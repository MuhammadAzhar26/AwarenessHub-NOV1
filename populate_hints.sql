-- 🧠 Comprehensive Hints Population Script for AwarenessHub
-- This script populates hints table with relevant cybersecurity information
-- Each hint reduces points by 5 (multiplied by hint number: 5, 10, 15)

-- ========================================
-- GENERAL CYBERSECURITY HINTS
-- ========================================

-- Hints for Basic Security Concepts (Stage 1)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(1, 1, 'Think about what information you share online. Anything you post publicly can be seen by anyone.', 5),
(1, 2, 'Consider the privacy settings on your social media accounts. Who can see your posts and personal information?', 10),
(1, 3, 'Digital footprints include everything from social media posts to search history and online purchases. Be selective about what you share.', 15);

-- Hints for Password Security (Stage 2)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(2, 1, 'Strong passwords should be at least 12 characters long and include a mix of uppercase, lowercase, numbers, and symbols.', 5),
(2, 2, 'Avoid using personal information like birthdays, names, or common words. These are easily guessed by attackers.', 10),
(2, 3, 'Consider using a password manager to generate and store complex, unique passwords for each account.', 15);

-- Hints for Phishing Awareness (Stage 3)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(3, 1, 'Check the sender''s email address carefully. Official companies usually have consistent, professional email addresses.', 5),
(3, 2, 'Look for urgent language or threats. Phishing emails often create panic to make you act quickly without thinking.', 10),
(3, 3, 'Never click links or download attachments from suspicious emails. Instead, go directly to the website by typing the URL.', 15);

-- ========================================
-- NETWORK SECURITY HINTS
-- ========================================

-- Hints for WiFi Security (Stage 4)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(4, 1, 'Public WiFi networks are not secure. Avoid accessing sensitive accounts like banking or email on public networks.', 5),
(4, 2, 'Look for networks that require a password or login. Open networks without any authentication are the most dangerous.', 10),
(4, 3, 'Use a VPN (Virtual Private Network) when accessing public WiFi to encrypt your connection and protect your data.', 15);

-- Hints for HTTPS vs HTTP (Stage 5)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(5, 1, 'Look for a padlock icon in your browser''s address bar. This indicates a secure, encrypted connection.', 5),
(5, 2, 'HTTPS encrypts the data between your browser and the website, while HTTP sends data in plain text.', 10),
(5, 3, 'When entering personal information like passwords or credit card numbers, always use HTTPS sites.', 15);

-- Hints for Browser Security (Stage 6)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(6, 1, 'Keep your web browser updated to the latest version to patch security vulnerabilities.', 5),
(6, 2, 'Disable or remove unnecessary browser extensions and plugins that you don''t actively use.', 10),
(6, 3, 'Configure your browser to block pop-ups and disable automatic downloads for better security.', 15);

-- ========================================
-- SOCIAL ENGINEERING HINTS
-- ========================================

-- Hints for Social Media Safety (Stage 7)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(7, 1, 'Review and update your privacy settings regularly. Social media platforms often change their policies.', 5),
(7, 2, 'Be cautious about sharing your location in real-time. This information could be used to track your movements.', 10),
(7, 3, 'Think before you post. Once something is online, it can be screenshotted, shared, and potentially used against you.', 15);

-- Hints for Fake Profile Detection (Stage 8)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(8, 1, 'Check for inconsistencies in the profile information, such as mismatched job titles, locations, or interests.', 5),
(8, 2, 'Look at the account creation date and posting history. New accounts with sudden burst of activity are suspicious.', 10),
(8, 3, 'Verify mutual connections and look for generic profile pictures or stock photos that could indicate a fake account.', 15);

-- Hints for Email Investigation (Stage 9)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(9, 1, 'Analyze the email headers for technical details like the sending server and IP address.', 5),
(9, 2, 'Look for spelling and grammar errors, unusual formatting, or generic greetings like "Dear Customer".', 10),
(9, 3, 'Cross-reference the claimed sender with official contact information from the company''s website.', 15);

-- ========================================
-- MALWARE & VIRUS HINTS
-- ========================================

