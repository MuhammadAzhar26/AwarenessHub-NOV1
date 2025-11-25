BEGIN;

-- Stage 16: Attachment Risk Assessment
UPDATE stages
SET
  title = 'Email Attachment Risk Analyzer',
  description = 'Classify email attachments by risk level based on file extensions and context.',
  scenario = 'Your security team intercepted several emails with attachments. Classify each file as Safe to Open, Verify First, or Do Not Open based on the file type and extension. Executables and scripts pose the highest risk.',
  challenge_type = 'attachment-risk',
  challenge_data = '{
    "attachments": [
      {
        "id": "att1",
        "filename": "Invoice_Q4_2024.pdf",
        "extension": ".pdf",
        "size": "245 KB",
        "riskLevel": "safe"
      },
      {
        "id": "att2",
        "filename": "contract_signed.docm",
        "extension": ".docm",
        "size": "128 KB",
        "riskLevel": "suspicious"
      },
      {
        "id": "att3",
        "filename": "photo_vacation.jpg",
        "extension": ".jpg",
        "size": "1.2 MB",
        "riskLevel": "safe"
      },
      {
        "id": "att4",
        "filename": "update_installer.exe",
        "extension": ".exe",
        "size": "4.5 MB",
        "riskLevel": "dangerous"
      },
      {
        "id": "att5",
        "filename": "report_archive.zip",
        "extension": ".zip",
        "size": "890 KB",
        "riskLevel": "suspicious"
      },
      {
        "id": "att6",
        "filename": "script_automation.vbs",
        "extension": ".vbs",
        "size": "12 KB",
        "riskLevel": "dangerous"
      }
    ]
  }'::jsonb,
  points = 100
WHERE id = 16;

DELETE FROM hints WHERE stage_id = 16;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (16, 1, 'PDFs and images are generally safe. Office files with macros (.docm, .xlsm) need verification. Executables (.exe, .vbs, .bat) are always dangerous.', 5),
  (16, 2, 'Safe: pdf, jpg. Suspicious: docm, zip. Dangerous: exe, vbs.', 10);

-- Stage 17: Email Header Analysis
UPDATE stages
SET
  title = 'Phishing Header Detective',
  description = 'Analyze email headers to identify spoofing and phishing indicators.',
  scenario = 'A suspected phishing email landed in the security queue. Review each header field and flag at least 3 suspicious entries that indicate spoofing, mismatched domains, or forged sender information.',
  challenge_type = 'email-header-analysis',
  challenge_data = '{
    "headers": [
      {
        "id": "h1",
        "name": "From",
        "value": "security@paypa1.com",
        "suspicious": true,
        "explanation": "Domain uses number ''1'' instead of letter ''l'' (paypal → paypa1), classic typosquatting."
      },
      {
        "id": "h2",
        "name": "Reply-To",
        "value": "payments@legitimate-bank.com",
        "suspicious": false,
        "explanation": "Matches expected domain for this organization, no red flags."
      },
      {
        "id": "h3",
        "name": "Return-Path",
        "value": "<malicious@temp-server.xyz>",
        "suspicious": true,
        "explanation": "Return-Path domain (temp-server.xyz) does not match From domain (paypa1.com), indicates spoofing."
      },
      {
        "id": "h4",
        "name": "Received",
        "value": "from unknown-relay.ru [185.220.101.45]",
        "suspicious": true,
        "explanation": "Email originated from suspicious foreign IP and relay server (.ru TLD), not from claimed sender infrastructure."
      },
      {
        "id": "h5",
        "name": "Date",
        "value": "Mon, 25 Nov 2024 14:32:18 +0000",
        "suspicious": false,
        "explanation": "Standard date format, no anomalies detected."
      },
      {
        "id": "h6",
        "name": "Message-ID",
        "value": "<random123@temp-server.xyz>",
        "suspicious": true,
        "explanation": "Message-ID domain matches suspicious Return-Path (temp-server.xyz), confirms forged origin."
      }
    ],
    "minCorrect": 3
  }'::jsonb,
  points = 150
WHERE id = 17;

DELETE FROM hints WHERE stage_id = 17;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (17, 1, 'Look for domain mismatches between From, Reply-To, Return-Path, and Message-ID. Typosquatting (paypa1 vs paypal) is a common trick.', 5),
  (17, 2, 'Check the Received header for suspicious foreign IPs or relay servers. At least 4 headers are suspicious in this email.', 10);

-- Stage 18: Spear Phishing Scenario (enhanced scenario challenge)
UPDATE stages
SET
  title = 'Spear Phishing Defense Scenario',
  description = 'Navigate a multi-step spear phishing attack targeting your organization.',
  scenario = 'You receive an email claiming to be from your CEO requesting an urgent wire transfer. The message includes personal details about recent company events. Choose the best response at each decision point to avoid falling for this targeted attack.',
  challenge_type = 'scenario',
  challenge_data = '{
    "sections": [
      {
        "id": "decision1",
        "question": "The email references a recent board meeting you attended. What is your first action?",
        "options": [
          {"id": "verify-phone", "text": "Call the CEO directly using a known phone number to verify", "correct": true},
          {"id": "reply-email", "text": "Reply to the email asking for confirmation"},
          {"id": "process-request", "text": "Process the wire transfer immediately due to urgency"},
          {"id": "forward-finance", "text": "Forward to finance team to handle"}
        ]
      }
    ],
    "correctChoice": "verify-phone"
  }'::jsonb,
  points = 100
WHERE id = 18;

DELETE FROM hints WHERE stage_id = 18;
INSERT INTO hints (stage_id, hint_number, hint_text, penalty_points)
VALUES
  (18, 1, 'Spear phishing uses personalized details to build trust. Always verify requests through a separate communication channel.', 5),
  (18, 2, 'Never reply to suspicious emails or process urgent financial requests without direct verbal confirmation.', 10);

COMMIT;
