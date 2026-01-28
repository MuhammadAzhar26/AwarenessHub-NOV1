import { useState, useMemo } from 'react'
import { Hash, Lightbulb, CheckCircle } from 'lucide-react'

type HashIdentifierProps = {
  hashes: Array<{ id: string; value: string; algorithm: string }>
  onSubmit: (answer: string) => void
  disabled?: boolean
}

const HASH_PATTERNS = [
  { name: 'MD5', regex: /^[a-f0-9]{32}$/i, length: 32, description: '32 hex characters' },
  { name: 'SHA-1', regex: /^[a-f0-9]{40}$/i, length: 40, description: '40 hex characters' },
  { name: 'SHA-256', regex: /^[a-f0-9]{64}$/i, length: 64, description: '64 hex characters' },
  { name: 'SHA-512', regex: /^[a-f0-9]{128}$/i, length: 128, description: '128 hex characters' },
  {
    name: 'bcrypt',
    regex: /^\$2[ayb]\$.{56}$/,
    length: 60,
    description: 'Starts with $2a$, $2b$, or $2y$',
  },
]

export default function HashIdentifier({ hashes, onSubmit, disabled }: HashIdentifierProps) {
  const [selections, setSelections] = useState<Record<string, string>>(
    hashes.reduce((acc, h) => ({ ...acc, [h.id]: '' }), {})
  )
  const [showHint, setShowHint] = useState(false)

  const allSelected = useMemo(
    () => Object.values(selections).every(val => val !== ''),
    [selections]
  )

  const handleSelect = (hashId: string, algorithm: string) => {
    setSelections(prev => ({ ...prev, [hashId]: algorithm }))
  }

  const handleSubmit = () => {
    // Format: hash1:MD5,hash2:SHA-256
    const answer = Object.entries(selections)
      .map(([id, algo]) => `${id}:${algo}`)
      .join(',')
    onSubmit(answer)
  }

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Match each hash string to its cryptographic algorithm by analyzing
          length and format patterns.
        </p>
      </div>

      <div className="space-y-4">
        {hashes.map(hash => {
          const selected = selections[hash.id]
          const isCorrect = selected === hash.algorithm

          return (
            <div
              key={hash.id}
              className={`rounded-lg border p-4 transition-colors ${
                selected
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-yellow-500 bg-yellow-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <Hash className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-small text-gray-600 mb-1">Hash #{hash.id}</p>
                  <p className="font-mono text-small text-gray-900 break-all">{hash.value}</p>
                  <p className="text-small text-gray-600 mt-1">
                    Length: <span className="text-blue-600">{hash.value.length}</span> characters
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {HASH_PATTERNS.map(pattern => (
                  <button
                    key={pattern.name}
                    type="button"
                    onClick={() => handleSelect(hash.id, pattern.name)}
                    disabled={disabled}
                    className={`px-4 py-2 rounded-md text-small font-medium transition-colors ${
                      selected === pattern.name
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {pattern.name}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowHint(!showHint)}
        className="inline-flex items-center gap-2 text-small text-blue-600 hover:text-blue-500"
      >
        <Lightbulb className="w-4 h-4" />
        {showHint ? 'Hide patterns guide' : 'Show patterns guide'}
      </button>

      {showHint && (
        <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-2">
          {HASH_PATTERNS.map(pattern => (
            <div key={pattern.name} className="flex items-start gap-2">
              <span className="font-mono text-small text-blue-600 font-semibold min-w-[80px]">
                {pattern.name}:
              </span>
              <span className="text-small text-gray-700">{pattern.description}</span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !allSelected}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          allSelected ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : allSelected ? 'Submit Classifications' : 'Select all algorithms first'}
      </button>
    </div>
  )
}
