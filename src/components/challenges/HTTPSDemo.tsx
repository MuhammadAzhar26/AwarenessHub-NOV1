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
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Learn the difference between HTTP and HTTPS by toggling between connection types. 
          Observe how your data is protected (or exposed) with each protocol.
        </p>
      </div>

      {/* Connection Type Toggle */}
      <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
        <div className="text-h4 text-neutral-100 mb-4">Select Connection Type</div>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => setConnectionType('http')}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              connectionType === 'http'
                ? 'bg-error-900/30 border-error-500'
                : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <LockOpen className="w-8 h-8 text-error-400" />
            </div>
            <div className="text-h4 text-neutral-100 mb-1">HTTP</div>
            <div className="text-small text-neutral-400">Not Secure</div>
          </button>

          <button
            onClick={() => setConnectionType('https')}
            disabled={disabled}
            className={`p-4 rounded-lg border-2 transition-all ${
              connectionType === 'https'
                ? 'bg-success-900/30 border-success-500'
                : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Lock className="w-8 h-8 text-success-400" />
            </div>
            <div className="text-h4 text-neutral-100 mb-1">HTTPS</div>
            <div className="text-small text-neutral-400">Secure</div>
          </button>
        </div>
      </div>

      {/* Data Transmission Visualization */}
      <div className={`p-6 rounded-lg border-2 transition-all ${
        connectionType === 'https'
          ? 'bg-success-900/20 border-success-700'
          : 'bg-error-900/20 border-error-700'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {connectionType === 'https' ? (
              <ShieldCheck className="w-6 h-6 text-success-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-error-400" />
            )}
            <div>
              <div className="text-h4 text-neutral-100">
                {connectionType === 'https' ? 'Encrypted Connection' : 'Unencrypted Connection'}
              </div>
              <div className="text-small text-neutral-400">
                {connectionType === 'https' 
                  ? 'Your data is protected with encryption'
                  : 'Your data is sent in plain text'}
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowData(!showData)}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition-colors"
          >
            {showData ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            <span className="text-small text-neutral-100">
              {showData ? 'Hide' : 'Show'} Data
            </span>
          </button>
        </div>

        {showData && (
          <div className="space-y-3 mt-4">
            <div className="text-small font-semibold text-neutral-300 mb-2">
              Data Being Transmitted:
            </div>
            {sensitiveData.map((data, index) => (
              <div key={index} className="bg-neutral-900 p-3 rounded border border-neutral-700">
                <div className="font-mono text-small">
                  {connectionType === 'https' ? (
                    <span className="text-success-400">
                      🔒 {data.split('').map(() => '•').join('')}
                    </span>
                  ) : (
                    <span className="text-error-400">
                      🔓 {data}
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            <div className={`p-3 rounded mt-4 ${
              connectionType === 'https'
                ? 'bg-success-900/20 border border-success-700'
                : 'bg-error-900/20 border border-error-700'
            }`}>
              <p className="text-small text-neutral-300">
                {connectionType === 'https' 
                  ? '✓ Data is encrypted and cannot be read by attackers'
                  : '⚠ Data is visible to anyone intercepting the connection'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quiz Question */}
      <div className="bg-neutral-800 p-6 rounded-lg border border-neutral-700">
        <div className="text-h4 text-neutral-100 mb-4">
          Which connection type should you use for sensitive data?
        </div>
        <div className="space-y-3">
          <button
            onClick={() => setSelectedAnswer('http')}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedAnswer === 'http'
                ? 'bg-primary-900/30 border-primary-500'
                : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === 'http' ? 'bg-primary-500 border-primary-500' : 'border-neutral-600'
              }`}>
                {selectedAnswer === 'http' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-body text-neutral-100">HTTP - Faster and simpler</span>
            </div>
          </button>

          <button
            onClick={() => setSelectedAnswer('https')}
            disabled={disabled}
            className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
              selectedAnswer === 'https'
                ? 'bg-primary-900/30 border-primary-500'
                : 'bg-neutral-900 border-neutral-700 hover:border-neutral-600'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === 'https' ? 'bg-primary-500 border-primary-500' : 'border-neutral-600'
              }`}>
                {selectedAnswer === 'https' && <div className="w-2 h-2 bg-white rounded-full" />}
              </div>
              <span className="text-body text-neutral-100">HTTPS - Encrypted and secure</span>
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
