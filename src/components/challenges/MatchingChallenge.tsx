import { useState } from 'react'
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react'

interface MatchingPair {
  id: string
  left: string
  right: string
}

interface MatchingChallengeProps {
  pairs: MatchingPair[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function MatchingChallenge({ pairs, onSubmit, disabled }: MatchingChallengeProps) {
  const [matches, setMatches] = useState<Record<string, string>>({})
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null)

  // Shuffle right items for display
  const [rightItems] = useState(() => {
    const items = pairs.map(p => ({ id: p.id, text: p.right }))
    return items.sort(() => Math.random() - 0.5)
  })

  const handleLeftClick = (id: string) => {
    if (disabled) return
    setSelectedLeft(id)
  }

  const handleRightClick = (rightId: string) => {
    if (disabled || !selectedLeft) return
    
    setMatches(prev => ({
      ...prev,
      [selectedLeft]: rightId
    }))
    setSelectedLeft(null)
  }

  const handleReset = () => {
    setMatches({})
    setSelectedLeft(null)
  }

  const handleSubmit = () => {
    // Format answer as comma-separated pairs
    const answer = pairs
      .map(p => `${p.id}:${matches[p.id] || 'none'}`)
      .join(',')
    onSubmit(answer)
  }

  const isComplete = Object.keys(matches).length === pairs.length
  const getMatchedRight = (leftId: string) => matches[leftId]

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          <h3 className="text-body font-semibold text-neutral-900 mb-3">Terms</h3>
          {pairs.map((pair) => {
            const matchedRight = getMatchedRight(pair.id)
            const isSelected = selectedLeft === pair.id
            
            return (
              <button
                key={pair.id}
                onClick={() => handleLeftClick(pair.id)}
                disabled={disabled}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  matchedRight
                    ? 'border-success-600 bg-success-50'
                    : isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-background-surface hover:border-primary-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-body text-neutral-900">{pair.left}</span>
                  {matchedRight && (
                    <CheckCircle className="w-5 h-5 text-success-600 flex-shrink-0" />
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          <h3 className="text-body font-semibold text-neutral-900 mb-3">Definitions</h3>
          {rightItems.map((item) => {
            const isMatched = Object.values(matches).includes(item.id)
            
            return (
              <button
                key={item.id}
                onClick={() => handleRightClick(item.id)}
                disabled={disabled || isMatched}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isMatched
                    ? 'border-success-600 bg-success-50 opacity-50'
                    : 'border-neutral-200 bg-background-surface hover:border-primary-300'
                } ${disabled || isMatched ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span className="text-body text-neutral-900">{item.text}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <p className="text-small text-neutral-700">
          Click a term on the left, then click the matching definition on the right. 
          {selectedLeft && <strong className="text-primary-500"> Now click a definition to match.</strong>}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          disabled={disabled || Object.keys(matches).length === 0}
          className="px-6 py-3 border-2 border-neutral-300 text-neutral-700 font-semibold rounded-md hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" />
          Reset
        </button>
        <button
          onClick={handleSubmit}
          disabled={disabled || !isComplete}
          className="flex-1 px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isComplete ? 'Submit Matches' : `${Object.keys(matches).length}/${pairs.length} Matched`}
        </button>
      </div>
    </div>
  )
}
