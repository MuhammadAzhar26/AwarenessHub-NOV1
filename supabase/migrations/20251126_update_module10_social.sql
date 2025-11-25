BEGIN;

-- Module 10: Social Engineering Defense
-- Stage 55: Pretexting Attack (scenario)
UPDATE stages SET
  title = 'Pretexting Attack Recognition',
  description = 'Identify pretexting social engineering tactic.',
  scenario = 'Caller claims to be IT support and needs your password to "fix your account". What social engineering technique is this?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "technique",
      "question": "Impersonating authority to extract information is which technique?",
      "options": [
        {"id": "pretexting", "text": "Pretexting - fabricated scenario to gain trust", "correct": true},
        {"id": "phishing", "text": "Phishing - email scam"},
        {"id": "baiting", "text": "Baiting - offering something free"},
        {"id": "tailgating", "text": "Tailgating - physical access"}
      ]
    }],
    "correctChoice": "pretexting"
  }'::jsonb,
  points = 100
WHERE id = 55;

DELETE FROM hints WHERE stage_id = 55;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (55, 1, 'Pretexting uses fabricated scenario (fake IT support) to create trust and extract information.', 5);

-- Stage 56: Baiting Attack (scenario)
UPDATE stages SET
  title = 'Baiting Attack Defense',
  description = 'Recognize baiting social engineering.',
  scenario = 'USB drive labeled "Executive Salaries 2024" left in parking lot. What attack is this?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "attack",
      "question": "Physical media with tempting label left for victims is?",
      "options": [
        {"id": "baiting", "text": "Baiting - luring victims with promise of reward", "correct": true},
        {"id": "pretexting", "text": "Pretexting - fabricated scenario"},
        {"id": "vishing", "text": "Vishing - voice phishing"},
        {"id": "smishing", "text": "Smishing - SMS phishing"}
      ]
    }],
    "correctChoice": "baiting"
  }'::jsonb,
  points = 100
WHERE id = 56;

DELETE FROM hints WHERE stage_id = 56;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (56, 1, 'Baiting uses curiosity or greed (tempting label) to lure victims into taking malicious action.', 5);

-- Stage 58: Authority Exploitation (scenario)
UPDATE stages SET
  title = 'Authority Principle Exploitation',
  description = 'Recognize authority manipulation in social engineering.',
  scenario = 'Email from "CEO" demands immediate wire transfer, unusual for normal procedures. Best response?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "response",
      "question": "When authority figure makes unusual urgent request, you should?",
      "options": [
        {"id": "verify", "text": "Verify through separate communication channel", "correct": true},
        {"id": "comply", "text": "Comply immediately due to authority"},
        {"id": "ignore", "text": "Ignore completely"},
        {"id": "reply", "text": "Reply to email asking for confirmation"}
      ]
    }],
    "correctChoice": "verify"
  }'::jsonb,
  points = 100
WHERE id = 58;

DELETE FROM hints WHERE stage_id = 58;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (58, 1, 'Always verify unusual requests from authority figures through independent channel (phone call).', 5);

-- Stage 57: Tailgating (scenario)
UPDATE stages SET
  title = 'Physical Access Control',
  description = 'Prevent unauthorized physical access through tailgating.',
  scenario = 'Person without badge follows you into secure office saying "I forgot my badge, can you hold the door?" What to do?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "response",
      "question": "Best response to prevent tailgating?",
      "options": [
        {"id": "escort", "text": "Politely direct them to reception/security to get visitor badge", "correct": true},
        {"id": "hold", "text": "Hold door open to be helpful"},
        {"id": "badge", "text": "Lend them your badge"},
        {"id": "ignore", "text": "Ignore them completely"}
      ]
    }],
    "correctChoice": "escort"
  }'::jsonb,
  points = 100
WHERE id = 57;

DELETE FROM hints WHERE stage_id = 57;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (57, 1, 'Always direct people without credentials to proper check-in process, even if they seem friendly.', 5);

-- Stage 59: Quid Pro Quo (scenario)
UPDATE stages SET
  title = 'Quid Pro Quo Attack',
  description = 'Recognize exchange-based social engineering.',
  scenario = 'Caller claims to be from IT support offering "free security upgrade" but needs your password to install it. What to do?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "response",
      "question": "How to respond to unsolicited offer requiring credentials?",
      "options": [
        {"id": "verify", "text": "Verify through official IT channel and never share passwords", "correct": true},
        {"id": "provide", "text": "Provide password to get security upgrade"},
        {"id": "temporary", "text": "Give temporary password then change it"},
        {"id": "partial", "text": "Give partial password"}
      ]
    }],
    "correctChoice": "verify"
  }'::jsonb,
  points = 100
WHERE id = 59;

DELETE FROM hints WHERE stage_id = 59;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (59, 1, 'Legitimate IT never asks for passwords. Verify any service offer through official channels.', 5);

-- Stage 60: Scarcity Tactic (scenario)
UPDATE stages SET
  title = 'Scarcity and Urgency',
  description = 'Recognize pressure tactics creating artificial urgency.',
  scenario = 'Email: "Your account will be closed in 24 hours unless you verify payment info NOW via this link!" What to do?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "response",
      "question": "Best response to urgent account threat?",
      "options": [
        {"id": "official", "text": "Visit official website directly (not via link) to check account", "correct": true},
        {"id": "click", "text": "Click link immediately to save account"},
        {"id": "reply", "text": "Reply to email with payment info"},
        {"id": "ignore", "text": "Assume all account emails are fake"}
      ]
    }],
    "correctChoice": "official"
  }'::jsonb,
  points = 120
WHERE id = 60;

DELETE FROM hints WHERE stage_id = 60;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (60, 1, 'Scarcity/urgency creates panic. Always verify through official channels, not links in suspicious emails.', 5);

COMMIT;
