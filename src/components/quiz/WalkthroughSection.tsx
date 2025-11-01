import { useState, useEffect } from 'react'
import { ChevronDown, ChevronUp, Copy, Book, Terminal, Lightbulb, Zap, AlertCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Walkthrough {
  id: number
  tool_name: string
  category: string
  title: string
  content: string
  code_examples: { language: string; code: string }[]
  order_index: number
}

interface WalkthroughSectionProps {
  toolName: string
}

const categoryIcons = {
  installation: Book,
  commands: Terminal,
  scenarios: Lightbulb,
  advanced: Zap,
  troubleshooting: AlertCircle
}

const categoryColors = {
  installation: 'text-blue-400',
  commands: 'text-green-400',
  scenarios: 'text-yellow-400',
  advanced: 'text-purple-400',
  troubleshooting: 'text-red-400'
}

export default function WalkthroughSection({ toolName }: WalkthroughSectionProps) {
  const [walkthroughs, setWalkthroughs] = useState<Walkthrough[]>([])
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([]))
  const [copiedCode, setCopiedCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWalkthroughs()
  }, [toolName])

  async function loadWalkthroughs() {
    const { data, error } = await supabase
      .from('walkthroughs')
      .select('*')
      .eq('tool_name', toolName)
      .order('category')
      .order('order_index')

    if (!error && data) {
      setWalkthroughs(data)
      // Expand first section by default
      if (data.length > 0) {
        setExpandedSections(new Set([data[0].id]))
      }
    }
    setLoading(false)
  }

  const toggleSection = (id: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedSections(newExpanded)
  }

  const copyCode = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  if (loading) {
    return <div className="text-neutral-400">Loading walkthrough...</div>
  }

  if (walkthroughs.length === 0) {
    return null
  }

  return (
    <div className="bg-neutral-900 rounded-lg border border-neutral-800 p-8">
      <div className="flex items-center gap-3 mb-6">
        <Book className="w-6 h-6 text-primary-400" />
        <h2 className="text-h3 text-white font-semibold">Comprehensive Walkthrough</h2>
      </div>

      <div className="space-y-4">
        {walkthroughs.map((walkthrough) => {
          const isExpanded = expandedSections.has(walkthrough.id)
          const Icon = categoryIcons[walkthrough.category as keyof typeof categoryIcons] || Book
          const iconColor = categoryColors[walkthrough.category as keyof typeof categoryColors] || 'text-primary-400'

          return (
            <div
              key={walkthrough.id}
              className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => toggleSection(walkthrough.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-neutral-900 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${iconColor}`} />
                  <div className="text-left">
                    <h3 className="text-body text-white font-medium">{walkthrough.title}</h3>
                    <p className="text-caption text-neutral-400 capitalize">{walkthrough.category}</p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-neutral-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-neutral-400" />
                )}
              </button>

              {/* Content */}
              {isExpanded && (
                <div className="p-5 pt-0 border-t border-neutral-800">
                  <div className="prose prose-invert max-w-none">
                    <div className="text-body text-neutral-300 whitespace-pre-wrap leading-relaxed">
                      {walkthrough.content}
                    </div>
                  </div>

                  {/* Code Examples */}
                  {walkthrough.code_examples && walkthrough.code_examples.length > 0 && (
                    <div className="mt-6 space-y-3">
                      {walkthrough.code_examples.map((example, idx) => (
                        <div
                          key={idx}
                          className="relative bg-neutral-900 rounded-lg border border-neutral-800 overflow-hidden"
                        >
                          <div className="flex items-center justify-between px-4 py-2 bg-neutral-900 border-b border-neutral-800">
                            <span className="text-caption text-neutral-400 uppercase font-mono">
                              {example.language}
                            </span>
                            <button
                              onClick={() => copyCode(example.code, `${walkthrough.id}-${idx}`)}
                              className="flex items-center gap-2 text-caption text-primary-400 hover:text-primary-300 transition-colors"
                            >
                              <Copy className="w-4 h-4" />
                              {copiedCode === `${walkthrough.id}-${idx}` ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <div className="p-4">
                            <pre className="text-caption text-neutral-200 font-mono overflow-x-auto">
                              <code>{example.code}</code>
                            </pre>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/30 rounded-lg">
        <p className="text-caption text-neutral-300">
          <span className="font-medium text-primary-400">Pro Tip:</span> Practice these commands in a safe lab environment before using in production.
        </p>
      </div>
    </div>
  )
}
