import { useState } from 'react'
import { Wifi, WifiOff, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'

interface WiFiScenario {
  id: string
  location: string
  networkName: string
  isSafe: boolean
  securityLevel: 'open' | 'password' | 'encrypted'
  riskFactors: string[]
  safetyTips: string[]
}

interface WiFiSafetyProps {
  scenarios: WiFiScenario[]
  correctAnswers: string[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function WiFiSafety({ scenarios, correctAnswers, onSubmit, disabled }: WiFiSafetyProps) {
  const [selectedScenarios, setSelectedScenarios] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const toggleScenario = (scenarioId: string) => {
    if (selectedScenarios.includes(scenarioId)) {
      setSelectedScenarios(selectedScenarios.filter(id => id !== scenarioId))
    } else {
      setSelectedScenarios([...selectedScenarios, scenarioId])
    }
  }

  const handleSubmit = () => {
    onSubmit(selectedScenarios.sort().join(','))
  }

  const getSecurityIcon = (level: string) => {
    switch (level) {
      case 'encrypted':
        return <Shield className="w-5 h-5 text-success-400" />
      case 'password':
        return <Shield className="w-5 h-5 text-warning-400" />
      case 'open':
        return <WifiOff className="w-5 h-5 text-error-400" />
      default:
        return <Wifi className="w-5 h-5 text-neutral-400" />
    }
  }

  const getSecurityLabel = (level: string) => {
    switch (level) {
      case 'encrypted':
        return { text: 'WPA2/WPA3 Encrypted', color: 'text-success-400' }
      case 'password':
        return { text: 'Password Protected', color: 'text-warning-400' }
      case 'open':
        return { text: 'Open Network', color: 'text-error-400' }
      default:
        return { text: 'Unknown', color: 'text-neutral-400' }
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Identify which public WiFi networks are safe to use. 
          Select all scenarios where it's safe to connect and perform sensitive activities.
        </p>
      </div>

      {/* Scenarios Grid */}
      <div className="space-y-4">
        {scenarios.map((scenario) => {
          const isSelected = selectedScenarios.includes(scenario.id)
          const security = getSecurityLabel(scenario.securityLevel)

          return (
            <button
              key={scenario.id}
              onClick={() => toggleScenario(scenario.id)}
              disabled={disabled}
              className={`w-full p-5 rounded-lg border-2 transition-all text-left ${
                isSelected
                  ? 'bg-primary-900/30 border-primary-500 shadow-dark-card-hover'
                  : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Selection Indicator */}
                <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? 'bg-primary-500 border-primary-500' : 'border-neutral-600'
                }`}>
                  {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                </div>

                <div className="flex-1 space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-h4 text-neutral-100 mb-1">{scenario.location}</div>
                      <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-neutral-400" />
                        <span className="text-small text-neutral-300 font-medium">
                          {scenario.networkName}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Level */}
                  <div className="flex items-center gap-2 bg-neutral-900 p-3 rounded border border-neutral-700">
                    {getSecurityIcon(scenario.securityLevel)}
                    <span className={`text-small font-medium ${security.color}`}>
                      {security.text}
                    </span>
                  </div>

                  {/* Risk Factors */}
                  {scenario.riskFactors.length > 0 && (
                    <div className="bg-error-900/20 border border-error-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-error-400" />
                        <span className="text-small font-semibold text-error-400">Risk Factors</span>
                      </div>
                      <ul className="space-y-1">
                        {scenario.riskFactors.map((risk, idx) => (
                          <li key={idx} className="text-small text-neutral-300 ml-6">
                            • {risk}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Safety Tips */}
                  {scenario.safetyTips.length > 0 && (
                    <div className="bg-success-900/20 border border-success-700 p-3 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-success-400" />
                        <span className="text-small font-semibold text-success-400">Safety Measures</span>
                      </div>
                      <ul className="space-y-1">
                        {scenario.safetyTips.map((tip, idx) => (
                          <li key={idx} className="text-small text-neutral-300 ml-6">
                            • {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </button>
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
            {showHint ? 'Hide WiFi Safety Tips' : 'Show WiFi Safety Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Avoid open/unsecured networks for sensitive activities</p>
            <p>• Use VPN when connecting to public WiFi</p>
            <p>• Verify network names with staff to avoid fake networks</p>
            <p>• Turn off auto-connect and file sharing on public networks</p>
            <p>• Use HTTPS websites and secure apps only</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={selectedScenarios.length === 0 || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          selectedScenarios.length === 0 || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled ? 'Submitting...' : `Submit Answer (${selectedScenarios.length} selected)`}
      </button>
    </div>
  )
}
