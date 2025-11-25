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
      <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
        <p className="text-body text-neutral-100">
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
                    ? 'border-success-600 bg-success-900/10'
                    : 'border-warning-600 bg-warning-900/10'
                  : 'border-neutral-700 bg-neutral-900'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <Hash className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-small text-neutral-400 mb-1">Hash #{hash.id}</p>
                  <p className="font-mono text-small text-neutral-100 break-all">{hash.value}</p>
                  <p className="text-small text-neutral-400 mt-1">
                    Length: <span className="text-primary-300">{hash.value.length}</span> characters
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
                        ? 'bg-primary-500 text-white'
                        : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700'
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
        className="inline-flex items-center gap-2 text-small text-primary-400 hover:text-primary-300"
      >
        <Lightbulb className="w-4 h-4" />
        {showHint ? 'Hide patterns guide' : 'Show patterns guide'}
      </button>

      {showHint && (
        <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4 space-y-2">
          {HASH_PATTERNS.map(pattern => (
            <div key={pattern.name} className="flex items-start gap-2">
              <span className="font-mono text-small text-primary-300 font-semibold min-w-[80px]">
                {pattern.name}:
              </span>
              <span className="text-small text-neutral-300">{pattern.description}</span>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !allSelected}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          allSelected ? 'bg-primary-500 hover:bg-primary-600' : 'bg-neutral-700'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : allSelected ? 'Submit Classifications' : 'Select all algorithms first'}
      </button>
    </div>
  )
}
