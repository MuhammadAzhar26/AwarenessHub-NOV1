import { useState } from 'react'
import { Lightbulb, CheckCircle } from 'lucide-react'

interface CaesarCipherProps {
  plaintext: string
  correctShift: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function CaesarCipher({ plaintext, correctShift, onSubmit, disabled }: CaesarCipherProps) {
  const [shift, setShift] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const shiftText = (text: string, shiftAmount: number): string => {
    return text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0)
          const isUpperCase = code >= 65 && code <= 90
          const base = isUpperCase ? 65 : 97
          const shifted = ((code - base + shiftAmount + 26) % 26) + base
          return String.fromCharCode(shifted)
        }
        return char
      })
      .join('')
  }

  const ciphertext = shiftText(plaintext, shift)

  const handleSubmit = () => {
    onSubmit(shift.toString())
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Find the correct shift value to decode the message. 
          Use the slider to shift the alphabet and reveal the plaintext.
        </p>
      </div>

      {/* Cipher Display */}
      <div className="space-y-4">
        <div>
          <label className="block text-body font-semibold text-neutral-100 mb-2">
            Original Message (Encrypted):
          </label>
          <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <p className="font-mono text-body text-warning-400 break-all">{plaintext}</p>
          </div>
        </div>

        <div>
          <label className="block text-body font-semibold text-neutral-100 mb-2">
            Shifted Message (Current Shift: {shift}):
          </label>
          <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
            <p className="font-mono text-body text-success-400 break-all">{ciphertext}</p>
          </div>
        </div>
      </div>

      {/* Shift Slider */}
      <div className="space-y-3">
        <label htmlFor="shift-slider" className="block text-body font-semibold text-neutral-100">
          Shift Amount: <span className="text-primary-400">{shift}</span>
        </label>
        <div className="flex items-center gap-4">
          <span className="text-small text-neutral-400">0</span>
          <input
            id="shift-slider"
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            disabled={disabled}
          />
          <span className="text-small text-neutral-400">25</span>
        </div>
      </div>

      {/* Alphabet Reference */}
      <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
        <h3 className="text-small font-semibold text-neutral-100 mb-2">Alphabet Reference:</h3>
        <div className="flex flex-wrap gap-1">
          {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index) => {
            const shiftedLetter = shiftText(letter, shift)
            return (
              <div key={index} className="flex flex-col items-center">
                <span className="text-small text-neutral-400">{letter}</span>
                <span className="text-small text-primary-400 font-bold">{shiftedLetter}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hint Button */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-2 text-small text-primary-400 hover:text-primary-300 transition-colors"
      >
        <Lightbulb className="w-4 h-4" />
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>

      {showHint && (
        <div className="bg-warning-900/20 border border-warning-700 p-4 rounded-lg">
          <p className="text-small text-neutral-100">
            <strong>Hint:</strong> Try different shift values until the message makes sense. 
            Look for common English words. The Caesar cipher shifts each letter by a fixed number of positions.
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className="w-full px-6 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : `Submit Answer (Shift: ${shift})`}
      </button>
    </div>
  )
}
