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
        return 'bg-red-50 text-red-600 border-red-200'
      case 'medium':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200'
      case 'low':
        return 'bg-green-50 text-green-600 border-green-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
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
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Review your digital footprint and decide which items should be removed to protect your privacy. 
          Click the trash icon to mark items for removal.
        </p>
      </div>

      {/* Cleanup Progress */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-h4 text-gray-900">Cleanup Progress</div>
            <div className="text-small text-gray-600">
              {removedItems.length} items marked for removal
            </div>
          </div>
          <div className="text-h2 font-bold text-blue-600">
            {cleanupScore}%
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 bg-blue-600 rounded-full transition-all duration-300"
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
                  ? 'bg-gray-50 border-gray-300 opacity-60'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className={`p-3 rounded-lg ${
                  isRemoved ? 'bg-gray-100' : 'bg-gray-100'
                }`}>
                  <div className="text-gray-600">
                    {getCategoryIcon(footprint.category)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-caption text-gray-500 mb-1">
                        {getCategoryLabel(footprint.category)}
                      </div>
                      <div className={`text-body font-semibold mb-1 ${
                        isRemoved ? 'text-gray-500 line-through' : 'text-gray-900'
                      }`}>
                        {footprint.item}
                      </div>
                      <div className="text-small text-gray-600">
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
                        ? 'bg-green-50 border-2 border-green-500 text-green-600'
                        : 'bg-red-50 border-2 border-red-200 text-red-600 hover:bg-red-100'
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
      <div className="bg-white border border-gray-200 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors"
        >
          <AlertCircle className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Digital Footprint Tips' : 'Show Digital Footprint Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-gray-700">
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
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-card hover:shadow-card-hover'
        }`}
      >
        {disabled ? 'Submitting...' : 'Complete Cleanup'}
      </button>
    </div>
  )
}
