import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Mail } from 'lucide-react'

interface PhishingClue {
  id: number
  type: 'sender' | 'link' | 'urgency' | 'grammar' | 'attachment' | 'content'
  description: string
  element: string // Text to highlight in the email
}

interface EmailDetectiveProps {
  emailContent: {
    from: string
    subject: string
    body: string
    hasAttachment?: boolean
    attachmentName?: string
  }
  clues: PhishingClue[] // All clues (correct and incorrect)
  correctClueIds: number[] // IDs of clues that are actually suspicious
  requiredClues: number // Number of clues user must find
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function EmailDetective({
  emailContent,
  clues,
  correctClueIds,
  requiredClues,
  onSubmit,
  disabled
}: EmailDetectiveProps) {
  const [foundClues, setFoundClues] = useState<number[]>([])
  const [selectedElement, setSelectedElement] = useState<string | null>(null)

  const toggleClue = (clueId: number) => {
    if (foundClues.includes(clueId)) {
      setFoundClues(foundClues.filter(id => id !== clueId))
    } else {
      setFoundClues([...foundClues, clueId])
    }
  }

  const highlightText = (text: string): JSX.Element => {
    if (!selectedElement) return <>{text}</>

    const parts = text.split(new RegExp(`(${selectedElement})`, 'gi'))
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === selectedElement.toLowerCase() ? (
            <mark key={index} className="bg-warning-400 text-neutral-900 font-semibold rounded px-1">
              {part}
            </mark>
          ) : (
            <span key={index}>{part}</span>
          )
        )}
      </>
    )
  }

  const handleSubmit = () => {
    // Check if user found the correct clues
    const correctFound = foundClues.filter(id => correctClueIds.includes(id)).length
    const incorrectFound = foundClues.filter(id => !correctClueIds.includes(id)).length

    // Score based on correct clues found and avoid incorrect ones
    const score = correctFound * 20 - incorrectFound * 10
    const success = correctFound >= requiredClues && incorrectFound === 0

    onSubmit(success ? 'correct' : 'incorrect')
  }

  const correctFound = foundClues.filter(id => correctClueIds.includes(id)).length
  const progress = (correctFound / requiredClues) * 100

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Identify <strong>{requiredClues}</strong> suspicious elements in this email. 
          Click on the clue descriptions below to highlight them in the email. Select only the genuine phishing indicators.
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-body font-semibold text-neutral-100">
            Clues Found: {correctFound}/{requiredClues}
          </label>
          <span className="text-small text-neutral-400">
            {foundClues.length} selected
          </span>
        </div>
        <div className="w-full h-2 bg-neutral-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-warning-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Email Display */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden shadow-dark-card">
        {/* Email Header */}
        <div className="bg-neutral-800 px-6 py-4 border-b border-neutral-700">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-6 h-6 text-primary-500" />
            <h3 className="text-body font-semibold text-neutral-100">Email Message</h3>
          </div>
          <div className="space-y-2 text-small">
            <div>
              <span className="text-neutral-400">From: </span>
              <span className="text-neutral-100">{highlightText(emailContent.from)}</span>
            </div>
            <div>
              <span className="text-neutral-400">Subject: </span>
              <span className="text-neutral-100 font-medium">{highlightText(emailContent.subject)}</span>
            </div>
            {emailContent.hasAttachment && (
              <div className="flex items-center gap-2 mt-2 p-2 bg-neutral-700 rounded">
                <AlertTriangle className="w-4 h-4 text-warning-500" />
                <span className="text-neutral-100">📎 {emailContent.attachmentName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Email Body */}
        <div className="px-6 py-6">
          <div className="text-body text-neutral-100 leading-relaxed whitespace-pre-wrap">
            {highlightText(emailContent.body)}
          </div>
        </div>
      </div>

      {/* Clue Selection */}
      <div className="space-y-3">
        <label className="block text-body font-semibold text-neutral-100">
          Click Suspicious Elements:
        </label>
        <div className="grid gap-3">
          {clues.map((clue) => {
            const isSelected = foundClues.includes(clue.id)
            const isCorrect = correctClueIds.includes(clue.id)

            return (
              <button
                key={clue.id}
                onClick={() => {
                  toggleClue(clue.id)
                  setSelectedElement(isSelected ? null : clue.element)
                }}
                onMouseEnter={() => setSelectedElement(clue.element)}
                onMouseLeave={() => setSelectedElement(null)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'bg-warning-900/30 border-warning-600'
                    : 'bg-neutral-800 border-neutral-700 hover:border-primary-500'
                }`}
                disabled={disabled}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected 
                      ? 'bg-warning-600 border-warning-600' 
                      : 'border-neutral-600'
                  }`}>
                    {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-caption font-semibold px-2 py-0.5 rounded ${
                        clue.type === 'sender' ? 'bg-error-900/50 text-error-400' :
                        clue.type === 'link' ? 'bg-warning-900/50 text-warning-400' :
                        clue.type === 'urgency' ? 'bg-orange-900/50 text-orange-400' :
                        clue.type === 'grammar' ? 'bg-purple-900/50 text-purple-400' :
                        clue.type === 'attachment' ? 'bg-red-900/50 text-red-400' :
                        'bg-blue-900/50 text-blue-400'
                      }`}>
                        {clue.type}
                      </span>
                    </div>
                    <p className="text-small text-neutral-100">{clue.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Hint */}
      <div className="bg-neutral-800 border border-neutral-700 p-4 rounded-lg">
        <p className="text-small text-neutral-400">
          <strong className="text-neutral-100">Tip:</strong> Hover over each clue to highlight the suspicious element in the email. 
          Real phishing emails often have multiple red flags including suspicious sender addresses, 
          grammatical errors, urgent language, and suspicious links.
        </p>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={disabled || foundClues.length === 0}
        className="w-full px-6 py-4 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : `Submit Analysis (${foundClues.length} clues selected)`}
      </button>
    </div>
  )
}
