-- Drop existing tables if they exist (to recreate with correct schema)
DROP TABLE IF EXISTS user_badges CASCADE;
DROP TABLE IF EXISTS badges CASCADE;

-- Create badges table with complete schema
CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  code VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  icon_name VARCHAR(50) NOT NULL,
  points_threshold INT,
  stages_required INT,
  module_id INT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_badges table
CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id INT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Create indexes for performance
CREATE INDEX idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX idx_user_badges_earned_at ON user_badges(earned_at DESC);
CREATE INDEX idx_badges_category ON badges(category);

-- Insert comprehensive badge data
INSERT INTO badges (code, title, description, category, icon_name, points_threshold, stages_required, module_id) VALUES
-- Achievement Milestones
('first_step', 'First Steps', 'Complete your first challenge', 'milestone', 'trophy', NULL, 1, NULL),
('rookie', 'Rookie Learner', 'Complete 5 challenges', 'milestone', 'award', NULL, 5, NULL),
('intermediate', 'Intermediate Defender', 'Complete 15 challenges', 'milestone', 'shield', NULL, 15, NULL),
('expert', 'Security Expert', 'Complete 30 challenges', 'milestone', 'star', NULL, 30, NULL),
('master', 'Cybersecurity Master', 'Complete all 50+ challenges', 'milestone', 'crown', NULL, 50, NULL),

-- Points Achievements
('hundred_club', '100 Points Club', 'Earn 100 total points', 'points', 'zap', 100, NULL, NULL),
('points_500', 'Point Collector', 'Earn 500 total points', 'points', 'gem', 500, NULL, NULL),
('points_1000', 'Point Master', 'Earn 1000 total points', 'points', 'diamond', 1000, NULL, NULL),
('points_2500', 'Point Legend', 'Earn 2500 total points', 'points', 'sparkles', 2500, NULL, NULL),
('points_5000', 'Elite Scorer', 'Earn 5000 total points', 'points', 'flame', 5000, NULL, NULL),

-- Module Completion Badges
('phishing_hunter', 'Phishing Hunter', 'Complete the Email Detective module', 'module', 'mail', NULL, NULL, 1),
('password_pro', 'Password Professional', 'Master password security challenges', 'module', 'key', NULL, NULL, 2),
('crypto_champion', 'Cryptography Champion', 'Complete Caesar Cipher challenges', 'module', 'lock', NULL, NULL, 3),
('privacy_guardian', 'Privacy Guardian', 'Complete all privacy challenges', 'module', 'eye-off', NULL, NULL, 4),
('malware_defender', 'Malware Defender', 'Complete malware education module', 'module', 'shield-alert', NULL, NULL, 5),
('network_ninja', 'Network Ninja', 'Master network security challenges', 'module', 'wifi', NULL, NULL, 6),

-- Special Achievements
('perfect_score', 'Perfect Performance', 'Complete any challenge without using hints', 'special', 'target', NULL, NULL, NULL),
('speed_demon', 'Speed Demon', 'Complete a challenge in under 30 seconds', 'special', 'zap-fast', NULL, NULL, NULL),
('hint_free', 'Hint-Free Hero', 'Complete 10 challenges without hints', 'special', 'brain', NULL, 10, NULL),
('streak_master', 'Streak Master', 'Complete challenges 5 days in a row', 'special', 'calendar', NULL, NULL, NULL),
('early_bird', 'Early Bird', 'Complete a challenge before 8 AM', 'special', 'sunrise', NULL, NULL, NULL),
('night_owl', 'Night Owl', 'Complete a challenge after 10 PM', 'special', 'moon', NULL, NULL, NULL),

-- Training Badges  
('tool_trainee', 'Tool Trainee', 'Complete first Tools Training stage', 'training', 'wrench', NULL, 1, NULL),
('tool_expert', 'Tool Expert', 'Complete all Tools Training modules', 'training', 'toolbox', NULL, NULL, NULL),
('dfir_rookie', 'DFIR Rookie', 'Complete first DFIR training stage', 'training', 'search', NULL, 1, NULL),
('dfir_investigator', 'DFIR Investigator', 'Complete all DFIR training modules', 'training', 'magnifying-glass', NULL, NULL, NULL),

-- Simulation Badges
('email_analyst', 'Email Security Analyst', 'Complete 10 email simulations successfully', 'simulation', 'inbox', NULL, 10, NULL),
('sms_detective', 'SMS Detective', 'Identify 10 phishing SMS messages', 'simulation', 'message-square', NULL, 10, NULL),
('search_sentinel', 'Search Sentinel', 'Complete 10 search result evaluations', 'simulation', 'compass', NULL, 10, NULL),
('simulation_master', 'Simulation Master', 'Complete all three simulation types', 'simulation', 'layers', NULL, NULL, NULL),

