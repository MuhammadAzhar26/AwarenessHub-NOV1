import React from 'react'
import { default as EnhancedSimulation, type EnhancedScenario } from './EnhancedSimulation'
import { DragItem, DropZone } from './types'
import { MatchPair } from './types'

const SocialEngineeringSimEnhanced = () => {
  const scenarios: EnhancedScenario[] = [
    // Scenario 1: IT Support Phone Scam - Drag suspicious phrases to red flag categories
    {
      id: 'it-support-phone-scam',
      title: 'IT Support Phone Scam Detection',
      description: 'Listen to suspicious call scripts and drag phrases to red flag categories',
      type: 'drag-drop',
      points: 10,
      difficulty: 'beginner',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'We detected a virus on your computer', category: 'red-flag' },
            { id: '2', content: 'I need your password to fix this', category: 'red-flag' },
            { id: '3', content: 'Call from your company IT department', category: 'suspicious' },
            { id: '4', content: 'We need remote access immediately', category: 'red-flag' },
            { id: '5', content: 'Install this software to protect you', category: 'red-flag' },
            { id: '6', content: 'Official company maintenance window', category: 'legitimate' },
            { id: '7', content: 'Request for full system access', category: 'red-flag' },
            { id: '8', content: 'Emergency security update needed', category: 'red-flag' },
            { id: '9', content: 'Planned IT infrastructure update', category: 'legitimate' },
            { id: '10', content: 'Credit card required for support', category: 'red-flag' },
            { id: '11', content: 'Unauthorized company software detected', category: 'red-flag' },
            { id: '12', content: 'Scheduled security patching notification', category: 'legitimate' }
          ],
          dropZones: [
            { id: 'legitimate', title: 'Legitimate IT Communications', accepts: ['legitimate'], color: 'from-green-500 to-emerald-500' },
            { id: 'suspicious', title: 'Requires Verification', accepts: ['suspicious'], color: 'from-yellow-500 to-orange-500' },
            { id: 'red-flag', title: 'Red Flags - Scam Indicators', accepts: ['red-flag'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },

    // Scenario 2: Banking Verification Call - Match legitimate vs fake verification methods
    {
      id: 'banking-verification-call',
      title: 'Banking Verification Call Analysis',
      description: 'Match legitimate banking verification methods with fake ones',
      type: 'matching',
      points: 12,
      difficulty: 'intermediate',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: 'Requests SSN over the phone' },
              right: { id: '1', content: 'Banking Scam - Banks never ask for SSN' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'Bank app requires secure login' },
              right: { id: '2', content: 'Legitimate Verification Method' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'Asks for card PIN over call' },
              right: { id: '3', content: 'Identity Theft Risk - Never share PIN' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'Confirms transactions via SMS codes' },
              right: { id: '4', content: 'Legitimate Two-Factor Authentication' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Demands immediate wire transfer' },
              right: { id: '5', content: 'Financial Fraud - Creates urgency' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'Sends verification link to email' },
              right: { id: '6', content: 'Legitimate Verification Channel' }
            }
          ]
        }
      }
    },

    // Scenario 3: Government Agency Impersonation - Sort authority verification steps
    {
      id: 'government-impersonation',
      title: 'Government Agency Impersonation',
      description: 'Sort authority verification steps to detect fake government agents',
      type: 'timeline',
      points: 15,
      difficulty: 'advanced',
      content: {
        timelineData: {
          events: [
            { id: '1', content: 'Do not provide personal information immediately', order: 1 },
            { id: '2', content: 'Ask for official case or reference number', order: 2 },
            { id: '3', content: 'Hang up and call official agency number', order: 3 },
            { id: '4', content: 'Verify identity through official channels', order: 4 },
            { id: '5', content: 'Report suspicious call to authorities', order: 5 }
          ],
          correctOrder: [1, 2, 3, 4, 5]
        }
      }
    },

    // Scenario 4: Tech Support Remote Access - Drag system access permissions
    {
      id: 'tech-support-remote-access',
      title: 'Tech Support Remote Access Security',
      description: 'Drag system access permissions to appropriate security categories',
      type: 'drag-drop',
      points: 14,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Screen sharing only', category: 'safe' },
            { id: '2', content: 'Download remote access software', category: 'unsafe' },
            { id: '3', content: 'Provide admin credentials', category: 'unsafe' },
            { id: '4', content: 'View-only assistance', category: 'safe' },
            { id: '5', content: 'Control mouse and keyboard', category: 'unsafe' },
            { id: '6', content: 'Scheduled remote session with time limit', category: 'safe' },
            { id: '7', content: 'Install security software remotely', category: 'unsafe' },
            { id: '8', content: 'Access to file system', category: 'unsafe' },
            { id: '9', content: 'Screen recording for troubleshooting', category: 'safe' },
            { id: '10', content: 'Remote control of entire system', category: 'unsafe' },
            { id: '11', content: 'Co-browsing for web support', category: 'safe' },
            { id: '12', content: 'Modify system settings', category: 'unsafe' }
          ],
          dropZones: [
            { id: 'safe', title: 'Safe Remote Support', accepts: ['safe'], color: 'from-green-500 to-emerald-500' },
            { id: 'unsafe', title: 'Unsafe - Major Risk', accepts: ['unsafe'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },

    // Scenario 5: Email Pretexting Analysis - Sort email elements by legitimacy
    {
      id: 'email-pretexting-analysis',
      title: 'Email Pretexting Analysis',
      description: 'Sort email elements by legitimacy indicators',
      type: 'drag-drop',
      points: 13,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Generic greeting "Dear Customer"', category: 'suspicious' },
            { id: '2', content: 'Suspicious sender domain', category: 'suspicious' },
            { id: '3', content: 'Urgent language', category: 'suspicious' },
            { id: '4', content: 'Professional company logo', category: 'legitimate' },
            { id: '5', content: 'Malicious attachment', category: 'dangerous' },
            { id: '6', content: 'Contact information mismatch', category: 'suspicious' },
            { id: '7', content: 'Proper spelling and grammar', category: 'legitimate' },
            { id: '8', content: 'Requests sensitive information', category: 'dangerous' },
            { id: '9', content: 'HTTPS secure connection', category: 'legitimate' },
            { id: '10', content: 'Too good to be true offers', category: 'suspicious' },
            { id: '11', content: 'Personalized customer service', category: 'legitimate' },
            { id: '12', content: 'Payment information request', category: 'dangerous' }
          ],
          dropZones: [
            { id: 'legitimate', title: 'Legitimate Elements', accepts: ['legitimate'], color: 'from-green-500 to-emerald-500' },
            { id: 'suspicious', title: 'Suspicious Elements', accepts: ['suspicious'], color: 'from-yellow-500 to-orange-500' },
            { id: 'dangerous', title: 'Dangerous Elements', accepts: ['dangerous'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },

    // Scenario 6: Social Media Impersonation - Match profile verification methods
    {
      id: 'social-media-impersonation',
      title: 'Social Media Impersonation Detection',
      description: 'Match social media impersonation tactics with verification methods',
      type: 'matching',
      points: 11,
      difficulty: 'beginner',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: 'Celebrity account asks for donations' },
              right: { id: '1', content: 'Fake - Celebrities don\'t solicit donations on social media' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'Blue verified badge on profile' },
              right: { id: '2', content: 'Authentic Verification Indicator' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'Friend requests from unknown profiles' },
              right: { id: '3', content: 'Social Engineering Attempt - Verify before accepting' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'Link sharing with malicious URLs' },
              right: { id: '4', content: 'Malware Distribution - Never click unverified links' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Recent account creation date' },
              right: { id: '5', content: 'Fake Profile Red Flag - Check account age' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'Engagement with authentic followers' },
              right: { id: '6', content: 'Legitimate Account Activity' }
            }
          ]
        }
      }
    },

    // Scenario 7: Emergency Contact Scams - Sort emergency response procedures
    {
      id: 'emergency-contact-scams',
      title: 'Emergency Contact Scam Response',
      description: 'Sort emergency response procedures to handle fake emergency calls',
      type: 'timeline',
      points: 16,
      difficulty: 'advanced',
      content: {
        timelineData: {
          events: [
            { id: '1', content: 'Do not panic or provide information immediately', order: 1 },
            { id: '2', content: 'Ask for official incident reference number', order: 2 },
            { id: '3', content: 'Hang up and call official emergency line', order: 3 },
            { id: '4', content: 'Contact trusted family member to verify situation', order: 4 },
            { id: '5', content: 'Report to law enforcement if confirmed scam', order: 5 }
          ],
          correctOrder: [1, 2, 3, 4, 5]
        }
      }
    },

    // Scenario 8: Vendor Impersonation - Drag vendor communication indicators
    {
      id: 'vendor-impersonation',
      title: 'Vendor Impersonation Detection',
      description: 'Drag vendor communication indicators to security risk levels',
      type: 'drag-drop',
      points: 14,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Unsolicited invoice for services not ordered', category: 'high-risk' },
            { id: '2', content: 'Official vendor portal notification', category: 'low-risk' },
            { id: '3', content: 'Bank account change request via email', category: 'high-risk' },
            { id: '4', content: 'Phone call about contract renewal', category: 'medium-risk' },
            { id: '5', content: 'Unusual payment method requests', category: 'high-risk' },
            { id: '6', content: 'Annual service agreement renewal', category: 'low-risk' },
            { id: '7', content: 'Urgent payment deadline threats', category: 'high-risk' },
            { id: '8', content: 'Established vendor communication patterns', category: 'low-risk' },
            { id: '9', content: 'New vendor onboarding documentation', category: 'medium-risk' },
            { id: '10', content: 'Wire transfer instructions', category: 'high-risk' },
            { id: '11', content: 'Updated vendor contact information', category: 'medium-risk' },
            { id: '12', content: 'Monthly service report notification', category: 'low-risk' }
          ],
          dropZones: [
            { id: 'low-risk', title: 'Low Risk - Standard Communication', accepts: ['low-risk'], color: 'from-green-500 to-emerald-500' },
            { id: 'medium-risk', title: 'Medium Risk - Verify First', accepts: ['medium-risk'], color: 'from-yellow-500 to-orange-500' },
            { id: 'high-risk', title: 'High Risk - Major Red Flag', accepts: ['high-risk'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },

    // Scenario 9: HR Department Social Engineering - Sort employee information security
    {
      id: 'hr-social-engineering',
      title: 'HR Social Engineering Protection',
      description: 'Sort employee information requests by security level',
      type: 'drag-drop',
      points: 12,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Employee directory information', category: 'public' },
            { id: '2', content: 'Salary and benefits details', category: 'confidential' },
            { id: '3', content: 'Social security numbers', category: 'restricted' },
            { id: '4', content: 'Emergency contact lists', category: 'confidential' },
            { id: '5', content: 'Company phone directory', category: 'public' },
            { id: '6', content: 'Performance reviews', category: 'restricted' },
            { id: '7', content: 'Department organizational chart', category: 'public' },
            { id: '8', content: 'Personal email addresses', category: 'confidential' },
            { id: '9', content: 'Training schedules', category: 'public' },
            { id: '10', content: 'Medical leave information', category: 'restricted' },
            { id: '11', content: 'Employee badge numbers', category: 'confidential' },
            { id: '12', content: 'Birth date and age information', category: 'restricted' }
          ],
          dropZones: [
            { id: 'public', title: 'Public Information', accepts: ['public'], color: 'from-green-500 to-emerald-500' },
            { id: 'confidential', title: 'Confidential Information', accepts: ['confidential'], color: 'from-yellow-500 to-orange-500' },
            { id: 'restricted', title: 'Restricted Information', accepts: ['restricted'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },

    // Scenario 10: Callback Verification Game - Drag verification protocol steps
    {
      id: 'callback-verification-game',
      title: 'Callback Verification Protocol',
      description: 'Drag verification protocol steps to proper sequence areas',
      type: 'drag-drop',
      points: 18,
      difficulty: 'advanced',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Get callback number and caller name', category: 'step1' },
            { id: '2', content: 'Hang up immediately', category: 'step1' },
            { id: '3', content: 'Look up official number independently', category: 'step2' },
            { id: '4', content: 'Call using official number only', category: 'step2' },
            { id: '5', content: 'Ask for employee ID and department', category: 'step3' },
            { id: '6', content: 'Request case or ticket number', category: 'step3' },
            { id: '7', content: 'Verify through official channels', category: 'step4' },
            { id: '8', content: 'Check caller ID and caller routing', category: 'step4' },
            { id: '9', content: 'Document the original callback request', category: 'step5' },
            { id: '10', content: 'Report suspicious activity', category: 'step5' }
          ],
          dropZones: [
            { id: 'step1', title: 'Step 1: Immediate Response', accepts: ['step1'], color: 'from-red-500 to-pink-500' },
            { id: 'step2', title: 'Step 2: Independent Verification', accepts: ['step2'], color: 'from-yellow-500 to-orange-500' },
            { id: 'step3', title: 'Step 3: Authentication', accepts: ['step3'], color: 'from-blue-500 to-cyan-500' },
            { id: 'step4', title: 'Step 4: Cross-Reference', accepts: ['step4'], color: 'from-purple-500 to-pink-500' },
            { id: 'step5', title: 'Step 5: Documentation', accepts: ['step5'], color: 'from-green-500 to-emerald-500' }
          ]
        }
      }
    },

    // Scenario 11: Multi-Channel Attacks - Match attack vectors with defenses
    {
      id: 'multi-channel-attacks',
      title: 'Multi-Channel Social Engineering Attacks',
      description: 'Match multi-channel attack vectors with appropriate defenses',
      type: 'matching',
      points: 16,
      difficulty: 'advanced',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: 'Email + Phone follow-up within hours' },
              right: { id: '1', content: 'Attack Vector - Coordinate verification of both channels' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'Social media + text message coordination' },
              right: { id: '2', content: 'Attack Vector - All channels must be verified independently' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'Time pressure across multiple platforms' },
              right: { id: '3', content: 'Attack Vector - Time pressure is red flag' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'Different personas across channels' },
              right: { id: '4', content: 'Attack Vector - Person identity must be consistent' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Omnichannel official communications' },
              right: { id: '5', content: 'Legitimate - Official channels are consistent and verifiable' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'Phone + In-person follow-up' },
              right: { id: '6', content: 'Attack Vector - Multiple contact methods increase risk' }
            }
          ]
        }
      }
    },

    // Scenario 12: Insider Threat Impersonation - Sort internal security indicators
    {
      id: 'insider-threat-impersonation',
      title: 'Insider Threat Impersonation Detection',
      description: 'Sort internal security indicators by threat level',
      type: 'drag-drop',
      points: 17,
      difficulty: 'advanced',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Unauthorized system access attempts', category: 'high-threat' },
            { id: '2', content: 'Employee badge sharing', category: 'medium-threat' },
            { id: '3', content: 'Large data downloads by unusual user', category: 'high-threat' },
            { id: '4', content: 'Off-hours administrative activities', category: 'medium-threat' },
            { id: '5', content: 'Request for elevated permissions', category: 'medium-threat' },
            { id: '6', content: 'Working outside normal business hours', category: 'low-threat' },
            { id: '7', content: 'Third-party access requests', category: 'medium-threat' },
            { id: '8', content: 'Multiple failed login attempts', category: 'high-threat' },
            { id: '9', content: 'Remote access from unusual locations', category: 'medium-threat' },
            { id: '10', content: 'USB device connections', category: 'medium-threat' },
            { id: '11', content: 'Printing sensitive documents', category: 'medium-threat' },
            { id: '12', content: 'Network scanning activities', category: 'high-threat' }
          ],
          dropZones: [
            { id: 'low-threat', title: 'Low Threat - Monitor', accepts: ['low-threat'], color: 'from-green-500 to-emerald-500' },
            { id: 'medium-threat', title: 'Medium Threat - Investigate', accepts: ['medium-threat'], color: 'from-yellow-500 to-orange-500' },
            { id: 'high-threat', title: 'High Threat - Immediate Action', accepts: ['high-threat'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },

    // Scenario 13: Customer Service Scams - Drag customer verification methods
    {
      id: 'customer-service-scams',
      title: 'Customer Service Impersonation',
      description: 'Drag customer verification methods by security level',
      type: 'drag-drop',
      points: 13,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Account number and PIN', category: 'unsafe' },
            { id: '2', content: 'Security questions and answers', category: 'unsafe' },
            { id: '3', content: 'Two-factor authentication code', category: 'unsafe' },
            { id: '4', content: 'Customer service ID verification', category: 'safe' },
            { id: '5', content: 'Account balance confirmation', category: 'medium-safe' },
            { id: '6', content: 'Recent transaction verification', category: 'medium-safe' },
            { id: '7', content: 'Mailing address confirmation', category: 'medium-safe' },
            { id: '8', content: 'Email verification link', category: 'safe' },
            { id: '9', content: 'Social media verification code', category: 'unsafe' },
            { id: '10', content: 'Personal identification questions', category: 'unsafe' },
            { id: '11', content: 'Phone number verification call', category: 'safe' },
            { id: '12', content: 'Biometric authentication', category: 'safe' }
          ],
          dropZones: [
            { id: 'safe', title: 'Safe Verification Methods', accepts: ['safe'], color: 'from-green-500 to-emerald-500' },
            { id: 'medium-safe', title: 'Medium Safe - Use Caution', accepts: ['medium-safe'], color: 'from-yellow-500 to-orange-500' },
            { id: 'unsafe', title: 'Unsafe - Never Share', accepts: ['unsafe'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },

    // Scenario 14: Financial Institution Pretexting - Sort banking security protocols
    {
      id: 'financial-pretexting',
      title: 'Financial Institution Pretexting',
      description: 'Sort banking security protocols by protection level',
      type: 'drag-drop',
      points: 15,
      difficulty: 'advanced',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Bank never asks for password', category: 'protocol-1' },
            { id: '2', content: 'Bank never requests PIN', category: 'protocol-1' },
            { id: '3', content: 'Bank never asks for SSN', category: 'protocol-1' },
            { id: '4', content: 'Verify through official channels only', category: 'protocol-2' },
            { id: '5', content: 'Use established communication methods', category: 'protocol-2' },
            { id: '6', content: 'Contact bank directly, don\'t return calls', category: 'protocol-2' },
            { id: '7', content: 'Check account through secure banking app', category: 'protocol-3' },
            { id: '8', content: 'Monitor accounts for suspicious activity', category: 'protocol-3' },
            { id: '9', content: 'Report suspicious calls to bank immediately', category: 'protocol-3' },
            { id: '10', content: 'Educate family about banking scams', category: 'protocol-4' },
            { id: '11', content: 'Share security knowledge with colleagues', category: 'protocol-4' },
            { id: '12', content: 'Implement account alerts for security', category: 'protocol-4' }
          ],
          dropZones: [
            { id: 'protocol-1', title: 'Protocol 1: Never Share', accepts: ['protocol-1'], color: 'from-red-500 to-pink-500' },
            { id: 'protocol-2', title: 'Protocol 2: Verify Independently', accepts: ['protocol-2'], color: 'from-yellow-500 to-orange-500' },
            { id: 'protocol-3', title: 'Protocol 3: Monitor & Report', accepts: ['protocol-3'], color: 'from-blue-500 to-cyan-500' },
            { id: 'protocol-4', title: 'Protocol 4: Educate & Prevent', accepts: ['protocol-4'], color: 'from-green-500 to-emerald-500' }
          ]
        }
      }
    },

    // Scenario 15: Authority Escalation Tactics - Match escalation with proper responses
    {
      id: 'authority-escalation-tactics',
      title: 'Authority Escalation Response',
      description: 'Match authority escalation tactics with proper security responses',
      type: 'matching',
      points: 19,
      difficulty: 'advanced',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: 'Immediate escalation to supervisor authority' },
              right: { id: '1', content: 'Pressure Tactic - Verify through official channels' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'Threat of immediate consequences' },
              right: { id: '2', content: 'Pressure Tactic - Never respond to threats' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'Claims of emergency authorization' },
              right: { id: '3', content: 'Pressure Tactic - Emergency powers are verifiable' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'Supervisor demands immediate compliance' },
              right: { id: '4', content: 'Pressure Tactic - Verify supervisor identity' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Official escalation through proper channels' },
              right: { id: '5', content: 'Legitimate - Follow established protocols' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'Time-limited approval authority' },
              right: { id: '6', content: 'Pressure Tactic - All approvals are time-limited' }
            },
            {
              id: '7',
              left: { id: 'G', content: 'Multi-level verification process' },
              right: { id: '7', content: 'Legitimate - Proper multi-level verification' }
            },
            {
              id: '8',
              left: { id: 'H', content: 'Executive override authorization' },
              right: { id: '8', content: 'Pressure Tactic - Executive override is documented' }
            }
          ]
        }
      }
    }
  ]

  const handleSimulationComplete = (scoreData: any) => {
    console.log('Social Engineering Simulation Complete:', scoreData)
  }

  const handleScenarioComplete = (scenarioId: string, score: number) => {
    console.log(`Scenario ${scenarioId} completed with score:`, score)
  }

  return (
    <EnhancedSimulation
      title="Social Engineering & Vishing Awareness"
      description="Master social engineering detection through 15 advanced interactive scenarios"
      botName="Security Expert Sarah"
      botColor="from-red-500 to-pink-600"
      scenarios={scenarios}
      onComplete={handleSimulationComplete}
      onScenarioComplete={handleScenarioComplete}
    />
  )
}

export default SocialEngineeringSimEnhanced