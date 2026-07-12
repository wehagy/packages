# 1. Service & Daemon Process

| Variable                   | CLI Flag                  | Description                                                                 | Default (Linux)               | Config JSON | Context       |
|----------------------------|---------------------------|-----------------------------------------------------------------------------|-------------------------------|-------------|---------------|
| `NB_DAEMON_ADDR`             | `--daemon-addr`             | Daemon socket address `[unix|tcp]://[path|host:port]`                        | `unix:///var/run/netbird.sock`  | N/A           | all CLI       |
| `NB_SERVICE`                 | `--service` / `-s`            | System service name                                                         | `netbird`                       | N/A           | daemon        |
| `NB_CONFIG`                  | `--config` / `-c`             | Active profile file path                                                    | `/var/lib/netbird/default.json` | N/A           | daemon        |
| `NB_STATE_DIR`               | N/A                         | Base directory for config and state files; must be set before daemon starts | `/var/lib/netbird/`             | N/A           | daemon (init) |
| `NB_DNS_STATE_FILE`          | N/A                         | Path to the DNS state file                                                  | `<StateDir>/state.json`         | N/A           | daemon (init) |
| `NB_DISABLE_PROFILES`        | `--disable-profiles`        | Disable profile switching/editing                                           | `false`                         | N/A           | daemon        |
| `NB_DISABLE_UPDATE_SETTINGS` | `--disable-update-settings` | Disable settings modification                                               | `false`                         | N/A           | daemon        |
| `NB_ENABLE_CAPTURE`          | `--enable-capture`          | Enable packet capture via `netbird debug capture`                             | `false`                         | N/A           | daemon        |
| `NB_DISABLE_NETWORKS`        | `--disable-networks`        | Disable network listing/selection                                           | `false`                         | N/A           | daemon        |

---

# 2. Logging

| Variable                    | CLI Flag         | Description                                                        | Default (Linux)             | Config JSON | Context |
|-----------------------------|------------------|--------------------------------------------------------------------|-----------------------------|-------------|---------|
| `NB_LOG_LEVEL`                | `--log-level` / `-l` | Log level: `trace`, `debug`, `info`, `warn`, `error`                         | `info`                        | N/A           | all CLI |
| `NB_LOG_FILE`                 | `--log-file`       | Log file path(s); also accepts `console` or `syslog`                   | `/var/log/netbird/client.log` | N/A           | daemon  |
| `NB_LOG_FORMAT`               | N/A                | Log output format: `json`, `syslog`, or default text                   | text                        | N/A           | daemon  |
| `NB_LOG_DISABLE_ROTATION`     | N/A                | Disable automatic log file rotation                                | `false`                       | N/A           | daemon  |
| `NB_LOG_MAX_SIZE_MB`          | N/A                | Maximum log file size before rotation (MB)                         | `15`                          | N/A           | daemon  |
| `NB_WG_DEBUG`                 | N/A                | Enable verbose WireGuard kernel logging (`true` = verbose)           | `false`                       | N/A           | daemon  |
| `NB_USPFILTER_LOG_BUFFER`     | N/A                | Channel buffer size for the userspace firewall logger              | `1000`                        | N/A           | daemon  |
| `GRPC_GO_LOG_SEVERITY_LEVEL`  | N/A                | gRPC log severity; set to `info` to enable full gRPC logging         | `""` (warn/error only)        | N/A           | daemon  |
| `GRPC_GO_LOG_VERBOSITY_LEVEL` | N/A                | gRPC log verbosity (integer); only effective when severity is `info` | `0`                           | N/A           | daemon  |

---

# 3. Connection & Identity

