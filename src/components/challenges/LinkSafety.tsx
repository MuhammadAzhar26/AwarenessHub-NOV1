import { useState } from 'react'
import { Link as LinkIcon, ExternalLink, AlertTriangle, CheckCircle, Eye } from 'lucide-react'

interface LinkExample {
  id: string
  displayText: string
  actualUrl: string
  isSafe: boolean
  warningSign: string
  context: string
}

interface LinkSafetyProps {
  links: LinkExample[]
  correctAnswers: string[]
  onSubmit: (answer: string) => void
  disabled?: boolean
}

export default function LinkSafety({ links, correctAnswers, onSubmit, disabled }: LinkSafetyProps) {
  const [selectedLinks, setSelectedLinks] = useState<string[]>([])
  const [revealedLinks, setRevealedLinks] = useState<string[]>([])
  const [showHint, setShowHint] = useState(false)

  const toggleLink = (linkId: string) => {
    if (selectedLinks.includes(linkId)) {
      setSelectedLinks(selectedLinks.filter(id => id !== linkId))
    } else {
      setSelectedLinks([...selectedLinks, linkId])
    }
  }

  const revealLink = (linkId: string) => {
    if (!revealedLinks.includes(linkId)) {
      setRevealedLinks([...revealedLinks, linkId])
    }
  }

  const handleSubmit = () => {
    onSubmit(selectedLinks.sort().join(','))
  }

  const analyzeUrl = (url: string) => {
    const warnings = []
    
    // Check for HTTP instead of HTTPS
    if (url.startsWith('http://')) {
      warnings.push('Uses insecure HTTP protocol')
    }
    
    // Check for suspicious characters
    if (url.includes('@') || url.match(/[а-яА-Я]/) || url.match(/[^\x00-\x7F]/)) {
      warnings.push('Contains suspicious characters')
    }
    
    // Check for IP address instead of domain
    if (url.match(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/)) {
      warnings.push('Uses IP address instead of domain name')
    }
    
    // Check for unusual TLD
    if (url.match(/\.(xyz|tk|ml|ga|cf|gq)$/)) {
      warnings.push('Uses suspicious top-level domain')
    }
    
    // Check for typosquatting patterns
    if (url.match(/(g00gle|amaz0n|micr0soft|faceb00k|paypa1)/i)) {
      warnings.push('Possible typosquatting attempt')
    }
    
    return warnings
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
        <p className="text-body text-gray-900">
          <strong>Goal:</strong> Identify suspicious links by revealing their actual URLs. 
          Hover over each link to see where it really goes, then select all the SAFE links.
        </p>
      </div>

      {/* Links List */}
      <div className="space-y-4">
        {links.map((link) => {
          const isSelected = selectedLinks.includes(link.id)
          const isRevealed = revealedLinks.includes(link.id)
          const warnings = analyzeUrl(link.actualUrl)

          return (
            <div
              key={link.id}
              className="bg-gray-100 border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Context */}
              <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="text-small text-gray-600">{link.context}</div>
              </div>

              {/* Link Display */}
              <div className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <LinkIcon className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="text-body text-blue-600 font-medium mb-2 break-all">
                      {link.displayText}
                    </div>
                    
                    {/* Reveal Button */}
                    <button
                      onClick={() => revealLink(link.id)}
                      disabled={isRevealed}
                      className={`flex items-center gap-2 px-3 py-2 rounded transition-all ${
                        isRevealed
                          ? 'bg-gray-200 text-gray-600 cursor-default'
                          : 'bg-primary-900/30 text-blue-600 hover:bg-primary-900/50'
                      }`}
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-small">
                        {isRevealed ? 'Actual URL Revealed' : 'Reveal Actual URL'}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Revealed URL */}
                {isRevealed && (
                  <div className="mt-4 space-y-3">
                    <div className={`p-4 rounded-lg border-2 ${
                      link.isSafe
                        ? 'bg-success-900/20 border-success-700'
                        : 'bg-error-900/20 border-error-700'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <ExternalLink className={`w-4 h-4 ${
                          link.isSafe ? 'text-green-600' : 'text-red-600'
                        }`} />
                        <span className="text-small font-semibold text-gray-700">
                          Actual Destination:
                        </span>
                      </div>
                      <div className="font-mono text-small text-gray-900 break-all bg-gray-100 p-2 rounded">
                        {link.actualUrl}
                      </div>
                    </div>

                    {/* Warning Signs */}
                    {warnings.length > 0 && (
                      <div className="bg-error-900/20 border border-error-700 p-3 rounded">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span className="text-small font-semibold text-red-600">
                            Warning Signs Detected
                          </span>
                        </div>
                        <ul className="space-y-1">
                          {warnings.map((warning, idx) => (
                            <li key={idx} className="text-small text-gray-700 ml-6">
                              • {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {link.warningSign && (
                      <div className="bg-warning-900/20 border border-warning-700 p-3 rounded">
                        <div className="text-small text-gray-700">
                          <strong className="text-orange-600">Key Indicator:</strong> {link.warningSign}
                        </div>
                      </div>
                    )}

                    {/* Selection Button */}
                    <button
                      onClick={() => toggleLink(link.id)}
                      disabled={disabled}
                      className={`w-full p-3 rounded-lg border-2 transition-all ${
                        isSelected
                          ? 'bg-primary-900/30 border-primary-500'
                          : 'bg-white border-gray-200 hover:border-gray-400'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {isSelected ? (
                          <>
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                            <span className="text-small font-medium text-blue-600">
                              Selected as SAFE
                            </span>
                          </>
                        ) : (
                          <span className="text-small font-medium text-gray-700">
                            Click to mark as SAFE
                          </span>
                        )}
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Hint Section */}
      <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
        <button
          onClick={() => setShowHint(!showHint)}
          className="flex items-center gap-2 text-orange-600 hover:text-orange-500 transition-colors"
        >
          <AlertTriangle className="w-5 h-5" />
          <span className="text-small font-medium">
            {showHint ? 'Hide Link Safety Tips' : 'Show Link Safety Tips'}
          </span>
        </button>
        
        {showHint && (
          <div className="mt-4 space-y-2 text-body text-gray-700">
            <p>• Always hover over links to see the actual URL before clicking</p>
            <p>• Check for HTTPS and a valid padlock icon</p>
            <p>• Be suspicious of URLs with typos or unusual characters</p>
            <p>• Verify the domain matches the legitimate website</p>
            <p>• Watch out for IP addresses instead of domain names</p>
            <p>• Be cautious with shortened URLs (bit.ly, tinyurl, etc.)</p>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={revealedLinks.length !== links.length || disabled}
        className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
          revealedLinks.length !== links.length || disabled
            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
            : 'bg-primary-600 text-white hover:bg-primary-700 shadow-dark-card hover:shadow-dark-card-hover'
        }`}
      >
        {disabled 
          ? 'Submitting...' 
          : revealedLinks.length !== links.length
          ? `Reveal all links first (${revealedLinks.length}/${links.length})`
          : 'Submit Answer'}
      </button>
    </div>
  )
}
