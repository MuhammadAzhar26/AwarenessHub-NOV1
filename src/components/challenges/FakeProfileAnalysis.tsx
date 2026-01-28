import { useState } from 'react'
import { User, AlertTriangle, CheckCircle, Flag, Calendar, Users, Image } from 'lucide-react'

interface ProfileRedFlag {
  id: string
  category: string
  indicator: string
  description: string
  severity: 'high' | 'medium' | 'low'
}

interface FakeProfileAnalysisProps {
  profileData: {
    username: string
    bio: string
    joinDate: string
    followerCount: string
    photoDescription: string
  }
  redFlags: ProfileRedFlag[]
  correctFlags: string[]
  minRequiredFlags: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function FakeProfileAnalysis({ 
  profileData, 
  redFlags, 
  correctFlags,
  minRequiredFlags,
  onSubmit, 
  disabled 
}: FakeProfileAnalysisProps) {
  const [selectedFlags, setSelectedFlags] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const toggleFlag = (flagId: string) => {
    if (selectedFlags.includes(flagId)) {
      setSelectedFlags(selectedFlags.filter(id => id !== flagId))
    } else {
      setSelectedFlags([...selectedFlags, flagId])
    }
  }

  const handleSubmit = () => {
    onSubmit(selectedFlags.sort().join(','))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-400'
      case 'medium':
        return 'bg-orange-100 text-orange-700 border-orange-400'
      case 'low':
        return 'bg-gray-100 text-gray-700 border-gray-400'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-400'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'account age':
        return <Calendar className="w-5 h-5" />
      case 'followers':
        return <Users className="w-5 h-5" />
      case 'profile photo':
        return <Image className="w-5 h-5" />
      case 'content':
        return <User className="w-5 h-5" />
      default:
        return <Flag className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Analyze this social media profile and identify red flags that suggest it might be fake or suspicious. 
          Select at least {minRequiredFlags} warning signs to complete the challenge.
        </p>
      </div>

      {/* Profile Display */}
      <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden shadow-md">
        <div className="p-6 bg-gray-50 border-b-2 border-gray-300">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="w-10 h-10 text-gray-600" />
            </div>
            <div className="flex-1">
              <div className="text-h3 text-gray-900 font-bold mb-1">{profileData.username}</div>
              <div className="text-small text-gray-700 mb-3">{profileData.bio}</div>
              <div className="flex gap-6 text-small">
                <div>
                  <span className="text-gray-600">Joined:</span>{' '}
                  <span className="text-gray-900 font-semibold">{profileData.joinDate}</span>
                </div>
                <div>
                  <span className="text-gray-600">Followers:</span>{' '}
                  <span className="text-gray-900 font-semibold">{profileData.followerCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-blue-50 border-t border-blue-200">
          <div className="flex items-start gap-2">
            <Image className="w-4 h-4 text-blue-600 mt-1 flex-shrink-0" />
            <div className="text-small text-gray-800">
              <strong>Profile Photo:</strong> {profileData.photoDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-h4 text-gray-900 font-semibold">Identify Red Flags</div>
          <div className="text-small text-gray-600">
            {selectedFlags.length} selected (min. {minRequiredFlags} required)
          </div>
        </div>

        <div className="space-y-3">
          {redFlags.map((flag) => {
            const isSelected = selectedFlags.includes(flag.id)

            return (
              <button
                key={flag.id}
                onClick={() => toggleFlag(flag.id)}
                disabled={disabled}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left shadow-sm ${
                  isSelected
                    ? 'bg-orange-50 border-orange-500 shadow-md'
                    : 'bg-white border-gray-300 hover:border-gray-400'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Selection Checkbox */}
                  <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-400 bg-white'
                  }`}>
                    {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-gray-600">
                          {getCategoryIcon(flag.category)}
                        </div>
                        <div>
                          <div className="text-small font-semibold text-gray-700 mb-1">
                            {flag.category}
                          </div>
                          <div className="text-body text-gray-900 font-semibold">
                            {flag.indicator}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-caption border font-semibold ${getSeverityColor(flag.severity)}`}>
                        {flag.severity}
                      </div>
                    </div>
                    <div className="text-small text-gray-700 ml-7">
                      {flag.description}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Hint Section */}
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors font-semibold"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Profile Analysis Tips' : 'Show Profile Analysis Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-gray-800">
            <p>• Check account creation date - very recent accounts may be suspicious</p>
            <p>• Look at follower-to-following ratio - fake accounts often follow many but have few followers</p>
            <p>• Examine profile photo - stock photos or celebrities are red flags</p>
            <p>• Review bio and posts for generic or copied content</p>
            <p>• Be wary of accounts with little to no activity</p>
            <p>• Watch for unusual posting patterns or spam-like behavior</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedFlags.length < minRequiredFlags || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          selectedFlags.length < minRequiredFlags || disabled
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
        }`}
      >
        {disabled 
          ? 'Submitting...' 
          : selectedFlags.length < minRequiredFlags
          ? `Select at least ${minRequiredFlags} red flags`
          : 'Submit Analysis'}
      </button>
    </div>
  )
}
