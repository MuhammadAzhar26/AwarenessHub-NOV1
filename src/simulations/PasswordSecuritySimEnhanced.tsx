import React from 'react';
import { EnhancedSimulation } from './EnhancedSimulation';
import { EnhancedScenario } from './types';

export const PasswordSecuritySimEnhanced: React.FC = () => {
  const scenarios: EnhancedScenario[] = [
    // Scenario 1: Strong Password Builder - Drag character types to build password
    {
      id: 'strong-password-builder',
      title: 'Strong Password Builder',
      description: 'Drag character types to build the strongest possible password',
      type: 'drag-drop',
      points: 15,
      difficulty: 'beginner',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Uppercase letters (A-Z)', category: 'characters' },
            { id: '2', content: 'Lowercase letters (a-z)', category: 'characters' },
            { id: '3', content: 'Numbers (0-9)', category: 'characters' },
            { id: '4', content: 'Special characters (!@#$%)', category: 'characters' },
            { id: '5', content: '12+ characters total', category: 'length' },
            { id: '6', content: 'No personal information', category: 'security' },
            { id: '7', content: 'Random pattern', category: 'security' },
            { id: '8', content: 'Memorable phrase', category: 'memorability' },
            { id: '9', content: 'No dictionary words', category: 'security' },
            { id: '10', content: 'Different for each account', category: 'uniqueness' },
            { id: '11', content: 'Mixed character types', category: 'characters' },
            { id: '12', content: 'No keyboard patterns', category: 'security' }
          ],
          dropZones: [
            { id: 'characters', title: 'Character Requirements', accepts: ['characters'], color: 'from-blue-500 to-cyan-500' },
            { id: 'length', title: 'Length Requirements', accepts: ['length'], color: 'from-green-500 to-emerald-500' },
            { id: 'security', title: 'Security Best Practices', accepts: ['security'], color: 'from-purple-500 to-pink-500' },
            { id: 'memorability', title: 'Memorability Tips', accepts: ['memorability'], color: 'from-yellow-500 to-orange-500' },
            { id: 'uniqueness', title: 'Uniqueness Requirements', accepts: ['uniqueness'], color: 'from-indigo-500 to-purple-500' }
          ]
        }
      }
    },
    // Scenario 2: Password Strength Sorter - Drag passwords to strength categories
    {
      id: 'password-strength-sorter',
      title: 'Password Strength Sorter',
      description: 'Sort passwords by strength classification',
      type: 'drag-drop',
      points: 12,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Password123', category: 'weak' },
            { id: '2', content: 'MyDog&Cat2020', category: 'medium' },
            { id: '3', content: 'Tr0p!cal$B0at#2024$Routine', category: 'excellent' },
            { id: '4', content: 'Admin', category: 'weak' },
            { id: '5', content: 'September2024!', category: 'medium' },
            { id: '6', content: 'P@ssw0rd', category: 'weak' },
            { id: '7', content: 'S@kura#Garden\\*M0nday!2023', category: 'excellent' },
            { id: '8', content: 'qwerty', category: 'weak' },
            { id: '9', content: 'R@inb0w\\*Ch30se%Th!rd!Door', category: 'excellent' },
            { id: '10', content: '123456', category: 'weak' },
            { id: '11', content: 'Coffee&Morning#Routine\\*2024', category: 'medium' },
            { id: '12', content: 'Mountain&P@ssw0rd\\*2024!', category: 'medium' }
          ],
          dropZones: [
            { id: 'weak', title: 'Weak Passwords - High Risk', accepts: ['weak'], color: 'from-red-500 to-pink-500' },
            { id: 'medium', title: 'Medium Passwords - Moderate Risk', accepts: ['medium'], color: 'from-yellow-500 to-orange-500' },
            { id: 'excellent', title: 'Excellent Passwords - Secure', accepts: ['excellent'], color: 'from-green-500 to-emerald-500' }
          ]
        }
      }
    },
    // Scenario 3: Multi-Factor Auth Setup - Drag auth factors to setup areas
    {
      id: 'multi-factor-auth-setup',
      title: 'Multi-Factor Authentication Setup',
      description: 'Drag authentication factors to proper setup categories',
      type: 'drag-drop',
      points: 18,
      difficulty: 'advanced',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'SMS code to phone', category: 'low-security' },
            { id: '2', content: 'Authenticator app (TOTP)', category: 'high-security' },
            { id: '3', content: 'Hardware security key', category: 'high-security' },
            { id: '4', content: 'Email verification link', category: 'medium-security' },
            { id: '5', content: 'Biometric fingerprint', category: 'high-security' },
            { id: '6', content: 'Backup codes', category: 'medium-security' },
            { id: '7', content: 'Voice call verification', category: 'low-security' },
            { id: '8', content: 'Push notification', category: 'high-security' },
            { id: '9', content: 'USB security key', category: 'high-security' },
            { id: '10', content: 'Security questions', category: 'low-security' },
            { id: '11', content: 'Time-based codes', category: 'high-security' },
            { id: '12', content: 'Recovery email', category: 'medium-security' }
          ],
          dropZones: [
            { id: 'low-security', title: 'Low Security - Use with caution', accepts: ['low-security'], color: 'from-yellow-500 to-orange-500' },
            { id: 'medium-security', title: 'Medium Security - Good backup option', accepts: ['medium-security'], color: 'from-blue-500 to-cyan-500' },
            { id: 'high-security', title: 'High Security - Recommended', accepts: ['high-security'], color: 'from-green-500 to-emerald-500' }
          ]
        }
      }
    },
    // Scenario 4: Password Manager Benefits - Sort manager vs no-manager outcomes
    {
      id: 'password-manager-benefits',
      title: 'Password Manager vs No Manager',
      description: 'Sort password management approaches by outcomes',
      type: 'drag-drop',
      points: 14,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Unique passwords for every account', category: 'with-manager' },
            { id: '2', content: 'Password reuse across sites', category: 'without-manager' },
            { id: '3', content: 'Automatic password generation', category: 'with-manager' },
            { id: '4', content: 'Easy password sharing', category: 'with-manager' },
            { id: '5', content: 'Password writing on sticky notes', category: 'without-manager' },
            { id: '6', content: 'Cross-device synchronization', category: 'with-manager' },
            { id: '7', content: 'Password strength monitoring', category: 'with-manager' },
            { id: '8', content: 'Memory-only passwords', category: 'without-manager' },
            { id: '9', content: 'Breached password detection', category: 'with-manager' },
            { id: '10', content: 'Password file in computer', category: 'without-manager' },
            { id: '11', content: 'Secure encrypted storage', category: 'with-manager' },
            { id: '12', content: 'Password changes manually', category: 'without-manager' }
          ],
          dropZones: [
            { id: 'with-manager', title: 'With Password Manager', accepts: ['with-manager'], color: 'from-green-500 to-emerald-500' },
            { id: 'without-manager', title: 'Without Password Manager', accepts: ['without-manager'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },
    // Scenario 5: Breach Response Timeline - Sort password breach procedures
    {
      id: 'breach-response-timeline',
      title: 'Password Breach Response Timeline',
      description: 'Sort password breach response procedures in correct order',
      type: 'timeline',
      points: 16,
      difficulty: 'advanced',
      content: {
        timelineData: {
          events: [
            { id: '1', content: 'Change passwords immediately for affected accounts', order: 1 },
            { id: '2', content: 'Enable two-factor authentication where possible', order: 2 },
            { id: '3', content: 'Check accounts for suspicious activity', order: 3 },
            { id: '4', content: 'Monitor credit reports and financial statements', order: 4 },
            { id: '5', content: 'Update passwords on all other accounts', order: 5 },
            { id: '6', content: 'Report breach to relevant authorities', order: 6 }
          ],
          correctOrder: [1, 2, 3, 4, 5, 6]
        }
      }
    },
    // Scenario 6: Dictionary Attack Defense - Match weak passwords with vulnerabilities
    {
      id: 'dictionary-attack-defense',
      title: 'Dictionary Attack Vulnerabilities',
      description: 'Match weak passwords with their vulnerability types',
      type: 'matching',
      points: 13,
      difficulty: 'intermediate',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: '123456789' },
              right: { id: '1', content: 'Dictionary Attack - Most common password' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'password' },
              right: { id: '2', content: 'Dictionary Attack - Simple word in all dictionaries' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'qwerty' },
              right: { id: '3', content: 'Keyboard Pattern - Common sequential pattern' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'john123' },
              right: { id: '4', content: 'Personal Dictionary - Uses common name and numbers' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Tr0p!cal#2024\\*M0nday' },
              right: { id: '5', content: 'Strong Against Dictionary - Complex, non-dictionary' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'letmein' },
              right: { id: '6', content: 'Dictionary Attack - Common phrase in dictionaries' }
            }
          ]
        }
      }
    },
    // Scenario 7: Authentication Fatigue - Sort factors contributing to MFA fatigue
    {
      id: 'authentication-fatigue',
      title: 'Authentication Fatigue Prevention',
      description: 'Sort factors that contribute to multi-factor authentication fatigue',
      type: 'drag-drop',
      points: 11,
      difficulty: 'beginner',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Too many different factor types', category: 'fatigue-factor' },
            { id: '2', content: 'Too frequent re-authentication', category: 'fatigue-factor' },
            { id: '3', content: 'Inconsistent factor requirements', category: 'fatigue-factor' },
            { id: '4', content: 'Clear user education and training', category: 'prevention-factor' },
            { id: '5', content: 'Consistent security policies', category: 'prevention-factor' },
            { id: '6', content: 'Simplified MFA setup process', category: 'prevention-factor' },
            { id: '7', content: 'Unreliable factor delivery methods', category: 'fatigue-factor' },
            { id: '8', content: 'User-friendly interfaces', category: 'prevention-factor' },
            { id: '9', content: 'Backup factor options', category: 'prevention-factor' },
            { id: '10', content: 'Poor mobile factor experience', category: 'fatigue-factor' },
            { id: '11', content: 'Regular security awareness training', category: 'prevention-factor' },
            { id: '12', content: 'Delayed factor verification processes', category: 'fatigue-factor' }
          ],
          dropZones: [
            { id: 'fatigue-factor', title: 'MFA Fatigue Factors', accepts: ['fatigue-factor'], color: 'from-red-500 to-pink-500' },
            { id: 'prevention-factor', title: 'MFA Prevention Factors', accepts: ['prevention-factor'], color: 'from-green-500 to-emerald-500' }
          ]
        }
      }
    },
    // Scenario 8: Session Management - Drag session security measures
    {
      id: 'session-management',
      title: 'Session Management Security',
      description: 'Drag session security measures to appropriate categories',
      type: 'drag-drop',
      points: 15,
      difficulty: 'advanced',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Automatic session timeout', category: 'security-measure' },
            { id: '2', content: 'Session hijacking prevention', category: 'security-measure' },
            { id: '3', content: 'Concurrent session limits', category: 'security-measure' },
            { id: '4', content: 'Secure session tokens', category: 'security-measure' },
            { id: '5', content: 'Session invalidation on logout', category: 'security-measure' },
            { id: '6', content: 'IP address validation', category: 'security-measure' },
            { id: '7', content: 'Long-lived persistent sessions', category: 'security-risk' },
            { id: '8', content: 'Shared session storage', category: 'security-risk' },
            { id: '9', content: 'Session token reuse', category: 'security-risk' },
            { id: '10', content: 'Insecure session cookies', category: 'security-risk' },
            { id: '11', content: 'Biometric session validation', category: 'advanced-security' },
            { id: '12', content: 'Risk-based authentication', category: 'advanced-security' }
          ],
          dropZones: [
            { id: 'security-measure', title: 'Security Measures', accepts: ['security-measure'], color: 'from-green-500 to-emerald-500' },
            { id: 'security-risk', title: 'Security Risks', accepts: ['security-risk'], color: 'from-red-500 to-pink-500' },
            { id: 'advanced-security', title: 'Advanced Security', accepts: ['advanced-security'], color: 'from-blue-500 to-cyan-500' }
          ]
        }
      }
    },
    // Scenario 9: Password Evolution - Sort password improvement steps
    {
      id: 'password-evolution',
      title: 'Password Evolution Strategy',
      description: 'Sort password improvement steps in proper sequence',
      type: 'timeline',
      points: 17,
      difficulty: 'advanced',
      content: {
        timelineData: {
          events: [
            { id: '1', content: 'Audit current password practices', order: 1 },
            { id: '2', content: 'Enable password manager', order: 2 },
            { id: '3', content: 'Generate unique passwords for all accounts', order: 3 },
            { id: '4', content: 'Implement two-factor authentication', order: 4 },
            { id: '5', content: 'Set up breach monitoring', order: 5 },
            { id: '6', content: 'Establish regular password review cycle', order: 6 }
          ],
          correctOrder: [1, 2, 3, 4, 5, 6]
        }
      }
    },
    // Scenario 10: Recovery Security - Drag recovery methods by security level
    {
      id: 'recovery-security',
      title: 'Account Recovery Security',
      description: 'Drag recovery methods by security level',
      type: 'drag-drop',
      points: 14,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Backup email account', category: 'medium-security' },
            { id: '2', content: 'Security questions and answers', category: 'low-security' },
            { id: '3', content: 'Trusted device verification', category: 'high-security' },
            { id: '4', content: 'Phone number verification', category: 'medium-security' },
            { id: '5', content: 'Biometric verification', category: 'high-security' },
            { id: '6', content: 'Backup codes list', category: 'medium-security' },
            { id: '7', content: 'Recovery form submission', category: 'low-security' },
            { id: '8', content: 'Hardware security key', category: 'high-security' },
            { id: '9', content: 'Customer service verification', category: 'low-security' },
            { id: '10', content: 'Multi-factor recovery process', category: 'high-security' },
            { id: '11', content: 'Social media account linking', category: 'low-security' },
            { id: '12', content: 'App-based recovery verification', category: 'medium-security' }
          ],
          dropZones: [
            { id: 'low-security', title: 'Low Security - Use with caution', accepts: ['low-security'], color: 'from-red-500 to-pink-500' },
            { id: 'medium-security', title: 'Medium Security - Good option', accepts: ['medium-security'], color: 'from-yellow-500 to-orange-500' },
            { id: 'high-security', title: 'High Security - Recommended', accepts: ['high-security'], color: 'from-green-500 to-emerald-500' }
          ]
        }
      }
    },
    // Scenario 11: Credential Stuffing Defense - Match attack patterns with defenses
    {
      id: 'credential-stuffing-defense',
      title: 'Credential Stuffing Defense',
      description: 'Match credential stuffing attack patterns with defense strategies',
      type: 'matching',
      points: 16,
      difficulty: 'advanced',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: 'Automated login attempts across multiple sites' },
              right: { id: '1', content: 'Attack Pattern - Implement rate limiting' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'Using breached passwords on multiple accounts' },
              right: { id: '2', content: 'Attack Pattern - Unique passwords prevent damage' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'Bot-driven credential testing' },
              right: { id: '3', content: 'Attack Pattern - CAPTCHA and behavioral analysis' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'Password reuse across different services' },
              right: { id: '4', content: 'Attack Pattern - Password manager eliminates reuse' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Slow brute force over time' },
              right: { id: '5', content: 'Attack Pattern - Regular security monitoring' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'Adaptive behavioral authentication' },
              right: { id: '6', content: 'Defense Strategy - Advanced security layer' }
            }
          ]
        }
      }
    },
    // Scenario 12: Password Reuse Dangers - Sort reuse scenarios by breach impact risk
    {
      id: 'password-reuse-dangers',
      title: 'Password Reuse Risk Assessment',
      description: 'Sort password reuse scenarios by breach impact risk',
      type: 'drag-drop',
      points: 12,
      difficulty: 'intermediate',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Same password for email and banking', category: 'extreme-risk' },
            { id: '2', content: 'Same password for work and personal accounts', category: 'high-risk' },
            { id: '3', content: 'Similar passwords with minor variations', category: 'medium-risk' },
            { id: '4', content: 'Same password for all social media', category: 'medium-risk' },
            { id: '5', content: 'Same password for shopping and banking', category: 'high-risk' },
            { id: '6', content: 'Password plus number variations', category: 'medium-risk' },
            { id: '7', content: 'Same password for all work accounts', category: 'high-risk' },
            { id: '8', content: 'Password with different case variations', category: 'medium-risk' },
            { id: '9', content: 'Same password for email and cloud storage', category: 'high-risk' },
            { id: '10', content: 'Minor punctuation changes between accounts', category: 'medium-risk' },
            { id: '11', content: 'Same password for financial apps', category: 'extreme-risk' },
            { id: '12', content: 'Password reuse with close friends', category: 'high-risk' }
          ],
          dropZones: [
            { id: 'medium-risk', title: 'Medium Risk', accepts: ['medium-risk'], color: 'from-yellow-500 to-orange-500' },
            { id: 'high-risk', title: 'High Risk', accepts: ['high-risk'], color: 'from-orange-500 to-red-500' },
            { id: 'extreme-risk', title: 'Extreme Risk', accepts: ['extreme-risk'], color: 'from-red-500 to-pink-500' }
          ]
        }
      }
    },
    // Scenario 13: Security Question Vulnerability - Match questions with vulnerability levels
    {
      id: 'security-question-vulnerability',
      title: 'Security Question Risk Assessment',
      description: 'Match security questions with their vulnerability levels',
      type: 'matching',
      points: 13,
      difficulty: 'intermediate',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: 'Mother\'s maiden name' },
              right: { id: '1', content: 'High Vulnerability - Public record information' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'First pet name' },
              right: { id: '2', content: 'Medium Vulnerability - Often on social media' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'Favorite color' },
              right: { id: '3', content: 'Low Vulnerability - Harder to research' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'Birthplace' },
              right: { id: '4', content: 'Medium Vulnerability - Often publicly known' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Random generated answer' },
              right: { id: '5', content: 'High Security - Impossible to research' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'High school name' },
              right: { id: '6', content: 'Medium Vulnerability - Can be found online' }
            }
          ]
        }
      }
    },
    // Scenario 14: Biometric Integration - Sort biometric factors by security level
    {
      id: 'biometric-integration',
      title: 'Biometric Authentication Factors',
      description: 'Sort biometric authentication factors by security level',
      type: 'drag-drop',
      points: 15,
      difficulty: 'advanced',
      content: {
        dragDropData: {
          items: [
            { id: '1', content: 'Fingerprint scanning', category: 'standard-biometric' },
            { id: '2', content: 'Facial recognition', category: 'standard-biometric' },
            { id: '3', content: 'Iris scanning', category: 'advanced-biometric' },
            { id: '4', content: 'Voice pattern recognition', category: 'standard-biometric' },
            { id: '5', content: 'Retina scanning', category: 'advanced-biometric' },
            { id: '6', content: 'Hand geometry scanning', category: 'advanced-biometric' },
            { id: '7', content: 'Keystroke dynamics', category: 'behavioral-biometric' },
            { id: '8', content: 'Gait analysis', category: 'behavioral-biometric' },
            { id: '9', content: 'Ear shape recognition', category: 'emerging-biometric' },
            { id: '10', content: 'Vein pattern recognition', category: 'advanced-biometric' },
            { id: '11', content: 'Signature dynamics', category: 'behavioral-biometric' },
            { id: '12', content: 'DNA authentication', category: 'future-biometric' }
          ],
          dropZones: [
            { id: 'standard-biometric', title: 'Standard Biometrics', accepts: ['standard-biometric'], color: 'from-blue-500 to-cyan-500' },
            { id: 'advanced-biometric', title: 'Advanced Biometrics', accepts: ['advanced-biometric'], color: 'from-green-500 to-emerald-500' },
            { id: 'behavioral-biometric', title: 'Behavioral Biometrics', accepts: ['behavioral-biometric'], color: 'from-purple-500 to-pink-500' },
            { id: 'emerging-biometric', title: 'Emerging Biometrics', accepts: ['emerging-biometric'], color: 'from-yellow-500 to-orange-500' },
            { id: 'future-biometric', title: 'Future Technologies', accepts: ['future-biometric'], color: 'from-indigo-500 to-purple-500' }
          ]
        }
      }
    },
    // Scenario 15: Zero Trust Authentication - Match verification methods with implementation levels
    {
      id: 'zero-trust-authentication',
      title: 'Zero Trust Authentication Model',
      description: 'Match zero trust verification methods with their implementation levels',
      type: 'matching',
      points: 19,
      difficulty: 'advanced',
      content: {
        matchingData: {
          pairs: [
            {
              id: '1',
              left: { id: 'A', content: 'Continuous authentication monitoring' },
              right: { id: '1', content: 'Zero Trust - Never trust, always verify' }
            },
            {
              id: '2',
              left: { id: 'B', content: 'Role-based access control' },
              right: { id: '2', content: 'Zero Trust - Minimum necessary access' }
            },
            {
              id: '3',
              left: { id: 'C', content: 'Dynamic risk assessment' },
              right: { id: '3', content: 'Zero Trust - Context-aware authentication' }
            },
            {
              id: '4',
              left: { id: 'D', content: 'Network segmentation' },
              right: { id: '4', content: 'Zero Trust - Assume breach principle' }
            },
            {
              id: '5',
              left: { id: 'E', content: 'Traditional perimeter security' },
              right: { id: '5', content: 'Legacy Model - Insufficient for modern threats' }
            },
            {
              id: '6',
              left: { id: 'F', content: 'Behavioral anomaly detection' },
              right: { id: '6', content: 'Zero Trust - Advanced threat detection' }
            },
            {
              id: '7',
              left: { id: 'G', content: 'Micro-segmentation strategy' },
              right: { id: '7', content: 'Zero Trust - Limit blast radius' }
            },
            {
              id: '8',
              left: { id: 'H', content: 'Trust-once-and-use-forever' },
              right: { id: '8', content: 'Legacy Model - Static trust is dangerous' }
            }
          ]
        }
      }
    }
  ];

  const handleSimulationComplete = (scoreData: any) => {
    console.log('Password Security Simulation Complete:', scoreData);
  };

  const handleScenarioComplete = (scenarioId: string, score: number) => {
    console.log(`Scenario ${scenarioId} completed with score:`, score);
  };

  return (
    <EnhancedSimulation
      title="Password Security & Authentication"
      description="Master password creation, management, and multi-factor authentication security"
      botName="SecurityBot"
      botColor="bg-green-500"
      scenarios={scenarios}
      onComplete={handleSimulationComplete}
      onScenarioComplete={handleScenarioComplete}
    />
  );
};