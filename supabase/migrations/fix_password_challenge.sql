-- Diagnostic SQL to find and fix the password challenge issue
-- Run this in Supabase SQL Editor

-- 1. Find the stage with "weakest password" scenario
SELECT 
  id,
  module_id,
  stage_number,
  title,
  challenge_type,
  LEFT(scenario, 100) as scenario_preview,
  challenge_data
FROM stages 
WHERE scenario ILIKE '%weakest password%'
   OR scenario ILIKE '%MyDog123%'
   OR scenario ILIKE '%A) Please%'
ORDER BY module_id, stage_number;

-- 2. Check if the challenge_data has the correct structure for password-builder
-- If the stage is found, check its challenge_data

-- 3. If challenge_type is 'text' but should be 'password-builder', update it:
-- UNCOMMENT AND RUN THIS AFTER CONFIRMING THE STAGE ID:
/*
UPDATE stages 
SET challenge_type = 'password-builder',
    challenge_data = jsonb_build_object(
      'minStrength', 70,
      'requiresLength', 12
    )
WHERE id = <REPLACE_WITH_ACTUAL_STAGE_ID>;
*/

-- 4. Verify the update
-- SELECT id, challenge_type, challenge_data FROM stages WHERE id = <STAGE_ID>;
