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
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Review each social media sharing scenario and decide whether it's safe or risky to share. 
          Consider privacy implications, security risks, and potential consequences.
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white border border-gray-200 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <div className="text-small font-semibold text-gray-900">Progress</div>
          <div className="text-small text-gray-600">
            {Object.keys(answers).length} of {scenarios.length} answered
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 bg-blue-600 rounded-full transition-all duration-300"
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
                  ? 'bg-white border-blue-600'
                  : 'bg-white border-gray-200'
              }`}
            >
              {/* Scenario Header */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-h3">{getContentTypeIcon(scenario.contentType)}</div>
                  <div>
                    <div className="text-small font-semibold text-blue-600">
                      {getContentTypeLabel(scenario.contentType)}
                    </div>
                    <div className="text-caption text-gray-600">{scenario.context}</div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg mb-4">
                  <div className="flex items-start gap-2 mb-2">
                    <Share2 className="w-4 h-4 text-gray-600 mt-1 flex-shrink-0" />
                    <div className="text-body text-gray-900 italic">"{scenario.content}"</div>
                  </div>
                </div>

                {/* Risk Information */}
                {scenario.risks.length > 0 && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="w-4 h-4 text-orange-600" />
                      <span className="text-small font-semibold text-orange-600">Potential Risks</span>
                    </div>
                    <ul className="space-y-1">
                      {scenario.risks.map((risk, idx) => (
                        <li key={idx} className="text-small text-gray-700 ml-6">
                          • {risk}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Safe Alternative */}
                {scenario.safeAlternative && (
                  <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-small font-semibold text-green-600">Safe Alternative</span>
                    </div>
                    <p className="text-small text-gray-700 ml-6">{scenario.safeAlternative}</p>
                  </div>
                )}

                {/* Answer Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => handleAnswer(scenario.id, true)}
                    disabled={disabled}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      userAnswer === true
                        ? 'bg-green-50 border-green-600'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <CheckCircle className={`w-5 h-5 ${
                        userAnswer === true ? 'text-green-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-small font-medium ${
                        userAnswer === true ? 'text-green-600' : 'text-gray-700'
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
                        ? 'bg-red-50 border-red-600'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <XCircle className={`w-5 h-5 ${
                        userAnswer === false ? 'text-red-600' : 'text-gray-400'
                      }`} />
                      <span className={`text-small font-medium ${
                        userAnswer === false ? 'text-red-600' : 'text-gray-700'
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
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors"
        >
          <Eye className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Sharing Safety Tips' : 'Show Sharing Safety Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-gray-700">
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
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg'
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
