BEGIN;

-- Module 6: Firewall Specialist
-- Stage 31: Firewall Basics (matching)
UPDATE stages SET
  title = 'Firewall Concepts Fundamentals',
  description = 'Match firewall terms to their definitions.',
  scenario = 'New security team members need training on firewall terminology. Match each concept to its correct definition.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "term1", "left": "Ingress filtering", "right": "Controls incoming traffic to network"},
      {"id": "term2", "left": "Egress filtering", "right": "Controls outgoing traffic from network"},
      {"id": "term3", "left": "DMZ", "right": "Semi-trusted zone between internal and external"},
      {"id": "term4", "left": "Access Control List", "right": "Rule set defining allowed/denied traffic"}
    ]
  }'::jsonb,
  points = 80
WHERE id = 31;

DELETE FROM hints WHERE stage_id = 31;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (31, 1, 'Ingress = incoming, Egress = outgoing. DMZ is buffer zone. ACL is rule list.', 5);

-- Stage 32: Default Deny Policy (scenario)
UPDATE stages SET
  title = 'Default Deny vs Default Allow',
  description = 'Choose the most secure firewall policy approach.',
  scenario = 'Implementing a new firewall for sensitive data infrastructure. Which policy provides the strongest security posture?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "policy",
      "question": "Which firewall policy is most secure for protecting sensitive systems?",
      "options": [
        {"id": "default-deny", "text": "Default Deny (block all, allow specific)", "correct": true},
        {"id": "default-allow", "text": "Default Allow (allow all, block specific)"},
        {"id": "hybrid", "text": "Hybrid (some allow, some deny)"},
        {"id": "no-policy", "text": "No default policy"}
      ]
    }],
    "correctChoice": "default-deny"
  }'::jsonb,
  points = 80
WHERE id = 32;

DELETE FROM hints WHERE stage_id = 32;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (32, 1, 'Default Deny blocks everything except explicitly allowed traffic - most secure approach.', 5);

-- Stage 34: DMZ Configuration (drag-drop)
UPDATE stages SET
  title = 'DMZ Architecture Design',
  description = 'Place servers in appropriate network zones.',
  scenario = 'Design a secure network architecture. Drag each server type to the correct zone: Internal Network, DMZ, or External.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "srv1", "text": "Public web server"},
      {"id": "srv2", "text": "Employee database"},
      {"id": "srv3", "text": "Mail server (MX record)"},
      {"id": "srv4", "text": "File server with PII"},
      {"id": "srv5", "text": "Public DNS server"},
      {"id": "srv6", "text": "Internal Active Directory"}
    ],
    "zones": [
      {"id": "internal", "label": "Internal Network", "correctItems": ["srv2", "srv4", "srv6"]},
      {"id": "dmz", "label": "DMZ", "correctItems": ["srv1", "srv3", "srv5"]}
    ]
  }'::jsonb,
  points = 120
WHERE id = 34;

DELETE FROM hints WHERE stage_id = 34;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (34, 1, 'DMZ holds internet-facing services (web, mail, public DNS). Internal zone protects sensitive data.', 5),
  (34, 2, 'DMZ: web server, mail server, public DNS. Internal: database, file server, AD.', 10);

-- Stage 35: Rule Ordering (scenario)
UPDATE stages SET
  title = 'Firewall Rule Priority',
  description = 'Understand firewall rule processing order.',
  scenario = 'A firewall evaluates rules top-to-bottom and stops at first match. You have: Rule 1 (Allow 192.168.1.50), Rule 2 (Deny 192.168.1.0/24), Rule 3 (Allow all). What happens to 192.168.1.100?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "outcome",
      "question": "Will 192.168.1.100 be allowed or denied?",
      "options": [
        {"id": "denied", "text": "Denied by Rule 2 (192.168.1.0/24 block)", "correct": true},
        {"id": "allowed-rule3", "text": "Allowed by Rule 3 (Allow all)"},
        {"id": "allowed-rule1", "text": "Allowed by Rule 1 (192.168.1.50)"},
        {"id": "no-match", "text": "No rule matches, default deny"}
      ]
    }],
    "correctChoice": "denied"
  }'::jsonb,
  points = 100
WHERE id = 35;

DELETE FROM hints WHERE stage_id = 35;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (35, 1, 'First match wins. Rule 2 matches 192.168.1.100 before Rule 3 is evaluated.', 5);

-- Stage 36: Next-Gen Firewall (matching)
UPDATE stages SET
  title = 'NGFW vs Traditional Firewall',
  description = 'Identify features unique to Next-Generation Firewalls.',
  scenario = 'Compare traditional firewalls with NGFWs. Match each capability to the correct firewall type.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "feat1", "left": "Deep packet inspection (DPI)", "right": "NGFW"},
      {"id": "feat2", "left": "Application-layer filtering", "right": "NGFW"},
      {"id": "feat3", "left": "Port/protocol filtering only", "right": "Traditional"},
      {"id": "feat4", "left": "Integrated IPS/IDS", "right": "NGFW"}
    ]
  }'::jsonb,
  points = 100
WHERE id = 36;

DELETE FROM hints WHERE stage_id = 36;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (36, 1, 'NGFWs add DPI, application awareness, and IPS. Traditional only checks port/protocol.', 5);

COMMIT;
