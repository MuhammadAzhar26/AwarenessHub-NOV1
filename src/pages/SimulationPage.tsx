import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Shield, AlertTriangle, CheckCircle, XCircle, Lock, RefreshCw, AlertOctagon, Mail, MessageSquare, Globe, BrainCircuit, Layers, Fingerprint, Users, HardDrive, Lightbulb } from 'lucide-react'
import { Link } from 'react-router-dom'
import { INITIAL_SCENARIOS } from '@/simulations/constants'
import { Scenario, ScenarioType, PhishingType, DefenseType, SocialTactic, SimulationModule } from '@/simulations/types'
import { EmailView } from '@/components/simulations/EmailView'
import { SmsView } from '@/components/simulations/SmsView'
import { SearchView } from '@/components/simulations/SearchView'
import { supabase } from '@/lib/supabase'

enum GameState {
  START,
  PLAYING,
  END
}

enum Step {
  IDENTIFY,
  TYPE,
  DEFENSE,
  FEEDBACK
}

export default function SimulationPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [gameState, setGameState] = useState<GameState>(GameState.START)
  const [scenarios, setScenarios] = useState<Scenario[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [step, setStep] = useState<Step>(Step.IDENTIFY)
  const [selectedModule, setSelectedModule] = useState<SimulationModule>(SimulationModule.ALL)
  const [hintsUsed, setHintsUsed] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [hintUsedForScenario, setHintUsedForScenario] = useState<Set<number>>(new Set())

  const [answers, setAnswers] = useState<{
    isPhishing?: boolean
    phishingType?: PhishingType
    defense?: DefenseType
  }>({})

  // Shuffle and Filter scenarios on start
  const startGame = (module: SimulationModule) => {
    setSelectedModule(module)
    let filtered = [...INITIAL_SCENARIOS]

    if (module === SimulationModule.EMAIL_DEFENSE) {
      filtered = filtered.filter(s => s.type === ScenarioType.EMAIL && s.correctPhishingType !== PhishingType.RANSOMWARE && s.correctPhishingType !== PhishingType.BEC)
    } else if (module === SimulationModule.MOBILE_SECURITY) {
      filtered = filtered.filter(s => s.type === ScenarioType.SMS || s.type === ScenarioType.VOICE)
    } else if (module === SimulationModule.WEB_MALWARE) {
      filtered = filtered.filter(s => s.correctPhishingType === PhishingType.SEO && s.type === ScenarioType.SEARCH)
    } else if (module === SimulationModule.IDENTITY_AUTH) {
      filtered = filtered.filter(s => s.type === ScenarioType.AUTH || s.correctPhishingType === PhishingType.QUISHING || s.correctPhishingType === PhishingType.MFA_FATIGUE || (s.content.subject && s.content.subject.includes('Password')))
    } else if (module === SimulationModule.SOCIAL_ENG) {
      filtered = filtered.filter(s => s.correctPhishingType === PhishingType.BEC || s.correctPhishingType === PhishingType.VISHING || s.socialTactic === SocialTactic.FAMILIARITY)
    } else if (module === SimulationModule.RANSOMWARE) {
      filtered = filtered.filter(s => s.correctPhishingType === PhishingType.RANSOMWARE)
    }

    // Fallback if filter is too aggressive
    if (filtered.length < 3) filtered = [...INITIAL_SCENARIOS]

    const shuffled = filtered.sort(() => Math.random() - 0.5)
    setScenarios(shuffled)
    setCurrentIdx(0)
    setScore(0)
    setHintsUsed(0)
    setHintUsedForScenario(new Set())
    setShowHint(false)
    setGameState(GameState.PLAYING)
    setStep(Step.IDENTIFY)
    setAnswers({})
  }

  const handleIdentify = (isPhishing: boolean) => {
    setAnswers({ ...answers, isPhishing })
    if (isPhishing) {
      setStep(Step.TYPE)
    } else {
      setStep(Step.DEFENSE)
    }
  }

  const handleTypeSelect = (type: PhishingType) => {
    setAnswers({ ...answers, phishingType: type })
    setStep(Step.DEFENSE)
  }

  const handleDefenseSelect = (defense: DefenseType) => {
    const finalAnswers = { ...answers, defense }
    setAnswers(finalAnswers)
    
    const currentScenario = scenarios[currentIdx]
    let roundScore = 0

    if (finalAnswers.isPhishing === currentScenario.isPhishing) roundScore += 1
    if (currentScenario.isPhishing) {
        if (finalAnswers.phishingType === currentScenario.correctPhishingType) roundScore += 1
    } else {
        roundScore += 1
    }
    if (finalAnswers.defense === currentScenario.correctDefense) roundScore += 1

    if (roundScore === 3) setScore(s => s + 1)
    setStep(Step.FEEDBACK)
  }

  const nextScenario = () => {
    if (currentIdx < scenarios.length - 1) {
      setCurrentIdx(c => c + 1)
      setStep(Step.IDENTIFY)
      setAnswers({})
      setShowHint(false)
    } else {
      setGameState(GameState.END)
      saveScore()
    }
  }

  const saveScore = async () => {
    if (!user) return
    
    try {
      const pointsEarned = score * 10 // 10 points per perfect scenario
      
      // Save to database
      await supabase.rpc('increment_user_points', {
        user_id: user.id,
        points_to_add: pointsEarned
      })

      console.log(`Awarded ${pointsEarned} points for ${score} perfect scenarios`)
    } catch (error) {
      console.error('Error saving score:', error)
    }
  }

  const handleHintClick = () => {
    if (!hintUsedForScenario.has(currentIdx)) {
      setHintsUsed(h => h + 1)
      setHintUsedForScenario(prev => new Set(prev).add(currentIdx))
    }
    setShowHint(true)
  }

  const getHintText = (scenario: Scenario, currentStep: Step): string => {
    if (currentStep === Step.IDENTIFY) {
      if (scenario.isPhishing) {
        // Provide specific hints based on scenario type and red flags
        const hints: string[] = ['💡 This is malicious! Key indicators:']
        
        if (scenario.type === ScenarioType.EMAIL) {
          if (scenario.content.senderEmail?.includes('@') && !scenario.content.senderEmail.includes('gov') && !scenario.content.senderEmail.includes('official')) {
            hints.push('• Check the sender email domain - does it match the claimed organization?')
          }
          if (scenario.socialTactic === SocialTactic.URGENCY) {
            hints.push('• Notice the urgent/threatening language trying to force quick action')
          }
          if (scenario.content.attachment) {
            hints.push('• Be cautious of unexpected attachments, especially .exe, .zip files')
          }
          hints.push('• Look for grammar errors, generic greetings, or suspicious links')
        } else if (scenario.type === ScenarioType.SMS) {
          hints.push('• Verify the sender - legitimate companies use verified sender IDs')
          hints.push('• Check for shortened links (bit.ly, tinyurl) - they hide the real destination')
          if (scenario.socialTactic === SocialTactic.URGENCY || scenario.socialTactic === SocialTactic.FEAR) {
            hints.push('• Notice the urgency/scare tactics to bypass critical thinking')
          }
        } else if (scenario.type === ScenarioType.SEARCH) {
          hints.push('• Check the URL carefully - does it match the legitimate site?')
          hints.push('• Look for misspellings in domain names (typosquatting)')
          hints.push('• Be wary of ads marked as "Sponsored" at the top of search results')
        } else if (scenario.type === ScenarioType.VOICE) {
          hints.push('• Legitimate organizations never ask for passwords/PINs over the phone')
          hints.push('• Caller ID can be spoofed - always verify by calling back official numbers')
        }
        
        return hints.join('\n')
      } else {
        // Legitimate communication
        const hints: string[] = ['💡 This is legitimate! Reasons:']
        
        if (scenario.type === ScenarioType.EMAIL) {
          hints.push('• Sender email matches official domain')
          hints.push('• Content is expected and doesn\'t pressure immediate action')
          hints.push('• Professional formatting with proper branding')
        } else if (scenario.type === ScenarioType.SMS) {
          hints.push('• Message from verified sender/official short code')
          hints.push('• No suspicious links or urgent demands')
          hints.push('• Matches expected communication pattern')
        } else if (scenario.type === ScenarioType.SEARCH) {
          hints.push('• URL matches the official website exactly')
          hints.push('• HTTPS with valid certificate')
          hints.push('• Appears in organic results, not sponsored ads')
        }
        
        return hints.join('\n')
      }
    } else if (currentStep === Step.TYPE) {
      const typeHints: { [key: string]: string } = {
        [PhishingType.GENERAL]: '💡 This is a broad phishing attempt targeting many users with generic content',
        [PhishingType.SPEAR]: '💡 This is spear phishing - personalized attack targeting specific individuals with their info',
        [PhishingType.WHALING]: '💡 This is whaling - targets high-level executives (CEO, CFO) with authority-based tactics',
        [PhishingType.SEO]: '💡 This is SEO poisoning - malicious sites ranked high in search results through manipulation',
        [PhishingType.SMISHING]: '💡 This is smishing - phishing via SMS/text messages with malicious links',
        [PhishingType.RANSOMWARE]: '💡 This could lead to ransomware/malware - malicious file downloads that encrypt systems',
        [PhishingType.VISHING]: '💡 This is vishing - voice phishing over phone calls impersonating trusted entities',
        [PhishingType.QUISHING]: '💡 This is quishing - QR code phishing where scanning leads to malicious sites',
        [PhishingType.MFA_FATIGUE]: '💡 This is MFA fatigue attack - bombardment of push notifications to trick approval',
        [PhishingType.BEC]: '💡 This is BEC (Business Email Compromise) - impersonates executives/partners for fraud',
      }
      return typeHints[scenario.correctPhishingType] || `💡 Hint: This is ${scenario.correctPhishingType} - analyze the delivery method and target`
    } else if (currentStep === Step.DEFENSE) {
      const defenseHints: { [key: string]: string } = {
        [DefenseType.THINK]: '💡 Best defense: Think critically! Is this too good to be true? Why now? Pause before acting.',
        [DefenseType.DONT_CLICK]: '💡 Best defense: Don\'t click! Verify sender identity and URLs. Navigate directly to official sites.',
        [DefenseType.PATCH]: '💡 Best defense: Keep systems patched and updated. Enable automatic security updates.',
        [DefenseType.ANTIVIRUS]: '💡 Best defense: Use Antivirus/EDR software to detect and block malware before execution.',
        [DefenseType.EMAIL_SCRUB]: '💡 Best defense: Use email security tools to filter malicious content before it reaches inbox.',
        [DefenseType.SECURE_DNS]: '💡 Best defense: Use secure DNS (1.1.1.1, 8.8.8.8) to block known malicious domains.',
        [DefenseType.BACKUP]: '💡 Best defense: Maintain offline/immutable backups so you can recover from ransomware.',
        [DefenseType.VERIFY_MFA]: '💡 Best defense: Always verify unexpected MFA prompts. Deny unknown login attempts.',
        [DefenseType.HANG_UP]: '💡 Best defense: Hang up and call the official number. Never give info to incoming calls.',
      }
      return defenseHints[scenario.correctDefense] || `💡 Hint: The best defense is: ${scenario.correctDefense}`
    }
    return ''
  }

  const renderScenario = (scenario: Scenario, highlight: boolean) => {
    switch (scenario.type) {
      case ScenarioType.EMAIL:
        return <EmailView content={scenario.content} highlight={highlight} riskPoints={scenario.riskPoints} />
      case ScenarioType.SMS:
      case ScenarioType.VOICE:
        return <SmsView content={scenario.content} highlight={highlight} type={scenario.type} />
      case ScenarioType.SEARCH:
      case ScenarioType.AUTH:
        return <SearchView content={scenario.content} highlight={highlight} />
      default:
        return null
    }
  }

  const getWrongTypeExplanation = (selected: PhishingType | undefined, correct: PhishingType, scenarioType: ScenarioType) => {
    if (!selected) return "You marked this as safe, but it was actually malicious."
    if (selected === correct) return null

    if (selected === PhishingType.SMISHING && (scenarioType !== ScenarioType.SMS)) return "Smishing is strictly SMS/Text-based."
    if (selected === PhishingType.VISHING && (scenarioType !== ScenarioType.VOICE)) return "Vishing is Voice/Phone Call phishing."
    if (correct === PhishingType.RANSOMWARE) return `This attack was designed to encrypt data (Ransomware), not just steal it.`
    if (correct === PhishingType.BEC) return "This is Business Email Compromise (BEC) - impersonating a vendor or exec without a link/attachment."
    if (correct === PhishingType.MFA_FATIGUE) return "This is MFA Fatigue - bombing you with notifications."
    if (correct === PhishingType.QUISHING) return "This is Quishing - Phishing via QR Codes."

    return `Incorrect. You selected ${selected}.`
  }

  const getTacticPsychology = (tactic: SocialTactic) => {
    switch (tactic) {
      case SocialTactic.URGENCY: return "Attackers create a false crisis (like a strict deadline, account closure, or expiring deal) to force your brain into 'fast thinking' mode. This rush causes you to bypass critical analysis and act on impulse."
      case SocialTactic.FEAR: return "Fear triggers a biological fight-or-flight response. By threatening arrest, legal action, financial loss, or public exposure, the attacker intimidates you into complying immediately to resolve the perceived danger."
      case SocialTactic.GREED: return "Greed exploits the natural desire for gain. When promised free money, unexpected gifts, or exclusive access, our skepticism lowers as we focus on the potential reward rather than the risks involved."
      case SocialTactic.AUTHORITY: return "We are socially conditioned to obey figures of authority (Police, CEOs, Government Officials). Impersonating these figures bypasses our verification process because questioning a superior feels risky or rude."
      case SocialTactic.CURIOSITY: return "Curiosity is a powerful motivator. Vague but intriguing messages (like 'Is this you in the video?' or 'Salary Info') create an information gap that we feel a compulsive urge to close by clicking."
      case SocialTactic.FAMILIARITY: return "Attacks using Familiarity mimic routine tasks, known brands, or even friends. Since the context feels normal (e.g., a delivery text or a colleague's name), our brain doesn't flag it as a threat."
      case SocialTactic.TRUST: return "By hijacking a known conversation chain or spoofing a trusted vendor, the attacker exploits the relationship you've already built, making you assume the new request is safe."
      default: return "This tactic manipulates social norms and human psychology to trick you into performing an action you wouldn't normally do."
    }
  }

  const getTacticIcon = (tactic: SocialTactic) => {
    switch(tactic) {
      case SocialTactic.URGENCY: return <AlertTriangle className="w-5 h-5 text-orange-500" />
      case SocialTactic.FEAR: return <AlertOctagon className="w-5 h-5 text-red-600" />
      case SocialTactic.GREED: return <Shield className="w-5 h-5 text-green-600" />
      case SocialTactic.AUTHORITY: return <Lock className="w-5 h-5 text-purple-600" />
      case SocialTactic.CURIOSITY: return <BrainCircuit className="w-5 h-5 text-blue-500" />
      default: return <Shield className="w-5 h-5 text-slate-500" />
    }
  }

  if (gameState === GameState.START) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white">
        {user && (
          <Link 
            to="/dashboard" 
            className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition-colors text-sm"
          >
            Dashboard
          </Link>
        )}
        <Shield className="w-24 h-24 text-indigo-400 mb-6" />
        <h1 className="text-4xl font-bold mb-2 text-center">AwarenessHub</h1>
        <h2 className="text-xl text-indigo-200 mb-8 font-semibold">Cybersecurity Simulations</h2>
        
        <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Module Cards */}
          <button onClick={() => startGame(SimulationModule.EMAIL_DEFENSE)} className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 p-6 rounded-xl text-left transition-all group">
            <div className="bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Mail className="w-6 h-6 text-white" /></div>
            <h3 className="font-bold text-lg mb-1">Email Defense</h3>
            <p className="text-slate-400 text-sm">Spear Phishing, Whaling & BEC.</p>
          </button>

          <button onClick={() => startGame(SimulationModule.MOBILE_SECURITY)} className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 p-6 rounded-xl text-left transition-all group">
            <div className="bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><MessageSquare className="w-6 h-6 text-white" /></div>
            <h3 className="font-bold text-lg mb-1">Mobile & Vishing</h3>
            <p className="text-slate-400 text-sm">Smishing, WhatsApp & Fake Calls.</p>
          </button>

          <button onClick={() => startGame(SimulationModule.WEB_MALWARE)} className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 p-6 rounded-xl text-left transition-all group">
            <div className="bg-red-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Globe className="w-6 h-6 text-white" /></div>
            <h3 className="font-bold text-lg mb-1">Web Threats</h3>
            <p className="text-slate-400 text-sm">Malicious Sites & SEO Poisoning.</p>
          </button>

          <button onClick={() => startGame(SimulationModule.RANSOMWARE)} className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 p-6 rounded-xl text-left transition-all group">
            <div className="bg-red-800 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><HardDrive className="w-6 h-6 text-white" /></div>
            <h3 className="font-bold text-lg mb-1">Ransomware Defense</h3>
            <p className="text-slate-400 text-sm">Recognize Encrypted Threats.</p>
          </button>

          <button onClick={() => startGame(SimulationModule.IDENTITY_AUTH)} className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 p-6 rounded-xl text-left transition-all group">
            <div className="bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Fingerprint className="w-6 h-6 text-white" /></div>
            <h3 className="font-bold text-lg mb-1">Identity & Auth</h3>
            <p className="text-slate-400 text-sm">Passwords, MFA Fatigue & QR Codes.</p>
          </button>

          <button onClick={() => startGame(SimulationModule.SOCIAL_ENG)} className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 p-6 rounded-xl text-left transition-all group">
            <div className="bg-orange-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Users className="w-6 h-6 text-white" /></div>
            <h3 className="font-bold text-lg mb-1">Social Engineering</h3>
            <p className="text-slate-400 text-sm">Manipulation, Pretexting & Scams.</p>
          </button>

          <button onClick={() => startGame(SimulationModule.ALL)} className="bg-slate-800 hover:bg-indigo-900/50 border border-slate-700 hover:border-indigo-500 p-6 rounded-xl text-left transition-all group md:col-span-3 lg:col-span-3">
            <div className="bg-indigo-600 w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Layers className="w-6 h-6 text-white" /></div>
            <h3 className="font-bold text-lg mb-1">Mixed Simulation</h3>
            <p className="text-slate-400 text-sm">Randomized mix of all scenarios.</p>
          </button>
        </div>
      </div>
    )
  }

  if (gameState === GameState.END) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-slate-900 text-white text-center">
        <CheckCircle className="w-20 h-20 text-green-400 mb-6" />
        <h2 className="text-3xl font-bold mb-2">Simulation Complete</h2>
        <div className="mb-8 space-y-2">
          <p className="text-xl">
            You identified {score} out of {scenarios.length} scenarios perfectly!
          </p>
          <p className="text-lg text-indigo-300">
            Points Earned: {score * 10} pts
          </p>
          <p className="text-sm text-slate-400">
            Hints Used: {hintsUsed}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => setGameState(GameState.START)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Main Menu
          </button>
          {user && (
            <Link 
              to="/dashboard" 
              className="bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center gap-2"
            >
              <Shield className="w-5 h-5" />
              Dashboard
            </Link>
          )}
        </div>
      </div>
    )
  }

  const scenario = scenarios[currentIdx]
  const isHighlightActive = step === Step.FEEDBACK && scenario.isPhishing

  return (
    <div className="min-h-screen bg-slate-50 py-4 md:py-8 px-3 md:px-4 flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 md:mb-6 gap-3">
        <div className="flex items-center gap-2 text-slate-700 font-bold text-base md:text-lg cursor-pointer" onClick={() => setGameState(GameState.START)}>
          <Shield className="w-5 h-5 md:w-6 md:h-6 text-indigo-600" />
          <span className="text-sm md:text-base">AwarenessHub <span className="text-[10px] md:text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded ml-1">{selectedModule}</span></span>
        </div>
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-xs md:text-sm text-slate-500">Scenario {currentIdx + 1}/{scenarios.length}</span>
          <span className="bg-indigo-100 text-indigo-800 text-xs md:text-sm font-medium px-2.5 md:px-3 py-1 rounded-full">
            Score: {score}
          </span>
        </div>
        </div>

      <div className="flex flex-col lg:flex-row gap-4 md:gap-8 w-full max-w-7xl items-start">
        {/* Left: Scenario View */}
        <div className="w-full lg:w-1/2 flex justify-center items-start overflow-x-hidden">
          {renderScenario(scenario, isHighlightActive)}
        </div>

        {/* Right: Interaction Panel */}
        <div className="w-full lg:w-1/2 bg-white rounded-lg md:rounded-xl shadow-xl p-4 md:p-6 border border-slate-100 min-h-[350px] md:min-h-[400px] flex flex-col">
          
          <div className="flex gap-2 mb-4">
            {[Step.IDENTIFY, Step.TYPE, Step.DEFENSE].map((s, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full transition-colors ${step > s ? 'bg-indigo-500' : step === s ? 'bg-indigo-200' : 'bg-slate-100'} ${(s === Step.TYPE && !answers.isPhishing && step > Step.IDENTIFY) ? 'hidden' : ''}`} />
            ))}
          </div>

          {/* Hint Button - Only show during gameplay steps */}
          {step !== Step.FEEDBACK && (
            <div className="mb-4">
              <button
                onClick={handleHintClick}
                className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-all ${hintUsedForScenario.has(currentIdx) ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 'bg-yellow-500 hover:bg-yellow-600 text-white'}`}
              >
                <Lightbulb className="w-5 h-5" />
                <span className="font-medium">{hintUsedForScenario.has(currentIdx) ? 'Hint Revealed' : 'Get Hint'}</span>
              </button>
              {showHint && (
                <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-900 animate-in fade-in slide-in-from-top-2 duration-300">
                  {getHintText(scenario, step)}
                </div>
              )}
            </div>
          )}

          <div className="flex-1 flex flex-col justify-center">
            {step === Step.IDENTIFY && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6">Is this a threat?</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button onClick={() => handleIdentify(true)} className="flex flex-col items-center justify-center p-4 md:p-8 border-2 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-300 rounded-lg md:rounded-xl transition-all group">
                    <AlertTriangle className="w-10 h-10 md:w-12 md:h-12 text-red-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm md:text-lg font-bold text-red-700">Yes, Malicious</span>
                  </button>
                  <button onClick={() => handleIdentify(false)} className="flex flex-col items-center justify-center p-4 md:p-8 border-2 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-300 rounded-lg md:rounded-xl transition-all group">
                    <Shield className="w-10 h-10 md:w-12 md:h-12 text-green-500 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-sm md:text-lg font-bold text-green-700">No, it's Safe</span>
                  </button>
                </div>
              </div>
            )}

            {step === Step.TYPE && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6">What type of attack is this?</h2>
                <div className="grid grid-cols-1 gap-2 md:gap-3 max-h-80 md:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  {[PhishingType.GENERAL, PhishingType.SPEAR, PhishingType.BEC, PhishingType.RANSOMWARE, PhishingType.SMISHING, PhishingType.VISHING, PhishingType.QUISHING, PhishingType.MFA_FATIGUE, PhishingType.SEO].map((type) => (
                    <button key={type} onClick={() => handleTypeSelect(type)} className="text-left p-4 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors font-medium text-slate-700">
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === Step.DEFENSE && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-4 md:mb-6">What is the best defense?</h2>
                <div className="grid grid-cols-1 gap-2 md:gap-3 max-h-80 md:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100">
                  {[DefenseType.THINK, DefenseType.DONT_CLICK, DefenseType.VERIFY_MFA, DefenseType.HANG_UP, DefenseType.ANTIVIRUS, DefenseType.BACKUP, DefenseType.SECURE_DNS].map((def) => (
                    <button key={def} onClick={() => handleDefenseSelect(def)} className="text-left p-4 border border-slate-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-colors font-medium text-slate-700 flex items-center gap-3">
                      <Lock className="w-4 h-4 text-indigo-400" /> {def}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === Step.FEEDBACK && (
              <div className="animate-in fade-in zoom-in-95 duration-300 bg-slate-50 p-6 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3 mb-4">
                  {answers.defense === scenario.correctDefense && answers.isPhishing === scenario.isPhishing && (answers.phishingType === scenario.correctPhishingType || !scenario.isPhishing) ? (
                    <div className="bg-green-100 text-green-700 p-2 rounded-full shrink-0"><CheckCircle className="w-8 h-8" /></div>
                  ) : (
                    <div className="bg-orange-100 text-orange-700 p-2 rounded-full shrink-0"><XCircle className="w-8 h-8" /></div>
                  )}
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{answers.defense === scenario.correctDefense && answers.isPhishing === scenario.isPhishing ? "Well Done!" : "Review Needed"}</h3>
                    <p className="text-sm text-slate-500">{scenario.isPhishing ? `Actual Type: ${scenario.correctPhishingType}` : "This was a legitimate communication."}</p>
                  </div>
                </div>
                
                {scenario.isPhishing && scenario.socialTactic && (
                  <div className="mb-4 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
                     <div className="p-3 flex items-center gap-3 bg-slate-50 border-b border-slate-100">
                        <div className="p-2 bg-white border border-slate-200 rounded-full shadow-sm">{getTacticIcon(scenario.socialTactic)}</div>
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Primary Tactic Used</span>
                            <span className="font-bold text-slate-800 text-lg">{scenario.socialTactic}</span>
                        </div>
                     </div>
                     <div className="p-4 bg-indigo-50/50 text-sm text-slate-700">
                        <span className="font-semibold text-indigo-900 block mb-1">Why this is effective:</span>
                        {getTacticPsychology(scenario.socialTactic)}
                     </div>
                  </div>
                )}
                
                <div className="prose prose-slate text-sm mb-6">
                  {scenario.isPhishing && answers.isPhishing && answers.phishingType !== scenario.correctPhishingType && (
                     <div className="mb-3 p-3 bg-indigo-50 border-l-4 border-indigo-500 text-indigo-800 rounded-r">
                        <strong>Why not {answers.phishingType}?</strong><br/>
                        {getWrongTypeExplanation(answers.phishingType, scenario.correctPhishingType, scenario.type)}
                     </div>
                  )}
                  {answers.defense !== scenario.correctDefense && (
                    <div className="mb-3 p-3 bg-orange-50 border-l-4 border-orange-400 text-orange-800 rounded-r"><strong>Better Defense:</strong> {scenario.correctDefense}</div>
                  )}
                  <p className="text-slate-700">{scenario.explanation}</p>
                  
                   {scenario.isPhishing && scenario.riskPoints && scenario.riskPoints.length > 0 && (
                     <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded flex items-center gap-2 text-red-800 animate-pulse font-semibold">
                        <AlertTriangle className="w-5 h-5" />
                        <span>Click the flashing red dots on the simulation to see the tactics used!</span>
                     </div>
                  )}
                </div>
                <button onClick={nextScenario} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">
                  {currentIdx < scenarios.length - 1 ? "Next Scenario" : "See Final Score"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}