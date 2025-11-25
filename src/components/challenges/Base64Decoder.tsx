import { useMemo, useState } from 'react'
import { Binary, CheckCircle, Lightbulb, Puzzle } from 'lucide-react'

type Base64DecoderProps = {
  encodedText: string
  correctPlaintext: string
  onSubmit: (answer: string) => void
  disabled?: boolean
}

const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

export default function Base64Decoder({
  encodedText,
  correctPlaintext,
  onSubmit,
  disabled,
}: Base64DecoderProps) {
  const [selectedChunk, setSelectedChunk] = useState(0)
  const [userAnswer, setUserAnswer] = useState('')
  const [showChunkHint, setShowChunkHint] = useState(false)

  const chunks = useMemo(() => {
    return encodedText.match(/.{1,4}/g) ?? []
  }, [encodedText])

  const decodedText = useMemo(() => {
    try {
      return atob(encodedText)
    } catch (error) {
      console.error('Invalid base64 payload provided to Base64Decoder component.')
      return ''
    }
  }, [encodedText])

  const chunkDecoded = useMemo(() => {
    if (decodedText.length === 0 || chunks.length === 0) return ''
    const charsPerChunk = Math.ceil(decodedText.length / chunks.length)
    const start = selectedChunk * charsPerChunk
    return decodedText.slice(start, start + charsPerChunk)
  }, [decodedText, chunks.length, selectedChunk])

  const chunkAlphabetIndexes = useMemo(() => {
    if (!chunks[selectedChunk]) return []
    return chunks[selectedChunk].split('').map(char => BASE64_ALPHABET.indexOf(char))
  }, [chunks, selectedChunk])

  const isCorrect = userAnswer.trim().toLowerCase() === correctPlaintext.trim().toLowerCase()
  const completionRatio = Math.min(1, userAnswer.trim().length / correctPlaintext.trim().length)

  const handleSubmit = () => {
    if (!userAnswer.trim()) return
    onSubmit(userAnswer.trim())
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-primary-900/20 border border-primary-700 rounded-lg p-4">
          <p className="text-body text-neutral-100">
            <strong>Goal:</strong> Decode the base64 message by analysing segments and typing the final plaintext. Use the slider to inspect each block.
          </p>
        </div>
        <div className="bg-neutral-900 border border-neutral-700 rounded-lg p-4">
          <p className="text-small text-neutral-300 leading-relaxed">
            Base64 encodes data using 64 characters. Each group of 4 base64 characters becomes 3 decoded bytes. Track how the alphabet indices line up while you work through the puzzle.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-body font-semibold text-neutral-100 mb-2 flex items-center gap-2">
            <Binary className="w-4 h-4 text-primary-400" />
            Encoded Message
          </h3>
          <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 font-mono text-body leading-7 break-all">
            {chunks.map((chunk, index) => (
              <span
                key={`${chunk}-${index}`}
                className={`px-1 py-0.5 rounded-md ${
                  index === selectedChunk ? 'bg-primary-500/20 text-primary-300 border border-primary-500/40' : 'text-neutral-200'
                }`}
              >
                {chunk}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label htmlFor="chunk-slider" className="text-body font-semibold text-neutral-100 flex items-center gap-2">
            <Puzzle className="w-4 h-4 text-primary-400" />
            Inspect Chunk: <span className="text-primary-300">{selectedChunk + 1}</span>/{chunks.length}
          </label>
          <input
            id="chunk-slider"
            type="range"
            min={0}
            max={Math.max(chunks.length - 1, 0)}
            value={selectedChunk}
            onChange={event => setSelectedChunk(parseInt(event.target.value, 10))}
            className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary-500 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-primary-500"
            disabled={chunks.length <= 1 || disabled}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
              <p className="text-small text-neutral-400 mb-2">Chunk Characters</p>
              <p className="font-mono text-body text-neutral-100">{chunks[selectedChunk] || '—'}</p>
            </div>
            <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
              <p className="text-small text-neutral-400 mb-2">Alphabet Index Values</p>
              <p className="font-mono text-body text-neutral-100">
                {chunkAlphabetIndexes.length > 0 ? chunkAlphabetIndexes.join(', ') : '—'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowChunkHint(value => !value)}
            className="inline-flex items-center gap-2 text-small text-primary-400 hover:text-primary-300"
          >
            <Lightbulb className="w-4 h-4" />
            {showChunkHint ? 'Hide chunk breakdown' : 'Show chunk breakdown'}
          </button>
          {showChunkHint && (
            <div className="rounded-lg border border-neutral-700 bg-neutral-900 p-4">
              <p className="text-small text-neutral-300 leading-relaxed">
                Decoded snippet: <span className="text-success-400 font-mono">{chunkDecoded || 'N/A'}</span>
              </p>
              <p className="text-small text-neutral-500 mt-2">
                Piece together each snippet to reconstruct the full plaintext.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <label htmlFor="plaintext-answer" className="block text-body font-semibold text-neutral-100">
          Final Plaintext
        </label>
        <textarea
          id="plaintext-answer"
          value={userAnswer}
          onChange={event => setUserAnswer(event.target.value)}
          placeholder="Type the decoded message here..."
          rows={3}
          className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-3 text-body text-neutral-100 font-mono focus:border-primary-500 focus:outline-none"
          disabled={disabled}
        />
        <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${isCorrect ? 'bg-success-500' : 'bg-primary-500'}`}
            style={{ width: `${completionRatio * 100}%` }}
          />
        </div>
        {isCorrect && (
          <p className="text-small text-success-400 font-medium">Looks right! Submit to lock in your answer.</p>
        )}
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={disabled || !userAnswer.trim()}
        className={`w-full px-6 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 text-white transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed ${
          isCorrect ? 'bg-success-500 hover:bg-success-600' : 'bg-primary-500 hover:bg-primary-600'
        }`}
      >
        <CheckCircle className="w-5 h-5" />
        {disabled ? 'Submitting...' : 'Submit Decoded Message'}
      </button>
    </div>
  )
}
