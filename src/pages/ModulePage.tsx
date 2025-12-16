import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Lock, CheckCircle, Circle, ArrowLeft, Play } from 'lucide-react'

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
  time_spent?: number
  started_at?: string
  completed_at?: string
}

export default function ModulePage() {
  const { moduleId } = useParams()
  const { user } = useAuth()
  const [module, setModule] = useState<Module | null>(null)
  const [stages, setStages] = useState<Stage[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [selectedStage, setSelectedStage] = useState<Stage | null>(null)
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
        if (stagesData && stagesData.length > 0) {
          setSelectedStage(stagesData[0])
        }

        // Load user progress
        if (stagesData) {
          const stageIds = stagesData.map(s => s.id)
          const { data: progressData } = await supabase
            .from('user_progress')
            .select('stage_id, status, points_earned, time_spent, started_at, completed_at')
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
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-gray-600">Loading...</div>
        </div>
      </div>
    )
  }

  if (!module) {
    return (
      <div className="min-h-screen bg-white">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-gray-600">Module not found</div>
        </div>
      </div>
    )
  }

  const completedStages = progress.filter(p => p.status === 'completed').length
  const totalPoints = progress.reduce((sum, p) => sum + (p.points_earned || 0), 0)
  const totalTimeSpent = progress.reduce((sum, p) => sum + (p.time_spent || 0), 0)
  const progressPercent = (completedStages / module.total_stages) * 100

  // Format time spent (seconds to minutes/hours)
  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-body text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </Link>

        {/* Module Header */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-md mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">{module.title}</h1>
              <p className="text-body text-gray-600 mb-4">{module.description}</p>
              <div className="flex items-center gap-4">
                <span className={`inline-block px-3 py-1 rounded-full text-caption font-medium ${
                  module.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                  module.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {module.difficulty}
                </span>
                <span className="text-small text-gray-600">Points Earned: {totalPoints} pts</span>
                {totalTimeSpent > 0 && (
                  <span className="text-small text-gray-600">Time Spent: {formatTime(totalTimeSpent)}</span>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-small text-gray-600">
              <span>Progress: {completedStages}/{module.total_stages} stages</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stages List - Left Sidebar */}
          <div className="lg:col-span-1 bg-white p-6 rounded-lg border border-gray-200 shadow-md h-fit">
            <h2 className="text-h3 font-bold text-gray-900 mb-4">Challenge Stages</h2>
            <div className="space-y-2">
              {stages.map((stage, index) => {
                const stageProgress = progress.find(p => p.stage_id === stage.id)
                const isCompleted = stageProgress?.status === 'completed'
                const previousCompleted = index === 0 || progress.find(p => p.stage_id === stages[index - 1].id)?.status === 'completed'
                const isUnlocked = index === 0 || previousCompleted
                const isSelected = selectedStage?.id === stage.id

                return (
                  <button
                    key={stage.id}
                    onClick={() => isUnlocked && setSelectedStage(stage)}
                    disabled={!isUnlocked}
                    className={`w-full text-left p-4 rounded-lg transition-all border ${
                      isSelected
                        ? 'bg-blue-50 border-blue-600'
                        : isUnlocked
                        ? 'bg-gray-50 border-gray-300 hover:border-blue-400'
                        : 'bg-gray-100 border-gray-300 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : isUnlocked ? (
                        <Circle className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-small font-medium text-gray-900">
                          Stage {stage.stage_number}
                        </div>
                        <div className="text-caption text-gray-600 truncate">
                          {stage.title}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stage Content - Right Side */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStage ? (
              <>
                {/* Stage Details */}
                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-md">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-h2 font-bold text-gray-900 mb-2">
                        Stage {selectedStage.stage_number}: {selectedStage.title}
                      </h2>
                      <p className="text-body text-gray-600 mb-4">
                        {selectedStage.points} points available
                        {progress.find(p => p.stage_id === selectedStage.id) && 
                          ` • Earned: ${progress.find(p => p.stage_id === selectedStage.id)?.points_earned} pts`}
                      </p>
                    </div>
                  </div>

                  {/* Start Challenge Button */}
                  {(() => {
                    const stageProgress = progress.find(p => p.stage_id === selectedStage.id)
                    const isCompleted = stageProgress?.status === 'completed'
                    const index = stages.findIndex(s => s.id === selectedStage.id)
                    const previousCompleted = index === 0 || progress.find(p => p.stage_id === stages[index - 1].id)?.status === 'completed'
                    const isUnlocked = index === 0 || previousCompleted

                    if (!isUnlocked) {
                      return (
                        <div className="w-full px-6 py-3 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center gap-2">
                          <Lock className="w-5 h-5" />
                          Complete previous stage to unlock
                        </div>
                      )
                    }

                    if (isCompleted) {
                      return (
                        <div className="space-y-3">
                          <div className="w-full px-6 py-3 bg-green-50 text-green-600 rounded-lg flex items-center justify-center gap-2">
                            <CheckCircle className="w-5 h-5" />
                            Stage Completed
                          </div>
                          <Link
                            to={`/module/${moduleId}/stage/${selectedStage.id}`}
                            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                          >
                            Review Challenge
                          </Link>
                        </div>
                      )
                    }

                    return (
                      <Link
                        to={`/module/${moduleId}/stage/${selectedStage.id}`}
                        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                      >
                        <Play className="w-5 h-5" />
                        Start Challenge
                      </Link>
                    )
                  })()}
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-lg border border-gray-200 shadow-md text-center">
                <Play className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-body text-gray-600">Select a stage to begin</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
