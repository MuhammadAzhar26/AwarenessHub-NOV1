import { useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'

interface CipherToolProps {
  defaultShift?: number
  title?: string
}

export default function CipherTool({ defaultShift = 13, title = "Cipher Tool" }: CipherToolProps) {
  const [inputText, setInputText] = useState('')
  const [shift, setShift] = useState(defaultShift)
  const [outputText, setOutputText] = useState('')

  const applyShift = (text: string, shiftAmount: number): string => {
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

  const handleInputChange = (text: string) => {
    setInputText(text)
    setOutputText(applyShift(text, shift))
  }

  const handleShiftChange = (newShift: number) => {
    setShift(newShift)
    if (inputText) {
      setOutputText(applyShift(inputText, newShift))
    }
  }

  const handleReset = () => {
    setInputText('')
    setOutputText('')
    setShift(defaultShift)
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(outputText)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h4 font-semibold text-neutral-100">{title}</h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-small text-neutral-400 hover:text-primary-400 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Shift Slider */}
      <div className="space-y-2">
        <label className="block text-body font-medium text-neutral-100">
          Shift Amount: <span className="text-primary-400">{shift}</span>
          {shift === 13 && <span className="ml-2 text-small text-warning-400">(ROT13)</span>}
        </label>
        <div className="flex items-center gap-4">
          <span className="text-small text-neutral-400">0</span>
          <input
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => handleShiftChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-neutral-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <span className="text-small text-neutral-400">25</span>
        </div>
      </div>

      {/* Input Text */}
      <div>
        <label className="block text-body font-medium text-neutral-100 mb-2">
          Input Text:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter text to encode/decode..."
          className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
          rows={3}
        />
      </div>

      {/* Output Text */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-body font-medium text-neutral-100">
            Output Text:
          </label>
          {outputText && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-small text-primary-400 hover:text-primary-300 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          )}
        </div>
        <div className="w-full p-3 bg-neutral-900 border border-neutral-700 rounded-lg min-h-[72px]">
          <p className="text-neutral-100 font-mono break-all whitespace-pre-wrap">
            {outputText || <span className="text-neutral-500">Transformed text will appear here...</span>}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleShiftChange(13)}
          className={`px-4 py-2 text-small rounded-lg font-medium transition-colors ${
            shift === 13
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          ROT13
        </button>
        <button
          onClick={() => handleShiftChange(3)}
          className={`px-4 py-2 text-small rounded-lg font-medium transition-colors ${
            shift === 3
              ? 'bg-primary-500 text-white'
              : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
          }`}
        >
          Caesar (3)
        </button>
      </div>
    </div>
  )
}
