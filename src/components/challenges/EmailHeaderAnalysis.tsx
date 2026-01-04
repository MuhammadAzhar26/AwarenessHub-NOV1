import { useState } from 'react'
import { Mail, ChevronDown, ChevronUp, CheckCircle, AlertCircle } from 'lucide-react'

type EmailHeaderAnalysisProps = {
  headers: Array<{
    id: string
    name: string
    value: string
    suspicious: boolean
    explanation: string
  }>
  minCorrect: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function EmailHeaderAnalysis({
  headers,
  minCorrect,
  onSubmit,
  disabled,
}: EmailHeaderAnalysisProps) {
  const [flagged, setFlagged] = useState<string[]>([])
  const [expandedHeaders, setExpandedHeaders] = useState<string[]>([])

  const toggleFlag = (headerId: string) => {
    setFlagged(prev =>
      prev.includes(headerId) ? prev.filter(id => id !== headerId) : [...prev, headerId]
    )
  }

  const toggleExpand = (headerId: string) => {
    setExpandedHeaders(prev =>
      prev.includes(headerId) ? prev.filter(id => id !== headerId) : [...prev, headerId]
    )
  }

  const handleSubmit = () => {
    // Format: header1,header3,header5
    onSubmit(flagged.sort().join(','))
  }

  const correctlyFlagged = flagged.filter(id =>
    headers.find(h => h.id === id)?.suspicious
  ).length
  const incorrectlyFlagged = flagged.filter(
    id => !headers.find(h => h.id === id)?.suspicious
  ).length

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Review email headers and flag at least {minCorrect} suspicious
          entries that indicate phishing or spoofing attempts.
        </p>
      </div>

      <div className="space-y-3">
        {headers.map(header => {
          const isFlagged = flagged.includes(header.id)
          const isExpanded = expandedHeaders.includes(header.id)

          return (
            <div
              key={header.id}
              className={`rounded-lg border-2 transition-colors shadow-sm ${
                isFlagged
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-300 bg-white'
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-3 mb-2">
                  <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-small font-semibold text-gray-900">{header.name}</p>
                    <p className="font-mono text-small text-gray-800 break-all mt-1">
                      {header.value}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleExpand(header.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-md border-2 border-blue-200">
                    <p className="text-small text-gray-800 leading-relaxed">
                      {header.explanation}
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => toggleFlag(header.id)}
                  disabled={disabled}
                  className={`mt-3 w-full px-4 py-2 rounded-md text-small font-medium transition-colors ${
                    isFlagged
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {isFlagged ? '⚠️ Flagged as Suspicious' : 'Flag as Suspicious'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border-2 border-green-400 bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-700" />
            <h3 className="text-small font-semibold text-gray-900">Correct Flags</h3>
          </div>
          <p className="text-h3 font-bold text-green-700">{correctlyFlagged}</p>
          <p className="text-small text-gray-700 mt-1">Suspicious headers identified</p>
        </div>

        <div className="rounded-lg border-2 border-orange-400 bg-orange-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5 text-orange-700" />
            <h3 className="text-small font-semibold text-gray-900">False Positives</h3>
          </div>
          <p className="text-h3 font-bold text-orange-700">{incorrectlyFlagged}</p>
          <p className="text-small text-gray-700 mt-1">Legitimate headers flagged</p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || flagged.length < minCorrect}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          flagged.length >= minCorrect ? 'bg-primary-500 hover:bg-primary-600' : 'bg-neutral-700'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled
          ? 'Submitting...'
          : flagged.length >= minCorrect
          ? 'Submit Analysis'
          : `Flag at least ${minCorrect} suspicious headers`}
      </button>
    </div>
  )
}
