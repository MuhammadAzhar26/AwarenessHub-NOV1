import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface FillBlankQuestionProps {
  question: string
  prefix?: string
  suffix?: string
  placeholder?: string
  correctAnswer: string
  alternatives?: string[]
  explanation: string
  onAnswer: (isCorrect: boolean, answer: string) => void
  disabled?: boolean
}

export default function FillBlankQuestion({
  question,
  prefix = '',
  suffix = '',
  placeholder = 'Enter your answer',
  correctAnswer,
  alternatives = [],
  explanation,
  onAnswer,
  disabled = false
}: FillBlankQuestionProps) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (!answer.trim()) return

    const userAnswer = answer.trim().toLowerCase()
    const correctAnswerLower = correctAnswer.toLowerCase()
    const alternativesLower = alternatives.map(alt => alt.toLowerCase())

    const correct = 
      userAnswer === correctAnswerLower || 
      alternativesLower.includes(userAnswer)

    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(correct, answer)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !submitted) {
      handleSubmit()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-h3 font-semibold text-neutral-100 mb-6">
        {question}
      </div>

      <div className="bg-neutral-900 p-6 rounded-lg border border-neutral-800">
        <div className="font-mono text-body text-neutral-100 flex items-center gap-2 flex-wrap">
          {prefix && <span className="text-primary-400">{prefix}</span>}
          <input
            type="text"
            value={answer}
            onChange={(e) => !submitted && setAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={submitted || disabled}
            className={`px-3 py-2 bg-neutral-800 border-2 rounded ${
              submitted
                ? isCorrect
                  ? 'border-green-500 bg-green-500/10'
                  : 'border-red-500 bg-red-500/10'
                : 'border-neutral-700 focus:border-primary-500'
            } focus:outline-none transition-colors font-mono text-neutral-100 min-w-[200px]`}
          />
          {suffix && <span className="text-primary-400">{suffix}</span>}
        </div>
      </div>

      {submitted && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'}`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
              {!isCorrect && (
                <div className="text-small text-neutral-300 mb-2">
                  <span className="font-semibold">Correct answer:</span> {correctAnswer}
                </div>
              )}
              <div className="text-small text-neutral-300">{explanation}</div>
            </div>
          </div>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || disabled}
          className="w-full px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}
    </div>
  )
}
