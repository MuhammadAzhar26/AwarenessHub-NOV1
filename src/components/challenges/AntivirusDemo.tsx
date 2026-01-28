import { useState } from 'react'
import { Shield, CheckCircle, Zap, Clock, Globe, Lock } from 'lucide-react'

interface AntivirusFeature {
  id: string
  name: string
  description: string
  benefit: string
  isEssential: boolean
  icon: 'shield' | 'zap' | 'clock' | 'globe' | 'lock'
}

interface AntivirusDemoProps {
  features: AntivirusFeature[]
  correctFeatures: string[]
  minRequired: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function AntivirusDemo({ 
  features, 
  correctFeatures, 
  minRequired, 
  onSubmit, 
  disabled 
}: AntivirusDemoProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const toggleFeature = (featureId: string) => {
    if (selectedFeatures.includes(featureId)) {
      setSelectedFeatures(selectedFeatures.filter(id => id !== featureId))
    } else {
      setSelectedFeatures([...selectedFeatures, featureId])
    }
  }

  const handleSubmit = () => {
    onSubmit(selectedFeatures.sort().join(','))
  }

  const getFeatureIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return <Shield className="w-6 h-6" />
      case 'zap':
        return <Zap className="w-6 h-6" />
      case 'clock':
        return <Clock className="w-6 h-6" />
      case 'globe':
        return <Globe className="w-6 h-6" />
      case 'lock':
        return <Lock className="w-6 h-6" />
      default:
        return <Shield className="w-6 h-6" />
    }
  }

  const calculateProtectionScore = () => {
    const essentialSelected = selectedFeatures.filter(id => {
      const feature = features.find(f => f.id === id)
      return feature && feature.isEssential
    }).length
    
    const totalEssential = features.filter(f => f.isEssential).length
    
    if (totalEssential === 0) return 100
    return Math.round((essentialSelected / totalEssential) * 100)
  }

  const protectionScore = calculateProtectionScore()
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success-400'
    if (score >= 50) return 'text-warning-400'
    return 'text-error-400'
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Learn about antivirus features and select the essential ones for comprehensive protection. 
          Choose at least {minRequired} important features to complete the challenge.
        </p>
      </div>

      {/* Protection Score */}
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-h4 text-neutral-100">Protection Level</div>
            <div className="text-small text-neutral-400">
              {selectedFeatures.length} features enabled
            </div>
          </div>
          <div className={`text-h2 font-bold ${getScoreColor(protectionScore)}`}>
            {protectionScore}%
          </div>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              protectionScore >= 80 ? 'bg-success-500' :
              protectionScore >= 50 ? 'bg-warning-500' :
              'bg-error-500'
            }`}
            style={{ width: `${protectionScore}%` }}
          />
        </div>
      </div>

      {/* Feature Selection */}
      <div className="space-y-3">
        {features.map((feature) => {
          const isSelected = selectedFeatures.includes(feature.id)

          return (
            <div
              key={feature.id}
              className={`p-5 rounded-lg border-2 transition-all ${
                isSelected
                  ? 'bg-primary-900/30 border-primary-500 shadow-dark-card-hover'
                  : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${
                  isSelected ? 'bg-primary-600' : 'bg-neutral-700'
                }`}>
                  <div className={isSelected ? 'text-white' : 'text-neutral-400'}>
                    {getFeatureIcon(feature.icon)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-body font-semibold text-neutral-100 mb-1">
                        {feature.name}
                      </div>
                      <div className="text-small text-neutral-400 mb-2">
                        {feature.description}
                      </div>
                    </div>
                    {feature.isEssential && (
                      <div className="px-2 py-1 rounded text-caption bg-success-900/30 text-success-400 border border-success-700 flex-shrink-0 ml-2">
                        Essential
                      </div>
                    )}
                  </div>

                  {/* Benefit */}
                  <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-lg mb-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-small font-semibold text-neutral-100 mb-1">Benefit</div>
                        <div className="text-small text-neutral-300">{feature.benefit}</div>
                      </div>
                    </div>
                  </div>

                  {/* Toggle Button */}
                  <button
                    onClick={() => toggleFeature(feature.id)}
                    disabled={disabled}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                      isSelected
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-neutral-700 text-neutral-300 hover:bg-neutral-600'
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSelected ? (
                      <div className="flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        <span>Feature Enabled</span>
                      </div>
                    ) : (
                      'Enable This Feature'
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
          <Shield className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Antivirus Tips' : 'Show Antivirus Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Real-time scanning catches threats as they appear</p>
            <p>• Regular automatic updates ensure protection against new malware</p>
            <p>• Email scanning prevents phishing and malicious attachments</p>
            <p>• Web protection blocks dangerous websites and downloads</p>
            <p>• Scheduled scans find hidden threats on your system</p>
            <p>• Firewall integration adds an extra layer of defense</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedFeatures.length < minRequired || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          selectedFeatures.length < minRequired || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled 
          ? 'Submitting...' 
          : selectedFeatures.length < minRequired
          ? `Select ${minRequired - selectedFeatures.length} more features`
          : 'Complete Setup'}
      </button>
    </div>
  )
}
