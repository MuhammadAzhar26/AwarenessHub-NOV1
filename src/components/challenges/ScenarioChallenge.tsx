import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface ScenarioOption {
  id: string
  text: string
  explanation?: string
}

interface ScenarioSection {
  question: string
  options: ScenarioOption[]
}

interface ScenarioChallengeProps {
  sections: ScenarioSection[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function ScenarioChallenge({ sections, onSubmit, disabled }: ScenarioChallengeProps) {
  const [selections, setSelections] = useState<Record<number, string>>({})

  const handleSelect = (sectionIndex: number, optionId: string) => {
    if (disabled) return
    setSelections(prev => ({
      ...prev,
      [sectionIndex]: optionId
    }))
  }

  const handleSubmit = () => {
    // Format answer as comma-separated selections
    const answer = sections
      .map((_, idx) => selections[idx] || 'none')
      .join(',')
    onSubmit(answer)
  }

  const isComplete = Object.keys(selections).length === sections.length

  return (
    <div className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
          <h3 className="text-body font-semibold text-neutral-100 mb-4">
            {sectionIndex + 1}. {section.question}
          </h3>
          
          <div className="space-y-3">
            {section.options.map((option) => {
              const isSelected = selections[sectionIndex] === option.id
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(sectionIndex, option.id)}
                  disabled={disabled}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary-500 bg-primary-900/30'
                      : 'border-neutral-700 bg-neutral-900 hover:border-neutral-600'
                  } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                      isSelected
                        ? 'border-primary-500 bg-primary-500'
                        : 'border-neutral-600'
                    }`}>
                      {isSelected && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-body text-neutral-100">{option.text}</p>
                      {option.explanation && isSelected && (
                        <p className="text-small text-neutral-400 mt-2">{option.explanation}</p>
                      )}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={disabled || !isComplete}
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed shadow-dark-card hover:shadow-dark-card-hover"
        >
          {isComplete ? 'Submit Answers' : `${Object.keys(selections).length}/${sections.length} Answered`}
        </button>
      </div>
    </div>
  )
}
