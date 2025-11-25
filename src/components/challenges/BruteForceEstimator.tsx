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
      <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Configure a password profile that achieves at least{' '}
          <span className="text-primary-300 font-mono">{requiredComplexity} bits</span> of entropy
          to resist brute force attacks.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="length-slider" className="block text-body font-semibold text-neutral-100 mb-2">
            Password Length: <span className="text-primary-300">{passwordLength}</span> characters
          </label>
          <input
            id="length-slider"
            type="range"
            min={minimumLength}
            max={32}
            value={passwordLength}
            onChange={e => setPasswordLength(parseInt(e.target.value, 10))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500"
            disabled={disabled}
          />
        </div>

        <fieldset className="space-y-3">
          <legend className="text-body font-semibold text-neutral-100 mb-2">Character Sets</legend>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={e => setUseLowercase(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-neutral-700 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-neutral-200">Lowercase (a-z) — {CHARSET_SIZES.lowercase} chars</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={e => setUseUppercase(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-neutral-700 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-neutral-200">Uppercase (A-Z) — {CHARSET_SIZES.uppercase} chars</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={e => setUseNumbers(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-neutral-700 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-neutral-200">Numbers (0-9) — {CHARSET_SIZES.numbers} chars</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={e => setUseSymbols(e.target.checked)}
              disabled={disabled}
              className="w-5 h-5 rounded border-neutral-700 text-primary-500 focus:ring-primary-500"
            />
            <span className="text-body text-neutral-200">Symbols (!@#$...) — {CHARSET_SIZES.symbols} chars</span>
          </label>
        </fieldset>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-primary-400" />
            <h3 className="text-small font-semibold text-neutral-200">Charset Size</h3>
          </div>
          <p className="text-h3 font-bold text-neutral-100">{charsetSize}</p>
          <p className="text-small text-neutral-400 mt-1">possible characters</p>
        </div>

        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-warning-400" />
            <h3 className="text-small font-semibold text-neutral-200">Entropy</h3>
          </div>
          <p className={`text-h3 font-bold ${isSufficient ? 'text-success-400' : 'text-warning-400'}`}>
            {entropy.toFixed(1)} bits
          </p>
          <p className="text-small text-neutral-400 mt-1">
            {isSufficient ? 'Strong enough!' : `Need ${requiredComplexity}+ bits`}
          </p>
        </div>

        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-5 h-5 text-primary-400" />
            <h3 className="text-small font-semibold text-neutral-200">Crack Time</h3>
          </div>
          <p className="text-body font-bold text-neutral-100">{crackTime}</p>
          <p className="text-small text-neutral-400 mt-1">avg. with modern GPU</p>
        </div>
      </div>

      {isSufficient && (
        <div className="bg-success-900/20 border border-success-700 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-success-400 flex-shrink-0" />
          <p className="text-body text-success-400">
            This configuration meets the security threshold! Submit to lock in your answer.
          </p>
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !isSufficient}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          isSufficient ? 'bg-success-500 hover:bg-success-600' : 'bg-neutral-700'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : 'Submit Configuration'}
      </button>
    </div>
  )
}
