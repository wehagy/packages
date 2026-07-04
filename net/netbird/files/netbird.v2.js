'use strict';  
'require form';  
'require network';  
'require rpc';   // chamadas ubus seguras via rpc.declare  
'require dom';   // dom.content — atualiza elementos DOM in-place sem recriar  
  
// ── RPC declarations ──────────────────────────────────────────────────────────  
  
var callNetbirdStatus = rpc.declare({  
    object: 'luci.netbird',  
    method: 'getStatus',  
    expect: { result: {} }  
});  
  
var callNetbirdLoginInfo = rpc.declare({  
    object: 'luci.netbird',  
    method: 'getLoginInfo',  
    // Sem 'expect' — lemos os campos diretamente da resposta  
});  
  
// ── Helpers ───────────────────────────────────────────────────────────────────  
  
// Renderiza o painel de status do daemon e a tabela de peers.  
// Função separada para reutilizar no fetch inicial e nos refreshes automáticos.  
function renderNetbirdStatus(data) {  
    if (!data)  
        return E('div', { class: 'alert-message warning' },  
            _('Could not retrieve NetBird status. Is the daemon running?'));  
  
    var peers = data.peers || {};  
    var rows = (peers.details || []).map(function(p) {  
        var routes = (p.networks || []).join(', ') || '-';  
        return E('tr', {}, [  
            E('td', { class: 'td left' }, p.fqdn || '-'),  
            E('td', { class: 'td left' }, p.netbirdIp || '-'),  
            E('td', { class: 'td left' }, p.status || '-'),  
            E('td', { class: 'td left' }, p.connectionType || '-'),  
            E('td', { class: 'td left' }, p.latency ? (p.latency / 1e6).toFixed(1) + ' ms' : '-'),  
            E('td', { class: 'td left' }, routes),  
        ]);  
    });  
  
    return E('div', {}, [  
        E('h3', {}, _('Daemon')),  
        E('table', { class: 'table' }, [  
            E('tr', {}, [ E('td', { class: 'td left', width: '33%' }, _('Status')),    E('td', { class: 'td left' }, data.daemonStatus || '-') ]),  
            E('tr', {}, [ E('td', { class: 'td left' }, _('NetBird IP')), E('td', { class: 'td left' }, data.netbirdIp || '-') ]),  
            E('tr', {}, [ E('td', { class: 'td left' }, _('FQDN')),       E('td', { class: 'td left' }, data.fqdn || '-') ]),  
            E('tr', {}, [ E('td', { class: 'td left' }, _('Management')), E('td', { class: 'td left' }, (data.management || {}).url || '-') ]),  
        ]),  
  
        E('h3', {}, _('Peers (%d connected / %d total)').format(peers.connected || 0, peers.total || 0)),  
        E('table', { class: 'table' }, [  
            E('thead', {}, E('tr', {}, [  
                E('th', { class: 'th left' }, _('FQDN')),  
                E('th', { class: 'th left' }, _('NetBird IP')),  
                E('th', { class: 'th left' }, _('Status')),  
                E('th', { class: 'th left' }, _('Connection')),  
                E('th', { class: 'th left' }, _('Latency')),  
                E('th', { class: 'th left' }, _('Routes')),  
            ])),  
            E('tbody', {}, rows.length ? rows :  
                [ E('tr', {}, E('td', { colspan: 6, class: 'td left' }, _('No peers'))) ])  
        ]),  
    ]);  
}  
  
// Expande .cbi-value-field para largura total do modal, escondendo o label.  
// Necessário porque DummyValue é renderizado dentro de .cbi-value-field (~55%  
// da largura), o que desloca as tabelas para a direita.  
// Usa setTimeout(fn, 0) porque o node precisa estar no DOM para que  
// .closest() e .querySelector() funcionem.  
function expandToFullWidth(node) {  
    setTimeout(function() {  
        var cbiValue = node.closest ? node.closest('.cbi-value') : null;  
        if (!cbiValue) return;  
        cbiValue.style.display = 'block';  
        var label = cbiValue.querySelector('label');  
        if (label) label.style.display = 'none';  
        var field = cbiValue.querySelector('.cbi-value-field');  
        if (field) { field.style.flex = '1 1 100%'; field.style.maxWidth = '100%'; }  
    }, 0);  
}  
  
