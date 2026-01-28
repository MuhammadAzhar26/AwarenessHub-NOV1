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
    <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-h4 font-semibold text-gray-900">{title}</h3>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 text-small text-gray-600 hover:text-blue-600 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* Shift Slider */}
      <div className="space-y-2">
        <label className="block text-body font-medium text-gray-900">
          Shift Amount: <span className="text-blue-600">{shift}</span>
          {shift === 13 && <span className="ml-2 text-small text-orange-600">(ROT13)</span>}
        </label>
        <div className="flex items-center gap-4">
          <span className="text-small text-gray-600">0</span>
          <input
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => handleShiftChange(parseInt(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <span className="text-small text-gray-600">25</span>
        </div>
      </div>

      {/* Input Text */}
      <div>
        <label className="block text-body font-medium text-gray-900 mb-2">
          Input Text:
        </label>
        <textarea
          value={inputText}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Enter text to encode/decode..."
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
          rows={3}
        />
      </div>

      {/* Output Text */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-body font-medium text-gray-900">
            Output Text:
          </label>
          {outputText && (
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1 text-small text-blue-600 hover:text-blue-500 transition-colors"
            >
              <Copy className="w-4 h-4" />
              Copy
            </button>
          )}
        </div>
        <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[72px]">
          <p className="text-gray-900 font-mono break-all whitespace-pre-wrap">
            {outputText || <span className="text-gray-500">Transformed text will appear here...</span>}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleShiftChange(13)}
          className={`px-4 py-2 text-small rounded-lg font-medium transition-colors ${
            shift === 13
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          ROT13
        </button>
        <button
          onClick={() => handleShiftChange(3)}
          className={`px-4 py-2 text-small rounded-lg font-medium transition-colors ${
            shift === 3
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Caesar (3)
        </button>
      </div>
    </div>
  )
}