| Variable                | CLI Flag               | Description                                                            | Default (Linux)            | Config JSON        | Context    |
|-------------------------|------------------------|------------------------------------------------------------------------|----------------------------|--------------------|------------|
| `NB_MANAGEMENT_URL`       | `--management-url` / `-m`  | Management Service URL                                                 | `https://api.netbird.io:443` | `ManagementURL`      | `netbird up` |
| `NB_ADMIN_URL`            | `--admin-url`            | Admin Panel URL                                                        | `https://app.netbird.io:443` | `AdminURL`           | `netbird up` |
| `NB_SETUP_KEY`            | `--setup-key` / `-k`       | Setup key for peer registration                                        | `""`                         | N/A                  | `netbird up` |
| `NB_SETUP_KEY_FILE`       | `--setup-key-file`       | Path to file containing the setup key (ignored if `NB_SETUP_KEY` is set) | `""`                         | N/A                  | `netbird up` |
| `NB_PRESHARED_KEY`        | `--preshared-key`        | WireGuard PreSharedKey; only peers with the same key can communicate   | `""`                         | `PreSharedKey`       | `netbird up` |
| `NB_HOSTNAME`             | `--hostname` / `-n`        | Custom device hostname                                                 | `""` (OS hostname)           | N/A                  | `netbird up` |
| `NB_DISABLE_AUTO_CONNECT` | `--disable-auto-connect` | Disable automatic connection when the service starts                   | `false`                      | `DisableAutoConnect` | `netbird up` |
| `NB_ANONYMIZE`            | `--anonymize` / `-A`       | Anonymize IPs and non-netbird.io domains in logs and status output     | `false`                      | N/A                  | `netbird up` |
| `NB_FOREGROUND_MODE`      | `--foreground-mode` / `-F` | Start without daemon (foreground mode)                                 | `false`                      | N/A                  | `netbird up` |
| `NB_NO_BROWSER`           | `--no-browser`           | Do not open a browser for SSO login                                    | `false`                      | N/A                  | `netbird up` |
| `NB_QR`                   | `--qr`                   | Display QR code for SSO login URL                                      | `false`                      | N/A                  | `netbird up` |
| `NB_PROFILE`              | `--profile`              | Profile name to use                                                    | `""` (last active)           | N/A                  | `netbird up` |

---

# 4. WireGuard Interface

| Variable                 | CLI Flag                | Description                                                             | Default (Linux) | Config JSON    | Context    |
|--------------------------|-------------------------|-------------------------------------------------------------------------|-----------------|----------------|------------|
| `NB_INTERFACE_NAME`        | `--interface-name`        | WireGuard interface name                                                | `wt0`             | `WgIface`        | `netbird up` |
| `NB_WIREGUARD_PORT`        | `--wireguard-port`        | WireGuard listening port                                                | `51820`           | `WgPort`         | `netbird up` |
| `NB_MTU`                   | `--mtu`                   | WireGuard interface MTU                                                 | `1280`            | `MTU`            | `netbird up` |
| `NB_NETWORK_MONITOR`       | `--network-monitor` / `-N`  | Enable network monitoring; reconnects when network changes are detected | `false`           | `NetworkMonitor` | `netbird up` |
| `NB_EXTRA_IFACE_BLACKLIST` | `--extra-iface-blacklist` | Extra interfaces to ignore for WireGuard listening                      | `""`              | `IFaceBlackList` | `netbird up` |

---

# 5. ICE / P2P Connectivity

| Variable                             | CLI Flag | Description                                                          | Default (Linux)      | Config JSON | Context |
|--------------------------------------|----------|----------------------------------------------------------------------|----------------------|-------------|---------|
| `NB_FORCE_RELAY`                       | N/A        | Force all connections via relay; disables direct P2P                 | `false`                | N/A           | daemon  |
| `NB_HOME_RELAY_SERVERS`                | N/A        | Override relay server list (comma-separated URLs); for debug/lab use | `""` (from management) | N/A           | daemon  |
| `NB_ICE_FORCE_RELAY_CONN`              | N/A        | Force ICE connections to use relay                                   | `false`                | N/A           | daemon  |
| `NB_ICE_KEEP_ALIVE_INTERVAL_SEC`       | N/A        | ICE keep-alive interval in seconds                                   | `4`                    | N/A           | daemon  |
| `NB_ICE_DISCONNECTED_TIMEOUT_SEC`      | N/A        | Seconds before an ICE peer is considered disconnected                | `6`                    | N/A           | daemon  |
| `NB_ICE_FAILED_TIMEOUT_SEC`            | N/A        | Seconds before an ICE connection is considered failed                | `6`                    | N/A           | daemon  |
| `NB_ICE_RELAY_ACCEPTANCE_MIN_WAIT_SEC` | N/A        | Minimum wait in seconds before accepting an ICE relay connection     | `2`                    | N/A           | daemon  |
| `NB_ICE_MONITOR_PERIOD`                | N/A        | ICE candidate monitoring period in seconds                           | `300` (5m)             | N/A           | daemon  |

