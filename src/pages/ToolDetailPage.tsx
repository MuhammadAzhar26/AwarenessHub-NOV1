import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react'
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
      
      <div className="container mx-auto py-8 px-4">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-body text-primary-400 hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tools Training
        </Link>

        {/* Tool Header */}
        <div className="mb-8">
          <h1 className="text-h1 text-white font-bold mb-4">{tool.title}</h1>
          <p className="text-body text-neutral-300 mb-6">{tool.description}</p>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-caption text-neutral-400">
              <span>Your Progress</span>
              <span>{completedStages}/{stages.length} Stages Complete</span>
            </div>
            <div className="w-full bg-neutral-900 rounded-full h-2 overflow-hidden">
              <div
                className="bg-primary-500 h-2 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Stages List */}
          <div className="lg:col-span-1 space-y-3">
            <h2 className="text-h3 text-white font-semibold mb-4">Training Stages</h2>
            {stages.map((stage) => {
              const stageProgress = progress.find(p => p.tool_stage_id === stage.id)
              const isCompleted = stageProgress?.status === 'completed'
              const isActive = selectedStage?.id === stage.id

              return (
                <button
                  key={stage.id}
                  onClick={() => setSelectedStage(stage)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    isActive
                      ? 'bg-primary-500/10 border-primary-500/50'
                      : 'bg-neutral-900 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        <Circle className="w-5 h-5 text-neutral-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-caption text-primary-400 font-medium mb-1">
                        Stage {stage.stage_number}
                      </div>
                      <div className="text-body text-white font-medium mb-1">
                        {stage.title}
                      </div>
                      <div className="text-caption text-neutral-400">
                        {stage.points} points
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Stage Content */}
          <div className="lg:col-span-2 space-y-8">
            {selectedStage && (
              <>
                {/* Stage Header */}
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-caption text-primary-400 font-medium">
                      Stage {selectedStage.stage_number}
                    </span>
                    <span className="text-caption text-neutral-500">•</span>
                    <span className="text-caption text-neutral-400">
                      {selectedStage.points} points
                    </span>
                  </div>
                  <h2 className="text-h2 text-white font-bold mb-4">
                    {selectedStage.title}
                  </h2>
                  <p className="text-body text-neutral-300 mb-6">
                    {selectedStage.description}
                  </p>
                </div>

                {/* Video Player */}
                {selectedStage.video_url && (
                  <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                    <div className="aspect-video">
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

                {/* Tutorial Content */}
                {selectedStage.tutorial_content && (
                  <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-6">
                    <h3 className="text-h3 text-white font-semibold mb-4">Tutorial</h3>
                    <div className="prose prose-invert max-w-none">
                      <p className="text-body text-neutral-300 whitespace-pre-wrap">
                        {selectedStage.tutorial_content}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mark Complete Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => markStageComplete(selectedStage.id)}
                    disabled={progress.find(p => p.tool_stage_id === selectedStage.id)?.status === 'completed'}
                    className="px-8 py-3 bg-primary-500 hover:bg-primary-600 disabled:bg-neutral-800 disabled:text-neutral-500 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors"
                  >
                    {progress.find(p => p.tool_stage_id === selectedStage.id)?.status === 'completed'
                      ? 'Stage Completed'
                      : 'Mark Stage Complete'}
                  </button>
                </div>

                {/* Walkthrough Section */}
                <WalkthroughSection toolName={getToolNameFromTitle(tool.title)} />

                {/* Questions Section */}
                {user && (
                  <QuestionsSection stageId={selectedStage.id} userId={user.id} />
                )}
              </>
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
