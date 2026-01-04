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
        return 'border-red-400 bg-red-50'
      case 'medium':
        return 'border-orange-400 bg-orange-50'
      case 'strong':
        return 'border-green-400 bg-green-50'
      default:
        return 'border-gray-400 bg-gray-50'
    }
  }

  const getStrengthLabel = (strength: string) => {
    switch (strength) {
      case 'weak':
        return { text: 'Weak', color: 'text-red-700' }
      case 'medium':
        return { text: 'Medium', color: 'text-orange-700' }
      case 'strong':
        return { text: 'Strong', color: 'text-green-700' }
      default:
        return { text: 'Unknown', color: 'text-gray-700' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-body text-gray-900">
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
              className={`w-full p-4 rounded-lg border-2 transition-all text-left shadow-sm ${
                isSelected
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-400/50 shadow-md'
                  : getStrengthColor(option.strength)
              } hover:border-blue-500 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-blue-600 bg-blue-600' 
                        : 'border-gray-400 bg-white'
                    }`}>
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-small font-semibold text-gray-900">
                      Option {option.id.toUpperCase()}
                    </span>
                  </div>
                  <div className="font-mono text-h4 text-gray-900 font-semibold mb-2 ml-8">
                    {option.password}
                  </div>
                  <div className="ml-8">
                    <span className={`text-small font-semibold ${strengthInfo.color}`}>
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
        className="w-full px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : selectedPassword ? 'Submit Answer' : 'Select a password to continue'}
      </button>
    </div>
  )
}
