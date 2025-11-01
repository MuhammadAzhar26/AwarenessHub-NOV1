import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Shield, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function SimulationPage() {
  const { user } = useAuth()
  const { theme } = useTheme()

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
              <Link 
                to={user ? '/dashboard' : '/'} 
                className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${
                  theme === 'dark' ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="text-sm">Back</span>
              </Link>
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-primary-500" />
                <h1 className="text-h3 font-bold">Cybersecurity Simulation</h1>
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
        {/* Simulation Instructions */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className={`rounded-lg border p-6 transition-colors ${
            theme === 'dark' 
              ? 'bg-neutral-900 border-neutral-800' 
              : 'bg-neutral-50 border-neutral-200'
          }`}>
            <h2 className="text-h4 font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary-500" />
              Interactive Cybersecurity Simulation
            </h2>
            <p className="text-body mb-4">
              Experience real-world cybersecurity scenarios through this interactive simulation. 
              Practice identifying threats, implementing security measures, and making critical decisions 
              in a safe, controlled environment.
            </p>
            <div className={`text-sm p-4 rounded-md ${
              theme === 'dark' 
                ? 'bg-primary-900/20 text-primary-300' 
                : 'bg-primary-50 text-primary-700'
            }`}>
              <strong>Instructions:</strong> Complete the simulation below. This interactive tool will help you 
              understand cybersecurity concepts through hands-on scenarios and real-time feedback.
            </div>
          </div>
        </div>

        {/* Simulation Embed */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-neutral-900 rounded-lg overflow-hidden shadow-2xl">
            {/* Responsive Container */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                title="Cybersecurity Simulation"
                src="https://view.genially.com/6906438fce2822013f550703"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allowFullScreen
                scrolling="yes"
                style={{
                  borderRadius: '0.5rem'
                }}
              />
            </div>
          </div>
          
          {/* Simulation Info */}
          <div className="mt-6 text-center">
            <p className={`text-sm ${theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Complete this interactive simulation to enhance your cybersecurity knowledge and skills.
            </p>
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