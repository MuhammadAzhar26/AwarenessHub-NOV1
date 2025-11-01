import { useEffect, useState, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, Circle, Play, Trophy } from 'lucide-react'
import QuizModal from '@/components/quiz/QuizModal'
import TranscriptPanel from '@/components/quiz/TranscriptPanel'

interface ToolModule {
  id: number
  title: string
  description: string
  category: string
  difficulty: string
  video_url: string
}

interface ToolStage {
  id: number
  stage_number: number
  title: string
  description: string
  content: string
  video_url: string
  estimated_duration: number
}

interface UserProgress {
  tool_stage_id: number
  status: string
  video_completed: boolean
}

interface Quiz {
  id: number
  trigger_timestamp: number
  trigger_percentage: number
  points: number
  difficulty: string
  questions: any[]
}

interface TranscriptSection {
  id: number
  start_time: number
  end_time: number
  section_title: string
  content: string
  code_examples: any[]
  order_index: number
}

// Declare YouTube IFrame API types
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function ToolDetailPage() {
  const { toolId } = useParams()
  const { user } = useAuth()
  const [tool, setTool] = useState<ToolModule | null>(null)
  const [stages, setStages] = useState<ToolStage[]>([])
  const [progress, setProgress] = useState<UserProgress[]>([])
  const [selectedStage, setSelectedStage] = useState<ToolStage | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Quiz and transcript state
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [transcripts, setTranscripts] = useState<TranscriptSection[]>([])
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [completedQuizzes, setCompletedQuizzes] = useState<number[]>([])
  const [showQuizModal, setShowQuizModal] = useState(false)
  
  // YouTube Player state
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)
  const [playerReady, setPlayerReady] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const timeCheckInterval = useRef<NodeJS.Timeout | null>(null)

  // Load YouTube IFrame API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

      window.onYouTubeIframeAPIReady = () => {
        console.log('YouTube IFrame API Ready')
      }
    }
  }, [])

  useEffect(() => {
    async function loadToolData() {
      if (!user || !toolId) return

      try {
        const { data: toolData } = await supabase
          .from('tool_modules')
          .select('*')
          .eq('id', toolId)
          .single()

        setTool(toolData)

        const { data: stagesData } = await supabase
          .from('tool_stages')
          .select('*')
          .eq('tool_module_id', toolId)
          .order('stage_number')

        setStages(stagesData || [])
        if (stagesData && stagesData.length > 0) {
          setSelectedStage(stagesData[0])
        }

        const { data: progressData } = await supabase
          .from('user_tool_progress')
          .select('*')
          .eq('user_id', user.id)
          .in('tool_stage_id', stagesData?.map(s => s.id) || [])

        setProgress(progressData || [])
      } catch (error) {
        console.error('Error loading tool data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadToolData()
  }, [user, toolId])

  useEffect(() => {
    async function loadQuizzesAndTranscripts() {
      if (!selectedStage) return

      try {
        const { data: quizzesData } = await supabase
          .from('quizzes')
          .select(`
            id,
            trigger_timestamp,
            trigger_percentage,
            points,
            difficulty,
            quiz_questions (
              id,
              question_text,
              question_type,
              question_data,
              correct_answer,
              explanation,
              points,
              order_index
            )
          `)
          .eq('tool_stage_id', selectedStage.id)
          .order('trigger_percentage')

        if (quizzesData) {
          const formattedQuizzes = quizzesData.map(quiz => ({
            ...quiz,
            questions: (quiz as any).quiz_questions || []
          }))
          setQuizzes(formattedQuizzes as any)
        }

        const { data: transcriptsData } = await supabase
          .from('video_transcripts')
          .select('*')
          .eq('tool_stage_id', selectedStage.id)
          .order('order_index')

        setTranscripts(transcriptsData || [])
        setCompletedQuizzes([])
        
        // Reset player when stage changes
        if (playerRef.current) {
          playerRef.current.destroy()
          playerRef.current = null
          setPlayerReady(false)
        }
      } catch (error) {
        console.error('Error loading quizzes and transcripts:', error)
      }
    }

    loadQuizzesAndTranscripts()
  }, [selectedStage])

  // Initialize YouTube Player when stage is selected
  useEffect(() => {
    if (!selectedStage || !window.YT || playerRef.current) return

    const videoId = extractYouTubeVideoId(selectedStage.video_url)
    if (!videoId) return

    const initPlayer = () => {
      if (!playerContainerRef.current) return

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 0,
          controls: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      })
    }

    if (window.YT && window.YT.Player) {
      initPlayer()
    } else {
      window.onYouTubeIframeAPIReady = initPlayer
    }

    return () => {
      if (timeCheckInterval.current) {
        clearInterval(timeCheckInterval.current)
      }
    }
  }, [selectedStage])

  const extractYouTubeVideoId = (url: string): string | null => {
    const match = url.match(/embed\/([^?]+)/)
    return match ? match[1] : null
  }

  const onPlayerReady = () => {
    setPlayerReady(true)
    startTimeChecking()
  }

  const onPlayerStateChange = (event: any) => {
    // 1 = playing, 2 = paused
    setIsPlaying(event.data === 1)
    
    if (event.data === 1) {
      startTimeChecking()
    } else {
      stopTimeChecking()
    }
  }

  const startTimeChecking = () => {
    if (timeCheckInterval.current) {
      clearInterval(timeCheckInterval.current)
    }

    timeCheckInterval.current = setInterval(() => {
      checkForQuizTrigger()
    }, 1000) // Check every second
  }

  const stopTimeChecking = () => {
    if (timeCheckInterval.current) {
      clearInterval(timeCheckInterval.current)
      timeCheckInterval.current = null
    }
  }

  const checkForQuizTrigger = () => {
    if (!playerRef.current || !playerReady || showQuizModal) return

    try {
      const currentTime = playerRef.current.getCurrentTime()
      
      // Check if any quiz should be triggered
      const quizToTrigger = quizzes.find(quiz => {
        const alreadyCompleted = completedQuizzes.includes(quiz.id)
        const timeMatches = Math.abs(currentTime - quiz.trigger_timestamp) < 2 // Within 2 seconds
        return !alreadyCompleted && timeMatches
      })

      if (quizToTrigger) {
        // Pause the video
        playerRef.current.pauseVideo()
        
        // Show quiz modal
        setCurrentQuiz(quizToTrigger)
        setShowQuizModal(true)
      }
    } catch (error) {
      console.error('Error checking quiz trigger:', error)
    }
  }

  const handleJumpToTimestamp = (timestamp: number) => {
    if (playerRef.current && playerReady) {
      playerRef.current.seekTo(timestamp, true)
      playerRef.current.playVideo()
    }
  }

  const handleQuizComplete = async (points: number, correct: boolean) => {
    if (!currentQuiz || !user) return

    setCompletedQuizzes([...completedQuizzes, currentQuiz.id])
    setShowQuizModal(false)
    
    // Resume video playback
    if (playerRef.current && playerReady) {
      playerRef.current.playVideo()
    }
    
    setCurrentQuiz(null)

    try {
      await supabase.rpc('increment_user_points', {
        user_id: user.id,
        points_to_add: points
      })
    } catch (error) {
      console.error('Error awarding points:', error)
    }
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
      
      {showQuizModal && currentQuiz && (
        <QuizModal
          quiz={currentQuiz}
          onComplete={handleQuizComplete}
        />
      )}
      
      <div className="container mx-auto py-8">
        <Link
          to="/tools"
          className="inline-flex items-center gap-2 text-body text-primary-400 hover:text-primary-300 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Tools Training
        </Link>

        <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-h1 font-bold text-neutral-100 mb-2">{tool.title}</h1>
              <p className="text-body text-neutral-400 mb-4">{tool.description}</p>
              <div className="flex items-center gap-4">
                <span className={`inline-block px-3 py-1 rounded-full text-caption font-medium ${
                  tool.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                  tool.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {tool.difficulty}
                </span>
                <span className="text-small text-neutral-400">{tool.category}</span>
                {quizzes.length > 0 && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-500/20 text-primary-400 text-caption font-medium">
                    <Trophy className="w-3 h-3" />
                    {quizzes.length} Interactive Quizzes
                  </span>
                )}
              </div>
            </div>
          </div>

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
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
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

          <div className="lg:col-span-2 space-y-6">
            {selectedStage ? (
              <>
                <div className="bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden">
                  <div className="aspect-video bg-neutral-900 relative">
                    <div ref={playerContainerRef} className="w-full h-full" />
                  </div>
                  
                  {quizzes.length > 0 && (
                    <div className="p-3 bg-neutral-800/50 border-t border-neutral-700">
                      <div className="flex items-center justify-between text-caption text-neutral-400 mb-2">
                        <span>Quizzes will auto-trigger during video</span>
                        <span>{completedQuizzes.length}/{quizzes.length} Completed</span>
                      </div>
                      <div className="flex gap-2">
                        {quizzes.map((quiz, idx) => (
                          <button
                            key={quiz.id}
                            onClick={() => {
                              if (!completedQuizzes.includes(quiz.id) && playerRef.current) {
                                playerRef.current.pauseVideo()
                                setCurrentQuiz(quiz)
                                setShowQuizModal(true)
                              }
                            }}
                            className={`flex-1 px-2 py-1 rounded text-caption font-medium transition-colors ${
                              completedQuizzes.includes(quiz.id)
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-primary-500/20 text-primary-400 hover:bg-primary-500/30'
                            }`}
                            title={`Auto-triggers at ${Math.floor(quiz.trigger_timestamp / 60)}:${(quiz.trigger_timestamp % 60).toString().padStart(2, '0')}`}
                          >
                            {completedQuizzes.includes(quiz.id) ? '✓' : `Q${idx + 1}`} @ {quiz.trigger_percentage}%
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {transcripts.length > 0 && (
                  <TranscriptPanel
                    transcripts={transcripts}
                    onTimestampClick={handleJumpToTimestamp}
                  />
                )}

                <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-h2 font-bold text-neutral-100 mb-2">
                        Stage {selectedStage.stage_number}: {selectedStage.title}
                      </h2>
                      <p className="text-body text-neutral-400 mb-4">{selectedStage.description}</p>
                    </div>
                  </div>

                  <div className="prose prose-neutral max-w-none mb-6">
                    <div dangerouslySetInnerHTML={{ __html: selectedStage.content }} />
                  </div>

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
                    <div className="w-full px-6 py-3 bg-green-500/10 border border-green-500 text-green-400 rounded-lg flex items-center justify-center gap-2">
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