-- Hints for Malware Recognition (Stage 10)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(10, 1, 'Sudden slowdowns, unusual pop-ups, or new toolbars can indicate malware infection.', 5),
(10, 2, 'Ransomware typically encrypts files and demands payment for decryption. Never pay the ransom!', 10),
(10, 3, 'Trojan malware often disguises itself as legitimate software. Only download from official sources.', 15);

-- Hints for Antivirus Protection (Stage 11)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(11, 1, 'Keep your antivirus software updated with the latest virus definitions to catch new threats.', 5),
(11, 2, 'Run regular full system scans, not just quick scans, to thoroughly check your entire computer.', 10),
(11, 3, 'Enable real-time protection to catch threats as they try to infect your system, not just after the fact.', 15);

-- Hints for Infection Signs (Stage 12)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(12, 1, 'Unusual network activity, such as unknown processes sending data, can indicate malware infection.', 5),
(12, 2, 'Browser hijacking (unwanted homepage changes, new bookmarks) is a common sign of adware or malware.', 10),
(12, 3, 'Missing files, corrupted programs, or unusual system behavior can indicate advanced persistent threats.', 15);

-- ========================================
-- DIGITAL FORENSICS HINTS
-- ========================================

-- Hints for Digital Footprint Cleanup (Stage 13)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(13, 1, 'Use Google''s "Results about you" tool to see what information is publicly available about you online.', 5),
(13, 2, 'Delete old accounts you no longer use, including social media, forums, and shopping websites.', 10),
(13, 3, 'Contact website administrators directly to request removal of unwanted content or personal information.', 15);

-- Hints for Privacy Settings (Stage 14)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(14, 1, 'Configure privacy settings to limit who can see your posts, friend list, and personal information.', 5),
(14, 2, 'Turn off location sharing and historical location tracking in your device and app settings.', 10),
(14, 3, 'Review and revoke permissions for apps that no longer need access to your data or camera.', 15);

-- ========================================
-- CRYPTOGRAPHY HINTS
-- ========================================

-- Hints for Caesar Cipher (Stage 15)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(15, 1, 'A Caesar cipher shifts each letter by a fixed number of positions in the alphabet.', 5),
(15, 2, 'Try shifting letters by different amounts (1-25) and look for readable words in the results.', 10),
(15, 3, 'The most common letter in English is E, so look for frequent letters that might correspond to E.', 15);

-- ========================================
-- CODE ANALYSIS HINTS
-- ========================================

-- Hints for Security Code Analysis (Stage 16)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(16, 1, 'Look for hardcoded passwords, API keys, or sensitive data stored directly in the code.', 5),
(16, 2, 'Check for input validation issues like missing sanitization that could lead to injection attacks.', 10),
(16, 3, 'Examine error handling - revealing too much information in error messages can aid attackers.', 15);

-- ========================================
-- ADVANCED CHALLENGES HINTS
-- ========================================

-- Hints for Link Safety Analysis (Stage 17)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(17, 1, 'Hover over links to see the actual destination URL before clicking. Does it match the displayed text?', 5),
(17, 2, 'Look for misspellings in domain names (like "micros0ft.com" instead of "microsoft.com").', 10),
(17, 3, 'Use tools like VirusTotal or URLVoid to scan suspicious links for malware before visiting them.', 15);

-- Hints for Website Security Comparison (Stage 18)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(18, 1, 'Examine the website''s SSL certificate. Look for valid certificates from trusted authorities.', 5),
(18, 2, 'Check for professional design and content quality. Legitimate businesses invest in good websites.', 10),
(18, 3, 'Verify contact information, physical addresses, and company registration details for legitimacy.', 15);

-- ========================================
-- PRACTICAL SCENARIOS HINTS
-- ========================================

-- Hints for Password Builder Challenge (Stage 19)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(19, 1, 'Use a combination of unrelated words with numbers and symbols to create a memorable but strong password.', 5),
(19, 2, 'Password strength meters consider length, character variety, and predictability. Avoid common patterns.', 10),
(19, 3, 'Consider using passphrases - longer sentences that are easier to remember but harder to crack.', 15);

