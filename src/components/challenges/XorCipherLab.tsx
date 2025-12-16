import { useMemo, useState } from 'react'
import { Cpu, Key, RefreshCw, Sparkles } from 'lucide-react'

type XorCipherLabProps = {
  ciphertext: string
  correctKey: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

function hexToBytes(hex: string): number[] {
  const sanitized = hex.replace(/\s+/g, '')
  const bytes: number[] = []
  for (let index = 0; index < sanitized.length; index += 2) {
    const segment = sanitized.slice(index, index + 2)
    bytes.push(parseInt(segment, 16))
  }
  return bytes
}

function xorDecode(bytes: number[], key: number): string {
  return bytes
    .map(byte => byte ^ key)
    .map(charCode => String.fromCharCode(charCode))
    .join('')
}

function scorePlaintext(text: string): number {
  if (!text) return 0
  const printable = text.split('').filter(char => /[a-z0-9\s]/i.test(char)).length
  return Math.round((printable / text.length) * 100)
}

export default function XorCipherLab({ ciphertext, correctKey, onSubmit, disabled }: XorCipherLabProps) {
  const [key, setKey] = useState(correctKey > 10 ? Math.floor(correctKey / 2) : 0)
  const [lockedKey, setLockedKey] = useState<number | null>(null)

  const cipherBytes = useMemo(() => hexToBytes(ciphertext), [ciphertext])
  const preview = useMemo(() => xorDecode(cipherBytes, key), [cipherBytes, key])
  const readabilityScore = useMemo(() => scorePlaintext(preview), [preview])
  const isCorrect = key === correctKey

  const handleReset = () => {
    setKey(correctKey > 10 ? Math.floor(correctKey / 2) : 0)
    setLockedKey(null)
  }

  const handleSubmit = () => {
    setLockedKey(key)
    onSubmit(String(key))
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Slide through XOR keys until the decoded output reads as meaningful English. The correct key will produce a readable message.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-small font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            Ciphertext (Hex)
          </h3>
          <p className="font-mono text-body text-orange-600 break-all">{ciphertext}</p>
        </div>
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <h3 className="text-small font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Decoded Preview (Key {key})
          </h3>
          <p className={`font-mono text-body break-words ${isCorrect ? 'text-green-600' : 'text-gray-900'}`}>{preview}</p>
          <p className="text-small text-gray-600 mt-2">Readability score: <span className={readabilityScore > 70 ? 'text-green-600' : 'text-blue-600'}>{readabilityScore}%</span></p>
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="xor-slider" className="text-body font-semibold text-gray-900 flex items-center gap-2">
          <Key className="w-4 h-4 text-blue-600" />
          XOR Key
          <span className={`ml-2 font-mono ${isCorrect ? 'text-green-600' : 'text-blue-600'}`}>{key}</span>
          {isCorrect && <span className="text-green-600">✓ Looks readable!</span>}
        </label>
        <input
          id="xor-slider"
          type="range"
          min={0}
          max={255}
          value={key}
          onChange={event => setKey(parseInt(event.target.value, 10))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-600"
          disabled={disabled}
        />
        <input
          type="number"
          min={0}
          max={255}
          value={key}
          onChange={event => {
            const value = Number(event.target.value)
            if (!Number.isNaN(value)) {
              setKey(Math.max(0, Math.min(255, value)))
            }
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-body text-gray-900 font-mono focus:border-blue-500 focus:outline-none"
          disabled={disabled}
        />
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleReset}
          disabled={disabled}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Reset
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={disabled}
          className={`flex-1 px-6 py-3 rounded-md font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
            isCorrect ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          Lock Key & Submit
        </button>
      </div>

      {lockedKey !== null && (
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <p className="text-small text-gray-700">
            Submitted key: <span className="font-mono text-blue-600">{lockedKey}</span>. Awaiting verification...
          </p>
        </div>
      )}
    </div>
  )
}
