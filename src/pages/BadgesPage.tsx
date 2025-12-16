import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { 
  Award, Trophy, Target, Star, Shield, Zap, Crown, Medal, 
  Flame, Lock, CheckCircle, Clock, TrendingUp, Users, 
  Brain, BookOpen, Code, Search, AlertTriangle, FileCheck,
  ChevronRight, Sparkles
} from 'lucide-react'

interface BadgeDefinition {
  id: string
  title: string
  description: string
  category: string
  criteria: string
  icon: string
  color: string
  locked: boolean
  progress?: number
  maxProgress?: number
}

const badgeDefinitions: BadgeDefinition[] = [
  // Milestone Badges
  {
    id: 'first_step',
    title: 'First Step',
    description: 'Welcome to your cybersecurity journey!',
    category: 'milestone',
    criteria: 'Complete your first challenge',
    icon: 'star',
    color: 'yellow',
    locked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'getting_started',
    title: 'Getting Started',
    description: 'You\'re building momentum',
    category: 'milestone',
    criteria: 'Complete 5 challenges',
    icon: 'target',
    color: 'yellow',
    locked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'dedicated_learner',
    title: 'Dedicated Learner',
    description: 'Showing real commitment',
    category: 'milestone',
    criteria: 'Complete 10 challenges',
    icon: 'trophy',
    color: 'yellow',
    locked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'halfway_hero',
    title: 'Halfway Hero',
    description: 'You\'re over the hump!',
    category: 'milestone',
    criteria: 'Complete 25 challenges',
    icon: 'medal',
    color: 'yellow',
    locked: false,
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'security_champion',
    title: 'Security Champion',
    description: 'An impressive achievement',
    category: 'milestone',
    criteria: 'Complete 50 challenges',
    icon: 'crown',
    color: 'yellow',
    locked: false,
    progress: 0,
    maxProgress: 50
  },

  // Points Badges
  {
    id: 'point_collector',
    title: 'Point Collector',
    description: 'Building your score',
    category: 'points',
    criteria: 'Earn 100 points',
    icon: 'sparkles',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 100
  },
  {
    id: 'point_master',
    title: 'Point Master',
    description: 'Impressive point accumulation',
    category: 'points',
    criteria: 'Earn 500 points',
    icon: 'zap',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 500
  },
  {
    id: 'point_legend',
    title: 'Point Legend',
    description: 'Elite point earner',
    category: 'points',
    criteria: 'Earn 1000 points',
    icon: 'trending_up',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 1000
  },
  {
    id: 'point_ultimate',
    title: 'Point Ultimate',
    description: 'Unstoppable point machine',
    category: 'points',
    criteria: 'Earn 2500 points',
    icon: 'flame',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 2500
  },

  // Module Completion Badges
  {
    id: 'module_starter',
    title: 'Module Starter',
    description: 'First module conquered',
    category: 'module',
    criteria: 'Complete 1 full module',
    icon: 'check_circle',
    color: 'green',
    locked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'module_explorer',
    title: 'Module Explorer',
    description: 'Exploring different domains',
    category: 'module',
    criteria: 'Complete 3 modules',
    icon: 'book_open',
    color: 'green',
    locked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'module_specialist',
    title: 'Module Specialist',
    description: 'Deep domain knowledge',
    category: 'module',
    criteria: 'Complete 6 modules',
    icon: 'brain',
    color: 'green',
    locked: false,
    progress: 0,
    maxProgress: 6
  },
  {
    id: 'module_master',
    title: 'Module Master',
    description: 'Comprehensive security knowledge',
    category: 'module',
    criteria: 'Complete all 12 modules',
    icon: 'crown',
    color: 'green',
    locked: false,
    progress: 0,
    maxProgress: 12
  },

  // Speed & Efficiency Badges
  {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Quick and accurate',
    category: 'special',
    criteria: 'Complete a challenge in under 2 minutes',
    icon: 'zap',
    color: 'purple',
    locked: false
  },
  {
    id: 'no_hints',
    title: 'No Hints Needed',
    description: 'Pure skill and knowledge',
    category: 'special',
    criteria: 'Complete 5 challenges without using any hints',
    icon: 'brain',
    color: 'purple',
    locked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'perfect_score',
    title: 'Perfect Score',
    description: 'Flawless execution',
    category: 'special',
    criteria: 'Complete 10 challenges with perfect scores',
    icon: 'star',
    color: 'purple',
    locked: false,
    progress: 0,
    maxProgress: 10
  },

  // Training Badges
  {
    id: 'dfir_novice',
    title: 'DFIR Novice',
    description: 'Starting your forensics journey',
    category: 'training',
    criteria: 'Complete 1 DFIR training module',
    icon: 'search',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'dfir_investigator',
    title: 'DFIR Investigator',
    description: 'Forensics skills developing',
    category: 'training',
    criteria: 'Complete 3 DFIR training modules',
    icon: 'search',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 3
  },
  {
    id: 'tools_apprentice',
    title: 'Tools Apprentice',
    description: 'Learning the trade',
    category: 'training',
    criteria: 'Complete 1 Tools training module',
    icon: 'code',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'tools_expert',
    title: 'Tools Expert',
    description: 'Mastering security tools',
    category: 'training',
    criteria: 'Complete 3 Tools training modules',
    icon: 'code',
    color: 'blue',
    locked: false,
    progress: 0,
    maxProgress: 3
  },

  // Simulation Badges
  {
    id: 'sim_beginner',
    title: 'Simulation Beginner',
    description: 'First simulation completed',
    category: 'simulation',
    criteria: 'Complete 1 simulation scenario',
    icon: 'shield',
    color: 'cyan',
    locked: false,
    progress: 0,
    maxProgress: 1
  },
  {
    id: 'threat_detector',
    title: 'Threat Detector',
    description: 'Spotting threats effectively',
    category: 'simulation',
    criteria: 'Identify 10 phishing attempts correctly',
    icon: 'alert_triangle',
    color: 'cyan',
    locked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'sim_master',
    title: 'Simulation Master',
    description: 'Real-world ready',
    category: 'simulation',
    criteria: 'Achieve 90%+ accuracy in 10 simulations',
    icon: 'target',
    color: 'cyan',
    locked: false,
    progress: 0,
    maxProgress: 10
  },

  // Level Badges
  {
    id: 'level_5',
    title: 'Level 5 Achiever',
    description: 'Solid progress',
    category: 'level',
    criteria: 'Reach Level 5',
    icon: 'trending_up',
    color: 'orange',
    locked: false,
    progress: 0,
    maxProgress: 5
  },
  {
    id: 'level_10',
    title: 'Level 10 Expert',
    description: 'Experienced learner',
    category: 'level',
    criteria: 'Reach Level 10',
    icon: 'crown',
    color: 'orange',
    locked: false,
    progress: 0,
    maxProgress: 10
  },
  {
    id: 'level_25',
    title: 'Level 25 Master',
    description: 'Elite status achieved',
    category: 'level',
    criteria: 'Reach Level 25',
    icon: 'flame',
    color: 'orange',
    locked: false,
    progress: 0,
    maxProgress: 25
  },

  // Competitive Badges
  {
    id: 'top_10',
    title: 'Top 10 Player',
    description: 'Among the best',
    category: 'competitive',
    criteria: 'Reach top 10 on leaderboard',
    icon: 'trophy',
    color: 'red',
    locked: false
  },
  {
    id: 'top_3',
    title: 'Podium Finish',
    description: 'Elite performer',
    category: 'competitive',
    criteria: 'Reach top 3 on leaderboard',
    icon: 'medal',
    color: 'red',
    locked: false
  },
  {
    id: 'number_one',
    title: 'Number One',
    description: 'The very best',
    category: 'competitive',
    criteria: 'Reach #1 on leaderboard',
    icon: 'crown',
    color: 'red',
    locked: false
  },

  // Consistency Badges
  {
    id: 'weekly_warrior',
    title: 'Weekly Warrior',
    description: 'Consistent effort',
    category: 'consistency',
    criteria: 'Complete at least 1 challenge per day for 7 days',
    icon: 'clock',
    color: 'green',
    locked: false,
    progress: 0,
    maxProgress: 7
  },
  {
    id: 'monthly_champion',
    title: 'Monthly Champion',
    description: 'Dedication personified',
    category: 'consistency',
    criteria: 'Complete at least 1 challenge per day for 30 days',
    icon: 'flame',
    color: 'green',
    locked: false,
    progress: 0,
    maxProgress: 30
  },

  // Security Checklist Badges
  {
    id: 'security_aware',
    title: 'Security Aware',
    description: 'Taking security seriously',
    category: 'checklist',
    criteria: 'Complete 25% of security checklist',
    icon: 'file_check',
    color: 'indigo',
    locked: false,
    progress: 0,
    maxProgress: 25
  },
  {
    id: 'security_practitioner',
    title: 'Security Practitioner',
    description: 'Implementing best practices',
    category: 'checklist',
    criteria: 'Complete 50% of security checklist',
    icon: 'shield',
    color: 'indigo',
    locked: false,
    progress: 0,
    maxProgress: 50
  },
  {
    id: 'security_expert',
    title: 'Security Expert',
    description: 'Comprehensive protection',
    category: 'checklist',
    criteria: 'Complete 100% of security checklist',
    icon: 'lock',
    color: 'indigo',
    locked: false,
    progress: 0,
    maxProgress: 100
  }
]

