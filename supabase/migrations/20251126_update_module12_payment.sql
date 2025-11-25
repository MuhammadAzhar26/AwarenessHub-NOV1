BEGIN;

-- Module 12: Payment Security
-- Stage 67: PCI DSS Overview (matching)
UPDATE stages SET
  title = 'PCI DSS Requirements',
  description = 'Match PCI DSS security goals to requirements.',
  scenario = 'Understanding Payment Card Industry Data Security Standard (PCI DSS).',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "req1", "left": "Build secure network", "right": "Firewalls and encryption"},
      {"id": "req2", "left": "Protect cardholder data", "right": "Encryption and masking"},
      {"id": "req3", "left": "Maintain vulnerability program", "right": "Updates and antivirus"},
      {"id": "req4", "left": "Restrict data access", "right": "Need-to-know basis"}
    ]
  }'::jsonb,
  points = 100
WHERE id = 67;

DELETE FROM hints WHERE stage_id = 67;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (67, 1, 'PCI DSS: secure network (firewalls), protect data (encryption), patch vulnerabilities, restrict access.', 5);

-- Stage 68: Card Fraud Detection (drag-drop)
UPDATE stages SET
  title = 'Fraud Indicator Classification',
  description = 'Classify transaction attributes as fraud indicators.',
  scenario = 'Analyzing credit card transactions for fraud. Which attributes are red flags?',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "ind1", "text": "Multiple failed attempts"},
      {"id": "ind2", "text": "Shipping to different country than billing"},
      {"id": "ind3", "text": "Large purchase on new card"},
      {"id": "ind4", "text": "Normal recurring subscription"},
      {"id": "ind5", "text": "Purchase at merchant used before"},
      {"id": "ind6", "text": "Rapid succession of purchases"}
    ],
    "zones": [
      {"id": "suspicious", "label": "Fraud Indicators", "correctItems": ["ind1", "ind2", "ind3", "ind6"]},
      {"id": "normal", "label": "Normal Behavior", "correctItems": ["ind4", "ind5"]}
    ]
  }'::jsonb,
  points = 120
WHERE id = 68;

DELETE FROM hints WHERE stage_id = 68;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (68, 1, 'Fraud indicators: failed attempts, mismatched addresses, new card large purchase, rapid purchases.', 5);

-- Stage 69: Tokenization (scenario)
UPDATE stages SET
  title = 'Payment Tokenization',
  description = 'Understand tokenization for secure payment processing.',
  scenario = 'E-commerce site stores payment methods for repeat customers. Best security approach?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "storage",
      "question": "Securely store payment information for future use?",
      "options": [
        {"id": "tokenize", "text": "Use tokenization - store token, not real card data", "correct": true},
        {"id": "encrypt-db", "text": "Encrypt card numbers in database"},
        {"id": "plaintext", "text": "Store card numbers in plaintext"},
        {"id": "hash", "text": "Hash card numbers"}
      ]
    }],
    "correctChoice": "tokenize"
  }'::jsonb,
  points = 120
WHERE id = 69;

DELETE FROM hints WHERE stage_id = 69;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (69, 1, 'Tokenization replaces sensitive card data with non-sensitive token. Payment processor stores real data.', 5);

-- Stage 70: EMV Chip Security (scenario)
UPDATE stages SET
  title = 'EMV Chip Cards',
  description = 'Understand chip card security advantages.',
  scenario = 'Customer uses chip card at POS terminal. Why is EMV more secure than magnetic stripe?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "advantage",
      "question": "Primary security advantage of EMV chip cards?",
      "options": [
        {"id": "dynamic", "text": "Dynamic authentication - unique code per transaction", "correct": true},
        {"id": "bigger", "text": "Larger storage capacity"},
        {"id": "faster", "text": "Faster transaction processing"},
        {"id": "color", "text": "Gold color looks premium"}
      ]
    }],
    "correctChoice": "dynamic"
  }'::jsonb,
  points = 100
WHERE id = 70;

DELETE FROM hints WHERE stage_id = 70;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (70, 1, 'EMV generates unique cryptogram per transaction, preventing cloning unlike static magnetic stripes.', 5);

-- Stage 71: 3D Secure (scenario)
UPDATE stages SET
  title = '3D Secure Authentication',
  description = 'Implement additional authentication for online payments.',
  scenario = 'High-value online purchase. Customer bank requests additional verification. What is this?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "auth",
      "question": "Purpose of 3D Secure (Verified by Visa, Mastercard SecureCode)?",
      "options": [
        {"id": "2fa", "text": "Adds authentication layer - customer verifies with bank", "correct": true},
        {"id": "faster", "text": "Speeds up transaction processing"},
        {"id": "discount", "text": "Provides purchase discounts"},
        {"id": "tracking", "text": "Improves shipment tracking"}
      ]
    }],
    "correctChoice": "2fa"
  }'::jsonb,
  points = 120
WHERE id = 71;

DELETE FROM hints WHERE stage_id = 71;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (71, 1, '3D Secure adds authentication layer where customer verifies identity with card issuer during purchase.', 5);

-- Stage 72: Payment Gateway Security (matching)
UPDATE stages SET
  title = 'Payment Gateway Controls',
  description = 'Match payment gateway security features to their functions.',
  scenario = 'Securing online payment processing requires multiple controls.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "ctrl1", "left": "TLS/SSL", "right": "Encrypts payment data in transit"},
      {"id": "ctrl2", "left": "Address verification (AVS)", "right": "Validates billing address"},
      {"id": "ctrl3", "left": "CVV verification", "right": "Confirms card possession"},
      {"id": "ctrl4", "left": "Fraud scoring", "right": "Risk assessment algorithms"}
    ]
  }'::jsonb,
  points = 100
WHERE id = 72;

DELETE FROM hints WHERE stage_id = 72;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (72, 1, 'TLS encrypts transit. AVS checks address. CVV confirms possession. Fraud scoring assesses risk.', 5);

COMMIT;
