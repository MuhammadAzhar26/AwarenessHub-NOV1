import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import Navigation from '@/components/Navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, HelpCircle, Send, CheckCircle, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import MatchingChallenge from '@/components/challenges/MatchingChallenge'
import ScenarioChallenge from '@/components/challenges/ScenarioChallenge'
import DragDropChallenge from '@/components/challenges/DragDropChallenge'
import CodeAnalysisChallenge from '@/components/challenges/CodeAnalysisChallenge'
import CaesarCipher from '@/components/challenges/CaesarCipher'
import PasswordBuilder from '@/components/challenges/PasswordBuilder'
import EmailDetective from '@/components/challenges/EmailDetective'
import WebsiteComparison from '@/components/challenges/WebsiteComparison'
import HTTPSDemo from '@/components/challenges/HTTPSDemo'
import WiFiSafety from '@/components/challenges/WiFiSafety'
import LinkSafety from '@/components/challenges/LinkSafety'
import BrowserSecurity from '@/components/challenges/BrowserSecurity'
import PrivacySettings from '@/components/challenges/PrivacySettings'
import SocialSharingQuiz from '@/components/challenges/SocialSharingQuiz'
import FakeProfileAnalysis from '@/components/challenges/FakeProfileAnalysis'
import DigitalFootprintCleanup from '@/components/challenges/DigitalFootprintCleanup'
import MalwareEducation from '@/components/challenges/MalwareEducation'
import InfectionSigns from '@/components/challenges/InfectionSigns'
import AntivirusDemo from '@/components/challenges/AntivirusDemo'

interface Stage {
  id: number
  module_id: number
  stage_number: number
  title: string
  description: string
  scenario: string
  challenge_type: string
  challenge_data?: any
  points: number
}

interface Hint {
  id: number
  hint_number: number
  hint_text: string
  penalty_points: number
}

