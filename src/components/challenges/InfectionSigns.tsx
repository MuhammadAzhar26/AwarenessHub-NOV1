import { useState } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Activity, Shield } from 'lucide-react'

interface InfectionSign {
  id: string
  symptom: string
  description: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  isActualSign: boolean
  explanation: string
}

interface InfectionSignsProps {
  signs: InfectionSign[]
  correctSigns: string[]
  minCorrectIdentifications: number
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function InfectionSigns({ 
  signs, 
  correctSigns, 
  minCorrectIdentifications, 
  onSubmit, 
  disabled 
}: InfectionSignsProps) {
  const [identifiedSigns, setIdentifiedSigns] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const toggleSign = (signId: string) => {
    if (identifiedSigns.includes(signId)) {
      setIdentifiedSigns(identifiedSigns.filter(id => id !== signId))
    } else {
      setIdentifiedSigns([...identifiedSigns, signId])
    }
  }

  const handleSubmit = () => {
    onSubmit(identifiedSigns.sort().join(','))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-error-600 text-white'
      case 'high':
        return 'bg-error-500 text-white'
      case 'medium':
        return 'bg-warning-500 text-white'
      case 'low':
        return 'bg-neutral-600 text-white'
      default:
        return 'bg-neutral-600 text-white'
    }
  }

  const getSeverityIcon = (severity: string) => {
    if (severity === 'critical' || severity === 'high') {
      return <AlertTriangle className="w-4 h-4" />
    }
    return <Activity className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Identify which symptoms indicate a malware infection on your computer. 
          Select at least {minCorrectIdentifications} genuine infection signs to complete the challenge.
        </p>
      </div>

      {/* Detection Progress */}
      <div className="bg-neutral-800 border border-neutral-700 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="text-h4 text-neutral-100 mb-1">Detection Progress</div>
            <div className="text-small text-neutral-400">
              {identifiedSigns.length} symptoms identified
            </div>
          </div>
          <div className="p-4 bg-neutral-900 rounded-lg">
            <Activity className="w-8 h-8 text-primary-400" />
          </div>
        </div>
        <div className="w-full bg-neutral-700 rounded-full h-3">
          <div
            className="h-3 bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((identifiedSigns.length / minCorrectIdentifications) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Infection Signs */}
      <div className="space-y-3">
        {signs.map((sign) => {
          const isIdentified = identifiedSigns.includes(sign.id)

          return (
            <button
              key={sign.id}
              onClick={() => toggleSign(sign.id)}
              disabled={disabled}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                isIdentified
                  ? 'bg-warning-900/20 border-warning-500 shadow-dark-card-hover'
                  : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Selection Indicator */}
                <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isIdentified ? 'bg-warning-500 border-warning-500' : 'border-neutral-600'
                }`}>
                  {isIdentified && <CheckCircle className="w-5 h-5 text-white" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-body font-semibold text-neutral-100">
                      {sign.symptom}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-caption ${getSeverityColor(sign.severity)}`}>
                      {getSeverityIcon(sign.severity)}
                      <span>{sign.severity}</span>
                    </div>
                  </div>
                  
                  <div className="text-small text-neutral-400 mb-2">
                    {sign.description}
                  </div>

                  <div className={`p-3 rounded-lg ${
                    sign.isActualSign 
                      ? 'bg-error-900/20 border border-error-700' 
                      : 'bg-success-900/20 border border-success-700'
                  }`}>
                    <div className="flex items-start gap-2">
                      {sign.isActualSign ? (
                        <AlertTriangle className="w-4 h-4 text-error-400 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Shield className="w-4 h-4 text-success-400 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-small text-neutral-300">
                        <strong className={sign.isActualSign ? 'text-error-400' : 'text-success-400'}>
                          {sign.isActualSign ? 'Warning: ' : 'Normal: '}
                        </strong>
                        {sign.explanation}
                      </div>
                    </div>
                  </div>

                  {isIdentified && (
                    <div className="mt-3 flex items-center gap-2 text-warning-400">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-small font-medium">Identified as Infection Sign</span>
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
          <AlertTriangle className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Infection Warning Tips' : 'Show Infection Warning Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Unexpected slowdowns or crashes may indicate malware</p>
            <p>• Pop-ups appearing when browser is closed are suspicious</p>
            <p>• Unexplained network activity could be data theft</p>
            <p>• New toolbars or programs you didn't install are red flags</p>
            <p>• Disabled security software is a critical warning sign</p>
            <p>• Files disappearing or changing unexpectedly need investigation</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={identifiedSigns.length < minCorrectIdentifications || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          identifiedSigns.length < minCorrectIdentifications || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled 
          ? 'Submitting...' 
          : identifiedSigns.length < minCorrectIdentifications
          ? `Identify ${minCorrectIdentifications - identifiedSigns.length} more signs`
          : 'Submit Detection'}
      </button>
    </div>
  )
}
