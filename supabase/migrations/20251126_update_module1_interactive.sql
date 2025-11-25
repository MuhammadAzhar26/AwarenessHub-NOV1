BEGIN;

-- Stage 2: ROT13 interactive decoder
UPDATE stages
SET
  title = 'ROT13 Decoder Lab',
  description = 'Use the Caesar slider to reverse a classic ROT13 scramble.',
  scenario = 'A security analyst left a note that was scrambled with a 13 letter shift. Move the slider until the decrypted message makes sense and submit the correct shift value.',
  challenge_type = 'caesar-cipher',
  challenge_data = '{
    "plaintext": "EBG13 VF SHA",
    "correctShift": 13
  }'::jsonb
WHERE id = 2;

DELETE FROM hints WHERE stage_id = 2;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (2, 1, 'Rotating the alphabet by 13 characters is its own inverse. Try halfway around the alphabet.', 5),
  (2, 2, 'When the slider shows 13 you should read a short sentence celebrating rotation.', 10);

-- Stage 3: Base64 decoder workstation
UPDATE stages
SET
  title = 'Base64 Signal Lab',
  description = 'Decode a captured base64 beacon by analysing each chunk of characters.',
  scenario = 'An intrusion beacon was captured leaving the network. Break it apart chunk by chunk using the Base64 Decoder to reveal the final instructions. Enter the fully decoded plaintext once you are confident.',
  challenge_type = 'base64-decoder',
  challenge_data = '{
    "encodedText": "TGV2ZWwgVXA6IERlY29kZSB0aGUgc2lnbmFsLg==",
    "correctPlaintext": "Level Up: Decode the signal."
  }'::jsonb
WHERE id = 3;

DELETE FROM hints WHERE stage_id = 3;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (3, 1, 'Each set of four base64 characters becomes three decoded bytes. Slide through the chunks to keep track.', 5),
  (3, 2, 'The decoded message starts with "Level Up" once you have pieced together every block.', 10);

-- Stage 4: XOR key discovery
UPDATE stages
SET
  title = 'XOR Cipher Lab',
  description = 'Discover the single byte XOR key that turns gibberish into a readable sentence.',
  scenario = 'Threat hunters intercepted a payload encrypted with a repeating one byte XOR key. Experiment with different keys until the preview becomes a clean English phrase, then submit the key value.',
  challenge_type = 'xor-cipher',
  challenge_data = '{
    "ciphertext": "6160666a616005716d6c76",
    "correctKey": 37
  }'::jsonb
WHERE id = 4;

DELETE FROM hints WHERE stage_id = 4;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (4, 1, 'Look for a key that changes the preview into uppercase letters and spaces.', 5),
  (4, 2, 'Once the key is correct you will read the phrase "DECODE THIS".', 10);

-- Stage 5: Substitution cipher categorisation
UPDATE stages
SET
  title = 'Substitution Mapper',
  description = 'Sort believable substitution pairs from deliberate decoys.',
  scenario = 'You recovered a suspect substitution table but only half of the pairings are valid. Drag each mapping into the correct bucket so that only authentic relationships remain.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "pair1", "text": "A <-> M"},
      {"id": "pair2", "text": "B <-> N"},
      {"id": "pair3", "text": "C <-> P"},
      {"id": "pair4", "text": "E <-> Z"},
      {"id": "pair5", "text": "Q <-> L"},
      {"id": "pair6", "text": "T <-> G"}
    ],
    "zones": [
      {"id": "valid", "label": "Valid cipher mapping", "correctItems": ["pair1", "pair2", "pair5"]},
      {"id": "decoy", "label": "Decoy mapping", "correctItems": ["pair3", "pair4", "pair6"]}
    ]
  }'::jsonb
WHERE id = 5;

DELETE FROM hints WHERE stage_id = 5;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (5, 1, 'True mappings never reuse letters. If A maps to M then neither letter appears elsewhere.', 5),
  (5, 2, 'Only three pairings belong in the valid bucket.', 10);

-- Stage 6: Multi-layer cipher finale
UPDATE stages
SET
  title = 'Layered Cipher Finale',
  description = 'Crack three intercepted notes, each using a different Caesar shift.',
  scenario = 'The adversary sent three sequential instructions, each with a unique shift. Use the Secret Message Detective interface to align every slider with its matching plaintext and submit once all three glow green.',
  challenge_type = 'secret-message-detective',
  challenge_data = '{
    "messages": [
      {
        "id": "layer1",
        "encryptedText": "KNWXY QFDJW WJFID",
        "correctShift": 5,
        "hint": "Reverse the shift that advanced letters by five positions."
      },
      {
        "id": "layer2",
        "encryptedText": "EBGNGVBA PBZCYGR",
        "correctShift": 13,
        "hint": "This layer used the same rotation as ROT13."
      },
      {
        "id": "layer3",
        "encryptedText": "MPUHS SVJR VWLU",
        "correctShift": 7,
        "hint": "Each letter moved seven spots forward when it was encoded."
      }
    ]
  }'::jsonb
WHERE id = 6;

DELETE FROM hints WHERE stage_id = 6;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (6, 1, 'Tackle the shifts in order. One of the layers is a classic ROT13.', 5),
  (6, 2, 'The correct shifts are 5, 13, and 7 — line up the sliders to reveal the mission.', 10);

COMMIT;
