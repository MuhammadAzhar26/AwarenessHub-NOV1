import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Trophy, Award, Target, TrendingUp, Lock, CheckCircle } from 'lucide-react'

interface UserProfile {
  username: string
  level: number
  total_points: number
}

interface Module {
  id: number
  title: string
  description: string
  icon: string
  difficulty: string
  total_stages: number
}

interface UserProgress {
  module_id: number
  completed_count: number
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [badgeCount, setBadgeCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      if (!user) return

      try {
        // Load user profile
        const { data: profileData } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .maybeSingle()

        setProfile(profileData)

        // Load modules
        const { data: modulesData } = await supabase
          .from('modules')
          .select('*')
          .order('order_index')

        setModules(modulesData || [])

        // Load user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('stage_id, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')

        // Get stages with module info
        if (progressData && progressData.length > 0) {
          const stageIds = progressData.map(p => p.stage_id)
          const { data: stagesData } = await supabase
            .from('stages')
            .select('id, module_id')
            .in('id', stageIds)

          // Count completed stages per module
          const progressMap: { [key: number]: number } = {}
          stagesData?.forEach(stage => {
            progressMap[stage.module_id] = (progressMap[stage.module_id] || 0) + 1
          })

          const progressArray = Object.entries(progressMap).map(([moduleId, count]) => ({
            module_id: parseInt(moduleId),
            completed_count: count
          }))

          setProgress(progressArray)
        }

        // Load badge count
        const { data: badgesData, error: badgesError } = await supabase
          .from('user_badges')
          .select('id', { count: 'exact' })
          .eq('user_id', user.id)

        if (!badgesError && badgesData) {
          setBadgeCount(badgesData.length)
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  const completedModules = progress.filter(p => {
    const module = modules.find(m => m.id === p.module_id)
    return module && p.completed_count === module.total_stages
  }).length

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">
            Welcome back, {profile?.username}!
          </h1>
          <p className="text-body-lg text-gray-600">
            Continue your cybersecurity learning journey
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-blue-600" />
              <span className="text-small font-medium text-gray-600">Total Points</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">{profile?.total_points || 0}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-small font-medium text-gray-600">Completed Modules</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">{completedModules}/12</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-blue-600" />
              <span className="text-small font-medium text-gray-600">Current Level</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">{profile?.level || 1}</p>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-6 h-6 text-blue-600" />
              <span className="text-small font-medium text-gray-600">Badges Earned</span>
            </div>
            <p className="text-h2 font-bold text-gray-900">{badgeCount}</p>
          </div>
        </div>

        {/* Modules Grid */}
        <div className="mb-8">
          <h2 className="text-h2 font-bold text-gray-900 mb-6">Learning Modules</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {modules.map((module) => {
              const moduleProgress = progress.find(p => p.module_id === module.id)
              const completedStages = moduleProgress?.completed_count || 0
              const progressPercent = (completedStages / module.total_stages) * 100
              const isCompleted = completedStages === module.total_stages

              return (
                <Link
                  key={module.id}
                  to={`/module/${module.id}`}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-600 hover:shadow-lg transition-all duration-250 hover:-translate-y-1 group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <span className="text-2xl">{module.icon === 'lock' ? '🔐' : '🛡️'}</span>
                    </div>
                    {isCompleted && <CheckCircle className="w-6 h-6 text-green-600" />}
                  </div>
                  
                  <h3 className="text-body font-semibold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-small text-gray-600 mb-4 line-clamp-2">{module.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-small text-gray-600">
                      <span>{completedStages}/{module.total_stages} stages</span>
                      <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-caption font-medium ${
                      module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                      module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {module.difficulty}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Link
            to="/badges"
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-lg text-white hover:shadow-lg transition-all duration-250 hover:-translate-y-1"
          >
            <Award className="w-12 h-12 mb-4" />
            <h3 className="text-h3 font-semibold mb-2">View Badges</h3>
            <p className="text-body opacity-90">Explore all achievements and unlock criteria</p>
          </Link>

          <Link
            to="/leaderboard"
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-lg text-white hover:shadow-lg transition-all duration-250 hover:-translate-y-1"
          >
            <TrendingUp className="w-12 h-12 mb-4" />
            <h3 className="text-h3 font-semibold mb-2">View Leaderboard</h3>
            <p className="text-body opacity-90">See how you rank against other learners</p>
          </Link>

          <Link
            to="/profile"
            className="bg-gradient-to-br from-blue-600 to-indigo-600 p-8 rounded-lg text-white hover:shadow-lg transition-all duration-250 hover:-translate-y-1"
          >
            <Award className="w-12 h-12 mb-4" />
            <h3 className="text-h3 font-semibold mb-2">Your Profile</h3>
            <p className="text-body opacity-90">View achievements and progress details</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
