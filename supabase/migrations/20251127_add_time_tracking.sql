-- Add time tracking fields to user_progress table
BEGIN;

-- Add started_at timestamp to track when user started the challenge
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;

-- Add hint_usage_times to store when each hint was used (in seconds from start)
ALTER TABLE user_progress 
ADD COLUMN IF NOT EXISTS hint_usage_times JSONB DEFAULT '[]'::jsonb;

-- Update existing records to have empty hint_usage_times
UPDATE user_progress 
SET hint_usage_times = '[]'::jsonb 
WHERE hint_usage_times IS NULL;

COMMIT;
