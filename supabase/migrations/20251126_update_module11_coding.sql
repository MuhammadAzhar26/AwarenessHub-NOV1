BEGIN;

-- Module 11: Secure Coding Practices
-- Stage 61: SQL Injection (scenario)
UPDATE stages SET
  title = 'SQL Injection Prevention',
  description = 'Identify secure method to prevent SQL injection.',
  scenario = 'Building a login form. Which approach prevents SQL injection?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "method",
      "question": "Best practice to prevent SQL injection in queries?",
      "options": [
        {"id": "prepared", "text": "Use parameterized queries / prepared statements", "correct": true},
        {"id": "concat", "text": "Concatenate user input directly into SQL"},
        {"id": "uppercase", "text": "Convert input to uppercase"},
        {"id": "length", "text": "Check input length only"}
      ]
    }],
    "correctChoice": "prepared"
  }'::jsonb,
  points = 100
WHERE id = 61;

DELETE FROM hints WHERE stage_id = 61;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (61, 1, 'Parameterized queries separate SQL code from data, preventing injection.', 5);

-- Stage 62: XSS Prevention (scenario)
UPDATE stages SET
  title = 'Cross-Site Scripting Defense',
  description = 'Prevent XSS attacks in web applications.',
  scenario = 'Displaying user comments on webpage. How to prevent XSS?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "prevention",
      "question": "Primary defense against XSS when displaying user input?",
      "options": [
        {"id": "encode", "text": "HTML encode/escape all user input before display", "correct": true},
        {"id": "raw", "text": "Display input exactly as entered"},
        {"id": "uppercase", "text": "Convert to uppercase"},
        {"id": "length", "text": "Limit input length"}
      ]
    }],
    "correctChoice": "encode"
  }'::jsonb,
  points = 100
WHERE id = 62;

DELETE FROM hints WHERE stage_id = 62;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (62, 1, 'HTML encoding converts special characters (<, >, &) to prevent script execution.', 5);

-- Stage 63: CSRF Protection (scenario)
UPDATE stages SET
  title = 'CSRF Token Implementation',
  description = 'Protect against Cross-Site Request Forgery.',
  scenario = 'Securing state-changing operations (money transfer, password change). Best CSRF protection?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "protection",
      "question": "Primary mechanism to prevent CSRF attacks?",
      "options": [
        {"id": "csrf-token", "text": "Include unpredictable CSRF token in forms", "correct": true},
        {"id": "no-protection", "text": "No protection needed"},
        {"id": "captcha", "text": "CAPTCHA on every request"},
        {"id": "long-url", "text": "Use very long URLs"}
      ]
    }],
    "correctChoice": "csrf-token"
  }'::jsonb,
  points = 120
WHERE id = 63;

DELETE FROM hints WHERE stage_id = 63;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (63, 1, 'CSRF tokens are unique per session/request, preventing attackers from forging requests.', 5);

-- Stage 64: Input Validation (drag-drop)
UPDATE stages SET
  title = 'Input Validation Strategy',
  description = 'Classify validation as client-side or server-side.',
  scenario = 'Proper input validation requires multiple layers. Categorize where each validation should occur.',
  challenge_type = 'drag-drop',
  challenge_data = '{
    "items": [
      {"id": "val1", "text": "Format checking (email pattern)"},
      {"id": "val2", "text": "Security validation (SQLi/XSS)"},
      {"id": "val3", "text": "UX improvement (instant feedback)"},
      {"id": "val4", "text": "Business logic enforcement"},
      {"id": "val5", "text": "Authorization checks"},
      {"id": "val6", "text": "Final security validation"}
    ],
    "zones": [
      {"id": "client", "label": "Client-Side (Optional UX)", "correctItems": ["val1", "val3"]},
      {"id": "server", "label": "Server-Side (Required)", "correctItems": ["val2", "val4", "val5", "val6"]}
    ]
  }'::jsonb,
  points = 120
WHERE id = 64;

DELETE FROM hints WHERE stage_id = 64;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (64, 1, 'Client-side is UX convenience only. Server-side must enforce all security and business rules.', 5);

-- Stage 65: Secure Password Storage (scenario)
UPDATE stages SET
  title = 'Password Hashing Best Practice',
  description = 'Store passwords securely.',
  scenario = 'Storing user passwords in database. Which method is most secure?',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [{
      "id": "storage",
      "question": "Most secure way to store passwords?",
      "options": [
        {"id": "bcrypt", "text": "bcrypt/Argon2 with salt and high cost factor", "correct": true},
        {"id": "plaintext", "text": "Plain text"},
        {"id": "md5", "text": "MD5 hash"},
        {"id": "base64", "text": "Base64 encoding"}
      ]
    }],
    "correctChoice": "bcrypt"
  }'::jsonb,
  points = 100
WHERE id = 65;

DELETE FROM hints WHERE stage_id = 65;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (65, 1, 'Use slow adaptive hash functions (bcrypt, Argon2) with salt to resist brute force attacks.', 5);

-- Stage 66: API Security (matching)
UPDATE stages SET
  title = 'API Security Controls',
  description = 'Match API security mechanisms to their purposes.',
  scenario = 'Securing REST APIs requires multiple controls. Match each mechanism to its function.',
  challenge_type = 'matching',
  challenge_data = '{
    "pairs": [
      {"id": "ctrl1", "left": "Rate limiting", "right": "Prevents abuse and DoS"},
      {"id": "ctrl2", "left": "OAuth 2.0", "right": "Delegated authorization"},
      {"id": "ctrl3", "left": "API keys", "right": "Identifies calling application"},
      {"id": "ctrl4", "left": "Input validation", "right": "Prevents injection attacks"}
    ]
  }'::jsonb,
  points = 100
WHERE id = 66;

DELETE FROM hints WHERE stage_id = 66;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES
  (66, 1, 'Rate limiting stops DoS. OAuth for authorization. API keys identify apps. Input validation prevents injection.', 5);

COMMIT;