-- Level Achievements
('level_5', 'Rising Star', 'Reach Level 5', 'level', 'trending-up', NULL, NULL, NULL),
('level_10', 'Security Professional', 'Reach Level 10', 'level', 'award', NULL, NULL, NULL),
('level_20', 'Security Expert', 'Reach Level 20', 'level', 'trophy', NULL, NULL, NULL),
('level_30', 'Security Master', 'Reach Level 30', 'level', 'crown', NULL, NULL, NULL),

-- Social/Competitive Badges
('top_10', 'Top 10 Leaderboard', 'Reach top 10 on the leaderboard', 'competitive', 'users', NULL, NULL, NULL),
('top_3', 'Podium Position', 'Reach top 3 on the leaderboard', 'competitive', 'medal', NULL, NULL, NULL),
('rank_1', 'Champion', 'Reach #1 on the leaderboard', 'competitive', 'crown', NULL, NULL, NULL),

-- Consistency Badges
('weekly_warrior', 'Weekly Warrior', 'Complete at least one challenge every day for a week', 'consistency', 'calendar-check', NULL, 7, NULL),
('monthly_champion', 'Monthly Champion', 'Complete at least one challenge every day for 30 days', 'consistency', 'calendar-star', NULL, 30, NULL),

-- Security Checklist Badges
('checklist_starter', 'Checklist Starter', 'Complete 10 security checklist items', 'checklist', 'check-square', NULL, 10, NULL),
('checklist_warrior', 'Security Warrior', 'Complete 50 security checklist items', 'checklist', 'list-checks', NULL, 50, NULL),
('checklist_master', 'Security Master', 'Complete all 250+ checklist items', 'checklist', 'clipboard-check', NULL, 250, NULL),

-- Knowledge Domain Badges
('password_expert', 'Password Security Expert', 'Complete all password-related challenges', 'domain', 'key-round', NULL, NULL, NULL),
('phishing_master', 'Phishing Defense Master', 'Complete all phishing detection challenges', 'domain', 'fish-off', NULL, NULL, NULL),
('privacy_pro', 'Privacy Professional', 'Complete all privacy and data protection challenges', 'domain', 'user-shield', NULL, NULL, NULL),
('network_guard', 'Network Guardian', 'Complete all network security challenges', 'domain', 'network', NULL, NULL, NULL),
('crypto_master', 'Cryptography Master', 'Complete all cryptography challenges', 'domain', 'lock-keyhole', NULL, NULL, NULL);

-- Function to check and award badges
CREATE OR REPLACE FUNCTION check_and_award_badges(p_user_id UUID)
RETURNS TABLE(badge_id INT, badge_title VARCHAR, newly_awarded BOOLEAN) AS $$
DECLARE
  v_total_points INT;
  v_total_stages INT;
  v_user_level INT;
  v_completed_modules INT[];
  v_hint_free_count INT;
  v_badge RECORD;
  v_already_has BOOLEAN;
BEGIN
  -- Get user stats
  SELECT COALESCE(total_points, 0), COALESCE(level, 1)
  INTO v_total_points, v_user_level
  FROM user_profiles
  WHERE id = p_user_id;

  -- Get total completed stages
  SELECT COUNT(*)
  INTO v_total_stages
  FROM user_progress
  WHERE user_id = p_user_id AND status = 'completed';

  -- Get hint-free completions
  SELECT COUNT(*)
  INTO v_hint_free_count
  FROM user_progress
  WHERE user_id = p_user_id 
    AND status = 'completed' 
    AND (hints_used IS NULL OR array_length(hints_used, 1) IS NULL OR array_length(hints_used, 1) = 0);

  -- Check each badge condition
  FOR v_badge IN SELECT * FROM badges LOOP
    -- Check if user already has this badge
    SELECT EXISTS(
      SELECT 1 FROM user_badges WHERE user_id = p_user_id AND badge_id = v_badge.id
    ) INTO v_already_has;

    IF NOT v_already_has THEN
      -- Check conditions based on badge requirements
      IF (v_badge.points_threshold IS NOT NULL AND v_total_points >= v_badge.points_threshold) OR
         (v_badge.stages_required IS NOT NULL AND v_total_stages >= v_badge.stages_required) OR
         (v_badge.code = 'hint_free' AND v_hint_free_count >= 10) OR
         (v_badge.code LIKE 'level_%' AND v_user_level >= CAST(SUBSTRING(v_badge.code FROM 7) AS INT)) THEN
        
        -- Award the badge
        INSERT INTO user_badges (user_id, badge_id)
        VALUES (p_user_id, v_badge.id)
        ON CONFLICT (user_id, badge_id) DO NOTHING;
        
        RETURN QUERY SELECT v_badge.id, v_badge.title, TRUE;
      END IF;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- Grant necessary permissions
GRANT SELECT ON badges TO authenticated;
GRANT SELECT, INSERT ON user_badges TO authenticated;
GRANT EXECUTE ON FUNCTION check_and_award_badges TO authenticated;
