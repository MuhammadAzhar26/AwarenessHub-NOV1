import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Award, Target, Clock, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { default as ChatInterface, type ChatMessage } from './ChatInterface'
import { DragDropActivity } from './DragDropActivity'
import { MatchingActivity } from './MatchingActivity'
import { TimelineSorter } from './TimelineSorter'
import { default as ProgressIndicator } from './ProgressIndicator'
import { default as AchievementSystem, type ScoreData } from './AchievementSystem'
import { useProgress } from './ProgressProvider'
import { type DragItem, type DropZone } from './types'
import { type MatchPair } from './types'

export interface EnhancedScenario {
  id: string
  title: string
  description: string
  type: 'chat' | 'drag-drop' | 'matching' | 'timeline' | 'multiple-choice'
  content: {
    chatMessages?: string[]
    dragDropData?: {
      items: DragItem[]
      dropZones: DropZone[]
    }
    matchingData?: {
      pairs: MatchPair[]
    }
    timelineData?: {
      events: Array<{ id: string; content: string; order: number }>
      correctOrder: number[]
    }
    question?: string
    options?: Array<{
      id: string
      text: string
      isCorrect: boolean
      explanation: string
    }>
  }
  points: number
  timeLimit?: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

interface EnhancedSimulationProps {
  title: string
  description: string
  botName: string
  botColor: string
  scenarios: EnhancedScenario[]
  onComplete: (scoreData: ScoreData) => void
  onScenarioComplete: (scenarioId: string, score: number) => void
  className?: string
}

const EnhancedSimulation: React.FC<EnhancedSimulationProps> = ({
  title,
  description,
  botName,
  botColor,
  scenarios,
  onComplete,
  onScenarioComplete,
  className = ''
}) => {
  const { updateSimulationProgress } = useProgress()
  const [currentScenario, setCurrentScenario] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)
  const [combo, setCombo] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [startTime] = useState(Date.now())
  const [showAchievements, setShowAchievements] = useState(false)

  const currentScenarioData = scenarios[currentScenario]
  const totalScenarios = scenarios.length

