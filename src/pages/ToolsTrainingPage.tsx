import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Wrench, Lock, CheckCircle, Play } from 'lucide-react'

interface ToolModule {
  id: number
  title: string
  category: string
  description: string
  difficulty: string
  video_url: string
  icon: string
  total_stages: number
}

interface UserProgress {
  tool_module_id: number
  completed_count: number
}

export default function ToolsTrainingPage() {
  const { user } = useAuth()
  const [tools, setTools] = useState<ToolModule[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTools() {
      if (!user) return

      try {
        // Load tool modules
        const { data: toolsData } = await supabase
          .from('tool_modules')
          .select('*')
          .order('order_index')

        setTools(toolsData || [])

        // Load user progress
        const { data: progressData } = await supabase
          .from('user_tool_progress')
          .select('tool_stage_id, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')

        // Get stages to map to modules
        if (progressData && progressData.length > 0) {
          const stageIds = progressData.map(p => p.tool_stage_id)
          const { data: stagesData } = await supabase
            .from('tool_stages')
            .select('id, tool_module_id')
            .in('id', stageIds)

          // Count completed stages per module
          const progressMap: { [key: number]: number } = {}
          stagesData?.forEach(stage => {
            progressMap[stage.tool_module_id] = (progressMap[stage.tool_module_id] || 0) + 1
          })

          const progressArray = Object.entries(progressMap).map(([moduleId, count]) => ({
            tool_module_id: parseInt(moduleId),
            completed_count: count
          }))

          setProgress(progressArray)
        }
      } catch (error) {
        console.error('Error loading tools:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTools()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Loading tools...</div>
        </div>
      </div>
    )
  }

  // Group tools by category
  const categories = Array.from(new Set(tools.map(t => t.category)))

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-12 h-12 text-primary-500" />
            <h1 className="text-h1 font-bold text-neutral-100">
              Cybersecurity Tools Training
            </h1>
          </div>
          <p className="text-body-lg text-neutral-400 max-w-3xl">
            Master essential cybersecurity tools through hands-on video tutorials, 
            interactive labs, and practical challenges. From network analysis to penetration testing.
          </p>
        </div>

        {/* Tools by Category */}
        {categories.map((category) => {
          const categoryTools = tools.filter(t => t.category === category)
          
          return (
            <div key={category} className="mb-12">
              <h2 className="text-h2 font-bold text-neutral-100 mb-6">{category}</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryTools.map((tool) => {
                  const toolProgress = progress.find(p => p.tool_module_id === tool.id)
                  const completedStages = toolProgress?.completed_count || 0
                  const progressPercent = (completedStages / tool.total_stages) * 100
                  const isCompleted = completedStages === tool.total_stages

                  return (
                    <Link
                      key={tool.id}
                      to={`/tools-training/${tool.id}`}
                      className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-primary-500 hover:shadow-dark-card-hover transition-all duration-250 hover:-translate-y-1 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                          <Wrench className="w-6 h-6 text-primary-500 group-hover:text-white" />
                        </div>
                        {isCompleted && <CheckCircle className="w-6 h-6 text-success-600" />}
                      </div>
                      
                      <h3 className="text-body font-semibold text-neutral-100 mb-2">{tool.title}</h3>
                      <p className="text-small text-neutral-400 mb-4 line-clamp-2">{tool.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Play className="w-4 h-4 text-primary-500" />
                        <span className="text-small text-neutral-400">Video Tutorial Included</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-small text-neutral-400">
                          <span>{completedStages}/{tool.total_stages} stages</span>
                          <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary-500 transition-all duration-300"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-caption font-medium ${
                          tool.difficulty === 'Beginner' ? 'bg-success-50 text-success-600' :
                          tool.difficulty === 'Intermediate' ? 'bg-warning-50 text-warning-700' :
                          'bg-error-50 text-error-600'
                        }`}>
                          {tool.difficulty}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
