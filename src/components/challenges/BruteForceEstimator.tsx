import { useState, useMemo } from 'react'
import { Clock, Shield, AlertTriangle, CheckCircle } from 'lucide-react'

type BruteForceEstimatorProps = {
  minimumLength: number
  requiredComplexity: number // bits of entropy required
  onSubmit: (answer: string) => void
  disabled?: boolean
}

const CHARSET_SIZES = {
  lowercase: 26,
  uppercase: 26,
  numbers: 10,
  symbols: 32,
}

function calculateEntropy(length: number, charsets: number): number {
  return Math.log2(Math.pow(charsets, length))
}

function estimateCrackTime(entropy: number): string {
  const attemptsPerSecond = 1e9 // 1 billion attempts/sec (modern GPU)
  const totalCombinations = Math.pow(2, entropy)
  const seconds = totalCombinations / (2 * attemptsPerSecond) // average case

  if (seconds < 60) return `${seconds.toFixed(1)} seconds`
  if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`
  if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`
  if (seconds < 31536000) return `${(seconds / 86400).toFixed(0)} days`
  if (seconds < 3153600000) return `${(seconds / 31536000).toFixed(1)} years`
  return `${(seconds / 31536000000).toFixed(0)} centuries`
}

export default function BruteForceEstimator({
  minimumLength,
  requiredComplexity,
  onSubmit,
  disabled,
}: BruteForceEstimatorProps) {
  const [passwordLength, setPasswordLength] = useState(minimumLength)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useUppercase, setUseUppercase] = useState(false)
  const [useNumbers, setUseNumbers] = useState(false)
  const [useSymbols, setUseSymbols] = useState(false)

  const charsetSize = useMemo(() => {
    let size = 0
    if (useLowercase) size += CHARSET_SIZES.lowercase
    if (useUppercase) size += CHARSET_SIZES.uppercase
    if (useNumbers) size += CHARSET_SIZES.numbers
    if (useSymbols) size += CHARSET_SIZES.symbols
    return size
  }, [useLowercase, useUppercase, useNumbers, useSymbols])

  const entropy = useMemo(
    () => calculateEntropy(passwordLength, charsetSize),
    [passwordLength, charsetSize]
  )

  const crackTime = useMemo(() => estimateCrackTime(entropy), [entropy])
  const isSufficient = entropy >= requiredComplexity

  const handleSubmit = () => {
    // Submit the entropy value rounded to nearest integer
    onSubmit(Math.round(entropy).toString())
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Configure a password profile that achieves at least{' '}
          <span className="text-primary-300 font-mono">{requiredComplexity} bits</span> of entropy
          to resist brute force attacks.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="length-slider" className="block text-body font-semibold text-gray-900 mb-2">
            Password Length: <span className="text-primary-600 font-mono">{passwordLength}</span> characters
          </label>
          <input
            id="length-slider"
            type="range"
            min={minimumLength}
            max={32}
            value={passwordLength}
            onChange={e => setPasswordLength(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500 border border-gray-300"
            disabled={disabled}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-body font-semibold text-gray-900 mb-2">Character Sets</legend>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={e => setUseLowercase(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-gray-400 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-gray-900">Lowercase (a-z) — {CHARSET_SIZES.lowercase} chars</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={e => setUseUppercase(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-gray-400 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-gray-900">Uppercase (A-Z) — {CHARSET_SIZES.uppercase} chars</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={e => setUseNumbers(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-gray-400 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-gray-900">Numbers (0-9) — {CHARSET_SIZES.numbers} chars</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={e => setUseSymbols(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-gray-400 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-gray-900">Symbols (!@#$...) — {CHARSET_SIZES.symbols} chars</span>
          </label>
        </fieldset>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border-2 border-blue-400 bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-blue-700" />
            <h3 className="text-small font-semibold text-gray-900">Charset Size</h3>
          </div>
          <p className="text-h3 font-bold text-gray-900">{charsetSize}</p>
          <p className="text-small text-gray-700 mt-1">possible characters</p>
        </div>

        <div className="rounded-lg border-2 border-orange-400 bg-orange-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-orange-700" />
            <h3 className="text-small font-semibold text-gray-900">Entropy</h3>
          </div>
          <p className={`text-h3 font-bold ${isSufficient ? 'text-green-700' : 'text-orange-700'}`}>
            {entropy.toFixed(1)} bits
          </p>
          <p className="text-small text-gray-700 mt-1">
            {isSufficient ? 'Strong enough!' : `Need ${requiredComplexity}+ bits`}
          </p>
        </div>

        <div className="rounded-lg border-2 border-purple-400 bg-purple-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-purple-700" />
            <h3 className="text-small font-semibold text-gray-900">Crack Time</h3>
          </div>
          <p className="text-body font-bold text-gray-900">{crackTime}</p>
          <p className="text-small text-gray-700 mt-1">avg. with modern GPU</p>
        </div>
      </div>

      {isSufficient && (
        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-700 flex-shrink-0" />
          <p className="text-body text-green-800 font-medium">
            This configuration meets the security threshold! Submit to lock in your answer.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !isSufficient}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isSufficient ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : 'Submit Configuration'}
      </button>
    </div>
  )
}