-- Hints for Scenario-Based Decision Making (Stage 20)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(20, 1, 'Consider the potential consequences of each action before making a decision in cybersecurity scenarios.', 5),
(20, 2, 'Think like an attacker - what would they try to exploit in this situation?', 10),
(20, 3, 'When in doubt, follow the principle of least privilege and err on the side of caution.', 15);

-- ========================================
-- MATCHING & INTERACTIVE HINTS
-- ========================================

-- Hints for Security Tools Matching (Stage 21)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(21, 1, 'Think about the primary function of each security tool. What problem does it solve?', 5),
(21, 2, 'Network analysis tools help monitor traffic, while vulnerability scanners identify security weaknesses.', 10),
(21, 3, 'Some tools are used for offensive security (penetration testing) while others are defensive (protection).', 15);

-- Hints for Drag & Drop Security Concepts (Stage 22)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(22, 1, 'Consider the logical flow of cybersecurity processes. What comes before what?', 5),
(22, 2, 'Security incident response typically follows a structured workflow from detection to recovery.', 10),
(22, 3, 'Think about dependencies between different security measures and practices.', 15);

-- ========================================
-- COMMON CYBERSECURITY PRINCIPLES
-- ========================================

-- Hints for Defense in Depth (Stage 23)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(23, 1, 'No single security measure is perfect. Multiple layers of protection provide better security.', 5),
(23, 2, 'If an attacker gets past one security layer, other layers should stop them from accessing critical systems.', 10),
(23, 3, 'Combine technical controls (firewalls, antivirus) with administrative controls (policies, training).', 15);

-- Hints for Incident Response (Stage 24)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(24, 1, 'The first step in incident response is identifying and confirming that an incident has occurred.', 5),
(24, 2, 'Containment is critical - isolate affected systems to prevent the incident from spreading.', 10),
(24, 3, 'Document everything during the incident. Good documentation helps with recovery and prevention of future incidents.', 15);

-- ========================================
-- EDUCATION & TRAINING HINTS
-- ========================================

-- Hints for Security Awareness (Stage 25)
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points) VALUES 
(25, 1, 'Human error is the leading cause of security breaches. Technology alone cannot protect against all threats.', 5),
(25, 2, 'Regular security training keeps employees aware of current threats and best practices.', 10),
(25, 3, 'Encourage a security-first mindset where everyone takes responsibility for protecting information.', 15);

-- ========================================
-- UPDATE EXISTING HINTS WITH PENALTIES
-- ========================================

-- Update any existing hints to use the correct penalty structure
-- Hint 1: 5 points penalty, Hint 2: 10 points penalty, Hint 3: 15 points penalty
UPDATE hints SET penalty_points = 5 WHERE hint_number = 1;
UPDATE hints SET penalty_points = 10 WHERE hint_number = 2;  
UPDATE hints SET penalty_points = 15 WHERE hint_number = 3;

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check all populated hints
SELECT 
    s.title as stage_title,
    h.hint_number,
    LEFT(h.hint_text, 50) || '...' as hint_preview,
    h.penalty_points
FROM hints h
JOIN stages s ON h.stage_id = s.id
ORDER BY s.stage_number, h.hint_number;

-- Count hints per stage
SELECT 
    s.title as stage_title,
    COUNT(h.id) as hint_count
FROM stages s
LEFT JOIN hints h ON s.id = h.stage_id
GROUP BY s.id, s.title, s.stage_number
ORDER BY s.stage_number;

-- ========================================
-- SUMMARY
-- ========================================

/*
This script populates the hints table with comprehensive cybersecurity education content.

Features:
✅ 25 different cybersecurity scenarios covered
✅ 3 hints per stage (75 total hints)
✅ Progressive hint system: 5, 10, 15 point penalties
✅ Educational and practical content
✅ Covers all major cybersecurity domains

Usage:
1. Run this script in Supabase SQL Editor
2. Or execute via VS Code PostgreSQL extension
3. Test hints display correctly in the Challenge page
4. Verify point deduction works in the edge function

The hint system now provides:
- Helpful guidance for learning
- 5-point penalty per hint used
- Educational value while maintaining challenge
- Progressive difficulty (later hints cost more points)
*/