  // Timer effect
  useEffect(() => {
    if (isCompleted) return
    
    const timer = setInterval(() => {
      setTimeElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(timer)
  }, [isCompleted, startTime])

  // Initialize bot introduction
  useEffect(() => {
    const introduction = `Hello! I'm ${botName}. Today we'll explore advanced cybersecurity scenarios through interactive challenges.

What we'll accomplish:
• Complete 15 comprehensive scenarios
• Practice with drag-and-drop interactions
• Match related security concepts
• Apply knowledge to real-world situations
• Earn achievements and certifications

Are you ready to begin this enhanced training experience?`
    
    setMessages([
      {
        id: 'intro',
        type: 'bot',
        content: introduction,
        timestamp: new Date()
      }
    ])
  }, [botName])

  const simulateTyping = (content: string, delay: number = 1000) => {
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const newMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, newMessage])
    }, delay)
  }

  const handleSendMessage = (message: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: message,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])

    setTimeout(() => {
      const responses = [
        "Excellent! Let's dive into our interactive scenarios.",
        "Perfect! You're ready for the next challenge.",
        "Great work! Let's continue with hands-on practice.",
        "Well done! These skills will serve you well."
      ]
      const response = responses[Math.floor(Math.random() * responses.length)]
      simulateTyping(response)
      
      // Trigger first scenario if this is the initial interaction
      setTimeout(() => {
        simulateTyping("Let's begin with our first interactive scenario.")
        setTimeout(() => {
          if (currentScenarioData.content.question) {
            simulateTyping(currentScenarioData.content.question)
          } else {
            simulateTyping(currentScenarioData.description)
          }
        }, 1000)
      }, 1500)
    }, 1000)
  }

  const handleActivityComplete = (correct: number, total: number) => {
    const scenarioPoints = Math.round((correct / total) * currentScenarioData.points)
    const newScore = score + scenarioPoints
    
    if (correct === total) {
      setCombo(prev => prev + 1)
      setCorrectAnswers(prev => prev + 1)
    } else {
      setCombo(0)
    }
    
    setScore(newScore)
    onScenarioComplete(currentScenarioData.id, scenarioPoints)
    
    // Simulate bot response
    setTimeout(() => {
      const feedback = correct === total 
        ? "Outstanding! You've mastered this scenario perfectly."
        : correct >= total * 0.7 
        ? "Good work! You're developing strong security awareness."
        : "Keep practicing! These skills improve with experience."
      
      simulateTyping(feedback)
      
      setTimeout(() => {
        if (currentScenario < totalScenarios - 1) {
          simulateTyping(`Let's move to scenario ${currentScenario + 2} of ${totalScenarios}.`)
          setTimeout(() => {
            setCurrentScenario(prev => prev + 1)
            // Trigger the new scenario to start
            if (scenarios[currentScenario + 1]?.content?.question) {
              simulateTyping(scenarios[currentScenario + 1].content.question)
            }
          }, 1000)
        } else {
          // Simulation completed
          setIsCompleted(true)
          setShowAchievements(true)
          
          const finalScoreData: ScoreData = {
            simulationId: title.toLowerCase().replace(/\s+/g, '-'),
            score: newScore,
            maxScore: scenarios.reduce((sum, s) => sum + s.points, 0),
            correctAnswers,
            totalQuestions: totalScenarios,
            timeSpent: timeElapsed,
            achievements: []
          }
          
          updateSimulationProgress('socialEngineering' as any, {
            completed: true,
            score: (newScore / scenarios.reduce((sum, s) => sum + s.points, 0)) * 100,
            scenariosCompleted: scenarios.map(s => s.id),
            lastPlayed: new Date().toISOString()
          })
          
          setTimeout(() => {
            simulateTyping("Congratulations! You've completed all scenarios in this enhanced cybersecurity training.")
            setTimeout(() => {
              simulateTyping(`Final Score: ${Math.round((newScore / scenarios.reduce((sum, s) => sum + s.points, 0)) * 100)}%`)
              setTimeout(() => {
                onComplete(finalScoreData)
              }, 1000)
            }, 1000)
          }, 1000)
        }
      }, 2000)
    }, 1000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to completed scenarios
    if (stepIndex < currentScenario) {
      setCurrentScenario(stepIndex)
      setShowAchievements(false)
      
      // Trigger scenario loading
      setTimeout(() => {
        const scenario = scenarios[stepIndex]
        if (scenario.content.question) {
          simulateTyping(`Let's review: ${scenario.content.question}`)
        } else {
          simulateTyping(`Let's review: ${scenario.description}`)
        }
      }, 1000)
    }
  }

  const renderScenarioContent = () => {
    if (!currentScenarioData) return null

    switch (currentScenarioData.type) {
      case 'drag-drop':
        if (!currentScenarioData.content.dragDropData) return null
        return (
          <DragDropActivity
            title={currentScenarioData.title}
            description={currentScenarioData.description}
            items={currentScenarioData.content.dragDropData.items}
            dropZones={currentScenarioData.content.dragDropData.dropZones}
            onComplete={handleActivityComplete}
          />
        )

      case 'matching':
        if (!currentScenarioData.content.matchingData) return null
        return (
          <MatchingActivity
            title={currentScenarioData.title}
            description={currentScenarioData.description}
            pairs={currentScenarioData.content.matchingData.pairs}
            onComplete={handleActivityComplete}
          />
        )

      case 'timeline':
        if (!currentScenarioData.content.timelineData) return null
        return (
          <TimelineSorter
            title={currentScenarioData.title}
            description={currentScenarioData.description}
            events={currentScenarioData.content.timelineData.events}
            correctOrder={currentScenarioData.content.timelineData.correctOrder}
            onComplete={handleActivityComplete}
          />
        )

      case 'multiple-choice':
      default:
        return (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{currentScenarioData.title}</h3>
            <p className="text-slate-300 mb-4">{currentScenarioData.description}</p>
            
            {currentScenarioData.content.question && (
              <div className="mb-6">
                <h4 className="text-md font-medium text-white mb-3">{currentScenarioData.content.question}</h4>
                {currentScenarioData.content.options && (
                  <div className="space-y-3">
                    {currentScenarioData.content.options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleActivityComplete(option.isCorrect ? 1 : 0, 1)}
                        className="w-full text-left p-4 rounded-lg border border-slate-600 hover:border-blue-500 hover:bg-slate-700/50 transition-all"
                      >
                        <span className="text-white">{option.id}) {option.text}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
    }
  }

  if (showAchievements) {
    const scoreData: ScoreData = {
      simulationId: title.toLowerCase().replace(/\s+/g, '-'),
      score,
      maxScore: scenarios.reduce((sum, s) => sum + s.points, 0),
      correctAnswers,
      totalQuestions: totalScenarios,
      timeSpent: timeElapsed,
      achievements: []
    }

    return (
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link 
              to="/" 
              className="inline-flex items-center text-slate-300 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-4xl font-bold text-white mb-2">{title} - Complete!</h1>
            <p className="text-slate-300">Congratulations on completing all scenarios</p>
          </div>
        </div>

        <AchievementSystem
          scoreData={scoreData}
          onAchievementUnlock={(achievement) => {
            console.log('Achievement unlocked:', achievement.title)
          }}
        />

        <div className="flex justify-center space-x-4 mt-8">
          <Link 
            to="/password-security"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center"
          >
            Next Training
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
          <Link 
            to="/"
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <Link 
            to="/" 
            className="inline-flex items-center text-slate-300 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <p className="text-slate-300">{description}</p>
        </div>
        
        <div className="text-right space-y-2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center text-blue-400">
              <Target className="h-4 w-4 mr-1" />
              <span>{score} pts</span>
            </div>
            <div className="flex items-center text-green-400">
              <Zap className="h-4 w-4 mr-1" />
              <span>{combo}x combo</span>
            </div>
            <div className="flex items-center text-slate-400">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
          </div>
          <div className="text-xs text-slate-500">
            Scenario {currentScenario + 1} of {totalScenarios}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Progress Indicator */}
        <div className="lg:col-span-1">
          <ProgressIndicator
            currentStep={currentScenario + 1}
            totalSteps={totalScenarios}
            steps={scenarios.map((scenario, index) => ({
              title: scenario.title,
              description: scenario.description,
              completed: index < currentScenario
            }))}
            onStepClick={handleStepClick}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Chat Interface */}
          <ChatInterface
            botName={botName}
            botAvatar={botName.split(' ')[0]}
            botColor={botColor}
            messages={messages}
            onSendMessage={handleSendMessage}
            isTyping={isTyping}
            showInput={true}
          />

          {/* Scenario Content */}
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
      </div>
    </div>
  )
}

export default EnhancedSimulation
