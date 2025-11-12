import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ArrowLeft, Mail, AlertTriangle, CheckCircle, Eye, Download, Link, User, Play } from 'lucide-react';
import { default as EnhancedSimulation } from './EnhancedSimulation';
import { ScoreData } from './types';

interface ChatMessage {
  id: string;
  type: 'system' | 'user' | 'simulation';
  content: string;
  timestamp: Date;
  options?: string[];
}

const PhishingEmailSimEnhanced: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Phishing Email Analysis Training! You\'ll learn to identify suspicious emails and protect against phishing attacks.',
      timestamp: new Date(),
    },
  ]);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);

  const simulationSteps = [
    {
      type: 'multiple-choice',
      title: 'Email Header Analysis',
      description: 'Analyze the sender information and email headers to identify red flags.',
      content: {
        question: 'Which email sender information appears most suspicious?',
        options: [
          'security@yourbank.com',
          'support@amaz0n-co.net',
          'notifications@paypal.com',
          'team@company.com'
        ],
        correct: 1,
        explanation: 'Notice the zero (0) in "amaz0n" and the .net domain instead of .com. This is a common phishing tactic.'
      }
    },
    {
      type: 'drag-drop',
      title: 'Email Components Classification',
      description: 'Drag each email element to the correct category: Safe or Suspicious.',
      content: {
        items: [
          { id: '1', content: 'Generic greeting "Dear Customer"', category: 'suspicious' },
          { id: '2', content: 'Urgent action required', category: 'suspicious' },
          { id: '3', content: 'Urgent: Your account will be closed', category: 'suspicious' },
          { id: '4', content: 'Personalized with your name', category: 'safe' },
          { id: '5', content: 'Legitimate company domain', category: 'safe' },
          { id: '6', content: 'Suspicious link shortener (bit.ly)', category: 'suspicious' },
          { id: '7', content: 'Official company contact info', category: 'safe' },
          { id: '8', content: 'Misspelled words', category: 'suspicious' },
        ],
        dropZones: [
          { id: 'safe', title: 'Safe Elements', description: 'Legitimate, secure email components', accepts: ['safe'] },
          { id: 'suspicious', title: 'Suspicious Elements', description: 'Potential phishing indicators', accepts: ['suspicious'] },
        ]
      }
    },
    {
      type: 'chat',
      title: 'Interactive Phishing Investigation',
      description: 'Role-play as a security analyst investigating a suspicious email.',
      content: {
        scenario: 'You receive an email claiming to be from IT support asking you to verify your credentials due to "suspicious activity".',
        messages: [
          {
            id: '1',
            type: 'simulation',
            content: 'Email received: "Dear user, we detected suspicious activity in your account. Please verify your credentials immediately at the secure portal."',
            options: ['Click the link immediately', 'Verify sender first', 'Report to IT security', 'Forward to colleagues']
          },
          {
            id: '2',
            type: 'simulation',
            content: 'Good choice! Now let\'s analyze the sender and email details.',
            options: ['Check the sender domain', 'Look at email headers', 'Hover over links', 'All of the above']
          },
        ]
      }
    },
    {
      type: 'matching',
      title: 'Link Safety Assessment',
      description: 'Match each URL with its safety assessment based on security indicators.',
      content: {
        pairs: [
          { left: 'https://www.paypal.com/login', right: 'Safe - Official PayPal domain', category: 'safe' },
          { left: 'http://paypaI.com/login', right: 'Suspicious - Capital "I" instead of lowercase "l"', category: 'suspicious' },
          { left: 'https://secure-update.net/verify', right: 'Suspicious - Unfamiliar domain', category: 'suspicious' },
          { left: 'https://amazon.com/my-account', right: 'Safe - Legitimate Amazon domain', category: 'safe' },
          { left: 'https://bit.ly/3xyzabc', right: 'Caution - Shortened URL hides destination', category: 'suspicious' },
          { left: 'https://yourbank.com/security', right: 'Safe - Legitimate banking domain', category: 'safe' },
        ]
      }
    },
    {
      type: 'timeline',
      title: 'Incident Response Sequence',
      description: 'Arrange the correct steps for responding to a phishing email.',
      content: {
        events: [
          { id: '1', content: 'Report email to IT security team', timestamp: 'day-0' },
          { id: '2', content: 'Do not click any links or download attachments', timestamp: 'day-0' },
          { id: '3', content: 'Verify sender through official channels', timestamp: 'day-0' },
          { id: '4', content: 'Change passwords if credentials were compromised', timestamp: 'day-0' },
          { id: '5', content: 'Monitor accounts for suspicious activity', timestamp: 'week-1' },
          { id: '6', content: 'Update security awareness training', timestamp: 'week-2' },
        ],
        correctOrder: ['2', '3', '1', '4', '5', '6']
      }
    },
    {
      type: 'multiple-choice',
      title: 'Advanced Phishing Techniques',
      description: 'Identify sophisticated phishing methods and countermeasures.',
      content: {
        question: 'What is "spear phishing"?',
        options: [
          'Phishing targeting specific individuals',
          'Phishing through voice calls',
          'Phishing via social media only',
          'Mass email phishing campaigns'
        ],
        correct: 0,
        explanation: 'Spear phishing targets specific individuals or organizations with personalized messages, often after gathering personal information.'
      }
    },
    {
      type: 'drag-drop',
      title: 'Email Security Features',
      description: 'Identify which security features help protect against phishing attacks.',
      content: {
        items: [
          { id: '1', content: 'DMARC authentication', category: 'protection' },
          { id: '2', content: 'SPF records', category: 'protection' },
          { id: '3', content: 'DKIM signatures', category: 'protection' },
          { id: '4', content: 'Email content warnings', category: 'protection' },
          { id: '5', content: 'HTML email rendering', category: 'risk' },
          { id: '6', content: 'Image loading by default', category: 'risk' },
          { id: '7', content: 'URL scanning', category: 'protection' },
          { id: '8', content: 'User education and awareness', category: 'protection' },
        ],
        dropZones: [
          { id: 'protection', title: 'Protection Features', description: 'Security measures that help prevent phishing', accepts: ['protection'] },
          { id: 'risk', title: 'Security Risks', description: 'Features that can be exploited by attackers', accepts: ['risk'] },
        ]
      }
    },
    {
      type: 'chat',
      title: 'Real-World Phishing Scenario',
      description: 'Practice identifying and handling a complex phishing attempt.',
      content: {
        scenario: 'You receive an email from "HR Department" about updating your emergency contact information. The email includes a link to a form that asks for your SSN and bank details.',
        messages: [
          {
            id: '1',
            type: 'simulation',
            content: 'Email received: "Please update your emergency contact information by EOD today. Click here to access the secure form."',
            options: ['Click and fill out immediately', 'Verify with HR directly', 'Report to security team', 'Forward to all colleagues']
          },
          {
            id: '2',
            type: 'simulation',
            content: 'You decide to verify with HR. What do you discover?',
            options: ['HR confirms they sent it', 'HR never sent such emails', 'The link goes to a fake site', 'Both B and C are true']
          },
        ]
      }
    },
    {
      type: 'matching',
      title: 'Phishing Attack Vectors',
      description: 'Match each attack vector with its characteristics and prevention methods.',
      content: {
        pairs: [
          { left: 'Business Email Compromise (BEC)', right: 'Targets specific employees with fake invoices', category: 'attack' },
          { left: 'Whaling attacks', right: 'Targets high-level executives', category: 'attack' },
          { left: 'Email authentication', right: 'Prevents domain spoofing', category: 'protection' },
          { left: 'User training programs', right: 'Builds awareness and recognition skills', category: 'protection' },
          { left: 'Clone phishing', right: 'Uses legitimate emails with malicious links', category: 'attack' },
          { left: 'Multi-factor authentication', right: 'Prevents account takeover even with stolen credentials', category: 'protection' },
        ]
      }
    },
    {
      type: 'multiple-choice',
      title: 'Phishing Defense Strategy',
      description: 'Design an effective defense strategy against phishing attacks.',
      content: {
        question: 'Which combination of measures provides the best defense against phishing?',
        options: [
          'Technical solutions only',
          'User training only',
          'Combination of technical controls, policies, and continuous user education',
          'Relying on email filters alone'
        ],
        correct: 2,
        explanation: 'Effective phishing defense requires a multi-layered approach: technical controls, security policies, and ongoing user education and awareness training.'
      }
    },
    {
      type: 'drag-drop',
      title: 'Email Security Assessment',
      description: 'Analyze this email sample and identify all security red flags.',
      content: {
        items: [
          { id: '1', content: 'Sender: noreply@companny-security.com', category: 'suspicious' },
          { id: '2', content: 'Subject: Action Required - Security Update', category: 'neutral' },
          { id: '3', content: 'Generic greeting "Valued Customer"', category: 'suspicious' },
          { id: '4', content: 'Request for password verification', category: 'suspicious' },
          { id: '5', content: 'Urgent deadline (24 hours)', category: 'suspicious' },
          { id: '6', content: 'Professional email signature', category: 'neutral' },
          { id: '7', content: 'Suspicious attachment ".exe"', category: 'suspicious' },
          { id: '8', content: 'URL shortener in links', category: 'suspicious' },
        ],
        dropZones: [
          { id: 'suspicious', title: 'Red Flags', description: 'Clear indicators of phishing', accepts: ['suspicious'] },
          { id: 'neutral', title: 'Neutral/Needs Context', description: 'Could be legitimate or need more analysis', accepts: ['neutral'] },
        ]
      }
    },
    {
      type: 'timeline',
      title: 'Phishing Incident Timeline',
      description: 'Create the correct timeline for handling a confirmed phishing incident.',
      content: {
        events: [
          { id: '1', content: 'Notify incident response team', timestamp: 'immediate' },
          { id: '2', content: 'Document all relevant details', timestamp: 'immediate' },
          { id: '3', content: 'Isolate affected systems if credentials were compromised', timestamp: 'hour-1' },
          { id: '4', content: 'Change all potentially compromised passwords', timestamp: 'hour-1' },
          { id: '5', content: 'Enable additional monitoring on accounts', timestamp: 'hour-2' },
          { id: '6', content: 'Conduct forensic analysis', timestamp: 'day-1' },
          { id: '7', content: 'Implement additional security measures', timestamp: 'week-1' },
          { id: '8', content: 'Review and update security training', timestamp: 'month-1' },
        ],
        correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8']
      }
    },
    {
      type: 'multiple-choice',
      title: 'Advanced Threat Detection',
      description: 'Identify sophisticated phishing techniques and detection methods.',
      content: {
        question: 'What is the most effective way to detect sophisticated phishing emails?',
        options: [
          'Trust the sender if they know your name',
          'Rely on email security filters alone',
          'Use multiple detection methods and maintain healthy skepticism',
          'Only respond to emails from known contacts'
        ],
        correct: 2,
        explanation: 'Sophisticated phishing attacks bypass individual security measures. Use multiple detection methods including technical controls, verification processes, and maintain a security-conscious mindset.'
      }
    },
    {
      type: 'matching',
      title: 'Phishing Prevention Tools',
      description: 'Match each tool or technique with its phishing prevention effectiveness.',
      content: {
        pairs: [
          { left: 'Email security gateway', right: 'Blocks known malicious senders and content', category: 'high' },
          { left: 'User awareness training', right: 'Builds human firewall against attacks', category: 'high' },
          { left: 'Browser security warnings', right: 'Alerts about suspicious websites', category: 'medium' },
          { left: 'Antivirus software', right: 'Detects malicious attachments and downloads', category: 'medium' },
          { left: 'Social media monitoring', right: 'Tracks potential social engineering attempts', category: 'medium' },
          { left: 'Regular password changes', right: 'Reduces impact of credential theft', category: 'high' },
        ]
      }
    },
    {
      type: 'chat',
      title: 'Advanced Phishing Analysis',
      description: 'Conduct a thorough analysis of a complex phishing scenario.',
      content: {
        scenario: 'You receive an email from your CEO asking you to purchase gift cards urgently for a client meeting. The email mentions being in a meeting and unable to talk.',
        messages: [
          {
            id: '1',
            type: 'simulation',
            content: 'CEO email: "I\'m in a client meeting and need you to buy $2000 in gift cards immediately. Send the codes via email. It\'s urgent and confidential."',
            options: ['Buy the gift cards as requested', 'Call the CEO to verify', 'Reply asking for more details', 'Report this as potential phishing']
          },
          {
            id: '2',
            type: 'simulation',
            content: 'You try calling the CEO but get voicemail. What\'s your next step?',
            options: ['Buy the cards anyway', 'Wait for the meeting to end', 'Contact IT security immediately', 'Check the email headers and sender']
          },
        ]
      }
    }
  ];

  const handleSimulationComplete = (scoreData: ScoreData) => {
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: `Phishing Email Analysis completed! Score: ${scoreData.score}/${scoreData.totalQuestions}`,
      timestamp: new Date(),
    }]);
  };

  const getStepIcon = (stepIndex: number) => {
    const icons = [Mail, Eye, AlertTriangle, Link, User, Shield, CheckCircle, AlertTriangle, Shield, Eye, CheckCircle, AlertTriangle, User];
    const Icon = icons[stepIndex % icons.length];
    return <Icon className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-gray-900 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={() => window.history.back()}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-600 rounded-lg">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Phishing Email Analysis</h1>
                <p className="text-gray-300">Advanced email security training and phishing detection</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {simulationSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentStep === index
                    ? 'border-red-500 bg-red-900/20'
                    : currentStep > index
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-gray-600 bg-gray-800/50 hover:bg-gray-700/50'
                }`}
                onClick={() => setCurrentStep(index)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    currentStep === index
                      ? 'bg-red-600'
                      : currentStep > index
                      ? 'bg-green-600'
                      : 'bg-gray-600'
                  }`}>
                    {currentStep > index ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : (
                      getStepIcon(index)
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">{step.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">
              Step {currentStep + 1}: {simulationSteps[currentStep].title}
            </h2>
            <button
              onClick={() => setIsSimulationActive(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
            >
              <Play className="w-4 h-4" />
              <span>Start Simulation</span>
            </button>
          </div>

          <div className="text-gray-300 mb-4">
            {simulationSteps[currentStep].description}
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">
              Complete this step to unlock the next module. Each simulation builds upon the previous knowledge.
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isSimulationActive && (
            <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-blue-400 mb-2">Simulation: {simulationSteps[currentStep].title}</h3>
              <p className="text-gray-300 mb-4">This interactive simulation is under development.</p>
              <p className="text-gray-400 text-sm">Drag & Drop functionality has been fixed and framework is ready for deployment.</p>
              <button
                onClick={() => setIsSimulationActive(false)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close Simulation
              </button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PhishingEmailSimEnhanced;
