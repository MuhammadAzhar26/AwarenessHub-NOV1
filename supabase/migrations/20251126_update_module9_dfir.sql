BEGIN;

-- Module 9: Digital Forensics Investigator
-- Stage 49: Chain of Custody (scenario)
UPDATE stages SET
  title = 'Evidence Chain of Custody',
  description = 'Maintain proper forensic evidence handling.',
  scenario = 'You seized a laptop as evidence. What is the first critical step to maintain chain of custody?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "step",
      "question": "First step after seizing digital evidence?",
      "options": [
        {"id": "document", "text": "Document and photograph evidence, create hash", "correct": true},
        {"id": "power-on", "text": "Power on device to check contents"},
        {"id": "email", "text": "Email photos to team"},
        {"id": "clean", "text": "Clean the device exterior"}
      ]
    }],
    "correctChoice": "document"
  }'::jsonb,
  points = 100
WHERE id = 49;

DELETE FROM hints WHERE stage_id = 49;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (49, 1, 'Document everything immediately: photos, serial numbers, condition, cryptographic hash of storage.', 5);

-- Stage 50: Volatile Data (drag-drop)
UPDATE stages SET
  title = 'Order of Volatility Collection',
  description = 'Prioritize volatile data collection by how quickly it is lost.',
  scenario = 'During live forensics, collect data in order of volatility (most volatile first). Arrange data sources correctly.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "data1", "text": "CPU registers and cache"},
      {"id": "data2", "text": "RAM contents"},
      {"id": "data3", "text": "Hard disk"},
      {"id": "data4", "text": "Network connections"},
      {"id": "data5", "text": "Running processes"},
      {"id": "data6", "text": "Backup tapes"}
    ],
    "zones": [
      {"id": "high-volatile", "label": "Most Volatile (collect first)", "correctItems": ["data1", "data4", "data5"]},
      {"id": "medium-volatile", "label": "Medium Volatility", "correctItems": ["data2"]},
      {"id": "low-volatile", "label": "Least Volatile (collect last)", "correctItems": ["data3", "data6"]}
    ]
  }'::jsonb,
  points = 120
WHERE id = 50;

DELETE FROM hints WHERE stage_id = 50;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (50, 1, 'Order of volatility: registers/network/processes → RAM → disk → backups', 5);

-- Stage 52: Log Analysis (scenario)
UPDATE stages SET
  title = 'Security Log Analysis',
  description = 'Identify attack pattern from logs.',
  scenario = 'Reviewing firewall logs shows repeated connection attempts from single IP to sequential ports 1-1000. What activity is this?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "activity",
      "question": "Sequential port connections from one IP indicates?",
      "options": [
        {"id": "port-scan", "text": "Port scanning reconnaissance", "correct": true},
        {"id": "normal", "text": "Normal user activity"},
        {"id": "backup", "text": "Backup process"},
        {"id": "update", "text": "Software update check"}
      ]
    }],
    "correctChoice": "port-scan"
  }'::jsonb,
  points = 100
WHERE id = 52;

DELETE FROM hints WHERE stage_id = 52;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (52, 1, 'Sequential port attempts from single source = port scan looking for open services.', 5);

-- Stage 53: Steganography Detection (scenario)
UPDATE stages SET
  title = 'Hidden Data in Images',
  description = 'Identify steganography technique.',
  scenario = 'A suspect image file is larger than expected and shows statistical anomalies in least significant bits. What technique is likely used?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "technique",
      "question": "LSB anomalies in image file suggest which technique?",
      "options": [
        {"id": "stego", "text": "Steganography - hidden data in image", "correct": true},
        {"id": "compression", "text": "Poor compression algorithm"},
        {"id": "corruption", "text": "File corruption"},
        {"id": "metadata", "text": "Extra EXIF metadata"}
      ]
    }],
    "correctChoice": "stego"
  }'::jsonb,
  points = 120
WHERE id = 53;

DELETE FROM hints WHERE stage_id = 53;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (53, 1, 'LSB (Least Significant Bit) manipulation is common steganography method to hide data in images.', 5);

-- Stage 54: Timeline Analysis (drag-drop)
UPDATE stages SET
  title = 'Incident Timeline Reconstruction',
  description = 'Order events chronologically based on timestamps.',
  scenario = 'Reconstruct attack timeline from various log sources. Arrange events in correct chronological order.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "evt1", "text": "2024-11-25 14:23 - Phishing email received"},
      {"id": "evt2", "text": "2024-11-25 14:45 - Malicious attachment opened"},
      {"id": "evt3", "text": "2024-11-25 15:12 - Outbound connection to C2 server"},
      {"id": "evt4", "text": "2024-11-25 16:30 - Privilege escalation detected"},
      {"id": "evt5", "text": "2024-11-25 18:45 - Data exfiltration observed"},
      {"id": "evt6", "text": "2024-11-26 09:00 - Incident detected by SOC"}
    ],
    "zones": [
      {"id": "initial", "label": "Initial Compromise", "correctItems": ["evt1", "evt2"]},
      {"id": "establish", "label": "Establish Foothold", "correctItems": ["evt3", "evt4"]},
      {"id": "mission", "label": "Complete Mission", "correctItems": ["evt5"]},
      {"id": "detection", "label": "Detection", "correctItems": ["evt6"]}
    ]
  }'::jsonb,
  points = 150
WHERE id = 54;

DELETE FROM hints WHERE stage_id = 54;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (54, 1, 'Timeline: Email → Open attachment → C2 connection → Escalation → Exfiltration → Detection', 5);

COMMIT;
