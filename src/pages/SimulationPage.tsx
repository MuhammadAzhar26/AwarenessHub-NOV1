import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Shield, ArrowLeft, Users, Key, ShieldAlert, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ProgressProvider } from '@/simulations'
import { 
  SocialEngineeringSimEnhanced, 
  PasswordSecuritySimEnhanced, 
  MalwareProtectionSimEnhanced 
} from '@/simulations'
import { useState } from 'react'

export default function SimulationPage() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [selectedSimulation, setSelectedSimulation] = useState<string | null>(null)

  const simulations = [
    {
      id: 'social-engineering',
      title: 'Social Engineering & Vishing Awareness',
      description: 'Learn to identify and defend against social engineering attacks and voice phishing attempts',
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      component: SocialEngineeringSimEnhanced,
      scenarios: 15,
      difficulty: 'Beginner to Advanced'
    },
    {
      id: 'password-security',
      title: 'Password Security & Authentication',
      description: 'Master password creation, management, and multi-factor authentication security',
      icon: Key,
      color: 'from-green-500 to-emerald-500',
      component: PasswordSecuritySimEnhanced,
      scenarios: 15,
      difficulty: 'Beginner to Advanced'
    },
    {
      id: 'malware-protection',
      title: 'Malware & Device Protection',
      description: 'Learn to protect against malware, secure devices, and implement effective security measures',
      icon: ShieldAlert,
      color: 'from-red-500 to-pink-500',
      component: MalwareProtectionSimEnhanced,
      scenarios: 15,
      difficulty: 'Beginner to Advanced'
    }
  ]

  const selectedSim = simulations.find(sim => sim.id === selectedSimulation)

  if (selectedSim) {
    const SimulationComponent = selectedSim.component
    return (
      <ProgressProvider>
        <SimulationComponent />
      </ProgressProvider>
    )
  }

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      theme === 'dark' ? 'bg-neutral-950 text-neutral-100' : 'bg-white text-neutral-900'
    }`}>
      {/* Header */}
      <div className={`sticky top-0 z-50 border-b backdrop-blur-sm transition-colors duration-200 ${
        theme === 'dark' 
          ? 'bg-neutral-900/95 border-neutral-800' 
          : 'bg-white/95 border-neutral-200'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo & Back Button */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedSimulation(null)}
                className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
                  theme === 'dark' ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back to Simulations</span>
              </button>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary-500" />
                <h1 className="text-h3 font-bold">Cybersecurity Simulations</h1>
              </div>
            </div>
            
            {/* Quick Link to Dashboard */}
            {user && (
              <Link 
                to="/dashboard" 
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors text-sm"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="max-w-4xl mx-auto mb-12 text-center">
          <h2 className="text-h2 font-bold mb-4">Choose Your Cybersecurity Training</h2>
          <p className={`text-body mb-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
            Select from our comprehensive interactive simulations designed to enhance your cybersecurity knowledge 
            and skills through hands-on scenarios.
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-md text-sm ${
            theme === 'dark' 
              ? 'bg-primary-900/20 text-primary-300' 
              : 'bg-primary-50 text-primary-700'
          }`}>
            <Shield className="w-4 h-4" />
            <span>45 Total Scenarios • 3 Comprehensive Simulations • Real-time Feedback</span>
          </div>
        </div>

        {/* Simulations Grid */}
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {simulations.map((simulation) => {
              const IconComponent = simulation.icon
              return (
                <div
                  key={simulation.id}
                  className={`group relative rounded-xl border transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer ${
                    theme === 'dark' 
                      ? 'bg-neutral-900 border-neutral-800 hover:border-primary-500' 
                      : 'bg-white border-neutral-200 hover:border-primary-300'
                  }`}
                  onClick={() => setSelectedSimulation(simulation.id)}
                >
                  {/* Gradient Header */}
                  <div className={`h-32 rounded-t-xl bg-gradient-to-br ${simulation.color} flex items-center justify-center`}>
                    <IconComponent className="w-16 h-16 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-h4 font-semibold mb-3 group-hover:text-primary-500 transition-colors">
                      {simulation.title}
                    </h3>
                    <p className={`text-sm mb-6 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                      {simulation.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary-500">{simulation.scenarios}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>Scenarios</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-500">Interactive</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>Activities</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-semibold text-blue-500">{simulation.difficulty}</div>
                        <div className={`text-xs ${theme === 'dark' ? 'text-neutral-500' : 'text-neutral-400'}`}>Level</div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg font-semibold hover:from-primary-600 hover:to-primary-700 transition-all duration-200 group-hover:scale-105">
                      <Play className="w-4 h-4" />
                      Start Simulation
                    </button>
                  </div>
                  
                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </div>
              )
            })}
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto mt-16">
          <h3 className="text-h3 font-bold text-center mb-8">What You'll Experience</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className={`text-center p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="font-semibold mb-2">Interactive Activities</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Drag & drop, matching games, and timeline sorting challenges
              </p>
            </div>
            
            <div className={`text-center p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="font-semibold mb-2">Real-time Feedback</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Instant visual feedback and scoring for every interaction
              </p>
            </div>
            
            <div className={`text-center p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                <Key className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="font-semibold mb-2">Progress Tracking</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Track your completion and scores across all simulations
              </p>
            </div>
            
            <div className={`text-center p-6 rounded-lg border ${
              theme === 'dark' ? 'bg-neutral-900 border-neutral-800' : 'bg-neutral-50 border-neutral-200'
            }`}>
              <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
              <h4 className="font-semibold mb-2">Expert Scenarios</h4>
              <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Real-world cybersecurity scenarios and threat simulations
              </p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="max-w-4xl mx-auto mt-12">
          <div className="grid md:grid-cols-3 gap-6">
            <div className={`rounded-lg border p-6 transition-colors ${
              theme === 'dark' 
                ? 'bg-neutral-900 border-neutral-800' 
                : 'bg-white border-neutral-200'
            }`}>
              <h3 className="text-h5 font-semibold mb-3">Tools Training</h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Learn about cybersecurity tools and how to use them effectively.
              </p>
              {user && (
                <Link 
                  to="/tools" 
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  Explore Tools →
                </Link>
              )}
            </div>
            
            <div className={`rounded-lg border p-6 transition-colors ${
              theme === 'dark' 
                ? 'bg-neutral-900 border-neutral-800' 
                : 'bg-white border-neutral-200'
            }`}>
              <h3 className="text-h5 font-semibold mb-3">DFIR Training</h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Master Digital Forensics and Incident Response techniques.
              </p>
              {user && (
                <Link 
                  to="/dfir" 
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  Start DFIR →
                </Link>
              )}
            </div>
            
            <div className={`rounded-lg border p-6 transition-colors ${
              theme === 'dark' 
                ? 'bg-neutral-900 border-neutral-800' 
                : 'bg-white border-neutral-200'
            }`}>
              <h3 className="text-h5 font-semibold mb-3">Practice Challenges</h3>
              <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
                Test your skills with interactive cybersecurity challenges.
              </p>
              {user && (
                <Link 
                  to="/dashboard" 
                  className="text-primary-500 hover:text-primary-600 text-sm font-medium"
                >
                  Go to Dashboard →
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}