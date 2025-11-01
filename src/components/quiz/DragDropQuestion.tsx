import { useState } from 'react'
import { CheckCircle, XCircle, GripVertical } from 'lucide-react'

interface DragDropQuestionProps {
  question: string
  items: string[]
  zones: string[]
  correctPairs: Array<{ item: string; zone: string }>
  explanation: string
  onAnswer: (isCorrect: boolean, pairs: Array<{ item: string; zone: string }>) => void
  disabled?: boolean
}

export default function DragDropQuestion({
  question,
  items,
  zones,
  correctPairs,
  explanation,
  onAnswer,
  disabled = false
}: DragDropQuestionProps) {
  const [placements, setPlacements] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const handleDragStart = (item: string) => {
    setDraggedItem(item)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (zone: string) => {
    if (draggedItem && !submitted) {
      setPlacements({
        ...placements,
        [draggedItem]: zone
      })
      setDraggedItem(null)
    }
  }

  const handleRemove = (item: string) => {
    const newPlacements = { ...placements }
    delete newPlacements[item]
    setPlacements(newPlacements)
  }

  const handleSubmit = () => {
    // Check if all items are placed
    if (Object.keys(placements).length !== items.length) return

    // Convert placements to pairs
    const userPairs = Object.entries(placements).map(([item, zone]) => ({ item, zone }))

    // Check if correct
    const correct = correctPairs.every(({ item, zone }) => {
      return placements[item] === zone
    })

    setIsCorrect(correct)
    setSubmitted(true)
    onAnswer(correct, userPairs)
  }

  const getItemsInZone = (zone: string) => {
    return Object.entries(placements)
      .filter(([_, z]) => z === zone)
      .map(([item]) => item)
  }

  const unplacedItems = items.filter(item => !placements[item])

  return (
    <div className="space-y-6">
      <div className="text-h3 font-semibold text-neutral-100 mb-6">
        {question}
      </div>

      <div className="text-small text-neutral-400 mb-4">
        Drag items from the left to matching zones on the right
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Unplaced Items */}
        <div className="space-y-3">
          <div className="text-body font-semibold text-neutral-200 mb-3">
            Items to Match
          </div>
          {unplacedItems.length === 0 ? (
            <div className="p-6 border-2 border-dashed border-neutral-700 rounded-lg text-center text-neutral-500">
              All items placed
            </div>
          ) : (
            <div className="space-y-2">
              {unplacedItems.map(item => (
                <div
                  key={item}
                  draggable={!submitted && !disabled}
                  onDragStart={() => handleDragStart(item)}
                  className={`p-3 bg-neutral-800 border-2 border-neutral-700 rounded-lg flex items-center gap-2 ${
                    !submitted && !disabled ? 'cursor-move hover:border-primary-500' : 'cursor-not-allowed opacity-70'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-neutral-500" />
                  <span className="text-body text-neutral-100 font-mono">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drop Zones */}
        <div className="space-y-3">
          <div className="text-body font-semibold text-neutral-200 mb-3">
            Categories
          </div>
          {zones.map(zone => {
            const itemsInZone = getItemsInZone(zone)
            const correctItem = correctPairs.find(pair => pair.zone === zone)
            const hasCorrectItem = submitted && correctItem && itemsInZone.includes(correctItem.item)
            const hasIncorrectItem = submitted && itemsInZone.length > 0 && !hasCorrectItem

            return (
              <div
                key={zone}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(zone)}
                className={`min-h-[60px] p-3 border-2 border-dashed rounded-lg transition-colors ${
                  hasCorrectItem
                    ? 'border-green-500 bg-green-500/10'
                    : hasIncorrectItem
                    ? 'border-red-500 bg-red-500/10'
                    : draggedItem
                    ? 'border-primary-500 bg-primary-500/10'
                    : 'border-neutral-700'
                }`}
              >
                <div className="text-small text-neutral-300 mb-2 font-semibold">{zone}</div>
                {itemsInZone.map(item => (
                  <div
                    key={item}
                    className="p-2 bg-neutral-900 border border-neutral-700 rounded flex items-center justify-between"
                  >
                    <span className="text-body text-neutral-100 font-mono">{item}</span>
                    {!submitted && (
                      <button
                        onClick={() => handleRemove(item)}
                        className="text-neutral-500 hover:text-red-400 text-small"
                      >
                        ✕
                      </button>
                    )}
                    {submitted && hasCorrectItem && <CheckCircle className="w-4 h-4 text-green-500" />}
                    {submitted && hasIncorrectItem && <XCircle className="w-4 h-4 text-red-500" />}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>

      {submitted && (
        <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-500/10 border border-green-500' : 'bg-red-500/10 border border-red-500'}`}>
          <div className="flex items-start gap-3">
            {isCorrect ? (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <div className={`font-semibold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
              </div>
              <div className="text-small text-neutral-300">{explanation}</div>
            </div>
          </div>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={Object.keys(placements).length !== items.length || disabled}
          className="w-full px-6 py-3 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Answer
        </button>
      )}
    </div>
  )
}