const categoryInfo = {
  all: { name: 'All Badges', icon: Award, color: 'text-gray-600' },
  milestone: { name: 'Milestones', icon: Trophy, color: 'text-yellow-600' },
  points: { name: 'Points', icon: Sparkles, color: 'text-blue-600' },
  module: { name: 'Modules', icon: BookOpen, color: 'text-green-600' },
  special: { name: 'Special', icon: Star, color: 'text-purple-600' },
  training: { name: 'Training', icon: Brain, color: 'text-blue-600' },
  simulation: { name: 'Simulations', icon: Shield, color: 'text-cyan-600' },
  level: { name: 'Levels', icon: TrendingUp, color: 'text-orange-600' },
  competitive: { name: 'Competitive', icon: Crown, color: 'text-red-600' },
  consistency: { name: 'Consistency', icon: Flame, color: 'text-green-600' },
  checklist: { name: 'Checklist', icon: FileCheck, color: 'text-indigo-600' }
}

const getIconComponent = (iconName: string) => {
  const icons: Record<string, any> = {
    star: Star,
    target: Target,
    trophy: Trophy,
    medal: Medal,
    crown: Crown,
    sparkles: Sparkles,
    zap: Zap,
    trending_up: TrendingUp,
    flame: Flame,
    check_circle: CheckCircle,
    book_open: BookOpen,
    brain: Brain,
    search: Search,
    code: Code,
    shield: Shield,
    alert_triangle: AlertTriangle,
    clock: Clock,
    file_check: FileCheck,
    lock: Lock,
    users: Users
  }
  return icons[iconName] || Award
}

