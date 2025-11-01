import { useState } from 'react'
import { CheckCircle, XCircle } from 'lucide-react'

interface Option {
  id: string
  text: string
}

interface MultipleChoiceQuestionProps {
  question: string
  options: Option[]
  correctAnswer: string
  explanation: string
  onAnswer: (isCorrect: boolean, answer: string) => void
  disabled?: boolean
}

export default function MultipleChoiceQuestion({
  question,
  options,
  correctAnswer,
  explanation,
  onAnswer,
  disabled = false
}: MultipleChoiceQuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  const handleSubmit = () => {
    if (!selectedOption) return

    const correct = selectedOption === correctAnswer
    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(correct, selectedOption)
  }

  return (
    <div className="space-y-6">
      <div className="text-h3 font-semibold text-neutral-100 mb-6">
        {question}
      </div>

      <div className="space-y-3">
        {options.map((option) => {
          const isSelected = selectedOption === option.id
          const showCorrect = submitted && option.id === correctAnswer
          const showIncorrect = submitted && isSelected && !isCorrect

          return (
            <button
              key={option.id}
              onClick={() => !submitted && setSelectedOption(option.id)}
              disabled={submitted || disabled}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                showCorrect
                  ? 'border-green-500 bg-green-500/10'
                  : showIncorrect
                  ? 'border-red-500 bg-red-500/10'
                  : isSelected
                  ? 'border-primary-500 bg-primary-500/10'
                  : 'border-neutral-700 bg-neutral-800 hover:border-neutral-600'
              } ${submitted || disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-body text-neutral-100">{option.text}</span>
                {showCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                {showIncorrect && <XCircle className="w-5 h-5 text-red-500" />}
              </div>
            </button>
          )
        })}
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
              <div className="text-small text-neutral-300">{explanation}</div>
            </div>
          </div>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={!selectedOption || disabled}
          className="w-full px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}
    </div>
  )
}
