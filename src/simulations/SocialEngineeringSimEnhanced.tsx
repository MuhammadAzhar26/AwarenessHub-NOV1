import React from 'react';
import { EnhancedSimulation } from './EnhancedSimulation';
import { EnhancedScenario } from './types';

export const SocialEngineeringSimEnhanced: React.FC = () => {
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
    }
  ];

  const handleSimulationComplete = (scoreData: any) => {
    console.log('Social Engineering Simulation Complete:', scoreData);
  };

  const handleScenarioComplete = (scenarioId: string, score: number) => {
    console.log(`Scenario ${scenarioId} completed with score:`, score);
  };

  return (
    <EnhancedSimulation
      title="Social Engineering & Vishing Awareness"
      description="Learn to identify and defend against social engineering attacks and voice phishing attempts"
      botName="SecurityBot"
      botColor="bg-blue-500"
      scenarios={scenarios}
      onComplete={handleSimulationComplete}
      onScenarioComplete={handleScenarioComplete}
    />
  );
};