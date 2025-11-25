-- Add Secret Message Detective Challenge to a Module
-- This example adds it to module 3 (Cryptography module) as stage 3

INSERT INTO stages (
  module_id,
  stage_number,
  title,
  description,
  scenario,
  challenge_type,
  challenge_data,
  points
) VALUES (
  3, -- Change this to your desired module_id
  3, -- Change this to the appropriate stage number
  'Secret Message Detective',
  'Crack multiple encrypted messages using different Caesar cipher shifts',
  'You''ve intercepted several encrypted messages from a suspicious organization. Each message uses a different shift value in the Caesar cipher. Your mission is to decrypt all of them to uncover their secret communications. Use the sliders to test different shift values until all messages are readable.',
  'secret-message-detective',
  '{
    "messages": [
      {
        "id": "msg1",
        "encryptedText": "KHOOR ZRUOG",
        "correctShift": 3,
        "hint": "This is a classic Caesar cipher shift. Try common values like 3."
      },
      {
        "id": "msg2",
        "encryptedText": "URYYB JBEYQ",
        "correctShift": 13,
        "hint": "This message uses ROT13 encryption - a special case where shift equals 13."
      },
      {
        "id": "msg3",
        "encryptedText": "LIPPS ASVPH",
        "correctShift": 4,
        "hint": "Try a shift value close to 3 or 5."
      },
      {
        "id": "msg4",
        "encryptedText": "WKH TXLFN EURZQ IRA",
        "correctShift": 3,
        "hint": "Look for common English words like ''THE'' when decrypted."
      },
      {
        "id": "msg5",
        "encryptedText": "FRPHGLDB VF LRXU EHVW GHIHQVH",
        "correctShift": 3,
        "hint": "All words should make sense when you find the right shift."
      }
    ]
  }'::jsonb,
  150 -- Points awarded for completing this challenge
);

-- Add hints for the Secret Message Detective challenge
-- Get the stage_id of the newly created challenge first
-- Then add hints with appropriate penalties

INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
SELECT 
  id,
  1,
  'Start with common shift values: Caesar cipher traditionally uses shift 3, and ROT13 uses shift 13. Try these first on each message.',
  5
FROM stages 
WHERE title = 'Secret Message Detective' 
  AND module_id = 3 
  AND stage_number = 3;

INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
SELECT 
  id,
  2,
  'Look for common English words. When a message is correctly decrypted, you should see recognizable words like THE, WORLD, QUICK, BROWN, etc.',
  10
FROM stages 
WHERE title = 'Secret Message Detective' 
  AND module_id = 3 
  AND stage_number = 3;

INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
SELECT 
  id,
  3,
  'The correct shifts for the 5 messages are: 3, 13, 4, 3, and 3. Use your sliders to verify each one produces readable English text.',
  15
FROM stages 
WHERE title = 'Secret Message Detective' 
  AND module_id = 3 
  AND stage_number = 3;

-- Verify the challenge was added successfully
SELECT 
  s.id,
  s.module_id,
  s.stage_number,
  s.title,
  s.challenge_type,
  s.points,
  COUNT(h.id) as hint_count
FROM stages s
LEFT JOIN hints h ON h.stage_id = s.id
WHERE s.title = 'Secret Message Detective'
GROUP BY s.id, s.module_id, s.stage_number, s.title, s.challenge_type, s.points;
