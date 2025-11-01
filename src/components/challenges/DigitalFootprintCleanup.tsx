import { useState } from 'react'
import { Trash2, Check, AlertCircle, Eye, Globe, MapPin, Image as ImageIcon } from 'lucide-react'

interface DigitalFootprint {
  id: string
  category: 'social-media' | 'search-history' | 'location' | 'photos' | 'accounts'
  item: string
  description: string
  riskLevel: 'high' | 'medium' | 'low'
  shouldRemove: boolean
}

interface DigitalFootprintCleanupProps {
  footprints: DigitalFootprint[]
  correctRemovals: string[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function DigitalFootprintCleanup({ 
  footprints, 
  correctRemovals, 
  onSubmit, 
  disabled 
}: DigitalFootprintCleanupProps) {
  const [removedItems, setRemovedItems] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const toggleRemove = (itemId: string) => {
    if (removedItems.includes(itemId)) {
      setRemovedItems(removedItems.filter(id => id !== itemId))
    } else {
      setRemovedItems([...removedItems, itemId])
    }
  }

  const handleSubmit = () => {
    onSubmit(removedItems.sort().join(','))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'social-media':
        return <Globe className="w-5 h-5" />
      case 'search-history':
        return <Eye className="w-5 h-5" />
      case 'location':
        return <MapPin className="w-5 h-5" />
      case 'photos':
        return <ImageIcon className="w-5 h-5" />
      case 'accounts':
        return <Globe className="w-5 h-5" />
      default:
        return <AlertCircle className="w-5 h-5" />
    }
  }

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'bg-error-900/30 text-error-400 border-error-700'
      case 'medium':
        return 'bg-warning-900/30 text-warning-400 border-warning-700'
      case 'low':
        return 'bg-success-900/30 text-success-400 border-success-700'
      default:
        return 'bg-neutral-700 text-neutral-300 border-neutral-600'
    }
  }

  const calculateCleanupScore = () => {
    const totalHigh = footprints.filter(f => f.riskLevel === 'high').length
    const removedHigh = removedItems.filter(id => {
      const item = footprints.find(f => f.id === id)
      return item && item.riskLevel === 'high'
    }).length
    
    if (totalHigh === 0) return 100
    return Math.round((removedHigh / totalHigh) * 100)
  }

  const cleanupScore = calculateCleanupScore()

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Review your digital footprint and decide which items should be removed to protect your privacy. 
          Click the trash icon to mark items for removal.
        </p>
      </div>

      {/* Cleanup Progress */}
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-h4 text-neutral-100">Cleanup Progress</div>
            <div className="text-small text-neutral-400">
              {removedItems.length} items marked for removal
            </div>
          </div>
          <div className="text-h2 font-bold text-primary-400">
            {cleanupScore}%
          </div>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3">
          <div
            className="h-3 bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${cleanupScore}%` }}
          />
        </div>
      </div>

      {/* Footprint Items */}
      <div className="space-y-3">
        {footprints.map((footprint) => {
          const isRemoved = removedItems.includes(footprint.id)

          return (
            <div
              key={footprint.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isRemoved
                  ? 'bg-neutral-900 border-neutral-600 opacity-60'
                  : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className={`p-3 rounded-lg ${
                  isRemoved ? 'bg-neutral-700' : 'bg-neutral-700'
                }`}>
                  <div className="text-neutral-400">
                    {getCategoryIcon(footprint.category)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-caption text-neutral-500 mb-1">
                        {getCategoryLabel(footprint.category)}
                      </div>
                      <div className={`text-body font-semibold mb-1 ${
                        isRemoved ? 'text-neutral-500 line-through' : 'text-neutral-100'
                      }`}>
                        {footprint.item}
                      </div>
                      <div className="text-small text-neutral-400">
                        {footprint.description}
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded text-caption border ${getRiskColor(footprint.riskLevel)}`}>
                      {footprint.riskLevel} risk
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => toggleRemove(footprint.id)}
                    disabled={disabled}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all mt-3 ${
                      isRemoved
                        ? 'bg-success-900/30 border-2 border-success-500 text-success-400'
                        : 'bg-error-900/30 border-2 border-error-700 text-error-400 hover:bg-error-900/50'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isRemoved ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-small font-medium">Marked for Removal</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        <span className="text-small font-medium">Remove This Item</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Hint Section */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-warning-400 hover:text-warning-300 transition-colors"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Digital Footprint Tips' : 'Show Digital Footprint Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Remove old social media posts that contain sensitive information</p>
            <p>• Delete unused online accounts to minimize exposure</p>
            <p>• Clear location history from maps and social media apps</p>
            <p>• Remove photos that reveal personal details or location</p>
            <p>• Request data deletion from websites you no longer use</p>
            <p>• Use privacy-focused search engines to limit tracking</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={removedItems.length === 0 || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          removedItems.length === 0 || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled ? 'Submitting...' : 'Complete Cleanup'}
      </button>
    </div>
  )
}
