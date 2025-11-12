import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, ArrowLeft, Shield, AlertTriangle, CheckCircle, Clock, Users, FileText, Phone } from 'lucide-react';
import { default as EnhancedSimulation } from './EnhancedSimulation';
import { ScoreData } from './types';

interface ChatMessage {
  id: string;
  type: 'system' | 'user' | 'simulation';
  content: string;
  timestamp: Date;
  options?: string[];
}

const DataBreachResponseSimEnhanced: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulationActive, setIsSimulationActive] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'system',
      content: 'Welcome to Data Breach Response Training! Learn to handle data breach incidents effectively and minimize damage.',
      timestamp: new Date(),
    },
  ]);
  const [selectedIncident, setSelectedIncident] = useState<string | null>(null);

  const simulationSteps = [
    {
      type: 'multiple-choice',
      title: 'Data Breach Fundamentals',
      description: 'Understand what constitutes a data breach and regulatory requirements.',
      content: {
        question: 'According to most privacy regulations, what timeframe must organizations report a data breach?',
        options: [
          'Within 72 hours of discovery',
          'Within 30 days of discovery',
          'Within 1 year of discovery',
          'No specific timeframe required'
        ],
        correct: 0,
        explanation: 'GDPR and most modern privacy laws require breach notification within 72 hours of discovery to regulatory authorities, with affected individuals notified without undue delay.'
      }
    },
    {
      type: 'drag-drop',
      title: 'Incident Classification',
      description: 'Classify different types of security incidents by severity and response requirements.',
      content: {
        items: [
          { id: '1', content: 'Unauthorized access to customer database', category: 'high-severity' },
          { id: '2', content: 'Lost encrypted laptop', category: 'low-severity' },
          { id: '3', content: 'Ransomware attack on payment system', category: 'high-severity' },
          { id: '4', content: 'Misconfigured cloud storage bucket', category: 'medium-severity' },
          { id: '5', content: 'Phishing email clicked by employee', category: 'medium-severity' },
          { id: '6', content: 'Insider theft of customer data', category: 'high-severity' },
          { id: '7', content: 'Vendor data breach affecting customers', category: 'medium-severity' },
          { id: '8', content: 'Software vulnerability exploited', category: 'high-severity' },
        ],
        dropZones: [
          { id: 'high-severity', title: 'High Severity', description: 'Immediate response required, regulatory notification needed', accepts: ['high-severity'] },
          { id: 'medium-severity', title: 'Medium Severity', description: 'Enhanced monitoring, potential notification required', accepts: ['medium-severity'] },
          { id: 'low-severity', title: 'Low Severity', description: 'Standard security procedures, limited notification', accepts: ['low-severity'] },
        ]
      }
    },
    {
      type: 'chat',
      title: 'Initial Breach Response',
      description: 'Experience the critical first hour of a data breach incident.',
      content: {
        scenario: 'Your security monitoring system alerts you to suspicious database queries at 2 AM. Initial investigation suggests unauthorized access to customer data.',
        messages: [
          {
            id: '1',
            type: 'simulation',
            content: 'Security Alert: Unusual database activity detected. Customer_info table accessed from unknown IP at 02:15 AM. 1,247 customer records accessed.',
            options: ['Wait for more information', 'Immediately activate incident response team', 'Check if it\'s a false alarm first', 'Call the security vendor']
          },
          {
            id: '2',
            type: 'simulation',
            content: 'Investigation reveals external IP, successful authentication with stolen credentials, and data exfiltration attempt.',
            options: ['Isolate affected systems', 'Wait for morning to investigate further', 'Just change passwords', 'Ignore if no data was actually stolen']
          },
        ]
      }
    },
    {
      type: 'matching',
      title: 'Stakeholder Notification Matrix',
      description: 'Match stakeholders with appropriate notification requirements and timelines.',
      content: {
        pairs: [
          { left: 'Regulatory authorities', right: 'Within 72 hours of discovery', category: 'regulatory' },
          { left: 'Affected individuals', right: 'Without undue delay', category: 'individuals' },
          { left: 'Law enforcement', right: 'When criminal activity confirmed', category: 'law-enforcement' },
          { left: 'Board of directors', right: 'Same day as discovery', category: 'management' },
          { left: 'Insurance company', right: 'Within 24-48 hours', category: 'business' },
          { left: 'Legal counsel', right: 'Immediately upon confirmation', category: 'legal' },
        ]
      }
    },
    {
      type: 'timeline',
      title: 'Incident Response Timeline',
      description: 'Understand the critical timeline for data breach response and recovery.',
      content: {
        events: [
          { id: '1', content: 'Detect and confirm the breach', timestamp: 'hour-0' },
          { id: '2', content: 'Contain the breach and assess scope', timestamp: 'hour-1' },
          { id: '3', content: 'Activate incident response team', timestamp: 'hour-1' },
          { id: '4', content: 'Begin forensic investigation', timestamp: 'hour-2' },
          { id: '5', content: 'Notify regulatory authorities (72-hour deadline)', timestamp: 'hour-24' },
          { id: '6', content: 'Prepare customer notification communications', timestamp: 'hour-48' },
          { id: '7', content: 'Implement remediation measures', timestamp: 'week-1' },
          { id: '8', content: 'Conduct post-incident review', timestamp: 'month-1' },
        ],
        correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8']
      }
    },
    {
      type: 'multiple-choice',
      title: 'Forensic Investigation',
      description: 'Learn proper forensic procedures during a data breach investigation.',
      content: {
        question: 'What is the most important principle when conducting forensic investigation of a data breach?',
        options: [
          'Act quickly to minimize business impact',
          'Preserve evidence integrity while maintaining chain of custody',
          'Focus on finding the attacker\'s identity first',
          'Document everything in regular business records'
        ],
        correct: 1,
        explanation: 'Forensic integrity is paramount. All evidence must be properly preserved, documented, and chain of custody maintained for legal admissibility.'
      }
    },
    {
      type: 'drag-drop',
      title: 'Data Breach Costs Analysis',
      description: 'Categorize the various costs associated with data breaches.',
      content: {
        items: [
          { id: '1', content: 'Forensic investigation and remediation', category: 'direct-costs' },
          { id: '2', content: 'Customer notification and credit monitoring', category: 'direct-costs' },
          { id: '3', content: 'Legal fees and regulatory fines', category: 'direct-costs' },
          { id: '4', content: 'Reputational damage and customer churn', category: 'indirect-costs' },
          { id: '5', content: 'Lost business and market share', category: 'indirect-costs' },
          { id: '6', content: 'Employee time and productivity loss', category: 'indirect-costs' },
          { id: '7', content: 'Security system upgrades', category: 'direct-costs' },
          { id: '8', content: 'Brand recovery and PR campaigns', category: 'indirect-costs' },
        ],
        dropZones: [
          { id: 'direct-costs', title: 'Direct Costs', description: 'Immediate financial expenses', accepts: ['direct-costs'] },
          { id: 'indirect-costs', title: 'Indirect Costs', description: 'Long-term business impact', accepts: ['indirect-costs'] },
        ]
      }
    },
    {
      type: 'chat',
      title: 'Customer Communication Strategy',
      description: 'Navigate the complex communication challenge of notifying affected customers.',
      content: {
        scenario: 'Your breach affected 50,000 customers. Legal team recommends notification, but marketing is concerned about brand damage. Customers are already asking questions on social media.',
        messages: [
          {
            id: '1',
            type: 'simulation',
            content: 'CEO asks: "Can we delay the notification until we have more details? Our Q4 results are coming up."',
            options: ['Delay notification for better timing', 'Proceed with immediate notification', 'Consult legal requirements first', 'Prepare draft notifications']
          },
          {
            id: '2',
            type: 'simulation',
            content: 'Legal team says: "We have 48 hours left before the 72-hour deadline expires."',
            options: ['Wait for perfect information', 'Proceed with notification immediately', 'Ask for extension', 'Notify selectively']
          },
        ]
      }
    },
    {
      type: 'matching',
      title: 'Regulatory Requirements',
      description: 'Match data protection regulations with their key breach notification requirements.',
      content: {
        pairs: [
          { left: 'GDPR (EU)', right: '72 hours to authorities, without undue delay to individuals', category: 'privacy-law' },
          { left: 'CCPA (California)', right: 'Without unreasonable delay to consumers', category: 'privacy-law' },
          { left: 'HIPAA (Healthcare)', right: '60 days for individuals, annually for HHS', category: 'sector-specific' },
          { left: 'SOX (Public companies)', right: 'Immediate disclosure for material breaches', category: 'sector-specific' },
          { left: 'PCI DSS (Payment cards)', right: 'Immediately to acquiring bank and card brands', category: 'industry-standard' },
          { left: 'State breach laws (US)', right: 'Varies by state, typically 30-90 days', category: 'privacy-law' },
        ]
      }
    },
    {
      type: 'multiple-choice',
      title: 'Business Continuity Planning',
      description: 'Design a business continuity strategy during and after a data breach.',
      content: {
        question: 'What should be the primary focus of business continuity during a data breach?',
        options: [
          'Continue normal business operations at all costs',
          'Maintain customer trust while containing the incident',
          'Minimize immediate costs and avoid disruption',
          'Focus on catching the attackers immediately'
        ],
        correct: 1,
        explanation: 'Business continuity must balance operational needs with security requirements, focusing on maintaining customer trust while effectively containing and resolving the incident.'
      }
    },
    {
      type: 'drag-drop',
      title: 'Containment Strategies',
      description: 'Categorize immediate containment actions for data breach incidents.',
      content: {
        items: [
          { id: '1', content: 'Isolate compromised systems from network', category: 'technical' },
          { id: '2', content: 'Revoke compromised credentials', category: 'technical' },
          { id: '3', content: 'Activate backup systems', category: 'technical' },
          { id: '4', content: 'Notify law enforcement', category: 'legal' },
          { id: '5', content: 'Brief senior management', category: 'management' },
          { id: '6', content: 'Document all actions taken', category: 'procedural' },
          { id: '7', content: 'Contact key customers proactively', category: 'management' },
          { id: '8', content: 'Enable enhanced monitoring', category: 'technical' },
        ],
        dropZones: [
          { id: 'technical', title: 'Technical Containment', description: 'System isolation and security controls', accepts: ['technical'] },
          { id: 'legal', title: 'Legal Actions', description: 'Law enforcement and legal compliance', accepts: ['legal'] },
          { id: 'management', title: 'Management Actions', description: 'Leadership and communication decisions', accepts: ['management'] },
          { id: 'procedural', title: 'Procedural Steps', description: 'Documentation and process requirements', accepts: ['procedural'] },
        ]
      }
    },
    {
      type: 'timeline',
      title: 'Recovery and Lessons Learned',
      description: 'Plan the recovery phase and implement lessons learned from the breach.',
      content: {
        events: [
          { id: '1', content: 'Complete forensic investigation and evidence collection', timestamp: 'week-1' },
          { id: '2', content: 'Implement security enhancements and fixes', timestamp: 'week-2' },
          { id: '3', content: 'Conduct employee training on lessons learned', timestamp: 'week-3' },
          { id: '4', content: 'Update incident response procedures', timestamp: 'week-4' },
          { id: '5', content: 'Review and strengthen vendor security', timestamp: 'month-1' },
          { id: '6', content: 'Conduct tabletop exercises', timestamp: 'month-2' },
          { id: '7', content: 'Annual comprehensive security assessment', timestamp: 'year-1' },
          { id: '8', content: 'Continuous improvement program', timestamp: 'ongoing' },
        ],
        correctOrder: ['1', '2', '3', '4', '5', '6', '7', '8']
      }
    },
    {
      type: 'multiple-choice',
      title: 'Third-Party and Vendor Management',
      description: 'Address data breaches involving third-party vendors and service providers.',
      content: {
        question: 'If a third-party vendor suffers a data breach affecting your customers, what are your primary responsibilities?',
        options: [
          'Only notify customers if the vendor requests it',
          'Conduct your own investigation and follow your notification obligations',
          'Let the vendor handle all communications',
          'Wait for the vendor to complete their investigation'
        ],
        correct: 1,
        explanation: 'Organizations remain responsible for customer data protection regardless of third-party involvement. You must conduct your own assessment and follow your notification obligations.'
      }
    },
    {
      type: 'matching',
      title: 'Insurance and Legal Considerations',
      description: 'Understand insurance coverage and legal implications of data breaches.',
      content: {
        pairs: [
          { left: 'Cyber liability insurance', right: 'Covers direct breach costs and liability', category: 'insurance' },
          { left: 'General liability insurance', right: 'May not cover cyber-specific incidents', category: 'insurance' },
          { left: 'Regulatory fines', right: 'Often not covered by insurance policies', category: 'legal' },
          { left: 'Class action lawsuits', right: 'Significant legal costs and settlements', category: 'legal' },
          { left: 'Credit monitoring services', right: 'May be covered by cyber insurance', category: 'insurance' },
          { left: 'Business interruption', right: 'Coverage depends on policy terms', category: 'insurance' },
        ]
      }
    },
    {
      type: 'chat',
      title: 'Advanced Breach Response Challenge',
      description: 'Navigate a complex, multi-faceted data breach involving multiple attack vectors.',
      content: {
        scenario: 'You discover a sophisticated breach: ransomware encrypted customer data, payment information was exfiltrated, and the attackers left threatening messages demanding payment. Meanwhile, customers are calling and social media is exploding.',
        messages: [
          {
            id: '1',
            type: 'simulation',
            content: 'Attacker message: "We have encrypted your customer database and stolen 100,000 payment records. Pay 5 BTC in 48 hours or we will sell the data and increase the ransom."',
            options: ['Pay the ransom immediately', 'Contact law enforcement and cyber insurance', 'Negotiate for more time', 'Ignore and rebuild from backups']
          },
          {
            id: '2',
            type: 'simulation',
            content: 'Your cyber insurance provider asks about your incident response plan and breach notification timeline.',
            options: ['We don\'t have a formal plan', 'Here\'s our documented incident response plan', 'We\'re still figuring it out', 'We\'ll handle it internally']
          },
        ]
      }
    }
  ];

  const handleSimulationComplete = (scoreData: ScoreData) => {
    setChatHistory(prev => [...prev, {
      id: Date.now().toString(),
      type: 'system',
      content: `Data Breach Response Training completed! Score: ${scoreData.score}/${scoreData.totalQuestions}`,
      timestamp: new Date(),
    }]);
  };

  const getStepIcon = (stepIndex: number) => {
    const icons = [Database, Shield, AlertTriangle, CheckCircle, Clock, Users, FileText, Phone, Database, Shield, AlertTriangle, CheckCircle, Users, FileText];
    const Icon = icons[stepIndex % icons.length];
    return <Icon className="w-6 h-6" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-gray-900 to-red-900">
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
              <div className="p-3 bg-orange-600 rounded-lg">
                <Database className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Data Breach Response</h1>
                <p className="text-gray-300">Comprehensive incident response and regulatory compliance training</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {simulationSteps.map((step, index) => (
              <motion.div
                key={index}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  currentStep === index
                    ? 'border-orange-500 bg-orange-900/20'
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
                      ? 'bg-orange-600'
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
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
            >
              <Database className="w-4 h-4" />
              <span>Start Simulation</span>
            </button>
          </div>

          <div className="text-gray-300 mb-4">
            {simulationSteps[currentStep].description}
          </div>

          <div className="bg-gray-900 p-4 rounded-lg">
            <p className="text-gray-400 text-sm">
              Master data breach response procedures, regulatory compliance, and crisis management through realistic scenarios.
            </p>
          </div>
        </div>

        <AnimatePresence>
          {isSimulationActive && (
            <div className="bg-orange-900/20 border border-orange-500/30 rounded-lg p-6 text-center">
              <h3 className="text-xl font-bold text-orange-400 mb-2">Simulation: {simulationSteps[currentStep].title}</h3>
              <p className="text-gray-300 mb-4">This interactive simulation is under development.</p>
              <p className="text-gray-400 text-sm">Comprehensive incident response framework ready for deployment.</p>
              <button
                onClick={() => setIsSimulationActive(false)}
                className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
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

export default DataBreachResponseSimEnhanced;
