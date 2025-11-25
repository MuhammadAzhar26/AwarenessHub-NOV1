// Module Testing Script
// This file contains test cases with correct answers for each challenge type

export const moduleTestCases = {
  // 1. Caesar Cipher
  'caesar-cipher': {
    testData: {
      plaintext: 'KHOOR ZRUOG',
      correctShift: 3
    },
    correctAnswer: '3',
    description: 'Caesar Cipher decryption - shift by 3 to get HELLO WORLD',
    expectedResult: true
  },

  // 2. Password Builder
  'password-builder': {
    testData: {
      minStrength: 70,
      requiresLength: 12
    },
    correctAnswer: 'MyP@ssw0rd123:85', // password:strength format
    description: 'Password builder - create strong password',
    expectedResult: true
  },

  // 3. Email Detective
  'email-detective': {
    testData: {
      correctClueIds: [1, 3, 5],
      requiredClues: 3
    },
    correctAnswer: '1,3,5',
    description: 'Email Detective - identify 3 phishing clues',
    expectedResult: true
  },

  // 4. Matching Challenge
  'matching': {
    testData: {
      pairs: [
        { id: '1', left: 'Phishing', right: 'Fake emails' },
        { id: '2', left: 'Malware', right: 'Malicious software' },
        { id: '3', left: 'Ransomware', right: 'Encrypts files' }
      ]
    },
    correctAnswer: '1:1,2:2,3:3',
    description: 'Matching - match security terms to definitions',
    expectedResult: true
  },

  // 5. Drag & Drop
  'drag-drop': {
    testData: {
      zones: [
        { id: 'secure', label: 'Secure', correctItems: ['https', 'vpn', 'wpa3'] },
        { id: 'insecure', label: 'Insecure', correctItems: ['http', 'public-wifi', 'wep'] }
      ]
    },
    correctAnswer: 'secure:https,vpn,wpa3;insecure:http,public-wifi,wep',
    description: 'Drag & Drop - categorize security features',
    expectedResult: true
  },

  // 6. Code Analysis
  'code-analysis': {
    testData: {
      correctIssues: ['sql-injection', 'xss', 'hardcoded-password']
    },
    correctAnswer: 'hardcoded-password,sql-injection,xss',
    description: 'Code Analysis - identify security vulnerabilities',
    expectedResult: true
  },

  // 7. Website Comparison
  'website-comparison': {
    testData: {
      correctAnswer: 'secure'
    },
    correctAnswer: 'secure',
    description: 'Website Comparison - identify secure website',
    expectedResult: true
  },

  // 8. HTTPS Demo
  'https-demo': {
    testData: {
      correctAnswer: 'https'
    },
    correctAnswer: 'https',
    description: 'HTTPS Demo - understand secure connections',
    expectedResult: true
  },

  // 9. WiFi Safety
  'wifi-safety': {
    testData: {
      correctNetworks: ['HomeSecure-WPA3', 'Office-Enterprise']
    },
    correctAnswer: 'HomeSecure-WPA3,Office-Enterprise',
    description: 'WiFi Safety - identify safe networks',
    expectedResult: true
  },

  // 10. Link Safety
  'link-safety': {
    testData: {
      correctClassifications: {
        'link1': 'safe',
        'link2': 'suspicious',
        'link3': 'malicious'
      }
    },
    correctAnswer: 'link1:safe,link2:suspicious,link3:malicious',
    description: 'Link Safety - classify URLs',
    expectedResult: true
  },

  // 11. Browser Security
  'browser-security': {
    testData: {
      correctSettings: ['https-only', 'block-trackers', 'disable-third-party-cookies']
    },
    correctAnswer: 'block-trackers,disable-third-party-cookies,https-only',
    description: 'Browser Security - enable security settings',
    expectedResult: true
  },

  // 12. Privacy Settings
  'privacy-settings': {
    testData: {
      correctSettings: ['2fa', 'private-profile', 'location-off', 'review-permissions']
    },
    correctAnswer: '2fa,location-off,private-profile,review-permissions',
    description: 'Privacy Settings - configure privacy options',
    expectedResult: true
  },

  // 13. Social Sharing Quiz
  'social-sharing-quiz': {
    testData: {
      correctAnswers: {
        'scenario1': 'do-not-share',
        'scenario2': 'share-with-friends',
        'scenario3': 'do-not-share'
      }
    },
    correctAnswer: 'scenario1:do-not-share,scenario2:share-with-friends,scenario3:do-not-share',
    description: 'Social Sharing - make safe sharing decisions',
    expectedResult: true
  },

  // 14. Fake Profile Analysis
  'fake-profile-analysis': {
    testData: {
      correctFlags: ['no-mutual-friends', 'stock-photo', 'spam-posts', 'new-account'],
      minRequiredFlags: 3
    },
    correctAnswer: 'new-account,no-mutual-friends,spam-posts,stock-photo',
    description: 'Fake Profile - identify warning signs',
    expectedResult: true
  },

  // 15. Digital Footprint Cleanup
  'digital-footprint-cleanup': {
    testData: {
      correctRemovals: ['old-embarrassing-post', 'tagged-party-photo', 'public-address', 'phone-number']
    },
    correctAnswer: 'old-embarrassing-post,phone-number,public-address,tagged-party-photo',
    description: 'Digital Footprint - remove sensitive information',
    expectedResult: true
  },

  // 16. Malware Education
  'malware-education': {
    testData: {
      correctTypes: {
        'file1': 'trojan',
        'file2': 'ransomware',
        'file3': 'spyware',
        'file4': 'safe'
      }
    },
    correctAnswer: 'file1:trojan,file2:ransomware,file3:spyware,file4:safe',
    description: 'Malware Education - classify malware types',
    expectedResult: true
  },

  // 17. Infection Signs
  'infection-signs': {
    testData: {
      correctSigns: ['slow-performance', 'popup-ads', 'unauthorized-access', 'high-cpu']
    },
    correctAnswer: 'high-cpu,popup-ads,slow-performance,unauthorized-access',
    description: 'Infection Signs - identify malware symptoms',
    expectedResult: true
  },

  // 18. Antivirus Demo
  'antivirus-demo': {
    testData: {
      correctActions: ['full-scan', 'quarantine-threats', 'update-definitions', 'enable-realtime']
    },
    correctAnswer: 'enable-realtime,full-scan,quarantine-threats,update-definitions',
    description: 'Antivirus - perform security actions',
    expectedResult: true
  },

  // 19. Scenario Challenge
  'scenario': {
    testData: {
      correctChoice: 'report-and-delete'
    },
    correctAnswer: 'report-and-delete',
    description: 'Scenario - make correct security decision',
    expectedResult: true
  }
}