---

# 6. DNS

| Variable                        | CLI Flag               | Description                                                          | Default (Linux)        | Config JSON      | Context    |
|---------------------------------|------------------------|----------------------------------------------------------------------|------------------------|------------------|------------|
| `NB_DNS_RESOLVER_ADDRESS`         | `--dns-resolver-address` | Custom local DNS resolver address (`IP:port`); disables auto-detection | `""` (auto)              | `CustomDNSAddress` | `netbird up` |
| `NB_DNS_ROUTER_INTERVAL`          | `--dns-router-interval`  | DNS route update interval                                            | `1m`                     | `DNSRouteInterval` | `netbird up` |
| `NB_EXTRA_DNS_LABELS`             | `--extra-dns-labels`     | Extra DNS labels (up to 32, comma-separated)                         | `""`                     | `DNSLabels`        | `netbird up` |
| `NB_DISABLE_DNS`                  | `--disable-dns`          | Do not configure DNS settings                                        | `false`                  | `DisableDNS`       | `netbird up` |
| `NB_DNS_FORWARDER_PORT`           | N/A                      | Port for the internal DNS forwarder                                  | auto                   | N/A                | daemon     |
| `NB_MGMT_CACHE_TTL`               | N/A                      | DNS management cache TTL; intended for integration/dev testing       | `300s`                   | N/A                | daemon     |
| `NB_UNCLEAN_SHUTDOWN_RESOLV_FILE` | N/A                      | Path to `resolv.conf` saved for DNS recovery after abrupt shutdown     | `<StateDir>/resolv.conf` | N/A                | daemon     |

---

# 7. Routing

| Variable                 | CLI Flag                | Description                                                   | Default (Linux) | Config JSON         | Context    |
|--------------------------|-------------------------|---------------------------------------------------------------|-----------------|---------------------|------------|
| `NB_EXTERNAL_IP_MAP`       | `--external-ip-map`       | External IP mapping for NAT traversal (`IP/IP` or `IP/Interface`) | `""`              | `NATExternalIPs`      | `netbird up` |
| `NB_DISABLE_CLIENT_ROUTES` | `--disable-client-routes` | Do not process client routes received from management         | `false`           | `DisableClientRoutes` | `netbird up` |
| `NB_DISABLE_SERVER_ROUTES` | `--disable-server-routes` | Do not act as a router for server routes                      | `false`           | `DisableServerRoutes` | `netbird up` |
| `NB_DISABLE_IPV6`          | `--disable-ipv6`          | Do not request or use an IPv6 overlay address                 | `false`           | `DisableIPv6`         | `netbird up` |

---

# 8. Firewall & Connection Tracking

