import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, Circle, Play, Wrench } from 'lucide-react'
import QuestionsSection from '@/components/quiz/QuestionsSection'
import WalkthroughSection from '@/components/quiz/WalkthroughSection'

interface ToolModule {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
}

interface ToolStage {
  id: number
  stage_number: number
  title: string
  description: string
  tutorial_content: string
  video_url: string
  points: number
}

interface UserProgress {
  tool_stage_id: number
  status: string
  video_completed: boolean
}

export default function ToolDetailPage() {
  const { toolId } = useParams()
  const { user } = useAuth()
  const [tool, setTool] = useState<ToolModule | null>(null)
  const [stages, setStages] = useState<ToolStage[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [selectedStage, setSelectedStage] = useState<ToolStage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadToolData()
  }, [toolId, user])

  useEffect(() => {
    if (stages.length > 0 && !selectedStage) {
      setSelectedStage(stages[0])
    }
  }, [stages])

  async function loadToolData() {
    if (!toolId) return

    // Load tool module
    const { data: toolData } = await supabase
      .from('tool_modules')
      .select('*')
      .eq('id', toolId)
      .single()

    if (toolData) {
      setTool(toolData)
    }

    // Load stages
    const { data: stagesData } = await supabase
      .from('tool_stages')
      .select('*')
      .eq('tool_module_id', toolId)
      .order('stage_number')

    if (stagesData) {
      setStages(stagesData)
    }

    // Load user progress
    if (user) {
      const { data: progressData } = await supabase
        .from('user_tool_progress')
        .select('*')
        .eq('user_id', user.id)
        .in('tool_stage_id', stagesData?.map(s => s.id) || [])

      if (progressData) {
        setProgress(progressData)
      }
    }

    setLoading(false)
  }

  const markStageComplete = async (stageId: number) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('user_tool_progress')
        .upsert({
          user_id: user.id,
          tool_stage_id: stageId,
          status: 'completed',
          video_completed: true,
          completed_at: new Date().toISOString()
        })

      if (!error) {
        const { data: progressData } = await supabase
          .from('user_tool_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('tool_stage_id', stages.map(s => s.id))

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
          <div className="text-neutral-400">Loading tool training...</div>
        </div>
      </div>
    )
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Tool not found</div>
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
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-body text-primary-400 hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tools Training
        </Link>

        {/* Tool Header */}
        <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Wrench className="w-8 h-8 text-primary-500" />
                <h1 className="text-h1 font-bold text-neutral-100">{tool.title}</h1>
              </div>
              <p className="text-body text-neutral-400 mb-4">{tool.description}</p>
              <div className="flex items-center gap-4">
                <span className={`inline-block px-3 py-1 rounded-full text-caption font-medium ${
                  tool.difficulty === 'Beginner' ? 'bg-success-50 text-success-600' :
                  tool.difficulty === 'Intermediate' ? 'bg-warning-50 text-warning-700' :
                  'bg-error-50 text-error-600'
                }`}>
                  {tool.difficulty}
                </span>
                <span className="text-small text-neutral-400">{tool.category}</span>
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
                const stageProgress = progress.find(p => p.tool_stage_id === stage.id)
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
                        title={selectedStage.title}
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

                  {/* Tutorial Content */}
                  {selectedStage.tutorial_content && (
                    <div className="prose prose-neutral max-w-none mb-6">
                      <div className="text-body text-neutral-300 whitespace-pre-wrap">
                        {selectedStage.tutorial_content}
                      </div>
                    </div>
                  )}

                  {/* Mark Complete Button */}
                  {!progress.find(p => p.tool_stage_id === selectedStage.id && p.status === 'completed') && (
                    <button
                      onClick={() => markStageComplete(selectedStage.id)}
                      className="w-full px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Mark Stage as Complete
                    </button>
                  )}

                  {progress.find(p => p.tool_stage_id === selectedStage.id && p.status === 'completed') && (
                    <div className="w-full px-6 py-3 bg-success-50 text-success-600 rounded-lg flex items-center justify-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Stage Completed
                    </div>
                  )}
                </div>

                {/* Walkthrough Section */}
                <WalkthroughSection toolName={getToolNameFromTitle(tool.title)} />

                {/* Questions Section */}
                {user && (
                  <QuestionsSection stageId={selectedStage.id} userId={user.id} />
                )}
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

// Helper function to extract tool name from module title
function getToolNameFromTitle(title: string): string {
  // Map module titles to tool names used in walkthroughs
  const mapping: Record<string, string> = {
    'Wireshark Mastery': 'Wireshark',
    'Nmap Scanning Techniques': 'Nmap',
    'Metasploit Framework': 'Metasploit',
    'Burp Suite Pro': 'Burp Suite',
    'Autopsy Forensics': 'Autopsy',
    'Volatility Framework': 'Volatility'
  }
  return mapping[title] || title.split(' ')[0]
}
