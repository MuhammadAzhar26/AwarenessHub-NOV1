import { useState } from 'react'
import { Shield, Eye, EyeOff, Cookie, Lock, CheckCircle, XCircle } from 'lucide-react'

interface SecuritySetting {
  id: string
  name: string
  description: string
  icon: 'shield' | 'eye' | 'cookie' | 'lock'
  isSecure: boolean
  impact: string
}

interface BrowserSecurityProps {
  settings: SecuritySetting[]
  correctSettings: string[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function BrowserSecurity({ settings, correctSettings, onSubmit, disabled }: BrowserSecurityProps) {
  const [enabledSettings, setEnabledSettings] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const toggleSetting = (settingId: string) => {
    if (enabledSettings.includes(settingId)) {
      setEnabledSettings(enabledSettings.filter(id => id !== settingId))
    } else {
      setEnabledSettings([...enabledSettings, settingId])
    }
  }

  const handleSubmit = () => {
    onSubmit(enabledSettings.sort().join(','))
  }

  const getIcon = (iconType: string) => {
    switch (iconType) {
      case 'shield':
        return <Shield className="w-6 h-6" />
      case 'eye':
        return <Eye className="w-6 h-6" />
      case 'cookie':
        return <Cookie className="w-6 h-6" />
      case 'lock':
        return <Lock className="w-6 h-6" />
      default:
        return <Shield className="w-6 h-6" />
    }
  }

  const calculateSecurityScore = () => {
    const correctlyEnabled = enabledSettings.filter(id => 
      settings.find(s => s.id === id && s.isSecure)
    ).length
    const incorrectlyEnabled = enabledSettings.filter(id => 
      settings.find(s => s.id === id && !s.isSecure)
    ).length
    const total = settings.filter(s => s.isSecure).length
    const score = Math.max(0, Math.round(((correctlyEnabled - incorrectlyEnabled) / total) * 100))
    return score
  }

  const securityScore = calculateSecurityScore()
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
          <strong>Goal:</strong> Configure your browser security settings by enabling the recommended protections. 
          Toggle each setting on or off to create a secure browsing configuration.
        </p>
      </div>

      {/* Security Score Display */}
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="text-h4 text-neutral-100">Current Security Score</div>
          <div className={`text-h2 font-bold ${getScoreColor(securityScore)}`}>
            {securityScore}%
          </div>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-300 ${
              securityScore >= 80 ? 'bg-success-500' :
              securityScore >= 50 ? 'bg-warning-500' :
              'bg-error-500'
            }`}
            style={{ width: `${securityScore}%` }}
          />
        </div>
        <p className="text-small text-neutral-400 mt-2">
          {enabledSettings.length} of {settings.length} settings configured
        </p>
      </div>

      {/* Security Settings */}
      <div className="space-y-3">
        {settings.map((setting) => {
          const isEnabled = enabledSettings.includes(setting.id)

          return (
            <div
              key={setting.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                isEnabled
                  ? 'bg-primary-900/30 border-primary-500'
                  : 'bg-neutral-800 border-neutral-700'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg ${
                  isEnabled ? 'bg-primary-600' : 'bg-neutral-700'
                }`}>
                  <div className={isEnabled ? 'text-white' : 'text-neutral-400'}>
                    {getIcon(setting.icon)}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-body font-semibold text-neutral-100 mb-1">
                        {setting.name}
                      </div>
                      <div className="text-small text-neutral-400">
                        {setting.description}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <button
                      onClick={() => toggleSetting(setting.id)}
                      disabled={disabled}
                      className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 ${
                        isEnabled ? 'bg-primary-500' : 'bg-neutral-600'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div
                        className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${
                          isEnabled ? 'left-8' : 'left-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Impact Badge */}
                  <div className={`inline-flex items-center gap-1 px-2 py-1 rounded text-caption ${
                    setting.isSecure
                      ? 'bg-success-900/30 text-success-400 border border-success-700'
                      : 'bg-neutral-700 text-neutral-400 border border-neutral-600'
                  }`}>
                    {setting.isSecure && <CheckCircle className="w-3 h-3" />}
                    <span>Impact: {setting.impact}</span>
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
          <Shield className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Browser Security Tips' : 'Show Browser Security Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Enable pop-up blockers to prevent unwanted windows</p>
            <p>• Use HTTPS-only mode for secure connections</p>
            <p>• Block third-party cookies to limit tracking</p>
            <p>• Keep your browser and extensions updated</p>
            <p>• Enable safe browsing warnings for dangerous sites</p>
            <p>• Regularly clear browsing data and cache</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={enabledSettings.length === 0 || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          enabledSettings.length === 0 || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled ? 'Submitting...' : 'Submit Configuration'}
      </button>
    </div>
  )
}
