BEGIN;

-- Module 4: Network Security Analyst
-- Stage 19: TCP Handshake (matching)
UPDATE stages SET
  title = 'TCP Three-Way Handshake',
  description = 'Match each TCP handshake step to its correct packet flag and purpose.',
  scenario = 'A network analyst captured a connection establishment sequence. Match each step of the TCP three-way handshake to the correct packet flags (SYN, SYN-ACK, ACK) and their roles in establishing a reliable connection.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "step1", "left": "Step 1: Client initiates", "right": "SYN packet sent"},
      {"id": "step2", "left": "Step 2: Server responds", "right": "SYN-ACK packet sent"},
      {"id": "step3", "left": "Step 3: Client confirms", "right": "ACK packet sent"}
    ]
  }'::jsonb,
  points = 80
WHERE id = 19;

DELETE FROM hints WHERE stage_id = 19;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (19, 1, 'The handshake follows a strict order: SYN → SYN-ACK → ACK', 5),
  (19, 2, 'Client sends SYN first, server replies with SYN-ACK, client confirms with ACK', 10);

-- Stage 20: Port Scanning Detection (drag-drop)
UPDATE stages SET
  title = 'Port Scan Pattern Recognition',
  description = 'Categorize different port scanning techniques by their behavior patterns.',
  scenario = 'Your IDS flagged unusual traffic patterns. Classify each scan type into its category based on the packet characteristics and scanning behavior observed in the logs.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "scan1", "text": "SYN packets to sequential ports"},
      {"id": "scan2", "text": "FIN packets without prior connection"},
      {"id": "scan3", "text": "UDP packets to all 65535 ports"},
      {"id": "scan4", "text": "TCP connect() to common services"},
      {"id": "scan5", "text": "NULL flags (no flags set)"},
      {"id": "scan6", "text": "XMAS scan (FIN, PSH, URG)"}
    ],
    "zones": [
      {"id": "stealth", "label": "Stealth Scans", "correctItems": ["scan2", "scan5", "scan6"]},
      {"id": "normal", "label": "Normal Scans", "correctItems": ["scan1", "scan4", "scan3"]}
    ]
  }'::jsonb,
  points = 100
WHERE id = 20;

DELETE FROM hints WHERE stage_id = 20;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (20, 1, 'Stealth scans use unusual flags (FIN, NULL, XMAS) to evade detection. Normal scans use standard SYN or full TCP connects.', 5),
  (20, 2, 'Stealth: FIN, NULL, XMAS. Normal: SYN sequential, TCP connect, UDP sweep.', 10);

-- Stage 21: Protocol Analysis (drag-drop)
UPDATE stages SET
  title = 'Network Protocol Classifier',
  description = 'Match protocols to their correct OSI layer and primary function.',
  scenario = 'During a security audit, you need to document which protocols operate at each network layer. Drag each protocol to its corresponding OSI layer category.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "http", "text": "HTTP/HTTPS"},
      {"id": "tcp", "text": "TCP"},
      {"id": "ip", "text": "IP"},
      {"id": "ethernet", "text": "Ethernet"},
      {"id": "dns", "text": "DNS"},
      {"id": "tls", "text": "TLS/SSL"}
    ],
    "zones": [
      {"id": "application", "label": "Application Layer (L7)", "correctItems": ["http", "dns"]},
      {"id": "transport", "label": "Transport Layer (L4)", "correctItems": ["tcp", "tls"]},
      {"id": "network", "label": "Network Layer (L3)", "correctItems": ["ip"]},
      {"id": "datalink", "label": "Data Link Layer (L2)", "correctItems": ["ethernet"]}
    ]
  }'::jsonb,
  points = 120
WHERE id = 21;

DELETE FROM hints WHERE stage_id = 21;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (21, 1, 'Remember: Application (HTTP, DNS), Transport (TCP, TLS), Network (IP), Data Link (Ethernet).', 5),
  (21, 2, 'Layer 7: HTTP, DNS. Layer 4: TCP, TLS. Layer 3: IP. Layer 2: Ethernet.', 10);

