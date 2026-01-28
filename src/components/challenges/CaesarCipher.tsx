import { useState } from 'react'
import { Lightbulb, CheckCircle } from 'lucide-react'

interface CaesarCipherProps {
  plaintext: string // This is actually the encrypted ciphertext to decrypt
  correctShift: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function CaesarCipher({ plaintext, correctShift, onSubmit, disabled }: CaesarCipherProps) {
  const [shift, setShift] = useState(0)
  const [showHint, setShowHint] = useState(false)

  const shiftText = (text: string, shiftAmount: number, decrypt: boolean = false): string => {
    // When decrypting, we shift backward (negative direction)
    const actualShift = decrypt ? -shiftAmount : shiftAmount
    
    return text
      .split('')
      .map(char => {
        if (char.match(/[a-z]/i)) {
          const code = char.charCodeAt(0)
          const isUpperCase = code >= 65 && code <= 90
          const base = isUpperCase ? 65 : 97
          const shifted = ((code - base + actualShift + 26) % 26) + base
          return String.fromCharCode(shifted)
        }
        return char
      })
      .join('')
  }

  // The encrypted message that needs to be decrypted
  const encryptedText = plaintext
  // Apply the REVERSE shift to decrypt it (shift backward)
  const decryptedText = shiftText(encryptedText, shift, true)

  // Check if the current shift produces readable text (correct decryption)
  const isCorrect = shift === correctShift
  
  const handleSubmit = () => {
    // Always submit the shift number - backend will validate
    onSubmit(shift.toString())
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-300 p-4 rounded-lg">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Find the correct shift value to decode the message. 
          Use the slider to shift the alphabet and reveal the plaintext.
        </p>
      </div>

      {/* Cipher Display */}
      <div className="space-y-4">
        <div>
          <label className="block text-body font-semibold text-gray-900 mb-2">
            Encrypted Message:
          </label>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <p className="font-mono text-body text-orange-600 break-all">{encryptedText}</p>
          </div>
        </div>

        <div>
          <label className="block text-body font-semibold text-gray-900 mb-2">
            Decrypted Message (Shift: {shift}):
          </label>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
            <p className="font-mono text-body text-green-600 break-all">{decryptedText}</p>
          </div>
        </div>
      </div>

      {/* Shift Slider */}
      <div className="space-y-3">
        <label htmlFor="shift-slider" className="block text-body font-semibold text-gray-900">
          Shift Amount: <span className={isCorrect ? "text-green-600" : "text-blue-600"}>{shift}</span>
          {isCorrect && <span className="ml-2 text-green-600">✓ Correct!</span>}
        </label>
        <div className="flex items-center gap-4">
          <span className="text-small text-gray-600">0</span>
          <input
            id="shift-slider"
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => setShift(parseInt(e.target.value))}
            className={`flex-1 h-2 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer ${
              isCorrect 
                ? 'bg-green-300 [&::-webkit-slider-thumb]:bg-green-600 [&::-moz-range-thumb]:bg-green-600' 
                : 'bg-gray-300 [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:bg-blue-600'
            }`}
            disabled={disabled}
          />
          <span className="text-small text-gray-600">25</span>
        </div>
      </div>

      {/* Alphabet Reference */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
        <h3 className="text-small font-semibold text-gray-900 mb-2">Decryption Key (Encrypted → Decrypted):</h3>
        <div className="flex flex-wrap gap-1">
          {Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ').map((letter, index) => {
            // Show how encrypted letters map to decrypted letters
            const decryptedLetter = shiftText(letter, shift, true)
            return (
              <div key={index} className="flex flex-col items-center">
                <span className="text-small text-orange-600">{letter}</span>
                <span className="text-small text-gray-600">↓</span>
                <span className="text-small text-green-600 font-bold">{decryptedLetter}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hint Button */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-2 text-small text-blue-600 hover:text-blue-700 transition-colors"
      >
        <Lightbulb className="w-4 h-4" />
        {showHint ? 'Hide Hint' : 'Show Hint'}
      </button>

      {showHint && (
        <div className="bg-yellow-50 border border-yellow-300 p-4 rounded-lg">
          <p className="text-small text-gray-900">
            <strong>Hint:</strong> Try different shift values until the message makes sense. 
            Look for common English words. The Caesar cipher shifts each letter by a fixed number of positions.
          </p>
        </div>
      )}

      {/* Feedback Message */}
      {isCorrect && (
        <div className="bg-green-50 border border-green-300 p-4 rounded-lg animate-in fade-in duration-300">
          <p className="text-body text-green-700 font-semibold">
            🎉 Perfect! You've successfully decrypted the message with shift {shift}!
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled}
        className={`w-full px-6 py-4 text-white font-semibold rounded-lg transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : `Submit Answer (Shift: ${shift})`}
      </button>
    </div>
  )
}