// Badge test scenarios
export const badgeTestScenarios = [
  {
    name: 'First Steps Badge',
    requirement: 'Complete 1 challenge',
    test: 'Complete any challenge',
    expectedBadge: 'first_step'
  },
  {
    name: 'Rookie Learner Badge',
    requirement: 'Complete 5 challenges',
    test: 'Complete 5 different challenges',
    expectedBadge: 'rookie'
  },
  {
    name: '100 Points Club',
    requirement: 'Earn 100 points',
    test: 'Complete challenges totaling 100+ points',
    expectedBadge: 'hundred_club'
  },
  {
    name: 'Perfect Performance',
    requirement: 'Complete challenge without hints',
    test: 'Complete any challenge with 0 hints used',
    expectedBadge: 'perfect_score'
  },
  {
    name: 'Level 5 Badge',
    requirement: 'Reach Level 5',
    test: 'Earn 400+ points (Level 5)',
    expectedBadge: 'level_5'
  }
]

// Points calculation tests
export const pointsTestCases = [
  {
    scenario: 'No hints used',
    basePoints: 100,
    hintsUsed: [],
    expectedPoints: 100,
    description: 'Full points when no hints used'
  },
  {
    scenario: 'One hint used',
    basePoints: 100,
    hintsUsed: [1],
    expectedPoints: 95,
    description: '5 points deducted for hint 1'
  },
  {
    scenario: 'Two hints used',
    basePoints: 100,
    hintsUsed: [1, 2],
    expectedPoints: 85,
    description: '15 points total deducted (5+10)'
  },
  {
    scenario: 'Three hints used',
    basePoints: 100,
    hintsUsed: [1, 2, 3],
    expectedPoints: 70,
    description: '30 points total deducted (5+10+15)'
  },
  {
    scenario: 'Maximum hints (5)',
    basePoints: 100,
    hintsUsed: [1, 2, 3, 4, 5],
    expectedPoints: 30,
    description: 'Minimum 30% retained (75 penalty capped)'
  }
]

