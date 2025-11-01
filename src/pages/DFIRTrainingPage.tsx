import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { Search, CheckCircle, Play } from 'lucide-react'

interface DFIRModule {
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
  dfir_module_id: number
  completed_count: number
}

export default function DFIRTrainingPage() {
  const { user } = useAuth()
  const [modules, setModules] = useState<DFIRModule[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadModules() {
      if (!user) return

      try {
        // Load DFIR modules
        const { data: modulesData } = await supabase
          .from('dfir_modules')
          .select('*')
          .order('order_index')

        setModules(modulesData || [])

        // Load user progress
        const { data: progressData } = await supabase
          .from('user_dfir_progress')
          .select('dfir_stage_id, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')

        // Get stages to map to modules
        if (progressData && progressData.length > 0) {
          const stageIds = progressData.map(p => p.dfir_stage_id)
          const { data: stagesData } = await supabase
            .from('dfir_stages')
            .select('id, dfir_module_id')
            .in('id', stageIds)

          // Count completed stages per module
          const progressMap: { [key: number]: number } = {}
          stagesData?.forEach(stage => {
            progressMap[stage.dfir_module_id] = (progressMap[stage.dfir_module_id] || 0) + 1
          })

          const progressArray = Object.entries(progressMap).map(([moduleId, count]) => ({
            dfir_module_id: parseInt(moduleId),
            completed_count: count
          }))

          setProgress(progressArray)
        }
      } catch (error) {
        console.error('Error loading DFIR modules:', error)
      } finally {
        setLoading(false)
      }
    }

    loadModules()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Loading DFIR modules...</div>
        </div>
      </div>
    )
  }

  // Group modules by category
  const categories = Array.from(new Set(modules.map(m => m.category)))

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      
      <div className="container mx-auto py-8">
        {/* Page Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-12 h-12 text-primary-500" />
            <h1 className="text-h1 font-bold text-neutral-100">
              Digital Forensics & Incident Response
            </h1>
          </div>
          <p className="text-body-lg text-neutral-400 max-w-3xl">
            Master digital forensics and incident response through comprehensive video tutorials,
            real-world scenarios, and hands-on investigations. From evidence collection to threat hunting.
          </p>
        </div>

        {/* Modules by Category */}
        {categories.map((category) => {
          const categoryModules = modules.filter(m => m.category === category)
          
          return (
            <div key={category} className="mb-12">
              <h2 className="text-h2 font-bold text-neutral-100 mb-6">{category}</h2>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryModules.map((module) => {
                  const moduleProgress = progress.find(p => p.dfir_module_id === module.id)
                  const completedStages = moduleProgress?.completed_count || 0
                  const progressPercent = (completedStages / module.total_stages) * 100
                  const isCompleted = completedStages === module.total_stages

                  return (
                    <Link
                      key={module.id}
                      to={`/dfir/${module.id}`}
                      className="bg-neutral-900 p-6 rounded-lg border border-neutral-800 hover:border-primary-500 hover:shadow-dark-card-hover transition-all duration-250 hover:-translate-y-1 group"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-primary-900/30 rounded-lg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                          <Search className="w-6 h-6 text-primary-500 group-hover:text-white" />
                        </div>
                        {isCompleted && <CheckCircle className="w-6 h-6 text-success-600" />}
                      </div>
                      
                      <h3 className="text-body font-semibold text-neutral-100 mb-2">{module.title}</h3>
                      <p className="text-small text-neutral-400 mb-4 line-clamp-2">{module.description}</p>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <Play className="w-4 h-4 text-primary-500" />
                        <span className="text-small text-neutral-400">Video Tutorial Included</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-small text-neutral-400">
                          <span>{completedStages}/{module.total_stages} stages</span>
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
                          module.difficulty === 'Beginner' ? 'bg-success-50 text-success-600' :
                          module.difficulty === 'Intermediate' ? 'bg-warning-50 text-warning-700' :
                          'bg-error-50 text-error-600'
                        }`}>
                          {module.difficulty}
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
