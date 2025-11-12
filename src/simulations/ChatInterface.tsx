import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User } from 'lucide-react'

export interface ChatMessage {
  id: string
  type: 'bot' | 'user'
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface ChatInterfaceProps {
  botName: string
  botAvatar: string
  botColor: string
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  isTyping?: boolean
  placeholder?: string
  showInput?: boolean
}

const ChatInterface = ({ 
  botName, 
  botAvatar, 
  botColor, 
  messages, 
  onSendMessage, 
  isTyping = false,
  placeholder = "Type your response...",
  showInput = true
}: ChatInterfaceProps) => {
  const [inputValue, setInputValue] = useState('')
  const [displayMessages, setDisplayMessages] = useState<ChatMessage[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Update display messages with typing animation
  useEffect(() => {
    const updatedMessages = messages.map(msg => ({
      ...msg,
      isTyping: msg.id === 'typing-indicator'
    }))
    setDisplayMessages(updatedMessages)
  }, [messages, isTyping])

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayMessages])

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className={`bg-gradient-to-r ${botColor} p-4 rounded-t-2xl`}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold">{botName}</h3>
            <p className="text-white/80 text-sm">Your cybersecurity training assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {displayMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.type === 'user' 
                  ? 'bg-blue-600' 
                  : `bg-gradient-to-r ${botColor}`
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`rounded-2xl p-3 ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-slate-100'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                
                {/* Typing indicator */}
                {message.isTyping && (
                  <div className="flex space-x-1 mt-2">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Typing indicator for bot responses */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[80%]">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-r ${botColor}`}>
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-slate-700 text-slate-100 rounded-2xl p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {showInput && (
        <div className="p-4 border-t border-slate-700">
          <div className="flex space-x-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="flex-1 bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChatInterface
