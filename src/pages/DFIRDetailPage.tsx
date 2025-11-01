import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, Circle, Play, Volume2, Search } from 'lucide-react'

interface DFIRModule {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  video_url: string
  audio_url: string
}

interface DFIRStage {
  id: number
  stage_number: number
  title: string
  description: string
  content: string
  video_url: string
  audio_url: string
  estimated_duration: number
}

interface UserProgress {
  dfir_stage_id: number
  status: string
  video_completed: boolean
}

export default function DFIRDetailPage() {
  const { dfirId } = useParams()
  const { user } = useAuth()
  const [module, setModule] = useState<DFIRModule | null>(null)
  const [stages, setStages] = useState<DFIRStage[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [selectedStage, setSelectedStage] = useState<DFIRStage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadDFIRData() {
      if (!user || !dfirId) return

      try {
        // Load DFIR module
        const { data: moduleData } = await supabase
          .from('dfir_modules')
          .select('*')
          .eq('id', dfirId)
          .single()

        setModule(moduleData)

        // Load stages
        const { data: stagesData } = await supabase
          .from('dfir_stages')
          .select('*')
          .eq('dfir_module_id', dfirId)
          .order('stage_number')

        setStages(stagesData || [])
        if (stagesData && stagesData.length > 0) {
          setSelectedStage(stagesData[0])
        }

        // Load user progress
        const { data: progressData } = await supabase
          .from('user_dfir_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('dfir_stage_id', stagesData?.map(s => s.id) || [])

        setProgress(progressData || [])
      } catch (error) {
        console.error('Error loading DFIR data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDFIRData()
  }, [user, dfirId])

  const markStageComplete = async (stageId: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_dfir_progress')
        .upsert({
          user_id: user.id,
          dfir_stage_id: stageId,
          status: 'completed',
          video_completed: true,
          completed_at: new Date().toISOString()
        })

      if (!error) {
        // Reload progress
        const { data: progressData } = await supabase
          .from('user_dfir_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('dfir_stage_id', stages.map(s => s.id))

        setProgress(progressData || [])
      }
    } catch (error) {
      console.error('Error marking stage complete:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Loading DFIR module...</div>
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
  const progressPercent = (completedStages / stages.length) * 100

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Back Button */}
        <Link
          to="/dfir"
          className="inline-flex items-center gap-2 text-body text-primary-400 hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to DFIR Training
        </Link>

        {/* Module Header */}
        <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Search className="w-8 h-8 text-primary-500" />
                <h1 className="text-h1 font-bold text-neutral-100">{module.title}</h1>
              </div>
              <p className="text-body text-neutral-400 mb-4">{module.description}</p>
              <div className="flex items-center gap-4">
                <span className={`inline-block px-3 py-1 rounded-full text-caption font-medium ${
                  module.difficulty === 'Beginner' ? 'bg-success-50 text-success-600' :
                  module.difficulty === 'Intermediate' ? 'bg-warning-50 text-warning-700' :
                  'bg-error-50 text-error-600'
                }`}>
                  {module.difficulty}
                </span>
                <span className="text-small text-neutral-400">{module.category}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-small text-neutral-400">
              <span>Progress: {completedStages}/{stages.length} stages</span>
              <span>{Math.round(progressPercent)}%</span>
            </div>
            <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary-500 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stages List */}
          <div className="lg:col-span-1 bg-neutral-900 p-6 rounded-lg border border-neutral-800 h-fit">
            <h2 className="text-h3 font-bold text-neutral-100 mb-4">Training Stages</h2>
            <div className="space-y-2">
              {stages.map((stage) => {
                const stageProgress = progress.find(p => p.dfir_stage_id === stage.id)
                const isCompleted = stageProgress?.status === 'completed'
                const isSelected = selectedStage?.id === stage.id

                return (
                  <button
                    key={stage.id}
                    onClick={() => setSelectedStage(stage)}
                    className={`w-full text-left p-4 rounded-lg transition-all border ${
                      isSelected
                        ? 'bg-primary-900/30 border-primary-500'
                        : 'bg-neutral-800 border-neutral-700 hover:border-primary-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="text-small font-medium text-neutral-100">
                          Stage {stage.stage_number}
                        </div>
                        <div className="text-caption text-neutral-400 truncate">
                          {stage.title}
                        </div>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Stage Content */}
          <div className="lg:col-span-2 space-y-6">
            {selectedStage ? (
              <>
                {/* Video Player */}
                {selectedStage.video_url && (
                  <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                    <div className="aspect-video bg-neutral-900 relative">
                      <iframe
                        src={selectedStage.video_url}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Stage Details */}
                <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-h2 font-bold text-neutral-100 mb-2">
                        Stage {selectedStage.stage_number}: {selectedStage.title}
                      </h2>
                      <p className="text-body text-neutral-400 mb-4">{selectedStage.description}</p>
                    </div>
                  </div>

                  {/* Audio Narration */}
                  {selectedStage.audio_url && (
                    <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center gap-2 mb-2">
                        <Volume2 className="w-5 h-5 text-primary-500" />
                        <span className="text-small font-medium text-neutral-100">Audio Narration</span>
                      </div>
                      <audio controls className="w-full">
                        <source src={selectedStage.audio_url} type="audio/mpeg" />
                        Your browser does not support audio playback.
                      </audio>
                    </div>
                  )}

                  {/* Content */}
                  <div className="prose prose-neutral max-w-none mb-6">
                    <div dangerouslySetInnerHTML={{ __html: selectedStage.content }} />
                  </div>

                  {/* Mark Complete Button */}
                  {!progress.find(p => p.dfir_stage_id === selectedStage.id && p.status === 'completed') && (
                    <button
                      onClick={() => markStageComplete(selectedStage.id)}
                      className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark Stage as Complete
                    </button>
                  )}

                  {progress.find(p => p.dfir_stage_id === selectedStage.id && p.status === 'completed') && (
                    <div className="w-full px-6 py-3 bg-success-50 text-success-600 rounded-lg flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Stage Completed
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-neutral-900 p-12 rounded-lg border border-neutral-800 text-center">
                <Play className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
                <p className="text-body text-neutral-400">Select a stage to begin training</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