export default function ChallengePage() {
  const { moduleId, stageId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [stage, setStage] = useState<Stage | null>(null)
  const [hints, setHints] = useState<Hint[]>([])
  const [answer, setAnswer] = useState('')
  const [usedHints, setUsedHints] = useState<number[]>([])
  const [expandedHints, setExpandedHints] = useState<number[]>([])
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    async function loadChallenge() {
      if (!stageId || !user) return

      try {
        // Load stage
        const { data: stageData } = await supabase
          .from('stages')
          .select('*')
          .eq('id', stageId)
          .maybeSingle()

        setStage(stageData)

        // Load hints
        const { data: hintsData } = await supabase
          .from('hints')
          .select('*')
          .eq('stage_id', stageId)
          .order('hint_number')

        setHints(hintsData || [])

        // Load user progress
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('hints_used, status')
          .eq('user_id', user.id)
          .eq('stage_id', stageId)
          .maybeSingle()

        if (progressData?.hints_used) {
          setUsedHints(progressData.hints_used)
        }

        if (progressData?.status === 'completed') {
          setFeedback({
            type: 'success',
            message: 'You have already completed this challenge!'
          })
        }
      } catch (error) {
        console.error('Error loading challenge:', error)
      } finally {
        setLoading(false)
      }
    }

    loadChallenge()
  }, [stageId, user])

  async function useHint(hintNumber: number) {
    if (usedHints.includes(hintNumber)) {
      // Already used, just toggle display
      if (expandedHints.includes(hintNumber)) {
        setExpandedHints(expandedHints.filter(h => h !== hintNumber))
      } else {
        setExpandedHints([...expandedHints, hintNumber])
      }
      return
    }

    // Use hint for first time
    setUsedHints([...usedHints, hintNumber])
    setExpandedHints([...expandedHints, hintNumber])
  }

  async function handleSubmit(answerValue?: string) {
    const submitAnswer = answerValue || answer
    if (!stage || !user || !submitAnswer.trim()) return

    setSubmitting(true)
    setFeedback(null)

    try {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)

      const { data, error } = await supabase.functions.invoke('submit-answer', {
        body: {
          stageId: stage.id,
          userId: user.id, // Add missing userId
          answer: submitAnswer.trim(),
          hintsUsed: usedHints,
          timeSpent
        }
      })

      if (error) throw error

      const result = data?.data || data

      if (result.correct) {
        const hintCount = usedHints.length
        let feedbackMessage = `Correct! You earned ${result.points_earned} points!`
        
        if (hintCount > 0) {
          const penaltyAmount = hintCount * 5 // 5 points per hint
          feedbackMessage += ` (Hint penalty: -${penaltyAmount} points for ${hintCount} hint${hintCount > 1 ? 's' : ''} used)`
        }
        
        setFeedback({
          type: 'success',
          message: feedbackMessage
        })

        // Wait 2 seconds then navigate back to module
        setTimeout(() => {
          navigate(`/module/${moduleId}`)
        }, 2000)
      } else {
        setFeedback({
          type: 'error',
          message: result.message || 'Incorrect answer. Try again!'
        })
        setAnswer('')
      }
    } catch (error: any) {
      console.error('Submission error:', error)
      setFeedback({
        type: 'error',
        message: error.message || 'Failed to submit answer'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSubmit()
  }

  const handleInteractiveSubmit = (answer: string) => {
    handleSubmit(answer)
  }

  const renderChallengeInterface = () => {
    if (!stage) return null

    const challengeType = stage.challenge_type || 'text'

    switch (challengeType) {
      case 'matching':
        return (
          <MatchingChallenge
            pairs={stage.challenge_data?.pairs || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'scenario':
        return (
          <ScenarioChallenge
            sections={stage.challenge_data?.sections || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'drag-drop':
        return (
          <DragDropChallenge
            items={stage.challenge_data?.items || []}
            zones={stage.challenge_data?.zones || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'code-analysis':
        return (
          <CodeAnalysisChallenge
            code={stage.challenge_data?.code || ''}
            issues={stage.challenge_data?.issues || []}
            language={stage.challenge_data?.language}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'caesar-cipher':
        return (
          <CaesarCipher
            plaintext={stage.challenge_data?.plaintext || ''}
            correctShift={stage.challenge_data?.correctShift || 0}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'password-builder':
        return (
          <PasswordBuilder
            minStrength={stage.challenge_data?.minStrength || 70}
            requiresLength={stage.challenge_data?.requiresLength || 12}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'email-detective':
        return (
          <EmailDetective
            emailContent={stage.challenge_data?.emailContent || {}}
            clues={stage.challenge_data?.clues || []}
            correctClueIds={stage.challenge_data?.correctClueIds || []}
            requiredClues={stage.challenge_data?.requiredClues || 3}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'website-comparison':
        return (
          <WebsiteComparison
            features={stage.challenge_data?.features || []}
            correctAnswer={stage.challenge_data?.correctAnswer || 'left'}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'https-demo':
        return (
          <HTTPSDemo
            sensitiveData={stage.challenge_data?.sensitiveData || []}
            correctAnswer={stage.challenge_data?.correctAnswer || 'https'}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'wifi-safety':
        return (
          <WiFiSafety
            scenarios={stage.challenge_data?.scenarios || []}
            correctAnswers={stage.challenge_data?.correctAnswers || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'link-safety':
        return (
          <LinkSafety
            links={stage.challenge_data?.links || []}
            correctAnswers={stage.challenge_data?.correctAnswers || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'browser-security':
        return (
          <BrowserSecurity
            settings={stage.challenge_data?.settings || []}
            correctSettings={stage.challenge_data?.correctSettings || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'privacy-settings':
        return (
          <PrivacySettings
            privacyOptions={stage.challenge_data?.privacyOptions || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'social-sharing-quiz':
        return (
          <SocialSharingQuiz
            scenarios={stage.challenge_data?.scenarios || []}
            correctAnswers={stage.challenge_data?.correctAnswers || {}}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'fake-profile-analysis':
        return (
          <FakeProfileAnalysis
            profileData={stage.challenge_data?.profileData || {}}
            redFlags={stage.challenge_data?.redFlags || []}
            correctFlags={stage.challenge_data?.correctFlags || []}
            minRequiredFlags={stage.challenge_data?.minRequiredFlags || 3}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'digital-footprint-cleanup':
        return (
          <DigitalFootprintCleanup
            footprints={stage.challenge_data?.footprints || []}
            correctRemovals={stage.challenge_data?.correctRemovals || []}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'malware-education':
        return (
          <MalwareEducation
            malwareTypes={stage.challenge_data?.malwareTypes || []}
            requiredLearning={stage.challenge_data?.requiredLearning || 3}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'infection-signs':
        return (
          <InfectionSigns
            signs={stage.challenge_data?.signs || []}
            correctSigns={stage.challenge_data?.correctSigns || []}
            minCorrectIdentifications={stage.challenge_data?.minCorrectIdentifications || 3}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'antivirus-demo':
        return (
          <AntivirusDemo
            features={stage.challenge_data?.features || []}
            correctFeatures={stage.challenge_data?.correctFeatures || []}
            minRequired={stage.challenge_data?.minRequired || 3}
            onSubmit={handleInteractiveSubmit}
            disabled={submitting}
          />
        )

      case 'text':
      default:
        return (
          <form onSubmit={handleTextSubmit} className="space-y-3">
            <label htmlFor="answer" className="block text-body font-semibold text-neutral-100 mb-3">
              Your Answer
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter your answer..."
                className="flex-1 px-4 py-3 border-2 border-neutral-700 rounded-md focus:border-primary-500 focus:outline-none transition-colors font-mono bg-neutral-900 text-neutral-100"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !answer.trim()}
                className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                {submitting ? 'Checking...' : 'Submit'}
              </button>
            </div>
          </form>
        )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Loading challenge...</div>
        </div>
      </div>
    )
  }

  if (!stage) {
    return (
      <div className="min-h-screen bg-neutral-950">
        <Navigation />
        <div className="container mx-auto py-16 text-center">
          <div className="text-neutral-400">Challenge not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Navigation />
      
      <div className="container mx-auto py-8">
        <Link
          to={`/module/${moduleId}`}
          className="inline-flex items-center gap-2 text-body text-neutral-400 hover:text-primary-500 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Module
        </Link>

        <div className="max-w-4xl mx-auto">
          {/* Challenge Header */}
          <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 shadow-dark-card mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-h2 font-bold text-neutral-100">
                Stage {stage.stage_number}: {stage.title}
              </h1>
              <div className="bg-primary-100 text-primary-500 px-4 py-2 rounded-full text-body font-semibold">
                {stage.points} pts
              </div>
            </div>
            <p className="text-body text-neutral-400">{stage.description}</p>
            {hints.length > 0 && (
              <div className="mt-4 p-3 bg-warning-900/20 border border-warning-600 rounded-md">
                <p className="text-small text-warning-300">
                  💡 Using hints will deduct points: Hint 1 (-5pts), Hint 2 (-10pts), Hint 3 (-15pts)
                </p>
              </div>
            )}
          </div>

          {/* Scenario */}
          <div className="bg-neutral-800 p-8 rounded-lg mb-6 border border-neutral-700">
            <h2 className="text-body font-semibold text-neutral-100 mb-3">Challenge Scenario</h2>
            <p className="text-body text-neutral-100 leading-relaxed whitespace-pre-wrap">{stage.scenario}</p>
          </div>

          {/* Challenge Interface */}
          <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 shadow-dark-card mb-6">
            {renderChallengeInterface()}
          </div>

          {/* Feedback */}
          {feedback && (
            <div className={`p-6 rounded-lg mb-6 flex items-center gap-3 ${
              feedback.type === 'success' 
                ? 'bg-success-900/20 border border-success-600' 
                : 'bg-error-900/20 border border-error-600'
            }`}>
              {feedback.type === 'success' ? (
                <CheckCircle className="w-6 h-6 text-success-600 flex-shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-error-600 flex-shrink-0" />
              )}
              <p className={`text-body font-medium ${
                feedback.type === 'success' ? 'text-success-400' : 'text-error-400'
              }`}>
                {feedback.message}
              </p>
            </div>
          )}

          {/* Hints System */}
          <div className="bg-neutral-900 p-8 rounded-lg border border-neutral-800 shadow-dark-card">
            <h2 className="text-body font-semibold text-neutral-100 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary-500" />
              Hints ({usedHints.length}/3 used)
            </h2>
            
            {hints.length === 0 ? (
              <div className="text-center py-8">
                <HelpCircle className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-body text-neutral-400">No hints available for this challenge.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {hints.map((hint) => {
                  const isUsed = usedHints.includes(hint.hint_number)
                  const isExpanded = expandedHints.includes(hint.hint_number)

                  return (
                    <div key={hint.id} className="border border-neutral-700 rounded-md overflow-hidden">
                      <button
                        onClick={() => useHint(hint.hint_number)}
                        className="hint-button w-full px-4 py-3 flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                        style={{ display: 'flex', visibility: 'visible', opacity: 1 }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                            isUsed 
                              ? 'bg-warning-900 text-warning-300' 
                              : 'bg-primary-900 text-primary-300'
                          }`}>
                            {hint.hint_number}
                          </div>
                          <span className="text-body font-medium text-neutral-100">
                            {isUsed ? 'Revealed Hint' : `Hint ${hint.hint_number}`}
                          </span>
                          <span className="text-small text-warning-400 font-medium bg-warning-900/20 px-2 py-1 rounded">
                            -{hint.penalty_points} pts
                          </span>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5 text-neutral-300" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-neutral-300" />
                        )}
                      </button>
                      
                      {isExpanded && (
                        <div className="px-4 py-3 bg-neutral-900 border-t border-neutral-700">
                          <p className="text-body text-neutral-100 leading-relaxed">{hint.hint_text}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
