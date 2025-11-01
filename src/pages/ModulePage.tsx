import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Lock, CheckCircle, Circle, ArrowLeft } from 'lucide-react'

interface Module {
  id: number
  title: string
  description: string
  difficulty: string
  total_stages: number
}

interface Stage {
  id: number
  stage_number: number
  title: string
  points: number
}

interface Progress {
  stage_id: number
  status: string
  points_earned: number
}

export default function ModulePage() {
  const { moduleId } = useParams()
  const { user } = useAuth()
  const [module, setModule] = useState<Module | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadModule() {
      if (!moduleId || !user) return

      try {
        // Load module
        const { data: moduleData } = await supabase
          .from('modules')
          .select('*')
          .eq('id', moduleId)
          .maybeSingle()

        setModule(moduleData)

        // Load stages
        const { data: stagesData } = await supabase
          .from('stages')
          .select('id, stage_number, title, points')
          .eq('module_id', moduleId)
          .order('stage_number')

        setStages(stagesData || [])

        // Load user progress
        if (stagesData) {
          const stageIds = stagesData.map(s => s.id)
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('stage_id, status, points_earned')
            .eq('user_id', user.id)
            .in('stage_id', stageIds)

          setProgress(progressData || [])
        }
      } catch (error) {
        console.error('Error loading module:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModule()
  }, [moduleId, user])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Module not found</div>
        </div>
      </div>
    )
  }

  const completedStages = progress.filter(p => p.status === 'completed').length
  const totalPoints = progress.reduce((sum, p) => sum + (p.points_earned || 0), 0)

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-body text-neutral-400 hover:text-primary-400 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Module Header */}
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 p-12 rounded-lg text-white mb-8">
          <h1 className="text-h1 font-bold mb-4">{module.title}</h1>
          <p className="text-body-lg opacity-90 mb-6 max-w-3xl">{module.description}</p>
          
          <div className="flex flex-wrap gap-6">
            <div>
              <div className="text-caption opacity-75 mb-1">Difficulty</div>
              <div className="text-body font-semibold">{module.difficulty}</div>
            </div>
            <div>
              <div className="text-caption opacity-75 mb-1">Progress</div>
              <div className="text-body font-semibold">{completedStages}/{module.total_stages} Stages</div>
            </div>
            <div>
              <div className="text-caption opacity-75 mb-1">Points Earned</div>
              <div className="text-body font-semibold">{totalPoints} pts</div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 mb-8">
          <div className="flex justify-between text-small text-neutral-400 mb-2">
            <span>Module Progress</span>
            <span>{Math.round((completedStages / module.total_stages) * 100)}%</span>
          </div>
          <div className="w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary-500 transition-all duration-300"
              style={{ width: `${(completedStages / module.total_stages) * 100}%` }}
            />
          </div>
        </div>

        {/* Stages List */}
        <div className="space-y-4">
          <h2 className="text-h2 font-bold text-neutral-100 mb-6">Challenge Stages</h2>
          {stages.map((stage, index) => {
            const stageProgress = progress.find(p => p.stage_id === stage.id)
            const isCompleted = stageProgress?.status === 'completed'
            const previousCompleted = index === 0 || progress.find(p => p.stage_id === stages[index - 1].id)?.status === 'completed'
            const isUnlocked = index === 0 || previousCompleted

            return (
              <Link
                key={stage.id}
                to={isUnlocked ? `/module/${moduleId}/stage/${stage.id}` : '#'}
                className={`block bg-neutral-900 p-6 rounded-lg border-2 transition-all duration-250 ${
                  isCompleted 
                    ? 'border-success-600 bg-success-900/20' 
                    : isUnlocked
                    ? 'border-neutral-800 hover:border-primary-500 hover:shadow-dark-card-hover hover:-translate-y-1'
                    : 'border-neutral-800 opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-success-600 text-white' 
                        : isUnlocked
                        ? 'bg-primary-900/30 text-primary-400'
                        : 'bg-neutral-800 text-neutral-500'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isUnlocked ? (
                        <Circle className="w-6 h-6" />
                      ) : (
                        <Lock className="w-6 h-6" />
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-body font-semibold text-neutral-100">
                        Stage {stage.stage_number}: {stage.title}
                      </h3>
                      <p className="text-small text-neutral-400">
                        {stage.points} points available
                        {stageProgress && ` • Earned: ${stageProgress.points_earned} pts`}
                      </p>
                    </div>
                  </div>

                  {isCompleted && (
                    <div className="bg-success-600 text-white px-4 py-2 rounded-full text-caption font-semibold">
                      Completed
                    </div>
                  )}
                  {!isCompleted && !isUnlocked && (
                    <div className="bg-neutral-800 text-neutral-400 px-4 py-2 rounded-full text-caption font-semibold">
                      Locked
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
