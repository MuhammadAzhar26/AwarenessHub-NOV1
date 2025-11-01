import { useState } from 'react'
import { Lock, Eye, UserCheck, MapPin, Bell, Mail, CheckCircle } from 'lucide-react'

interface PrivacyOption {
  id: string
  category: string
  setting: string
  options: string[]
  defaultOption: string
  recommendedOption: string
  description: string
  privacyImpact: 'high' | 'medium' | 'low'
}

interface PrivacySettingsProps {
  privacyOptions: PrivacyOption[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function PrivacySettings({ privacyOptions, onSubmit, disabled }: PrivacySettingsProps) {
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [showHint, setShowHint] = useState(false)

  const handleOptionChange = (optionId: string, value: string) => {
    setSelectedOptions({
      ...selectedOptions,
      [optionId]: value
    })
  }

  const handleSubmit = () => {
    const answer = Object.entries(selectedOptions)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([id, value]) => `${id}:${value}`)
      .join(',')
    onSubmit(answer)
  }

  const calculatePrivacyScore = () => {
    const configured = Object.keys(selectedOptions).length
    const recommended = Object.entries(selectedOptions).filter(
      ([id, value]) => {
        const option = privacyOptions.find(o => o.id === id)
        return option && value === option.recommendedOption
      }
    ).length
    
    if (configured === 0) return 0
    return Math.round((recommended / privacyOptions.length) * 100)
  }

  const privacyScore = calculatePrivacyScore()
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-400'
    if (score >= 50) return 'text-warning-400'
    return 'text-error-400'
  }

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'profile':
        return <UserCheck className="w-5 h-5" />
      case 'location':
        return <MapPin className="w-5 h-5" />
      case 'notifications':
        return <Bell className="w-5 h-5" />
      case 'messages':
        return <Mail className="w-5 h-5" />
      case 'visibility':
        return <Eye className="w-5 h-5" />
      default:
        return <Lock className="w-5 h-5" />
    }
  }

  const getImpactBadge = (impact: string) => {
    const colors = {
      high: 'bg-error-900/30 text-error-400 border-error-700',
      medium: 'bg-warning-900/30 text-warning-400 border-warning-700',
      low: 'bg-success-900/30 text-success-400 border-success-700'
    }
    return colors[impact as keyof typeof colors] || colors.medium
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Configure privacy settings to protect your personal information. 
          Choose the most privacy-conscious option for each setting to maximize your privacy score.
        </p>
      </div>

      {/* Privacy Score Display */}
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-h4 text-neutral-100">Privacy Score</div>
            <div className="text-small text-neutral-400">
              {Object.keys(selectedOptions).length} of {privacyOptions.length} settings configured
            </div>
          </div>
          <div className={`text-h2 font-bold ${getScoreColor(privacyScore)}`}>
            {privacyScore}%
          </div>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              privacyScore >= 80 ? 'bg-success-500' :
              privacyScore >= 50 ? 'bg-warning-500' :
              'bg-error-500'
            }`}
            style={{ width: `${privacyScore}%` }}
          />
        </div>
      </div>

      {/* Privacy Options */}
      <div className="space-y-4">
        {privacyOptions.map((option) => {
          const selectedValue = selectedOptions[option.id]
          const isRecommended = selectedValue === option.recommendedOption

          return (
            <div
              key={option.id}
              className="bg-neutral-800 border border-neutral-700 p-5 rounded-lg"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="p-2 bg-neutral-700 rounded-lg text-neutral-300">
                  {getCategoryIcon(option.category)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div className="text-body font-semibold text-neutral-100">
                      {option.setting}
                    </div>
                    <div className={`px-2 py-1 rounded text-caption border ${getImpactBadge(option.privacyImpact)}`}>
                      {option.privacyImpact} impact
                    </div>
                  </div>
                  <div className="text-small text-neutral-400 mb-3">
                    {option.description}
                  </div>

                  {/* Options */}
                  <div className="space-y-2">
                    {option.options.map((optionValue) => {
                      const isSelected = selectedValue === optionValue
                      const isRecommendedOption = optionValue === option.recommendedOption

                      return (
                        <button
                          key={optionValue}
                          onClick={() => handleOptionChange(option.id, optionValue)}
                          disabled={disabled}
                          className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                            isSelected
                              ? isRecommendedOption
                                ? 'bg-success-900/20 border-success-500'
                                : 'bg-primary-900/30 border-primary-500'
                              : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600'
                          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'bg-primary-500 border-primary-500' : 'border-neutral-600'
                            }`}>
                              {isSelected && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                            <span className="text-small text-neutral-100 flex-1">{optionValue}</span>
                            {isRecommendedOption && (
                              <div className="flex items-center gap-1 text-success-400">
                                <CheckCircle className="w-4 h-4" />
                                <span className="text-caption">Recommended</span>
                              </div>
                            )}
                          </div>
                        </button>
                      )
                    })}
                  </div>
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
          <Lock className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Privacy Tips' : 'Show Privacy Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Limit who can see your profile and posts</p>
            <p>• Disable location tracking when not needed</p>
            <p>• Review app permissions regularly</p>
            <p>• Use two-factor authentication</p>
            <p>• Be selective about friend requests</p>
            <p>• Regularly audit third-party app access</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={Object.keys(selectedOptions).length !== privacyOptions.length || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          Object.keys(selectedOptions).length !== privacyOptions.length || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled 
          ? 'Submitting...' 
          : Object.keys(selectedOptions).length !== privacyOptions.length
          ? `Configure all settings (${Object.keys(selectedOptions).length}/${privacyOptions.length})`
          : 'Submit Privacy Configuration'}
      </button>
    </div>
  )
}
