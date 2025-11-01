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
        return 'bg-error-900/30 text-error-400 border-error-700'
      case 'medium':
        return 'bg-warning-900/30 text-warning-400 border-warning-700'
      case 'low':
        return 'bg-neutral-700 text-neutral-300 border-neutral-600'
      default:
        return 'bg-neutral-700 text-neutral-300 border-neutral-600'
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
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Analyze this social media profile and identify red flags that suggest it might be fake or suspicious. 
          Select at least {minRequiredFlags} warning signs to complete the challenge.
        </p>
      </div>

      {/* Profile Display */}
      <div className="bg-neutral-800 border border-neutral-700 rounded-lg overflow-hidden">
        <div className="p-6 bg-neutral-900 border-b border-neutral-700">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-neutral-700 flex items-center justify-center">
              <User className="w-10 h-10 text-neutral-500" />
            </div>
            <div className="flex-1">
              <div className="text-h3 text-neutral-100 mb-1">{profileData.username}</div>
              <div className="text-small text-neutral-400 mb-3">{profileData.bio}</div>
              <div className="flex gap-6 text-small">
                <div>
                  <span className="text-neutral-400">Joined:</span>{' '}
                  <span className="text-neutral-100">{profileData.joinDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Followers:</span>{' '}
                  <span className="text-neutral-100">{profileData.followerCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-neutral-900/50">
          <div className="flex items-start gap-2">
            <Image className="w-4 h-4 text-neutral-400 mt-1 flex-shrink-0" />
            <div className="text-small text-neutral-300">
              <strong>Profile Photo:</strong> {profileData.photoDescription}
            </div>
          </div>
        </div>
      </div>

      {/* Red Flags Selection */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="text-h4 text-neutral-100">Identify Red Flags</div>
          <div className="text-small text-neutral-400">
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
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  isSelected
                    ? 'bg-warning-900/20 border-warning-500 shadow-dark-card-hover'
                    : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
                } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Selection Checkbox */}
                  <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-warning-500 border-warning-500' : 'border-neutral-600'
                  }`}>
                    {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="text-neutral-400">
                          {getCategoryIcon(flag.category)}
                        </div>
                        <div>
                          <div className="text-small font-semibold text-neutral-300 mb-1">
                            {flag.category}
                          </div>
                          <div className="text-body text-neutral-100">
                            {flag.indicator}
                          </div>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-caption border ${getSeverityColor(flag.severity)}`}>
                        {flag.severity}
                      </div>
                    </div>
                    <div className="text-small text-neutral-400 ml-7">
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
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-warning-400 hover:text-warning-300 transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Profile Analysis Tips' : 'Show Profile Analysis Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
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
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
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
