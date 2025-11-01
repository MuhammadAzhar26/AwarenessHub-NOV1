import { useState } from 'react'
import { CheckCircle, XCircle, ShieldCheck, ShieldAlert } from 'lucide-react'

interface WebsiteFeature {
  id: string
  feature: string
  real: string
  fake: string
}

interface WebsiteComparisonProps {
  features: WebsiteFeature[]
  correctAnswer: 'left' | 'right'
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function WebsiteComparison({ features, correctAnswer, onSubmit, disabled }: WebsiteComparisonProps) {
  const [selectedSite, setSelectedSite] = useState<'left' | 'right' | null>(null)
  const [showHint, setShowHint] = useState(false)

  const handleSubmit = () => {
    if (selectedSite) {
      onSubmit(selectedSite)
    }
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-primary-900/20 border border-primary-700 p-4 rounded-lg">
        <p className="text-body text-neutral-100">
          <strong>Goal:</strong> Compare these two websites side-by-side and identify which one is legitimate. 
          Look carefully at the security indicators, URL structure, and design quality.
        </p>
      </div>

      {/* Website Comparison Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Website */}
        <button
          onClick={() => setSelectedSite('left')}
          disabled={disabled}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            selectedSite === 'left'
              ? 'bg-primary-900/30 border-primary-500 shadow-dark-card-hover'
              : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              selectedSite === 'left' ? 'bg-primary-600' : 'bg-neutral-700'
            }`}>
              <ShieldCheck className="w-6 h-6 text-neutral-100" />
            </div>
            <div>
              <div className="text-h4 text-neutral-100">Website A</div>
              <div className="text-caption text-neutral-400">Click to select as legitimate</div>
            </div>
          </div>

          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature.id} className="bg-neutral-900 p-3 rounded border border-neutral-700">
                <div className="text-small font-semibold text-neutral-300 mb-1">{feature.feature}</div>
                <div className="text-body text-neutral-100">{feature.real}</div>
              </div>
            ))}
          </div>

          {selectedSite === 'left' && (
            <div className="mt-4 flex items-center gap-2 text-primary-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-small font-medium">Selected</span>
            </div>
          )}
        </button>

        {/* Right Website */}
        <button
          onClick={() => setSelectedSite('right')}
          disabled={disabled}
          className={`p-6 rounded-lg border-2 transition-all text-left ${
            selectedSite === 'right'
              ? 'bg-primary-900/30 border-primary-500 shadow-dark-card-hover'
              : 'bg-neutral-800 border-neutral-700 hover:border-neutral-600'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-2 rounded-lg ${
              selectedSite === 'right' ? 'bg-primary-600' : 'bg-neutral-700'
            }`}>
              <ShieldAlert className="w-6 h-6 text-neutral-100" />
            </div>
            <div>
              <div className="text-h4 text-neutral-100">Website B</div>
              <div className="text-caption text-neutral-400">Click to select as legitimate</div>
            </div>
          </div>

          <div className="space-y-3">
            {features.map((feature) => (
              <div key={feature.id} className="bg-neutral-900 p-3 rounded border border-neutral-700">
                <div className="text-small font-semibold text-neutral-300 mb-1">{feature.feature}</div>
                <div className="text-body text-neutral-100">{feature.fake}</div>
              </div>
            ))}
          </div>

          {selectedSite === 'right' && (
            <div className="mt-4 flex items-center gap-2 text-primary-400">
              <CheckCircle className="w-5 h-5" />
              <span className="text-small font-medium">Selected</span>
            </div>
          )}
        </button>
      </div>

      {/* Hint Section */}
      <div className="bg-neutral-900 border border-neutral-800 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-warning-400 hover:text-warning-300 transition-colors"
        >
          <ShieldCheck className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Security Tips' : 'Show Security Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-neutral-300">
            <p>• Check for HTTPS in the URL and a valid padlock icon</p>
            <p>• Look for spelling errors or unusual characters in the domain name</p>
            <p>• Verify the certificate information and expiration date</p>
            <p>• Examine the overall design quality and professionalism</p>
            <p>• Be suspicious of urgent warnings or pressure tactics</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!selectedSite || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          !selectedSite || disabled
            ? 'bg-neutral-700 text-neutral-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled ? 'Submitting...' : 'Submit Answer'}
      </button>
    </div>
  )
}
