BEGIN;

-- Stage 9: Brute Force Time Calculator
UPDATE stages
SET
  title = 'Brute Force Time Calculator',
  description = 'Design a password configuration strong enough to resist GPU-powered brute force attacks.',
  scenario = 'Your company requires all employee passwords to withstand at least 50 bits of entropy to delay brute force attempts. Use the sliders and checkboxes to configure length and character sets until the crack time becomes impractical.',
  challenge_type = 'brute-force-estimator',
  challenge_data = '{
    "minimumLength": 8,
    "requiredComplexity": 50
  }'::jsonb,
  points = 100
WHERE id = 9;

DELETE FROM hints WHERE stage_id = 9;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (9, 1, 'Longer passwords exponentially increase entropy. Start with at least 10 characters.', 5),
  (9, 2, 'Mixing uppercase, lowercase, numbers, and symbols dramatically boosts the charset size and entropy.', 10);

-- Stage 10: Dictionary Attack Defense
UPDATE stages
SET
  title = 'Dictionary Attack Categorizer',
  description = 'Classify common passwords as dictionary-vulnerable or resistant.',
  scenario = 'Security audits revealed multiple accounts using weak passwords. Drag each password into the correct category based on whether it appears in common dictionary attack wordlists.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "pass1", "text": "password123"},
      {"id": "pass2", "text": "qwerty"},
      {"id": "pass3", "text": "Tr0ub4dor&3"},
      {"id": "pass4", "text": "CorrectHorseBatteryStaple"},
      {"id": "pass5", "text": "letmein"},
      {"id": "pass6", "text": "G7$mK2@pQw9"}
    ],
    "zones": [
      {"id": "vulnerable", "label": "Dictionary-vulnerable", "correctItems": ["pass1", "pass2", "pass5"]},
      {"id": "resistant", "label": "Dictionary-resistant", "correctItems": ["pass3", "pass4", "pass6"]}
    ]
  }'::jsonb,
  points = 100
WHERE id = 10;

DELETE FROM hints WHERE stage_id = 10;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (10, 1, 'Common words like "password", "qwerty", and "letmein" are in every dictionary list.', 5),
  (10, 2, 'Random strings and passphrases with substitutions resist dictionary attacks better.', 10);

-- Stage 11: Hash Recognition Lab
UPDATE stages
SET
  title = 'Hash Algorithm Identifier',
  description = 'Identify cryptographic hash algorithms by analyzing their length and format.',
  scenario = 'A forensic team recovered password hashes from a compromised database but the algorithm is unknown. Match each hash string to the correct algorithm (MD5, SHA-1, SHA-256, SHA-512, bcrypt) so the team can choose the right cracking tool.',
  challenge_type = 'hash-identifier',
  challenge_data = '{
    "hashes": [
      {
        "id": "hash1",
        "value": "5f4dcc3b5aa765d61d8327deb882cf99",
        "algorithm": "MD5"
      },
      {
        "id": "hash2",
        "value": "5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8",
        "algorithm": "SHA-1"
      },
      {
        "id": "hash3",
        "value": "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f",
        "algorithm": "SHA-256"
      },
      {
        "id": "hash4",
        "value": "$2a$10$N9qo8uLOickgx2ZMRZoMye",
        "algorithm": "bcrypt"
      }
    ]
  }'::jsonb,
  points = 100
WHERE id = 11;

DELETE FROM hints WHERE stage_id = 11;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (11, 1, 'MD5 is 32 hex characters, SHA-1 is 40, SHA-256 is 64, SHA-512 is 128.', 5),
  (11, 2, 'bcrypt hashes start with $2a$, $2b$, or $2y$ and include salt/cost parameters.', 10);

COMMIT;
