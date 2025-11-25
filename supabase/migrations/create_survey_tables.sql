-- Survey responses table with logging
CREATE TABLE IF NOT EXISTS survey_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page VARCHAR(255) NOT NULL,
  ratings JSONB NOT NULL,
  average_rating DECIMAL(3,2),
  feedback TEXT,
  user_email VARCHAR(255),
  screenshot_data TEXT, -- Base64 encoded image
  user_agent TEXT,
  screen_resolution VARCHAR(50),
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying by page
CREATE INDEX IF NOT EXISTS idx_survey_page ON survey_responses(page);

-- Index for querying by date
CREATE INDEX IF NOT EXISTS idx_survey_submitted_at ON survey_responses(submitted_at DESC);

-- Index for average rating (for analytics)
CREATE INDEX IF NOT EXISTS idx_survey_rating ON survey_responses(average_rating);

-- Survey analytics view
CREATE OR REPLACE VIEW survey_analytics AS
SELECT 
  page,
  COUNT(*) as total_responses,
  ROUND(AVG(average_rating), 2) as avg_rating,
  MIN(submitted_at) as first_response,
  MAX(submitted_at) as latest_response,
  COUNT(CASE WHEN feedback IS NOT NULL AND feedback != '' THEN 1 END) as responses_with_feedback,
  COUNT(CASE WHEN screenshot_data IS NOT NULL THEN 1 END) as responses_with_screenshot
FROM survey_responses
GROUP BY page;

-- Comment on table
COMMENT ON TABLE survey_responses IS 'Stores all user feedback survey responses with ratings, feedback text, and optional screenshots';