const getBadgeColor = (color: string) => {
  const colors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    yellow: { bg: 'bg-gradient-to-br from-yellow-100 to-yellow-50', border: 'border-yellow-400', text: 'text-yellow-900', icon: 'text-yellow-600' },
    blue: { bg: 'bg-gradient-to-br from-blue-100 to-blue-50', border: 'border-blue-400', text: 'text-blue-900', icon: 'text-blue-600' },
    green: { bg: 'bg-gradient-to-br from-green-100 to-green-50', border: 'border-green-400', text: 'text-green-900', icon: 'text-green-600' },
    purple: { bg: 'bg-gradient-to-br from-purple-100 to-purple-50', border: 'border-purple-400', text: 'text-purple-900', icon: 'text-purple-600' },
    cyan: { bg: 'bg-gradient-to-br from-cyan-100 to-cyan-50', border: 'border-cyan-400', text: 'text-cyan-900', icon: 'text-cyan-600' },
    orange: { bg: 'bg-gradient-to-br from-orange-100 to-orange-50', border: 'border-orange-400', text: 'text-orange-900', icon: 'text-orange-600' },
    red: { bg: 'bg-gradient-to-br from-red-100 to-red-50', border: 'border-red-400', text: 'text-red-900', icon: 'text-red-600' },
    indigo: { bg: 'bg-gradient-to-br from-indigo-100 to-indigo-50', border: 'border-indigo-400', text: 'text-indigo-900', icon: 'text-indigo-600' }
  }
  return colors[color] || colors.blue
}

