import { useState } from 'react'
import { FileWarning, CheckCircle, AlertTriangle } from 'lucide-react'

type AttachmentRiskProps = {
  attachments: Array<{
    id: string
    filename: string
    extension: string
    size: string
    riskLevel: 'safe' | 'suspicious' | 'dangerous'
  }>
  onSubmit: (answer: string) => void
  disabled?: boolean
}

const RISK_CATEGORIES = [
  { id: 'safe', label: 'Safe to Open', color: 'success', description: 'Low-risk file types' },
  { id: 'suspicious', label: 'Verify First', color: 'warning', description: 'Needs verification' },
  { id: 'dangerous', label: 'Do Not Open', color: 'error', description: 'High-risk executables' },
]

export default function AttachmentRisk({ attachments, onSubmit, disabled }: AttachmentRiskProps) {
  const [classifications, setClassifications] = useState<Record<string, string>>(
    attachments.reduce((acc, a) => ({ ...acc, [a.id]: '' }), {})
  )

  const allClassified = Object.values(classifications).every(val => val !== '')

  const handleClassify = (attachmentId: string, riskLevel: string) => {
    setClassifications(prev => ({ ...prev, [attachmentId]: riskLevel }))
  }

  const handleSubmit = () => {
    // Format: att1:safe,att2:dangerous
    const answer = Object.entries(classifications)
      .map(([id, risk]) => `${id}:${risk}`)
      .join(',')
    onSubmit(answer)
  }

  return (
    <div className="space-y-6">
      <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Classify each email attachment based on its file type and extension
          to identify safe, suspicious, and dangerous files.
        </p>
      </div>

      <div className="space-y-4">
        {attachments.map(attachment => {
          const selected = classifications[attachment.id]

          return (
            <div
              key={attachment.id}
              className="rounded-lg border border-neutral-700 bg-neutral-900 p-4"
            >
              <div className="flex items-start gap-3 mb-4">
                <FileWarning className="w-5 h-5 text-primary-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <p className="text-body font-semibold text-neutral-100">{attachment.filename}</p>
                  <div className="flex items-center gap-4 mt-1 text-small text-neutral-400">
                    <span>Extension: <span className="text-warning-400">{attachment.extension}</span></span>
                    <span>Size: {attachment.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {RISK_CATEGORIES.map(category => {
                  const isSelected = selected === category.id
                  const colorClasses = {
                    success: isSelected
                      ? 'bg-success-500 text-white border-success-400'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border-neutral-700',
                    warning: isSelected
                      ? 'bg-warning-500 text-white border-warning-400'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border-neutral-700',
                    error: isSelected
                      ? 'bg-error-500 text-white border-error-400'
                      : 'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 border-neutral-700',
                  }

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleClassify(attachment.id, category.id)}
                      disabled={disabled}
                      className={`px-4 py-2 rounded-md text-small font-medium border transition-colors ${
                        colorClasses[category.color as keyof typeof colorClasses]
                      }`}
                    >
                      {category.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
        <h3 className="text-body font-semibold text-neutral-100 mb-3">Risk Assessment Guide</h3>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-success-500 flex-shrink-0 mt-0.5" />
            <div className="text-small text-neutral-300">
              <strong className="text-success-400">Safe:</strong> Documents (.pdf, .txt, .jpg, .png), generally low risk
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-warning-500 flex-shrink-0 mt-0.5" />
            <div className="text-small text-neutral-300">
              <strong className="text-warning-400">Suspicious:</strong> Archives (.zip, .rar), Office macros (.docm, .xlsm), verify sender
            </div>
          </div>
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-error-500 flex-shrink-0 mt-0.5" />
            <div className="text-small text-neutral-300">
              <strong className="text-error-400">Dangerous:</strong> Executables (.exe, .bat, .scr, .js, .vbs), never open from unknown sources
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !allClassified}
        className={`w-full px-6 py-4 rounded-lg font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
          allClassified ? 'bg-primary-500 hover:bg-primary-600' : 'bg-neutral-700'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : allClassified ? 'Submit Risk Assessment' : 'Classify all attachments first'}
      </button>
    </div>
  )
}
