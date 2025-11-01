import { useState } from 'react'
import { Share2, AlertTriangle, CheckCircle, XCircle, Eye, Users } from 'lucide-react'

interface SharingScenario {
  id: string
  content: string
  contentType: 'photo' | 'location' | 'personal-info' | 'financial' | 'work'
  context: string
  isSafeToShare: boolean
  risks: string[]
  safeAlternative?: string
}

interface SocialSharingQuizProps {
  scenarios: SharingScenario[]
  correctAnswers: Record<string, boolean>
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function SocialSharingQuiz({ scenarios, correctAnswers, onSubmit, disabled }: SocialSharingQuizProps) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({})
  const [showHint, setShowHint] = useState(false)

  const handleAnswer = (scenarioId: string, isSafe: boolean) => {
    setAnswers({
      ...answers,
      [scenarioId]: isSafe
    })
  }

  const handleSubmit = () => {
    const answerString = Object.entries(answers)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, value]) => `${id}:${value}`)
      .join(',')
    onSubmit(answerString)
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'location':
        return '📍'
      case 'photo':
        return '📷'
      case 'personal-info':
        return '👤'
      case 'financial':
        return '💳'
      case 'work':
        return '💼'
      default:
        return '📄'
    }
  }

  const getContentTypeLabel = (type: string) => {
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Review each social media sharing scenario and decide whether it's safe or risky to share. 
          Consider privacy implications, security risks, and potential consequences.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-small font-semibold text-neutral-100">Progress</div>
          <div className="text-small text-neutral-400">
            {Object.keys(answers).length} of {scenarios.length} answered
          </div>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-2">
          <div
            className="h-2 bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(answers).length / scenarios.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Scenarios */}
      <div className="space-y-4">
        {scenarios.map((scenario) => {
          const userAnswer = answers[scenario.id]
          const hasAnswered = userAnswer !== undefined

          return (
            <div
              key={scenario.id}
              className={`border-2 rounded-lg overflow-hidden transition-all ${
                hasAnswered
                  ? 'bg-neutral-800 border-primary-500'
                  : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              {/* Scenario Header */}
              <div className="p-4 bg-neutral-900 border-b border-neutral-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-h3">{getContentTypeIcon(scenario.contentType)}</div>
                  <div>
                    <div className="text-small font-semibold text-primary-400">
                      {getContentTypeLabel(scenario.contentType)}
                    </div>
                    <div className="text-caption text-neutral-400">{scenario.context}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="bg-neutral-900 border border-neutral-700 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Share2 className="w-4 h-4 text-neutral-400 mt-1 flex-shrink-0" />
                    <div className="text-body text-neutral-100 italic">"{scenario.content}"</div>
                  </div>
                </div>

                {/* Risk Information */}
                {scenario.risks.length > 0 && (
                  <div className="bg-warning-900/20 border border-warning-700 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-warning-400" />
                      <span className="text-small font-semibold text-warning-400">Potential Risks</span>
                    </div>
                    <ul className="space-y-1">
                      {scenario.risks.map((risk, idx) => (
                        <li key={idx} className="text-small text-neutral-300 ml-6">
                          • {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safe Alternative */}
                {scenario.safeAlternative && (
                  <div className="bg-success-900/20 border border-success-700 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-success-400" />
                      <span className="text-small font-semibold text-success-400">Safe Alternative</span>
                    </div>
                    <p className="text-small text-neutral-300 ml-6">{scenario.safeAlternative}</p>
                  </div>
                )}

                {/* Answer Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(scenario.id, true)}
                    disabled={disabled}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      userAnswer === true
                        ? 'bg-success-900/30 border-success-500'
                        : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${
                        userAnswer === true ? 'text-success-400' : 'text-neutral-400'
                      }`} />
                      <span className={`text-small font-medium ${
                        userAnswer === true ? 'text-success-400' : 'text-neutral-300'
                      }`}>
                        Safe to Share
                      </span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleAnswer(scenario.id, false)}
                    disabled={disabled}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      userAnswer === false
                        ? 'bg-error-900/30 border-error-500'
                        : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className={`w-5 h-5 ${
                        userAnswer === false ? 'text-error-400' : 'text-neutral-400'
                      }`} />
                      <span className={`text-small font-medium ${
                        userAnswer === false ? 'text-error-400' : 'text-neutral-300'
                      }`}>
                        Risky to Share
                      </span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hint Section */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-warning-400 hover:text-warning-300 transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Sharing Safety Tips' : 'Show Sharing Safety Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Never share real-time location publicly</p>
            <p>• Avoid posting vacation plans before traveling</p>
            <p>• Don't share financial or sensitive personal information</p>
            <p>• Be cautious with photos that reveal personal details</p>
            <p>• Check privacy settings before posting</p>
            <p>• Consider who can see your posts (public vs. friends)</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== scenarios.length || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          Object.keys(answers).length !== scenarios.length || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled 
          ? 'Submitting...' 
          : Object.keys(answers).length !== scenarios.length
          ? `Answer all scenarios (${Object.keys(answers).length}/${scenarios.length})`
          : 'Submit Answers'}
      </button>
    </div>
  )
}