export default function BadgesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredBadges = badgeDefinitions.filter(badge => {
    const matchesCategory = selectedCategory === 'all' || badge.category === selectedCategory
    const matchesSearch = badge.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         badge.criteria.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categories = Object.keys(categoryInfo)

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-10 h-10 text-blue-600" />
            <h1 className="text-h1 font-bold text-gray-900">Badges & Achievements</h1>
          </div>
          <p className="text-body-lg text-gray-600">
            Unlock badges by completing challenges and reaching milestones. Track your progress and achievements!
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search badges by name, description, or criteria..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-600 focus:outline-none transition-colors text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2 pb-2">
            {categories.map(category => {
              const info = categoryInfo[category as keyof typeof categoryInfo]
              const Icon = info.icon
              const isActive = selectedCategory === category
              
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {info.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              <span className="text-small font-medium text-gray-600">Total Badges</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">{badgeDefinitions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-small font-medium text-gray-600">Earned</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">0</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Lock className="w-6 h-6 text-gray-600" />
              <span className="text-small font-medium text-gray-600">Locked</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">{badgeDefinitions.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-600" />
              <span className="text-small font-medium text-gray-600">Progress</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">0%</p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBadges.map(badge => {
            const IconComponent = getIconComponent(badge.icon)
            const colors = getBadgeColor(badge.color)
            const progressPercent = badge.maxProgress 
              ? Math.round(((badge.progress || 0) / badge.maxProgress) * 100)
              : 0

            return (
              <div
                key={badge.id}
                className={`${colors.bg} p-6 rounded-lg border-2 ${colors.border} transition-all hover:scale-105 hover:shadow-xl relative overflow-hidden ${
                  badge.locked ? 'opacity-60' : ''
                }`}
              >
                {badge.locked && (
                  <div className="absolute top-3 right-3">
                    <Lock className="w-5 h-5 text-gray-500" />
                  </div>
                )}

                <div className="flex flex-col items-center text-center">
                  <div className={`w-20 h-20 ${colors.icon} mb-4 flex items-center justify-center`}>
                    <IconComponent className="w-16 h-16" />
                  </div>

                  <h3 className={`text-lg font-bold ${colors.text} mb-2`}>
                    {badge.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-3">
                    {badge.description}
                  </p>

                  <div className="w-full bg-white/50 rounded-lg p-3 mb-3">
                    <div className="flex items-start gap-2 text-left">
                      <Target className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-1">Criteria:</p>
                        <p className="text-xs text-gray-800">{badge.criteria}</p>
                      </div>
                    </div>
                  </div>

                  {badge.maxProgress && (
                    <div className="w-full">
                      <div className="flex justify-between text-xs text-gray-700 mb-1">
                        <span>Progress</span>
                        <span>{badge.progress || 0}/{badge.maxProgress}</span>
                      </div>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="mt-3">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
                      {badge.category}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredBadges.length === 0 && (
          <div className="text-center py-16">
            <Award className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No badges found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-8 text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-3">Ready to Start Earning Badges?</h2>
          <p className="text-lg mb-6 opacity-90">
            Complete challenges, training modules, and simulations to unlock achievements
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Go to Dashboard
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
