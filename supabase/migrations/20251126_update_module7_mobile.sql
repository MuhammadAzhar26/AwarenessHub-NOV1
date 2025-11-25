BEGIN;

-- Module 7: Mobile Security Guardian
-- Stage 37: Mobile OS Security (matching)
UPDATE stages SET
  title = 'Mobile OS Security Features',
  description = 'Match mobile OS security mechanisms to their purposes.',
  scenario = 'Understanding mobile platform security. Match each security feature to its primary function.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "feat1", "left": "Sandboxing", "right": "Isolates apps from each other"},
      {"id": "feat2", "left": "Code signing", "right": "Verifies app developer authenticity"},
      {"id": "feat3", "left": "Full disk encryption", "right": "Protects data at rest"},
      {"id": "feat4", "left": "App permissions", "right": "Controls resource access per app"}
    ]
  }'::jsonb,
  points = 80
WHERE id = 37;

DELETE FROM hints WHERE stage_id = 37;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (37, 1, 'Sandboxing isolates. Code signing verifies. Encryption protects storage. Permissions control access.', 5);

-- Stage 38: App Permission Analysis (drag-drop)
UPDATE stages SET
  title = 'Suspicious Permission Analyzer',
  description = 'Classify app permissions as normal or suspicious based on app purpose.',
  scenario = 'A flashlight app requests various permissions. Categorize each permission as Normal (expected) or Suspicious (privacy risk) for this app type.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "perm1", "text": "Camera access"},
      {"id": "perm2", "text": "Read contacts"},
      {"id": "perm3", "text": "Access fine location"},
      {"id": "perm4", "text": "Send SMS messages"},
      {"id": "perm5", "text": "Internet access"},
      {"id": "perm6", "text": "Modify system settings"}
    ],
    "zones": [
      {"id": "normal", "label": "Normal for Flashlight", "correctItems": ["perm1"]},
      {"id": "suspicious", "label": "Suspicious Permissions", "correctItems": ["perm2", "perm3", "perm4", "perm5", "perm6"]}
    ]
  }'::jsonb,
  points = 100
WHERE id = 38;

DELETE FROM hints WHERE stage_id = 38;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (38, 1, 'Flashlight only needs camera/flash. Contacts, location, SMS, internet, and system settings are red flags.', 5);

-- Stage 39: Mobile Malware (scenario)
UPDATE stages SET
  title = 'Mobile Malware Identification',
  description = 'Identify mobile malware type from symptoms.',
  scenario = 'A user reports excessive data usage, battery drain, and premium SMS charges they did not authorize. What type of mobile malware is most likely?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "malware",
      "question": "Premium SMS charges and excessive data usage indicate which mobile threat?",
      "options": [
        {"id": "sms-trojan", "text": "SMS Trojan / Mobile Banking Trojan", "correct": true},
        {"id": "ransomware", "text": "Mobile Ransomware"},
        {"id": "adware", "text": "Mobile Adware"},
        {"id": "spyware", "text": "Surveillance Spyware"}
      ]
    }],
    "correctChoice": "sms-trojan"
  }'::jsonb,
  points = 100
WHERE id = 39;

DELETE FROM hints WHERE stage_id = 39;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (39, 1, 'Premium SMS charges are signature of SMS trojans that send messages to premium numbers.', 5);

-- Stage 40: BYOD Risk (scenario)
UPDATE stages SET
  title = 'BYOD Security Risk Assessment',
  description = 'Identify biggest risk in Bring Your Own Device policies.',
  scenario = 'Company implementing BYOD. What is the primary security risk?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "risk",
      "question": "What is the greatest security challenge with BYOD?",
      "options": [
        {"id": "data-leak", "text": "Data leakage through unmanaged personal devices", "correct": true},
        {"id": "cost", "text": "Hardware purchase costs"},
        {"id": "battery", "text": "Battery life concerns"},
        {"id": "screen-size", "text": "Screen size limitations"}
      ]
    }],
    "correctChoice": "data-leak"
  }'::jsonb,
  points = 80
WHERE id = 40;

DELETE FROM hints WHERE stage_id = 40;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (40, 1, 'Unmanaged personal devices can leak corporate data through apps, cloud storage, or loss/theft.', 5);

-- Stage 42: Mobile App Security (scenario)
UPDATE stages SET
  title = 'Secure Mobile App Development',
  description = 'Identify secure coding practice for mobile apps.',
  scenario = 'Developing a mobile banking app. Which security practice is most critical?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "practice",
      "question": "Most important security practice for mobile banking app?",
      "options": [
        {"id": "cert-pinning", "text": "Certificate pinning to prevent MITM attacks", "correct": true},
        {"id": "animations", "text": "Smooth UI animations"},
        {"id": "dark-mode", "text": "Dark mode support"},
        {"id": "large-fonts", "text": "Large font options"}
      ]
    }],
    "correctChoice": "cert-pinning"
  }'::jsonb,
  points = 100
WHERE id = 42;

DELETE FROM hints WHERE stage_id = 42;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (42, 1, 'Certificate pinning prevents man-in-the-middle attacks by validating server certificates.', 5);

COMMIT;
