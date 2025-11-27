import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

interface PasswordOption {
  id: string
  password: string
  strength: 'weak' | 'medium' | 'strong'
}

interface PasswordSelectionQuizProps {
  passwords: PasswordOption[]
  correctAnswer: string // ID of the weakest password
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function PasswordSelectionQuiz({
  passwords,
  correctAnswer,
  onSubmit,
  disabled
}: PasswordSelectionQuizProps) {
  const [selectedPassword, setSelectedPassword] = useState<string | null>(null)

  const handleSubmit = () => {
    if (selectedPassword) {
      onSubmit(selectedPassword)
    }
  }

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'weak':
        return 'border-error-500 bg-error-900/10'
      case 'medium':
        return 'border-warning-500 bg-warning-900/10'
      case 'strong':
        return 'border-success-500 bg-success-900/10'
      default:
        return 'border-neutral-700 bg-neutral-800'
    }
  }

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'weak':
        return { text: 'Weak', color: 'text-error-400' }
      case 'medium':
        return { text: 'Medium', color: 'text-warning-400' }
      case 'strong':
        return { text: 'Strong', color: 'text-success-400' }
      default:
        return { text: 'Unknown', color: 'text-neutral-400' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Task:</strong> Select the weakest password from the options below. Click on a password to select it.
        </p>
      </div>

      {/* Password Options */}
      <div className="space-y-3">
        {passwords.map((option) => {
          const isSelected = selectedPassword === option.id
          const strengthInfo = getStrengthLabel(option.strength)

          return (
            <button
              key={option.id}
              onClick={() => setSelectedPassword(option.id)}
              disabled={disabled}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'border-primary-500 bg-primary-900/30 ring-2 ring-primary-500/50'
                  : getStrengthColor(option.strength)
              } hover:border-primary-400 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-neutral-600'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-small font-medium text-neutral-300">
                      Option {option.id.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-mono text-h4 text-neutral-100 mb-2 ml-8">
                    {option.password}
                  </div>
                  <div className="ml-8">
                    <span className={`text-small font-medium ${strengthInfo.color}`}>
                      Strength: {strengthInfo.text}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || !selectedPassword}
        className="w-full px-6 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : selectedPassword ? 'Submit Answer' : 'Select a password to continue'}
      </button>
    </div>
  )
}