| Variable                            | CLI Flag           | Description                                                                                                               | Default (Linux)    | Config JSON     | Context    |
|-------------------------------------|--------------------|---------------------------------------------------------------------------------------------------------------------------|--------------------|-----------------|------------|
| `NB_DISABLE_FIREWALL`                 | `--disable-firewall` | Do not modify firewall rules                                                                                              | `false`              | `DisableFirewall` | `netbird up` |
| `NB_BLOCK_LAN_ACCESS`                 | `--block-lan-access` | Block access to local networks when acting as router or exit node                                                         | `false`              | `BlockLANAccess`  | `netbird up` |
| `NB_BLOCK_INBOUND`                    | `--block-inbound`    | Block all inbound connections; overrides management policies                                                              | `false`              | `BlockInbound`    | `netbird up` |
| `NB_SKIP_NFTABLES_CHECK`              | N/A                  | Skip nftables detection and force iptables                                                                                | `false`              | N/A               | daemon     |
| `NB_FORCE_USERSPACE_FIREWALL`         | N/A                  | Force userspace packet filter (USPFilter) instead of kernel netfilter; only applies when WireGuard runs in userspace mode | `false`              | N/A               | daemon     |
| `NB_CONNTRACK_TCP_MAX`                | N/A                  | Maximum TCP conntrack table entries (userspace firewall only)                                                             | platform-dependent | N/A               | daemon     |
| `NB_CONNTRACK_UDP_MAX`                | N/A                  | Maximum UDP conntrack table entries (userspace firewall only)                                                             | platform-dependent | N/A               | daemon     |
| `NB_CONNTRACK_ICMP_MAX`               | N/A                  | Maximum ICMP conntrack table entries (userspace firewall only)                                                            | `2048`               | N/A               | daemon     |
| `NB_CONNTRACK_TCP_FIN_WAIT_TIMEOUT`   | N/A                  | TCP FIN_WAIT state timeout (duration string, e.g. `60s`); userspace firewall only                                           | `60s`                | N/A               | daemon     |
| `NB_CONNTRACK_TCP_CLOSE_WAIT_TIMEOUT` | N/A                  | TCP CLOSE_WAIT state timeout; userspace firewall only                                                                     | `60s`                | N/A               | daemon     |
| `NB_CONNTRACK_TCP_LAST_ACK_TIMEOUT`   | N/A                  | TCP LAST_ACK state timeout; userspace firewall only                                                                       | `30s`                | N/A               | daemon     |

---

# 9. SSH Server

| Variable                             | CLI Flag                            | Description                                       | Default (Linux) | Config JSON                   | Context    |
|--------------------------------------|-------------------------------------|---------------------------------------------------|-----------------|-------------------------------|------------|
| `NB_ALLOW_SERVER_SSH`                  | `--allow-server-ssh`                  | Enable SSH server on this peer                    | `false`           | `ServerSSHAllowed`              | `netbird up` |
| `NB_ENABLE_SSH_ROOT`                   | `--enable-ssh-root`                   | Enable root login via SSH server                  | `false`           | `EnableSSHRoot`                 | `netbird up` |
| `NB_ENABLE_SSH_SFTP`                   | `--enable-ssh-sftp`                   | Enable SFTP subsystem for SSH server              | `false`           | `EnableSSHSFTP`                 | `netbird up` |
| `NB_ENABLE_SSH_LOCAL_PORT_FORWARDING`  | `--enable-ssh-local-port-forwarding`  | Enable local port forwarding via SSH server       | `false`           | `EnableSSHLocalPortForwarding`  | `netbird up` |
| `NB_ENABLE_SSH_REMOTE_PORT_FORWARDING` | `--enable-ssh-remote-port-forwarding` | Enable remote port forwarding via SSH server      | `false`           | `EnableSSHRemotePortForwarding` | `netbird up` |
| `NB_DISABLE_SSH_AUTH`                  | `--disable-ssh-auth`                  | Disable SSH authentication                        | `false`           | `DisableSSHAuth`                | `netbird up` |
| `NB_SSH_JWT_CACHE_TTL`                 | `--ssh-jwt-cache-ttl`                 | SSH JWT token cache TTL in seconds (`0` = disabled) | `0`               | `SSHJWTCacheTTL`                | `netbird up` |

---

# 10. Lazy Connection

| Variable                          | CLI Flag                 | Description                                                                       | Default (Linux) | Config JSON           | Context    |
|-----------------------------------|--------------------------|-----------------------------------------------------------------------------------|-----------------|-----------------------|------------|
| `NB_ENABLE_LAZY_CONNECTION`         | `--enable-lazy-connection` | [Experimental] Establish peer connections on-demand                               | `false`           | `LazyConnectionEnabled` | `netbird up` |
| `NB_ENABLE_EXPERIMENTAL_LAZY_CONN`  | N/A                        | [Experimental] Enable lazy connection via env (alternative to the CLI flag above) | `false`           | N/A                     | daemon     |
| `NB_LAZY_CONN_INACTIVITY_THRESHOLD` | N/A                        | Duration before an idle lazy connection is closed (e.g. `15m`, `1h`)                  | `15m`             | N/A                     | daemon     |

---

