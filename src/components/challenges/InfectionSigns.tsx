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
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Identify which symptoms indicate a malware infection on your computer. 
          Select at least {minCorrectIdentifications} genuine infection signs to complete the challenge.
        </p>
      </div>

      {/* Detection Progress */}
      <div className="bg-white border border-gray-200 p-6 rounded-lg">
        <div className="flex items-center gap-4 mb-3">
          <div className="flex-1">
            <div className="text-h4 text-gray-900 mb-1">Detection Progress</div>
            <div className="text-small text-gray-600">
              {identifiedSigns.length} symptoms identified
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 bg-blue-600 rounded-full transition-all duration-300"
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
              className={`w-full p-4 rounded-lg border-2 transition-all text-left shadow-sm ${
                isIdentified
                  ? 'bg-orange-50 border-orange-500 shadow-md'
                  : 'bg-white border-gray-300 hover:border-gray-400'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-start gap-4">
                {/* Selection Indicator */}
                <div className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isIdentified ? 'bg-orange-500 border-orange-500' : 'border-gray-400 bg-white'
                }`}>
                  {isIdentified && <CheckCircle className="w-5 h-5 text-white" />}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-body font-semibold text-gray-900">
                      {sign.symptom}
                    </div>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded text-caption ${getSeverityColor(sign.severity)}`}>
                      {getSeverityIcon(sign.severity)}
                      <span>{sign.severity}</span>
                    </div>
                  </div>
                  
                  <div className="text-small text-gray-700 mb-2">
                    {sign.description}
                  </div>

                  <div className={`p-3 rounded-lg border-2 ${
                    sign.isActualSign 
                      ? 'bg-red-50 border-red-300' 
                      : 'bg-green-50 border-green-300'
                  }`}>
                    <div className="flex items-start gap-2">
                      {sign.isActualSign ? (
                        <AlertTriangle className="w-4 h-4 text-red-700 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Shield className="w-4 h-4 text-green-700 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="text-small text-gray-800">
                        <strong className={sign.isActualSign ? 'text-red-700' : 'text-green-700'}>
                          {sign.isActualSign ? 'Warning: ' : 'Normal: '}
                        </strong>
                        {sign.explanation}
                      </div>
                    </div>
                  </div>

                  {isIdentified && (
                    <div className="mt-3 flex items-center gap-2 text-orange-700">
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
      <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-amber-700 hover:text-amber-800 transition-colors font-semibold"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Infection Warning Tips' : 'Show Infection Warning Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-gray-800">
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
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg'
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
