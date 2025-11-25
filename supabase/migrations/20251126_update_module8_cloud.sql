BEGIN;

-- Module 8: Cloud Security Architect
-- Stage 43: Cloud Service Models (matching)
UPDATE stages SET
  title = 'Cloud Service Model Classification',
  description = 'Match services to IaaS, PaaS, or SaaS models.',
  scenario = 'Classify cloud offerings by service model. Match each example to the correct cloud service type.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "ex1", "left": "Amazon EC2 virtual machines", "right": "IaaS"},
      {"id": "ex2", "left": "Google App Engine", "right": "PaaS"},
      {"id": "ex3", "left": "Microsoft 365", "right": "SaaS"},
      {"id": "ex4", "left": "Heroku application platform", "right": "PaaS"}
    ]
  }'::jsonb,
  points = 80
WHERE id = 43;

DELETE FROM hints WHERE stage_id = 43;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (43, 1, 'IaaS = infrastructure (VMs). PaaS = platform (app runtime). SaaS = software (end-user apps).', 5);

-- Stage 44: Shared Responsibility (drag-drop)
UPDATE stages SET
  title = 'Cloud Shared Responsibility Model',
  description = 'Assign security responsibilities to customer or cloud provider.',
  scenario = 'In cloud environments, security is shared. Categorize each security control as Cloud Provider responsibility or Customer responsibility.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "resp1", "text": "Physical datacenter security"},
      {"id": "resp2", "text": "Identity and access management"},
      {"id": "resp3", "text": "Application security"},
      {"id": "resp4", "text": "Network infrastructure"},
      {"id": "resp5", "text": "Data encryption"},
      {"id": "resp6", "text": "Hypervisor security"}
    ],
    "zones": [
      {"id": "provider", "label": "Cloud Provider", "correctItems": ["resp1", "resp4", "resp6"]},
      {"id": "customer", "label": "Customer", "correctItems": ["resp2", "resp3", "resp5"]}
    ]
  }'::jsonb,
  points = 120
WHERE id = 44;

DELETE FROM hints WHERE stage_id = 44;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (44, 1, 'Provider: physical security, network infrastructure, hypervisor. Customer: IAM, apps, data encryption.', 5);

-- Stage 45: Cloud Storage Security (scenario)
UPDATE stages SET
  title = 'S3 Bucket Security Misconfiguration',
  description = 'Identify cloud storage security risk.',
  scenario = 'A company accidentally made an S3 bucket publicly readable. What is the immediate risk?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "risk",
      "question": "Public S3 bucket with sensitive data creates which risk?",
      "options": [
        {"id": "data-breach", "text": "Data breach - anyone can download files", "correct": true},
        {"id": "slow-speed", "text": "Slower download speeds"},
        {"id": "high-cost", "text": "Slightly higher transfer costs"},
        {"id": "no-risk", "text": "No security risk"}
      ]
    }],
    "correctChoice": "data-breach"
  }'::jsonb,
  points = 100
WHERE id = 45;

DELETE FROM hints WHERE stage_id = 45;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (45, 1, 'Public buckets allow unauthenticated access - major data breach risk if sensitive files stored.', 5);

-- Stage 46: IAM Best Practice (scenario)
UPDATE stages SET
  title = 'Cloud IAM Principle of Least Privilege',
  description = 'Apply least privilege to cloud permissions.',
  scenario = 'A developer needs to read logs from CloudWatch. Which IAM policy follows least privilege?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "policy",
      "question": "Which policy grants minimum necessary permissions?",
      "options": [
        {"id": "read-only", "text": "CloudWatch read-only access", "correct": true},
        {"id": "full-admin", "text": "Full administrator access"},
        {"id": "all-logs", "text": "Read/write all logs and metrics"},
        {"id": "root", "text": "Root account access"}
      ]
    }],
    "correctChoice": "read-only"
  }'::jsonb,
  points = 80
WHERE id = 46;

DELETE FROM hints WHERE stage_id = 46;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (46, 1, 'Least privilege means granting only the minimum permissions needed - read-only for viewing logs.', 5);

-- Stage 47: Cloud Encryption (matching)
UPDATE stages SET
  title = 'Cloud Encryption Types',
  description = 'Match encryption types to their use cases.',
  scenario = 'Different encryption methods protect data in different states. Match each encryption type to when it is used.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "enc1", "left": "Encryption at rest", "right": "Protects stored data on disks"},
      {"id": "enc2", "left": "Encryption in transit", "right": "Protects data moving over network"},
      {"id": "enc3", "left": "Encryption in use", "right": "Protects data being processed in memory"},
      {"id": "enc4", "left": "Client-side encryption", "right": "Encrypts before sending to cloud"}
    ]
  }'::jsonb,
  points = 100
WHERE id = 47;

DELETE FROM hints WHERE stage_id = 47;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (47, 1, 'At rest = storage. In transit = network. In use = memory. Client-side = before upload.', 5);

-- Stage 48: Multi-Tenancy Risk (scenario)
UPDATE stages SET
  title = 'Cloud Multi-Tenancy Isolation',
  description = 'Understand multi-tenancy security concerns.',
  scenario = 'Multiple customers share physical infrastructure in public cloud. What is the primary security concern?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "concern",
      "question": "Main security risk in multi-tenant cloud environments?",
      "options": [
        {"id": "isolation", "text": "Insufficient isolation between tenant workloads", "correct": true},
        {"id": "speed", "text": "Slower performance"},
        {"id": "color", "text": "Dashboard color scheme"},
        {"id": "location", "text": "Geographical location preference"}
      ]
    }],
    "correctChoice": "isolation"
  }'::jsonb,
  points = 100
WHERE id = 48;

DELETE FROM hints WHERE stage_id = 48;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (48, 1, 'Multi-tenancy risk is inadequate isolation allowing one tenant to access another tenant data.', 5);

COMMIT;
