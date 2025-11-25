import { useState } from 'react'
import { CheckCircle, Lightbulb } from 'lucide-react'

interface EncryptedMessage {
  id: string
  encryptedText: string
  correctShift: number
  hint?: string
}

interface SecretMessageDetectiveProps {
  messages: EncryptedMessage[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function SecretMessageDetective({ messages, onSubmit, disabled }: SecretMessageDetectiveProps) {
  const [shifts, setShifts] = useState<Record<string, number>>(
    messages.reduce((acc, msg) => ({ ...acc, [msg.id]: 0 }), {})
  )
  const [showHints, setShowHints] = useState<Record<string, boolean>>({})

  const shiftText = (text: string, shiftAmount: number): string => {
    return text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0)
          const isUpperCase = code >= 65 && code <= 90
          const base = isUpperCase ? 65 : 97
          // Decrypt by shifting backward
          const shifted = ((code - base - shiftAmount + 26) % 26) + base
          return String.fromCharCode(shifted)
        }
        return char
      })
      .join('')
  }

  const handleShiftChange = (messageId: string, newShift: number) => {
    setShifts(prev => ({ ...prev, [messageId]: newShift }))
  }

  const toggleHint = (messageId: string) => {
    setShowHints(prev => ({ ...prev, [messageId]: !prev[messageId] }))
  }

  const handleSubmit = () => {
    // Submit all shift values as answer
    const answer = messages.map(msg => `${msg.id}:${shifts[msg.id]}`).join(',')
    onSubmit(answer)
  }

  const allCorrect = messages.every(msg => shifts[msg.id] === msg.correctShift)
  const progressCount = messages.filter(msg => shifts[msg.id] === msg.correctShift).length

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Mission:</strong> Decrypt all {messages.length} secret messages by finding the correct shift value for each one. 
          Each message may use a different encryption key!
        </p>
      </div>

      {/* Progress Bar */}
      <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
        <div className="flex items-center justify-between mb-2">
          <span className="text-small font-semibold text-neutral-100">Decryption Progress</span>
          <span className="text-small text-neutral-400">{progressCount}/{messages.length} cracked</span>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-2">
          <div
            className="h-2 bg-success-500 rounded-full transition-all duration-300"
            style={{ width: `${(progressCount / messages.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-6">
        {messages.map((message, index) => {
          const shift = shifts[message.id] || 0
          const decryptedText = shiftText(message.encryptedText, shift)
          const isCorrect = shift === message.correctShift

          return (
            <div
              key={message.id}
              className={`border-2 rounded-lg p-6 transition-all ${
                isCorrect
                  ? 'border-success-500 bg-success-900/10'
                  : 'border-neutral-700 bg-neutral-800'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-h4 font-semibold text-neutral-100">
                  Message #{index + 1}
                </h3>
                {isCorrect && (
                  <div className="flex items-center gap-2 text-success-400">
                    <CheckCircle className="w-5 h-5" />
                    <span className="text-small font-semibold">Cracked!</span>
                  </div>
                )}
              </div>

              {/* Encrypted Text */}
              <div className="mb-4">
                <label className="block text-small font-medium text-neutral-300 mb-2">
                  Encrypted:
                </label>
                <div className="bg-neutral-900 p-3 rounded border border-neutral-700">
                  <p className="font-mono text-body text-warning-400 break-all">{message.encryptedText}</p>
                </div>
              </div>

              {/* Shift Slider */}
              <div className="mb-4">
                <label className="block text-small font-medium text-neutral-100 mb-2">
                  Shift Value: <span className={isCorrect ? "text-success-400" : "text-primary-400"}>{shift}</span>
                  {isCorrect && <span className="ml-2 text-success-400">✓</span>}
                </label>
                <div className="flex items-center gap-4">
                  <span className="text-small text-neutral-400">0</span>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={shift}
                    onChange={(e) => handleShiftChange(message.id, parseInt(e.target.value))}
                    className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer ${
                      isCorrect
                        ? 'bg-success-700 [&::-webkit-slider-thumb]:bg-success-500 [&::-moz-range-thumb]:bg-success-500'
                        : 'bg-neutral-700 [&::-webkit-slider-thumb]:bg-primary-500 [&::-moz-range-thumb]:bg-primary-500'
                    }`}
                    disabled={disabled}
                  />
                  <span className="text-small text-neutral-400">25</span>
                </div>
              </div>

              {/* Decrypted Text */}
              <div className="mb-4">
                <label className="block text-small font-medium text-neutral-300 mb-2">
                  Decrypted:
                </label>
                <div className={`p-3 rounded border ${
                  isCorrect 
                    ? 'bg-success-900/20 border-success-700' 
                    : 'bg-neutral-900 border-neutral-700'
                }`}>
                  <p className={`font-mono text-body break-all ${
                    isCorrect ? 'text-success-400' : 'text-neutral-100'
                  }`}>
                    {decryptedText}
                  </p>
                </div>
              </div>

              {/* Hint */}
              {message.hint && (
                <div>
                  <button
                    onClick={() => toggleHint(message.id)}
                    className="flex items-center gap-2 text-small text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHints[message.id] ? 'Hide Hint' : 'Show Hint'}
                  </button>
                  {showHints[message.id] && (
                    <div className="mt-2 bg-warning-900/20 border border-warning-700 p-3 rounded">
                      <p className="text-small text-neutral-100">{message.hint}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Success Message */}
      {allCorrect && (
        <div className="bg-success-900/20 border border-success-700 p-4 rounded-lg animate-in fade-in duration-300">
          <p className="text-body text-success-400 font-semibold">
            🎉 Excellent work, Detective! All messages have been successfully decrypted!
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || !allCorrect}
        className={`w-full px-6 py-4 text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          allCorrect ? 'bg-success-500 hover:bg-success-600' : 'bg-primary-500 hover:bg-primary-600'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : allCorrect ? 'Submit All Decrypted Messages' : `Decrypt all ${messages.length} messages to submit`}
      </button>
    </div>
  )
}