// ── Protocol registration ─────────────────────────────────────────────────────  
  
// Install as: /www/luci-static/resources/protocol/netbird.js  
return network.registerProtocol('netbird', {  
    getI18n: function() { return _('NetBird VPN'); },  
  
    // _ubus('l3_device') lê o nome real da interface reportado pelo netifd via ubus.  
    // Fallback 'wt0' é o padrão do netbird.  
    getIfname: function() { return this._ubus('l3_device') || 'wt0'; },  
  
    getOpkgPackage: function() { return 'netbird'; },  
  
    // isFloating: true — VPN sem interface física base.  
    // Sem isso, o LuCI exigiria selecionar um dispositivo físico.  
    isFloating: function() { return true; },  
  
    // isVirtual: true — interface criada pelo daemon, não pelo netifd.  
    isVirtual: function() { return true; },  
  
    getDevices: function() { return null; },  
  
    containsDevice: function(ifname) {  
        return (network.getIfnameOf(ifname) == this.getIfname());  
    },  
  
    // renderFormOptions é o método correto (não getFormOptions) para adicionar  
    // campos ao modal de edição da interface (Network → Interfaces → Edit).  
    renderFormOptions: function(s) {  
        var o;  
  
        // ── General tab (pré-existente, não precisa criar) ─────────────────  
        o = s.taboption('general', form.Value, 'device', _('Tunnel device'),  
            _('The interface netbird creates and manages. Default: wt0.'));  
        o.placeholder = 'wt0';  
        o.rmempty = true;  
  
        o = s.taboption('general', form.Value, 'searchdomain', _('Search domain'),  
            _('DNS search domain for the NetBird network (e.g. netbird.cloud).'));  
        o.rmempty = true;  
  
        o = s.taboption('general', form.Value, 'delay', _('Startup wait (s)'),  
            _('Maximum seconds to wait for the tunnel after the daemon (re)starts.'));  
        o.datatype = 'uinteger';  
        o.placeholder = '25';  
        o.rmempty = true;  
  
        // ── Advanced tab (pré-existente) ───────────────────────────────────  
        o = s.taboption('advanced', form.Value, 'state_dir', _('State directory'),  
            _('netbird state directory (NB_STATE_DIR). Default: /root/.config/netbird.'));  
        o.placeholder = '/root/.config/netbird';  
        o.rmempty = true;  
  
        // ── Status tab ─────────────────────────────────────────────────────  
        // try/catch necessário: s.tab() lança se a aba já existir (ex: chamada dupla).  
        try { s.tab('status', _('Status')); } catch(e) {}  
  
        o = s.taboption('status', form.DummyValue, '_netbird_status', ' ');  
        // Não usar rawhtml = true: retornamos elementos DOM, não strings HTML.  
        // rawhtml = true faz DummyValue usar innerHTML = value, que falha com DOM elements.  
  
        o.cfgvalue = function(section_id) {  
            var content  = E('div', {}, E('em', {}, _('Loading...')));  
            var countEl  = E('span', { style: 'margin-left:1em; font-size:.85em; opacity:.65' }, '');  
            var timer    = null;  
            var node;  
            var remaining = 39;  
  
            function doFetch() {  
                dom.content(content, E('em', {}, _('Loading...')));  
                callNetbirdStatus().catch(function() { return null; }).then(function(data) {  
                    dom.content(content, renderNetbirdStatus(data));  
                });  
            }  
  
            function tick() {  
                // Auto-stop quando o modal fecha e o node sai do DOM.  
                // Evita memory leaks e chamadas RPC desnecessárias em background.  
                if (!document.contains(node)) {  
                    clearInterval(timer);  
                    timer = null;  
                    return;  
                }  
  
                remaining--;  
                if (remaining <= 0) {  
                    remaining = 39;  
                    doFetch();  
                }  
  
                // Concatenação simples em vez de .format('%ds') para evitar  
                // ambiguidade no parser de format strings do LuCI com '%ds'.  
                countEl.textContent = 'Next refresh in ' + remaining + 's';  
            }  
  
            node = E('div', {}, [  
                E('div', { style: 'margin-bottom:.75em; display:flex; align-items:center;' }, [  
                    // type: 'button' obrigatório: sem ele, o padrão HTML é type="submit".  
                    // O modal do LuCI é um <form>, então clicar submeteria o formulário  
                    // (fechando o modal) em vez de chamar o handler JavaScript.  
                    E('button', {  
                        class: 'cbi-button cbi-button-action',  
                        type: 'button',  
                        click: function() {  
                            remaining = 39;  
                            countEl.textContent = 'Next refresh in ' + remaining + 's';  
                            doFetch();  
                        }  
                    }, _('Refresh')),  
                    countEl  
                ]),  
                content  
            ]);  
  
            // setTimeout(fn, 0) é necessário para o fetch inicial e o setInterval.  
            // Problema sem ele: cfgvalue() ainda não retornou → node não está no DOM →  
            // document.contains(node) === false → tick() cancela o timer imediatamente  
            // na primeira chamada → o contador nunca decrementa.  
            // Com setTimeout(fn, 0): cfgvalue() retorna → LuCI insere node no DOM →  
            // só então o callback executa → document.contains(node) === true.  
            setTimeout(function() {  
                doFetch();  
                countEl.textContent = 'Next refresh in ' + remaining + 's';  
                timer = setInterval(tick, 1000);  
            }, 0);  
  
            expandToFullWidth(node);  
            return node;  
        };  
  
        // ── Login tab ──────────────────────────────────────────────────────  
        // A aba é sempre criada, mas é escondida via JavaScript quando o daemon  
        // não precisa de login. Isso é necessário porque as abas são criadas  
        // sincronamente em renderFormOptions — não é possível criá-las depois  
        // de verificar o status de forma assíncrona.  
        try { s.tab('login', _('Login')); } catch(e) {}  
  
        o = s.taboption('login', form.DummyValue, '_netbird_login', ' ');  
  
        o.cfgvalue = function(section_id) {  
            var content = E('div', {}, E('em', {}, _('Checking login status...')));  
            var node;  
  
            // Esconde a aba Login no menu de abas do modal.  
            // O seletor 'a[data-tab="login"]' encontra o link da aba pelo atributo  
            // data-tab que o LuCI adiciona automaticamente ao criar a aba.  
            function setLoginTabVisible(visible) {  
                var tabLink = document.querySelector('a[data-tab="login"]');  
                if (tabLink && tabLink.parentNode)  
                    tabLink.parentNode.style.display = visible ? '' : 'none';  
            }  
  
            function renderLoginContent(data) {  
                if (data && data.error)  
                    return E('div', { class: 'alert-message warning' }, _('Error: ') + data.error);  
  
                if (!data || !data.output)  
                    return E('div', { class: 'alert-message warning' },  
                        _('Could not get login URL. Try running manually: netbird up --qr --no-browser'));  
  
                // <pre> preserva espaços, quebras de linha e os caracteres Unicode  
                // do QR code (█, ▄, ▀). font-size pequeno para caber na tela.  
                return E('div', {}, [  
                    E('p', {}, _('Scan the QR code or visit the URL below to log in:')),  
                    E('pre', {  
                        style: 'font-size:.75em; line-height:1.2; font-family:monospace; white-space:pre;'  
                    }, data.output)  
                ]);  
            }  
  
            function doRefresh() {  
                dom.content(content, E('em', {}, _('Checking login status...')));  
  
                callNetbirdLoginInfo().catch(function() { return null; }).then(function(data) {  
                    if (!data || !data.needsLogin) {  
                        // Daemon conectado ou status desconhecido — esconde a aba.  
                        setLoginTabVisible(false);  
                        dom.content(content, E('div', { class: 'alert-message' },  
                            _('Login not required.')));  
                    } else {  
                        // Daemon precisa de login — mostra a aba e o QR code.  
                        setLoginTabVisible(true);  
                        dom.content(content, renderLoginContent(data));  
                    }  
                });  
            }  
  
            node = E('div', {}, [  
                E('div', { style: 'margin-bottom:.75em' }, [  
                    E('button', {  
                        class: 'cbi-button cbi-button-action',  
                        type: 'button',  
                        click: function() { doRefresh(); }  
                    }, _('Refresh'))  
                ]),  
                content  
            ]);  
  
            // Mesmo padrão do Status tab: setTimeout(fn, 0) garante que o node  
            // está no DOM antes de iniciar o fetch e de tentar esconder a aba.  
            setTimeout(function() { doRefresh(); }, 0);  
  
            expandToFullWidth(node);  
            return node;  
        };  
    }  
});

