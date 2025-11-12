import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trophy, 
  Star, 
  Target, 
  Zap, 
  Shield, 
  Award, 
  CheckCircle,
  TrendingUp,
  Crown,
  Flame
} from 'lucide-react'

export interface Achievement {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  requirement: number
  unlocked?: boolean
  progress?: number
  color: string
}

export interface ScoreData {
  simulationId: string
  score: number
  maxScore: number
  correctAnswers: number
  totalQuestions: number
  timeSpent?: number
  achievements: Achievement[]
}

interface AchievementSystemProps {
  scoreData: ScoreData
  onAchievementUnlock: (achievement: Achievement) => void
  className?: string
}

const AchievementSystem: React.FC<AchievementSystemProps> = ({
  scoreData,
  onAchievementUnlock,
  className = ''
}) => {
  const { score, maxScore, correctAnswers, totalQuestions, achievements } = scoreData
  
  const scorePercentage = Math.round((score / maxScore) * 100)
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  
  // Define achievement criteria
  const getAchievements = (): Achievement[] => {
    const baseAchievements: Achievement[] = [
      {
        id: 'perfect_score',
        title: 'Perfect Score',
        description: 'Achieve 100% on a simulation',
        icon: Trophy,
        requirement: 100,
        color: 'from-yellow-400 to-yellow-600'
      },
      {
        id: 'security_expert',
        title: 'Security Expert',
        description: 'Score 90% or higher',
        icon: Crown,
        requirement: 90,
        color: 'from-purple-400 to-purple-600'
      },
      {
        id: 'quick_learner',
        title: 'Quick Learner',
        description: 'Complete within time limit',
        icon: Zap,
        requirement: 1,
        color: 'from-orange-400 to-orange-600'
      },
      {
        id: 'steady_performer',
        title: 'Steady Performer',
        description: 'Score 80% or higher',
        icon: Star,
        requirement: 80,
        color: 'from-blue-400 to-blue-600'
      },
      {
        id: 'first_steps',
        title: 'First Steps',
        description: 'Complete first simulation',
        icon: Target,
        requirement: 1,
        color: 'from-green-400 to-green-600'
      },
      {
        id: 'combo_master',
        title: 'Combo Master',
        description: 'Get 5 correct answers in a row',
        icon: Flame,
        requirement: 5,
        color: 'from-red-400 to-red-600'
      }
    ]
    
    // Check achievements based on performance
    return baseAchievements.map(achievement => {
      let progress = 0
      let unlocked = false
      
      switch (achievement.id) {
        case 'perfect_score':
          progress = scorePercentage
          unlocked = scorePercentage >= achievement.requirement
          break
        case 'security_expert':
          progress = Math.min(scorePercentage, achievement.requirement)
          unlocked = scorePercentage >= achievement.requirement
          break
        case 'quick_learner':
          progress = score > 0 ? 1 : 0
          unlocked = score > 0
          break
        case 'steady_performer':
          progress = Math.min(scorePercentage, achievement.requirement)
          unlocked = scorePercentage >= achievement.requirement
          break
        case 'first_steps':
          progress = score > 0 ? 1 : 0
          unlocked = score > 0
          break
        case 'combo_master':
          // This would need to be tracked separately in real implementation
          progress = Math.min(correctAnswers, achievement.requirement)
          unlocked = correctAnswers >= achievement.requirement
          break
      }
      
      return {
        ...achievement,
        progress,
        unlocked
      }
    })
  }
  
  const allAchievements = getAchievements()
  const unlockedAchievements = allAchievements.filter(a => a.unlocked)
  const totalAchievements = allAchievements.length
  const progressToNext = (achievement: Achievement) => {
    if (achievement.unlocked) return 100
    return Math.min((achievement.progress || 0), achievement.requirement)
  }

  const getScoreGrade = () => {
    if (scorePercentage >= 95) return { grade: 'A+', color: 'text-green-400', bgColor: 'from-green-500 to-emerald-500' }
    if (scorePercentage >= 90) return { grade: 'A', color: 'text-green-400', bgColor: 'from-green-500 to-emerald-500' }
    if (scorePercentage >= 80) return { grade: 'B', color: 'text-blue-400', bgColor: 'from-blue-500 to-cyan-500' }
    if (scorePercentage >= 70) return { grade: 'C', color: 'text-yellow-400', bgColor: 'from-yellow-500 to-orange-500' }
    if (scorePercentage >= 60) return { grade: 'D', color: 'text-orange-400', bgColor: 'from-orange-500 to-red-500' }
    return { grade: 'F', color: 'text-red-400', bgColor: 'from-red-500 to-pink-500' }
  }

  const gradeInfo = getScoreGrade()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Score Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-800 to-slate-700 border border-slate-600 rounded-2xl p-6"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 mb-4">
            <span className="text-2xl font-bold text-white">{gradeInfo.grade}</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Simulation Complete!</h3>
          <p className="text-slate-300">Your cybersecurity training assessment</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">{scorePercentage}%</div>
            <div className="text-sm text-slate-400">Overall Score</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">{correctAnswers}/{totalQuestions}</div>
            <div className="text-sm text-slate-400">Correct Answers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">{accuracy}%</div>
            <div className="text-sm text-slate-400">Accuracy</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">{unlockedAchievements.length}/{totalAchievements}</div>
            <div className="text-sm text-slate-400">Achievements</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">Overall Progress</span>
            <span className="text-sm text-slate-400">{scorePercentage}%</span>
          </div>
          <div className="w-full bg-slate-600 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${scorePercentage}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className={`h-2 rounded-full bg-gradient-to-r ${gradeInfo.bgColor}`}
            />
          </div>
        </div>
      </motion.div>

      {/* Achievements Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-white">Achievements</h4>
          <div className="text-sm text-slate-400">
            {unlockedAchievements.length} of {totalAchievements} unlocked
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {allAchievements.map((achievement, index) => {
              const Icon = achievement.icon
              const progress = progressToNext(achievement)
              
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? `border-transparent bg-gradient-to-r ${achievement.color} shadow-lg`
                      : 'border-slate-600 bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      achievement.unlocked
                        ? 'bg-white/20'
                        : 'bg-slate-700'
                    }`}>
                      <Icon className={`h-6 w-6 ${
                        achievement.unlocked ? 'text-white' : 'text-slate-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h5 className={`font-semibold ${
                        achievement.unlocked ? 'text-white' : 'text-slate-300'
                      }`}>
                        {achievement.title}
                      </h5>
                      <p className={`text-sm ${
                        achievement.unlocked ? 'text-white/80' : 'text-slate-400'
                      }`}>
                        {achievement.description}
                      </p>
                      
                      {/* Progress Bar for Locked Achievements */}
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <div className="mt-2">
                          <div className="w-full bg-slate-600 rounded-full h-1">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${Math.min((achievement.progress / achievement.requirement) * 100, 100)}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                              className="h-1 rounded-full bg-blue-500"
                            />
                          </div>
                          <div className="text-xs text-slate-500 mt-1">
                            {achievement.progress}/{achievement.requirement}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {achievement.unlocked && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                        className="absolute -top-2 -right-2"
                      >
                        <CheckCircle className="h-6 w-6 text-green-400 bg-slate-800 rounded-full" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Performance Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6"
      >
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 mr-2 text-blue-400" />
          Performance Insights
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Strengths:</span>
              <span className="text-green-400 font-medium">
                {scorePercentage >= 80 ? 'Excellent knowledge' : 
                 scorePercentage >= 60 ? 'Good understanding' : 
                 'Needs improvement'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Accuracy:</span>
              <span className="text-blue-400 font-medium">{accuracy}%</span>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Recommendation:</span>
              <span className="text-yellow-400 font-medium">
                {scorePercentage >= 90 ? 'Ready for advanced training' :
                 scorePercentage >= 70 ? 'Review weak areas' :
                 'Retake simulation'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Next Level:</span>
              <span className="text-purple-400 font-medium">
                {scorePercentage < 70 ? 'Beginner Course' :
                 scorePercentage < 90 ? 'Intermediate Module' :
                 'Advanced Certification'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AchievementSystem