-- Stage 22: IP Address Classification (drag-drop)
UPDATE stages SET
  title = 'IP Address Classification Lab',
  description = 'Categorize IP addresses as public, private, loopback, or multicast.',
  scenario = 'A firewall audit requires classifying captured IP addresses. Drag each IP address into the correct category based on RFC standards for address allocation.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "ip1", "text": "192.168.1.100"},
      {"id": "ip2", "text": "8.8.8.8"},
      {"id": "ip3", "text": "127.0.0.1"},
      {"id": "ip4", "text": "10.0.0.50"},
      {"id": "ip5", "text": "224.0.0.1"},
      {"id": "ip6", "text": "172.16.5.20"}
    ],
    "zones": [
      {"id": "private", "label": "Private (RFC 1918)", "correctItems": ["ip1", "ip4", "ip6"]},
      {"id": "public", "label": "Public (Routable)", "correctItems": ["ip2"]},
      {"id": "special", "label": "Special Purpose", "correctItems": ["ip3", "ip5"]}
    ]
  }'::jsonb,
  points = 100
WHERE id = 22;

DELETE FROM hints WHERE stage_id = 22;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (22, 1, 'Private ranges: 10.x.x.x, 172.16-31.x.x, 192.168.x.x. Loopback: 127.x.x.x. Multicast: 224-239.x.x.x', 5),
  (22, 2, 'Private: 192.168.1.100, 10.0.0.50, 172.16.5.20. Public: 8.8.8.8. Special: 127.0.0.1 (loopback), 224.0.0.1 (multicast).', 10);

-- Stage 23: ARP Spoofing Detection (scenario)
UPDATE stages SET
  title = 'ARP Spoofing Attack Recognition',
  description = 'Identify signs of an ARP spoofing attack from network logs.',
  scenario = 'Users report intermittent connectivity issues and slow network performance. You check the ARP cache and notice duplicate MAC addresses for different IPs. What is the most likely attack occurring?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "attack-type",
      "question": "What attack is indicated by duplicate MAC addresses in ARP cache?",
      "options": [
        {"id": "arp-spoof", "text": "ARP Spoofing / Man-in-the-Middle", "correct": true},
        {"id": "dns-poison", "text": "DNS Cache Poisoning"},
        {"id": "syn-flood", "text": "SYN Flood Attack"},
        {"id": "port-scan", "text": "Port Scanning Activity"}
      ]
    }],
    "correctChoice": "arp-spoof"
  }'::jsonb,
  points = 100
WHERE id = 23;

DELETE FROM hints WHERE stage_id = 23;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (23, 1, 'Duplicate MAC addresses mapping to different IPs is a classic sign of ARP cache poisoning.', 5),
  (23, 2, 'The attacker sends forged ARP replies to associate their MAC with legitimate IP addresses (MITM).', 10);

-- Stage 24: DNS Tunneling (scenario)
UPDATE stages SET
  title = 'DNS Tunneling Detection',
  description = 'Recognize DNS tunneling used for data exfiltration.',
  scenario = 'Your SIEM shows unusually high DNS query volume to a single external domain with very long subdomain names. The queries contain base64-like strings. What technique is being used?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "technique",
      "question": "What technique uses DNS queries with encoded data in subdomain names?",
      "options": [
        {"id": "dns-tunnel", "text": "DNS Tunneling for data exfiltration", "correct": true},
        {"id": "dns-flood", "text": "DNS Amplification DDoS"},
        {"id": "dns-cache", "text": "DNS Cache Poisoning"},
        {"id": "dns-harvest", "text": "DNS Zone Transfer Attack"}
      ]
    }],
    "correctChoice": "dns-tunnel"
  }'::jsonb,
  points = 120
WHERE id = 24;

DELETE FROM hints WHERE stage_id = 24;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (24, 1, 'Long encoded subdomain names in high-volume DNS queries indicate data being smuggled out via DNS protocol.', 5),
  (24, 2, 'DNS tunneling encodes data in DNS query names to bypass firewall restrictions and exfiltrate information.', 10);

COMMIT;
