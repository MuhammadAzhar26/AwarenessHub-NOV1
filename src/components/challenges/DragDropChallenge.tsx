import { useState, DragEvent } from 'react'
import { GripVertical, CheckCircle, RefreshCw } from 'lucide-react'

interface DropZone {
  id: string
  label: string
  correctItems: string[]
}

interface DraggableItem {
  id: string
  text: string
}

interface DragDropChallengeProps {
  items: DraggableItem[]
  zones: DropZone[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function DragDropChallenge({ items, zones, onSubmit, disabled }: DragDropChallengeProps) {
  const [itemsPool, setItemsPool] = useState<DraggableItem[]>(
    [...items].sort(() => Math.random() - 0.5)
  )
  const [zoneItems, setZoneItems] = useState<Record<string, DraggableItem[]>>(
    zones.reduce((acc, zone) => ({ ...acc, [zone.id]: [] }), {})
  )
  const [draggedItem, setDraggedItem] = useState<DraggableItem | null>(null)
  const [dragSource, setDragSource] = useState<string | null>(null)

  const handleDragStart = (item: DraggableItem, source: string) => {
    if (disabled) return
    setDraggedItem(item)
    setDragSource(source)
  }

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetZone: string) => {
    if (!draggedItem || !dragSource || disabled) return

    if (dragSource === 'pool') {
      // Move from pool to zone
      setItemsPool(prev => prev.filter(item => item.id !== draggedItem.id))
      setZoneItems(prev => ({
        ...prev,
        [targetZone]: [...prev[targetZone], draggedItem]
      }))
    } else if (dragSource !== targetZone) {
      // Move from one zone to another
      setZoneItems(prev => ({
        ...prev,
        [dragSource]: prev[dragSource].filter(item => item.id !== draggedItem.id),
        [targetZone]: [...prev[targetZone], draggedItem]
      }))
    }

    setDraggedItem(null)
    setDragSource(null)
  }

  const handleDropToPool = () => {
    if (!draggedItem || !dragSource || disabled || dragSource === 'pool') return

    // Move from zone back to pool
    setZoneItems(prev => ({
      ...prev,
      [dragSource]: prev[dragSource].filter(item => item.id !== draggedItem.id)
    }))
    setItemsPool(prev => [...prev, draggedItem])

    setDraggedItem(null)
    setDragSource(null)
  }

  const handleReset = () => {
    setItemsPool([...items].sort(() => Math.random() - 0.5))
    setZoneItems(zones.reduce((acc, zone) => ({ ...acc, [zone.id]: [] }), {}))
  }

  const handleSubmit = () => {
    // Format answer as zone:item1,item2;zone2:item3,item4
    const answer = zones
      .map(zone => {
        const items = zoneItems[zone.id].map(item => item.id).join(',')
        return `${zone.id}:${items || 'empty'}`
      })
      .join(';')
    onSubmit(answer)
  }

  const totalPlaced = Object.values(zoneItems).reduce((sum, items) => sum + items.length, 0)
  const isComplete = itemsPool.length === 0

  return (
    <div className="space-y-6">
      {/* Drop Zones */}
      <div className="space-y-4">
        {zones.map(zone => (
          <div
            key={zone.id}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(zone.id)}
            className="border-2 border-dashed border-neutral-300 rounded-lg p-4 min-h-[120px] bg-neutral-50 transition-colors hover:border-primary-400 hover:bg-primary-50/30"
          >
            <h3 className="text-body font-semibold text-neutral-900 mb-3">{zone.label}</h3>
            <div className="flex flex-wrap gap-2">
              {zoneItems[zone.id].map(item => (
                <div
                  key={item.id}
                  draggable={!disabled}
                  onDragStart={() => handleDragStart(item, zone.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-md border border-primary-300 ${
                    disabled ? 'cursor-not-allowed' : 'cursor-move'
                  }`}
                >
                  <GripVertical className="w-4 h-4" />
                  <span className="text-small font-medium">{item.text}</span>
                </div>
              ))}
              {zoneItems[zone.id].length === 0 && (
                <span className="text-small text-neutral-500 italic">Drop items here</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Items Pool */}
      <div
        onDragOver={handleDragOver}
        onDrop={handleDropToPool}
        className="border-2 border-neutral-300 rounded-lg p-4 min-h-[100px] bg-background-surface"
      >
        <h3 className="text-body font-semibold text-neutral-900 mb-3">
          Available Items {itemsPool.length > 0 && `(${itemsPool.length})`}
        </h3>
        <div className="flex flex-wrap gap-2">
          {itemsPool.map(item => (
            <div
              key={item.id}
              draggable={!disabled}
              onDragStart={() => handleDragStart(item, 'pool')}
              className={`inline-flex items-center gap-2 px-4 py-2 bg-neutral-100 text-neutral-700 rounded-md border border-neutral-300 ${
                disabled ? 'cursor-not-allowed' : 'cursor-move'
              }`}
            >
              <GripVertical className="w-4 h-4" />
              <span className="text-small font-medium">{item.text}</span>
            </div>
          ))}
          {itemsPool.length === 0 && (
            <span className="text-small text-neutral-500 italic">All items placed</span>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
        <p className="text-small text-neutral-700">
          Drag items from the pool into the appropriate categories above.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={handleReset}
          disabled={disabled || totalPlaced === 0}
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
          {isComplete ? 'Submit Categories' : `${totalPlaced}/${items.length} Placed`}
        </button>
      </div>
    </div>
  )
}