// Level progression tests
export const levelTestCases = [
  { totalPoints: 0, expectedLevel: 1, description: 'New user starts at level 1' },
  { totalPoints: 50, expectedLevel: 1, description: 'Still level 1 with 50 points' },
  { totalPoints: 100, expectedLevel: 2, description: 'Level 2 at 100 points' },
  { totalPoints: 250, expectedLevel: 3, description: 'Level 3 at 250 points' },
  { totalPoints: 500, expectedLevel: 6, description: 'Level 6 at 500 points' },
  { totalPoints: 1000, expectedLevel: 11, description: 'Level 11 at 1000 points' },
  { totalPoints: 3000, expectedLevel: 31, description: 'Level 31 at 3000 points' }
]

// Manual testing guide
export const manualTestingSteps = `
MANUAL TESTING PROCEDURE
========================

1. CREATE TEST USER
   - Sign up with test email
   - Note user ID for verification

2. TEST CAESAR CIPHER
   - Navigate to Caesar Cipher challenge
   - Encrypted text should show: "KHOOR ZRUOG"
   - Try shift value: 3
   - Should decrypt to: "HELLO WORLD"
   - Submit answer: "3"
   - ✓ Should accept and award points

3. TEST EMAIL DETECTIVE
   - Navigate to Email Detective challenge
   - Select clues with IDs: 1, 3, 5
   - Submit
   - ✓ Should validate correctly

4. TEST BADGE AWARDING
   - After first challenge completion
   - Check for "First Steps" badge notification
   - Verify badge appears in profile
   - ✓ Badge count should increment

5. TEST POINTS CALCULATION
   - Complete challenge worth 100 points
   - Use 2 hints
   - Expected points: 85 (100 - 5 - 10)
   - Check profile total points
   - ✓ Points should match calculation

6. TEST LEVEL PROGRESSION
   - Complete challenges until 100 points
   - Check user level
   - ✓ Should be Level 2

7. VERIFY DASHBOARD
   - Check total points display
   - Check badge count
   - Check completed modules
   - Check current level
   - ✓ All stats should be accurate

8. TEST ALL CHALLENGE TYPES
   - Use correct answers from moduleTestCases
   - Verify each validates correctly
   - Check points awarded
   - ✓ All should pass validation

9. TEST HINT PENALTY
   - Complete challenge
   - Use different numbers of hints (0, 1, 2, 3+)
   - Verify points decrease correctly
   - ✓ Should match pointsTestCases

10. TEST MULTIPLE BADGES
    - Complete 5 challenges
    - Should earn: First Steps, Rookie Learner
    - Reach 100 points
    - Should earn: 100 Points Club
    - ✓ Multiple badges can be earned

EXPECTED RESULTS
================
✓ All challenge types validate correctly
✓ Points calculated accurately with hint penalties
✓ Badges awarded automatically
✓ Level progression works
✓ Dashboard shows correct stats
✓ Profile displays earned badges
✓ Leaderboard updates with new scores
`

export default {
  moduleTestCases,
  badgeTestScenarios,
  pointsTestCases,
  levelTestCases,
  manualTestingSteps
}
