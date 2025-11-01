import { useState, useEffect } from 'react'
import { Shield, CheckCircle, AlertCircle } from 'lucide-react'

interface PasswordBuilderProps {
  minStrength: number // Minimum required strength score (0-100)
  requiresLength?: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function PasswordBuilder({ minStrength, requiresLength = 12, onSubmit, disabled }: PasswordBuilderProps) {
  const [password, setPassword] = useState('')
  const [strength, setStrength] = useState(0)
  const [feedback, setFeedback] = useState<string[]>([])

  const characterTypes = [
    { type: 'lowercase', label: 'Lowercase (a-z)', chars: 'abcdefghijklmnopqrstuvwxyz' },
    { type: 'uppercase', label: 'Uppercase (A-Z)', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ' },
    { type: 'numbers', label: 'Numbers (0-9)', chars: '0123456789' },
    { type: 'special', label: 'Special (!@#$%)', chars: '!@#$%^&*()_+-=[]{}|;:,.<>?' }
  ]

  const addCharacter = (charSet: string) => {
    const randomChar = charSet[Math.floor(Math.random() * charSet.length)]
    setPassword(prev => prev + randomChar)
  }

  const calculateStrength = (pwd: string): { score: number; feedback: string[] } => {
    let score = 0
    const feedbackList: string[] = []

    // Length check
    if (pwd.length >= requiresLength) {
      score += 25
    } else {
      feedbackList.push(`Password must be at least ${requiresLength} characters`)
    }

    // Character variety checks
    if (/[a-z]/.test(pwd)) {
      score += 15
    } else {
      feedbackList.push('Add lowercase letters')
    }

    if (/[A-Z]/.test(pwd)) {
      score += 15
    } else {
      feedbackList.push('Add uppercase letters')
    }

    if (/[0-9]/.test(pwd)) {
      score += 15
    } else {
      feedbackList.push('Add numbers')
    }

    if (/[^a-zA-Z0-9]/.test(pwd)) {
      score += 15
    } else {
      feedbackList.push('Add special characters')
    }

    // Bonus for length
    if (pwd.length >= requiresLength + 4) {
      score += 10
    }

    // Penalty for common patterns
    if (/(.)\1{2,}/.test(pwd)) {
      score -= 10
      feedbackList.push('Avoid repeating characters')
    }

    if (/^[0-9]+$/.test(pwd)) {
      score = Math.min(score, 30)
      feedbackList.push('Don\'t use only numbers')
    }

    // Ensure score is 0-100
    score = Math.max(0, Math.min(100, score))

    return { score, feedback: feedbackList }
  }

  useEffect(() => {
    const result = calculateStrength(password)
    setStrength(result.score)
    setFeedback(result.feedback)
  }, [password])

  const getStrengthColor = () => {
    if (strength < 30) return 'bg-error-600'
    if (strength < 60) return 'bg-warning-600'
    if (strength < 80) return 'bg-warning-500'
    return 'bg-success-600'
  }

  const getStrengthLabel = () => {
    if (strength < 30) return { text: 'Weak', color: 'text-error-400' }
    if (strength < 60) return { text: 'Fair', color: 'text-warning-400' }
    if (strength < 80) return { text: 'Good', color: 'text-warning-300' }
    return { text: 'Strong', color: 'text-success-400' }
  }

  const handleSubmit = () => {
    if (strength >= minStrength) {
      onSubmit(strength.toString())
    }
  }

  const strengthLabel = getStrengthLabel()
  const meetsRequirement = strength >= minStrength

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Build a strong password by clicking character type buttons below. 
          Achieve a strength score of at least <strong>{minStrength}</strong> to complete the challenge.
        </p>
      </div>

      {/* Password Display */}
      <div className="space-y-3">
        <label className="block text-body font-semibold text-neutral-100">
          Your Password:
        </label>
        <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700 min-h-[60px] flex items-center">
          <p className="font-mono text-h3 text-neutral-100 break-all">
            {password || <span className="text-neutral-500 italic">Click buttons below to build...</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setPassword('')}
            className="px-4 py-2 bg-error-600 text-white rounded-md hover:bg-error-700 transition-colors text-small"
          >
            Clear
          </button>
          <button
            onClick={() => setPassword(prev => prev.slice(0, -1))}
            className="px-4 py-2 bg-neutral-700 text-neutral-100 rounded-md hover:bg-neutral-600 transition-colors text-small"
            disabled={!password}
          >
            Delete Last
          </button>
        </div>
      </div>

      {/* Character Type Buttons */}
      <div className="space-y-3">
        <label className="block text-body font-semibold text-neutral-100">
          Add Characters:
        </label>
        <div className="grid grid-cols-2 gap-3">
          {characterTypes.map((charType) => (
            <button
              key={charType.type}
              onClick={() => addCharacter(charType.chars)}
              disabled={disabled}
              className="px-4 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <span className="text-body font-medium">{charType.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Strength Meter */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-body font-semibold text-neutral-100">
            Password Strength:
          </label>
          <span className={`text-body font-bold ${strengthLabel.color}`}>
            {strengthLabel.text} ({strength}%)
          </span>
        </div>
        <div className="w-full h-4 bg-neutral-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStrengthColor()} transition-all duration-300`}
            style={{ width: `${strength}%` }}
          />
        </div>
      </div>

      {/* Feedback */}
      {feedback.length > 0 && (
        <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg space-y-2">
          <h3 className="text-small font-semibold text-neutral-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-warning-500" />
            Suggestions:
          </h3>
          <ul className="list-disc list-inside space-y-1">
            {feedback.map((item, index) => (
              <li key={index} className="text-small text-neutral-400">{item}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Requirement Status */}
      <div className={`p-4 rounded-lg border ${
        meetsRequirement 
          ? 'bg-success-900/20 border-success-700' 
          : 'bg-neutral-800 border-neutral-700'
      }`}>
        <div className="flex items-center gap-3">
          {meetsRequirement ? (
            <CheckCircle className="w-6 h-6 text-success-500" />
          ) : (
            <Shield className="w-6 h-6 text-neutral-500" />
          )}
          <div>
            <p className="text-body font-semibold text-neutral-100">
              {meetsRequirement ? 'Password Meets Requirements!' : 'Keep Building...'}
            </p>
            <p className="text-small text-neutral-400">
              {meetsRequirement 
                ? `Your password is strong enough (${strength}% ≥ ${minStrength}%)`
                : `Need ${minStrength - strength}% more strength`
              }
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || !meetsRequirement}
        className="w-full px-6 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : 'Submit Password'}
      </button>
    </div>
  )
}
