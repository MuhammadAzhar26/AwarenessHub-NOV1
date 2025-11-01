import { useState } from 'react'
import { ChevronDown, ChevronUp, Copy, Check, FileText } from 'lucide-react'

interface CodeExample {
  language: string
  description: string
  code: string
}

interface TranscriptSection {
  id: number
  start_time: number
  end_time: number
  section_title: string
  content: string
  code_examples: CodeExample[]
  order_index: number
}

interface TranscriptPanelProps {
  transcripts: TranscriptSection[]
  onTimestampClick: (time: number) => void
}

export default function TranscriptPanel({ transcripts, onTimestampClick }: TranscriptPanelProps) {
  const [isOpen, setIsOpen] = useState(true)
  const [expandedSections, setExpandedSections] = useState<number[]>([])
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const toggleSection = (sectionId: number) => {
    if (expandedSections.includes(sectionId)) {
      setExpandedSections(expandedSections.filter(id => id !== sectionId))
    } else {
      setExpandedSections([...expandedSections, sectionId])
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (transcripts.length === 0) {
    return null
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-primary-400" />
          <h3 className="text-h3 font-bold text-neutral-100">Guided Transcript & Commands</h3>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-neutral-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-neutral-400" />
        )}
      </button>

      {/* Transcript Content */}
      {isOpen && (
        <div className="border-t border-neutral-800">
          <div className="p-4 space-y-3 max-h-[600px] overflow-y-auto">
            {transcripts
              .sort((a, b) => a.order_index - b.order_index)
              .map((section) => {
                const isExpanded = expandedSections.includes(section.id)
                
                return (
                  <div
                    key={section.id}
                    className="bg-neutral-800 rounded-lg border border-neutral-700 overflow-hidden"
                  >
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(section.id)}
                      className="w-full p-3 flex items-center justify-between hover:bg-neutral-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onTimestampClick(section.start_time)
                          }}
                          className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded text-small font-mono hover:bg-primary-500/30 transition-colors"
                        >
                          {formatTime(section.start_time)}
                        </button>
                        <span className="text-body font-semibold text-neutral-100">
                          {section.section_title}
                        </span>
                      </div>
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                      )}
                    </button>

                    {/* Section Content */}
                    {isExpanded && (
                      <div className="p-4 border-t border-neutral-700 space-y-4">
                        {/* Text Content */}
                        <div className="prose prose-sm prose-invert max-w-none">
                          <div
                            className="text-small text-neutral-300 whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: section.content.replace(/\n/g, '<br/>') }}
                          />
                        </div>

                        {/* Code Examples */}
                        {section.code_examples && section.code_examples.length > 0 && (
                          <div className="space-y-3">
                            {section.code_examples.map((example, idx) => {
                              const codeId = `${section.id}-${idx}`
                              const isCopied = copiedCode === codeId

                              return (
                                <div key={idx} className="bg-neutral-900 rounded-lg border border-neutral-700 overflow-hidden">
                                  <div className="px-3 py-2 bg-neutral-800/50 border-b border-neutral-700 flex items-center justify-between">
                                    <span className="text-caption text-neutral-400">
                                      {example.description}
                                    </span>
                                    <button
                                      onClick={() => copyCode(example.code, codeId)}
                                      className="flex items-center gap-1 text-caption text-neutral-400 hover:text-primary-400 transition-colors"
                                    >
                                      {isCopied ? (
                                        <>
                                          <Check className="w-3 h-3" />
                                          <span>Copied!</span>
                                        </>
                                      ) : (
                                        <>
                                          <Copy className="w-3 h-3" />
                                          <span>Copy</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                  <div className="p-3">
                                    <pre className="text-small font-mono text-neutral-100 overflow-x-auto">
                                      <code className={example.language === 'bash' ? 'language-bash' : ''}>
                                        {example.code}
                                      </code>
                                    </pre>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        )}

                        {/* Time Range */}
                        <div className="text-caption text-neutral-500 pt-2 border-t border-neutral-700">
                          Duration: {formatTime(section.start_time)} - {formatTime(section.end_time)}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </div>
      )}
    </div>
  )
}
