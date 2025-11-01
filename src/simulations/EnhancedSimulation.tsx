import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Trophy, Target } from 'lucide-react';
import { EnhancedScenario, ScoreData } from './types';
import { DragDropActivity } from './DragDropActivity';
import { MatchingActivity } from './MatchingActivity';
import { TimelineSorter } from './TimelineSorter';
import { useProgress } from './ProgressProvider';

interface EnhancedSimulationProps {
  title: string;
  description: string;
  botName: string;
  botColor: string;
  scenarios: EnhancedScenario[];
  onComplete: (scoreData: ScoreData) => void;
  onScenarioComplete: (scenarioId: string, score: number) => void;
  className?: string;
}

interface ChatMessage {
  id: string;
  content: string;
  isBot: boolean;
  timestamp: Date;
}

export const EnhancedSimulation: React.FC<EnhancedSimulationProps> = ({
  title,
  description,
  botName,
  botColor,
  scenarios,
  onComplete,
  onScenarioComplete,
  className = '',
}) => {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [score, setScore] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [combo, setCombo] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [startTime] = useState(Date.now());
  const [scenarioScores, setScenarioScores] = useState<{ id: string; score: number; points: number; timeElapsed: number }[]>([]);
  const { updateSimulationProgress } = useProgress();

  useEffect(() => {
    // Initialize chat with bot introduction
    const timer = setTimeout(() => {
      addBotMessage(`Welcome to ${title}! I'm ${botName}, your cybersecurity training assistant. Let's start with the first scenario.`);
    }, 1000);

    return () => clearTimeout(timer);
  }, [title, botName]);

  useEffect(() => {
    // Timer
    const interval = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const addBotMessage = (content: string) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        content,
        isBot: true,
        timestamp: new Date()
      }]);
    }, 1000 + Math.random() * 1000);
  };

  const addUserMessage = (content: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      content,
      isBot: false,
      timestamp: new Date()
    }]);
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };

  const handleActivityComplete = (correct: number, total: number) => {
    const scenario = scenarios[currentScenario];
    const percentage = (correct / total) * 100;
    const scenarioPoints = Math.round(scenario.points * percentage);
    const newCombo = percentage >= 80 ? combo + 1 : 0;

    setScore(prev => prev + scenarioPoints);
    setCombo(newCombo);
    setCorrectAnswers(prev => prev + correct);

    // Track scenario completion
    const scenarioData = {
      id: scenario.id,
      score: scenarioPoints,
      points: scenario.points,
      timeElapsed: timeElapsed
    };
    setScenarioScores(prev => [...prev, scenarioData]);

    onScenarioComplete(scenario.id, scenarioPoints);

    // Bot response based on performance
    if (percentage >= 90) {
      simulateTyping();
      setTimeout(() => {
        addBotMessage(`Excellent work! You got ${correct}/${total} correct (${Math.round(percentage)}%). That's outstanding performance!`);
      }, 1000);
    } else if (percentage >= 70) {
      simulateTyping();
      setTimeout(() => {
        addBotMessage(`Great job! You got ${correct}/${total} correct (${Math.round(percentage)}%). You're doing well!`);
      }, 1000);
    } else {
      simulateTyping();
      setTimeout(() => {
        addBotMessage(`Good effort! You got ${correct}/${total} correct (${Math.round(percentage)}%). Keep practicing to improve!`);
      }, 1000);
    }

    // Move to next scenario after delay
    setTimeout(() => {
      if (currentScenario < scenarios.length - 1) {
        setCurrentScenario(prev => prev + 1);
        const nextScenario = scenarios[currentScenario + 1];
        simulateTyping();
        setTimeout(() => {
          addBotMessage(`Ready for the next challenge? ${nextScenario.title} awaits. ${nextScenario.description}`);
        }, 1000);
      } else {
        completeSimulation();
      }
    }, 3000);
  };

  const completeSimulation = () => {
    setIsCompleted(true);
    
    const finalScoreData: ScoreData = {
      score,
      timeElapsed,
      correctAnswers,
      totalAnswers: scenarios.reduce((sum, s) => sum + (s.content.dragDropData?.items.length || s.content.matchingData?.pairs.length || s.content.timelineData?.events.length || 0), 0),
      percentage: Math.round((score / scenarios.reduce((sum, s) => sum + s.points, 0)) * 100),
      scenarios: scenarioScores
    };

    // Update progress
    updateSimulationProgress(title.toLowerCase().includes('social') ? 'socialEngineering' : 
                           title.toLowerCase().includes('password') ? 'passwordSecurity' : 
                           'malwareProtection', {
      completed: true,
      score: finalScoreData.score,
      scenariosCompleted: scenarios.map(s => s.id),
      lastPlayed: new Date().toISOString()
    });

    setTimeout(() => {
      onComplete(finalScoreData);
    }, 2000);
  };

  const handleStepClick = (index: number) => {
    if (index <= currentScenario) {
      setCurrentScenario(index);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentScenarioData = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  const renderScenarioContent = () => {
    if (!currentScenarioData) return null;

    const { content } = currentScenarioData;

    switch (currentScenarioData.type) {
      case 'drag-drop':
        return (
          <DragDropActivity
            title={currentScenarioData.title}
            description={currentScenarioData.description}
            items={content.dragDropData?.items || []}
            dropZones={content.dragDropData?.dropZones || []}
            onComplete={handleActivityComplete}
          />
        );
      case 'matching':
        return (
          <MatchingActivity
            title={currentScenarioData.title}
            description={currentScenarioData.description}
            pairs={content.matchingData?.pairs || []}
            onComplete={handleActivityComplete}
          />
        );
      case 'timeline':
        return (
          <TimelineSorter
            title={currentScenarioData.title}
            description={currentScenarioData.description}
            events={content.timelineData?.events || []}
            correctOrder={content.timelineData?.correctOrder || []}
            onComplete={handleActivityComplete}
          />
        );
      default:
        return (
          <div className="text-center text-gray-400">
            Scenario type "{currentScenarioData.type}" not implemented yet.
          </div>
        );
    }
  };

  return (
    <div className={`min-h-screen bg-gray-950 ${className}`}>
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700 px-6 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{title}</h1>
              <p className="text-gray-300 mt-1">{description}</p>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{score}</div>
                <div className="text-sm text-gray-400">Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{combo}</div>
                <div className="text-sm text-gray-400">Combo</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">{formatTime(timeElapsed)}</div>
                <div className="text-sm text-gray-400">Time</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-gray-900 px-6 py-2">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-400">
              Scenario {currentScenario + 1} of {scenarios.length}
            </span>
            <span className="text-sm text-gray-400">{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Scenario Navigation */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3">
        <div className="max-w-6xl mx-auto">
          <div className="flex space-x-2 overflow-x-auto">
            {scenarios.map((scenario, index) => (
              <button
                key={scenario.id}
                onClick={() => handleStepClick(index)}
                disabled={index > currentScenario}
                className={`
                  flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${index === currentScenario
                    ? 'bg-blue-600 text-white'
                    : index < currentScenario
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                  }
                `}
              >
                {scenario.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderScenarioContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Chat Interface */}
      <div className="fixed bottom-0 right-6 w-80 bg-gray-900 border border-gray-700 rounded-t-lg shadow-lg">
        <div className="p-4 border-b border-gray-700">
          <h3 className="font-semibold text-white flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${botColor}`} />
            <span>{botName}</span>
          </h3>
        </div>
        <div className="h-64 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.isBot
                    ? 'bg-gray-800 text-gray-100'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-800 text-gray-100 p-3 rounded-lg">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      <AnimatePresence>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 p-8 rounded-lg max-w-lg w-full mx-4 border border-gray-700"
            >
              <div className="text-center">
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-white mb-4">Simulation Complete!</h2>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <Target className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-blue-400">{score}</div>
                    <div className="text-sm text-gray-400">Final Score</div>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <Clock className="w-8 h-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-green-400">{formatTime(timeElapsed)}</div>
                    <div className="text-sm text-gray-400">Time Taken</div>
                  </div>
                </div>
                <p className="text-gray-300 mb-6">
                  You've successfully completed all {scenarios.length} scenarios!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};