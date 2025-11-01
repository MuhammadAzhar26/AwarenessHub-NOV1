-- 🚀 Quick Video Update Script for AwarenessHub
-- Run this in Supabase SQL Editor or VS Code PostgreSQL extension

-- ========================================
-- TOOLS TRAINING VIDEO UPDATES
-- ========================================

-- Update Wireshark Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_WIRESHARK_VIDEO_ID' 
WHERE tool_name = 'Wireshark';

-- Update Nmap Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_NMAP_VIDEO_ID' 
WHERE tool_name = 'Nmap';

-- Update Metasploit Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_METASPLOIT_VIDEO_ID' 
WHERE tool_name = 'Metasploit';

-- Update Burp Suite Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_BURP_SUITE_VIDEO_ID' 
WHERE tool_name = 'Burp Suite';

-- Update Nessus Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_NESSUS_VIDEO_ID' 
WHERE tool_name = 'Nessus';

-- Update OpenVAS Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_OPENVAS_VIDEO_ID' 
WHERE tool_name = 'OpenVAS';

-- Update Autopsy Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_AUTOPSY_VIDEO_ID' 
WHERE tool_name = 'Autopsy';

-- Update Volatility Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_VOLATILITY_VIDEO_ID' 
WHERE tool_name = 'Volatility';

-- Update John the Ripper Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_JTR_VIDEO_ID' 
WHERE tool_name = 'John the Ripper';

-- Update Hashcat Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_HASHCAT_VIDEO_ID' 
WHERE tool_name = 'Hashcat';

-- Update Kali Linux Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_KALI_VIDEO_ID' 
WHERE tool_name = 'Kali Linux';

-- Update Security Integration Video
UPDATE tools_training 
SET video_url = 'https://www.youtube.com/embed/YOUR_SECURITY_VIDEO_ID' 
WHERE tool_name = 'Security Integration';

-- ========================================
-- DFIR EDUCATION VIDEO UPDATES
-- ========================================

-- Update DFIR Fundamentals
UPDATE dfir_education 
SET video_url = 'https://www.youtube.com/embed/YOUR_DFIR_FUNDAMENTALS_VIDEO_ID' 
WHERE module_name = 'DFIR Fundamentals';

-- Update Incident Response Basics
UPDATE dfir_education 
SET video_url = 'https://www.youtube.com/embed/YOUR_IR_BASICS_VIDEO_ID' 
WHERE module_name = 'Incident Response Basics';

-- Update Malware Analysis
UPDATE dfir_education 
SET video_url = 'https://www.youtube.com/embed/YOUR_MALWARE_ANALYSIS_VIDEO_ID' 
WHERE module_name = 'Malware Analysis';

-- Update Memory Forensics
UPDATE dfir_education 
SET video_url = 'https://www.youtube.com/embed/YOUR_MEMORY_FORENSICS_VIDEO_ID' 
WHERE module_name = 'Memory Forensics';

-- Update Network Forensics
UPDATE dfir_education 
SET video_url = 'https://www.youtube.com/embed/YOUR_NETWORK_FORENSICS_VIDEO_ID' 
WHERE module_name = 'Network Forensics';

-- ========================================
-- BULK UPDATE OPTIONS
-- ========================================

-- Option 1: Update all basic level videos to same URL
-- UPDATE tools_training 
-- SET video_url = 'https://www.youtube.com/embed/YOUR_BASIC_VIDEO_ID' 
-- WHERE difficulty_level = 'Basic';

-- Option 2: Update all network category videos
-- UPDATE tools_training 
-- SET video_url = 'https://www.youtube.com/embed/YOUR_NETWORK_VIDEO_ID' 
-- WHERE category = 'Network';

-- Option 3: Update all DFIR videos to same URL
-- UPDATE dfir_education 
-- SET video_url = 'https://www.youtube.com/embed/YOUR_DFIR_VIDEO_ID';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check current video URLs for Tools Training
SELECT tool_name, video_url, difficulty_level, category 
FROM tools_training 
ORDER BY tool_name;

-- Check current video URLs for DFIR Education
SELECT module_name, video_url, topic, difficulty_level 
FROM dfir_education 
ORDER BY module_name;

-- Count total videos
SELECT 'Tools Training' as table_name, COUNT(*) as video_count 
FROM tools_training 
UNION ALL 
SELECT 'DFIR Education' as table_name, COUNT(*) as video_count 
FROM dfir_education;

-- ========================================
-- INSTRUCTIONS
-- ========================================
/*
1. Replace 'YOUR_[TOOL]_VIDEO_ID' with actual YouTube video IDs
2. Example: 'YOUR_WIRESHARK_VIDEO_ID' -> '5U4cN5H5jQ4'
3. Full URL format: https://www.youtube.com/embed/VIDEO_ID
4. Run these queries in Supabase SQL Editor
5. Or use VS Code PostgreSQL extension
6. Test videos after updating URLs
*/