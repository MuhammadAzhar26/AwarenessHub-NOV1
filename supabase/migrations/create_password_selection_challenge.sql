-- SQL to create a password selection challenge
-- This creates an interactive quiz where users select the weakest password

BEGIN;

-- Update the stage to use password-selection challenge type
-- Replace <STAGE_ID> with the actual stage ID from the diagnostic query
UPDATE stages 
SET 
  challenge_type = 'password-selection',
  challenge_data = jsonb_build_object(
    'passwords', jsonb_build_array(
      jsonb_build_object(
        'id', 'a',
        'password', 'A) Please',
        'strength', 'weak'
      ),
      jsonb_build_object(
        'id', 'b',
        'password', 'B) MyDog123',
        'strength', 'weak'
      ),
      jsonb_build_object(
        'id', 'c',
        'password', 'C) xK9m#zLp4',
        'strength', 'strong'
      ),
      jsonb_build_object(
        'id', 'd',
        'password', 'D) password',
        'strength', 'weak'
      )
    ),
    'correctAnswer', 'd'
  )
WHERE scenario ILIKE '%weakest password%'
  OR scenario ILIKE '%MyDog123%';

-- Verify the update
SELECT 
  id,
  title,
  challenge_type,
  challenge_data
FROM stages 
WHERE challenge_type = 'password-selection';

COMMIT;
