import { useState } from 'react'
import { Lock, LockOpen, Eye, EyeOff, ShieldCheck, AlertTriangle } from 'lucide-react'

interface HTTPSDemoProps {
  sensitiveData: string[]
  correctAnswer: string
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function HTTPSDemo({ sensitiveData, correctAnswer, onSubmit, disabled }: HTTPSDemoProps) {
  const [connectionType, setConnectionType] = useState<'http' | 'https'>('http')
  const [showData, setShowData] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer)
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Learn the difference between HTTP and HTTPS by toggling between connection types. 
          Observe how your data is protected (or exposed) with each protocol.
        </p>
      </div>

      {/* Connection Type Toggle */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-300">
        <div className="text-h4 text-gray-900 mb-4">Select Connection Type</div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setConnectionType('http')}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              connectionType === 'http'
                ? 'bg-red-50 border-red-500 shadow-md'
                : 'bg-white border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <LockOpen className="w-8 h-8 text-red-600" />
            </div>
            <div className="text-h4 text-gray-900 mb-1 font-semibold">HTTP</div>
            <div className="text-small text-red-600 font-medium">Not Secure</div>
          </button>

          <button
            onClick={() => setConnectionType('https')}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              connectionType === 'https'
                ? 'bg-green-50 border-green-500 shadow-md'
                : 'bg-white border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-h4 text-gray-900 mb-1 font-semibold">HTTPS</div>
            <div className="text-small text-green-600 font-medium">Secure</div>
          </button>
        </div>
      </div>

      {/* Data Transmission Visualization */}
      <div className={`p-6 rounded-lg border-2 transition-all ${
        connectionType === 'https'
          ? 'bg-green-50 border-green-400'
          : 'bg-red-50 border-red-400'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {connectionType === 'https' ? (
              <ShieldCheck className="w-6 h-6 text-green-700" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-700" />
            )}
            <div>
              <div className="text-h4 text-gray-900 font-semibold">
                {connectionType === 'https' ? 'Encrypted Connection' : 'Unencrypted Connection'}
              </div>
              <div className="text-small text-gray-700">
                {connectionType === 'https' 
                  ? 'Your data is protected with encryption'
                  : 'Your data is sent in plain text'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowData(!showData)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            {showData ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span className="text-small font-medium">
              {showData ? 'Hide' : 'Show'} Data
            </span>
          </button>
        </div>

        {showData && (
          <div className="space-y-3 mt-4">
            <div className="text-small font-semibold text-gray-900 mb-2">
              Data Being Transmitted:
            </div>
            {sensitiveData.map((data, index) => (
              <div key={index} className="bg-white p-3 rounded border-2 border-gray-300">
                <div className="font-mono text-small">
                  {connectionType === 'https' ? (
                    <span className="text-green-700 font-semibold">
                      🔒 {data.split('').map(() => '•').join('')}
                    </span>
                  ) : (
                    <span className="text-red-700 font-semibold">
                      🔓 {data}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            <div className={`p-3 rounded-lg mt-4 border-2 ${
              connectionType === 'https'
                ? 'bg-green-50 border-green-400'
                : 'bg-red-50 border-red-400'
            }`}>
              <p className="text-small text-gray-900 font-medium">
                {connectionType === 'https' 
                  ? '✓ Data is encrypted and cannot be read by attackers'
                  : '⚠ Data is visible to anyone intercepting the connection'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Question */}
      <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-300">
        <div className="text-h4 text-gray-900 mb-4 font-semibold">
          Which connection type should you use for sensitive data?
        </div>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedAnswer('http')}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedAnswer === 'http'
                ? 'bg-blue-100 border-blue-500 shadow-md'
                : 'bg-white border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === 'http' ? 'bg-blue-500 border-blue-500' : 'border-gray-400 bg-white'
              }`}>
                {selectedAnswer === 'http' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-body text-gray-900 font-medium">HTTP - Faster and simpler</span>
            </div>
          </button>

          <button
            onClick={() => setSelectedAnswer('https')}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedAnswer === 'https'
                ? 'bg-blue-100 border-blue-500 shadow-md'
                : 'bg-white border-gray-300 hover:border-gray-400'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === 'https' ? 'bg-blue-500 border-blue-500' : 'border-gray-400 bg-white'
              }`}>
                {selectedAnswer === 'https' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-body text-gray-900 font-medium">HTTPS - Encrypted and secure</span>
            </div>
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedAnswer || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          !selectedAnswer || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled ? 'Submitting...' : 'Submit Answer'}
      </button>
    </div>
  )
}
