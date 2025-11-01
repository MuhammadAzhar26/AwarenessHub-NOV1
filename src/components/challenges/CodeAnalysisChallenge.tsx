import { useState } from 'react'
import { AlertTriangle, CheckCircle, Code } from 'lucide-react'

interface CodeIssue {
  line: number
  id: string
  description: string
}

interface CodeAnalysisChallengeProps {
  code: string
  issues: CodeIssue[]
  language?: string
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function CodeAnalysisChallenge({
  code,
  issues,
  language = 'javascript',
  onSubmit,
  disabled
}: CodeAnalysisChallengeProps) {
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set())

  const codeLines = code.split('\n')

  const toggleIssue = (issueId: string) => {
    if (disabled) return
    setSelectedIssues(prev => {
      const newSet = new Set(prev)
      if (newSet.has(issueId)) {
        newSet.delete(issueId)
      } else {
        newSet.add(issueId)
      }
      return newSet
    })
  }

  const handleSubmit = () => {
    // Format answer as comma-separated issue IDs
    const answer = Array.from(selectedIssues).sort().join(',')
    onSubmit(answer)
  }

  const isComplete = selectedIssues.size > 0

  return (
    <div className="space-y-6">
      {/* Code Display */}
      <div className="bg-neutral-900 rounded-lg p-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-4 text-neutral-400">
          <Code className="w-4 h-4" />
          <span className="text-small font-mono">{language}</span>
        </div>
        <pre className="text-small font-mono text-neutral-100 leading-relaxed">
          {codeLines.map((line, idx) => {
            const lineNumber = idx + 1
            const hasIssue = issues.some(issue => issue.line === lineNumber)
            
            return (
              <div
                key={idx}
                className={`${hasIssue ? 'bg-error-900/30 border-l-4 border-error-500' : ''} px-2 -mx-2`}
              >
                <span className="text-neutral-500 select-none mr-4 inline-block w-8 text-right">
                  {lineNumber}
                </span>
                <span>{line}</span>
              </div>
            )
          })}
        </pre>
      </div>

      {/* Issue Selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-neutral-900">
          <AlertTriangle className="w-5 h-5 text-warning-600" />
          <h3 className="text-body font-semibold">
            Identify Security Issues ({selectedIssues.size} selected)
          </h3>
        </div>

        <div className="space-y-3">
          {issues.map(issue => {
            const isSelected = selectedIssues.has(issue.id)
            
            return (
              <button
                key={issue.id}
                onClick={() => toggleIssue(issue.id)}
                disabled={disabled}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-neutral-200 bg-background-surface hover:border-primary-300'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center ${
                    isSelected
                      ? 'border-primary-500 bg-primary-500'
                      : 'border-neutral-300'
                  }`}>
                    {isSelected && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-small font-mono text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded">
                        Line {issue.line}
                      </span>
                    </div>
                    <p className="text-body text-neutral-900">{issue.description}</p>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <p className="text-small text-neutral-700">
          Review the code above and select all security issues you can identify. 
          Lines with potential issues are highlighted.
        </p>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={disabled || !isComplete}
          className="px-6 py-3 bg-primary-500 text-white font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isComplete ? 'Submit Analysis' : 'Select at least one issue'}
        </button>
      </div>
    </div>
  )
}