# 11. Post-Quantum Security (Rosenpass)

| Variable                | CLI Flag               | Description                                                | Default (Linux) | Config JSON         | Context    |
|-------------------------|------------------------|------------------------------------------------------------|-----------------|---------------------|------------|
| `NB_ENABLE_ROSENPASS`     | `--enable-rosenpass`     | [Experimental] Enable Rosenpass post-quantum key exchange  | `false`           | `RosenpassEnabled`    | `netbird up` |
| `NB_ROSENPASS_PERMISSIVE` | `--rosenpass-permissive` | Rosenpass permissive mode; accepts peers without Rosenpass | `false`           | `RosenpassPermissive` | `netbird up` |

---

# 12. Netstack / Userspace Mode

| Variable                | CLI Flag | Description                                                                                              | Default (Linux) | Config JSON | Context |
|-------------------------|----------|----------------------------------------------------------------------------------------------------------|-----------------|-------------|---------|
| `NB_USE_NETSTACK_MODE`    | N/A        | Enable userspace networking stack (no kernel WireGuard required); used for rootless/embedded deployments | `false`           | N/A           | daemon  |
| `NB_SOCKS5_LISTENER_PORT` | N/A        | SOCKS5 proxy listening port; only applies when `NB_USE_NETSTACK_MODE=true`                                 | `1080`            | N/A           | daemon  |
| `NB_NETSTACK_SKIP_PROXY`  | N/A        | Disable the SOCKS5 proxy when using netstack mode                                                        | `false`           | N/A           | daemon  |

---

# 13. Metrics

| Variable                 | CLI Flag | Description                                                     | Default (Linux)                  | Config JSON | Context |
|--------------------------|----------|-----------------------------------------------------------------|----------------------------------|-------------|---------|
| `NB_METRICS_PUSH_ENABLED`  | N/A        | Enable pushing collected metrics to the backend                 | `false`                            | N/A           | daemon  |
| `NB_METRICS_FORCE_SENDING` | N/A        | Force metric sending without fetching remote push config        | `false`                            | N/A           | daemon  |
| `NB_METRICS_CONFIG_URL`    | N/A        | URL to fetch metrics push configuration                         | `https://ingest.netbird.io/config` | N/A           | daemon  |
| `NB_METRICS_SERVER_URL`    | N/A        | Metrics server URL; overrides the value from remote push config | `""`                               | N/A           | daemon  |
| `NB_METRICS_INTERVAL`      | N/A        | Metrics push interval (e.g. `1h`, `30m`); overrides remote config   | from remote config               | N/A           | daemon  |

---

**Notes:**

- `NB_SETUP_KEY` and `NB_SETUP_KEY_FILE` are mutually exclusive. [24](#6-23)
- `NB_LOG_FORMAT` is overridden to `syslog` automatically when `--log-file syslog` is used. `NB_LOG_DISABLE_ROTATION` and `NB_LOG_MAX_SIZE_MB` only apply when logging to a file. [25](#6-24)
- `NB_CONNTRACK_*` variables only apply when using the userspace packet filter (USPFilter), which is active in netstack mode or as a fallback when native netfilter is unavailable. `NB_CONNTRACK_TCP_MAX` and `NB_CONNTRACK_UDP_MAX` defaults are defined in `client/firewall/uspfilter/conntrack/defaults_desktop.go`. [26](#6-25)
- `NB_DISABLE_PROFILES`, `NB_DISABLE_UPDATE_SETTINGS`, `NB_ENABLE_CAPTURE`, `NB_DISABLE_NETWORKS` are flags on `serviceCmd`; to persist them use `netbird service install --service-env KEY=VALUE` or `netbird service reconfigure --service-env KEY=VALUE`. [1](#6-0)
- `NB_SOCKS5_LISTENER_PORT` and `NB_NETSTACK_SKIP_PROXY` only have effect when `NB_USE_NETSTACK_MODE=true`. [22](#6-21)
- `netbird down` reads `NB_DAEMON_ADDR` and `NB_LOG_LEVEL` from the environment (via `SetFlagsFromEnvVars(rootCmd)`); all other variables are irrelevant for that command. [27](#6-26)

