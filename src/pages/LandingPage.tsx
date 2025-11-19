import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Leaderboard from '@/components/Leaderboard'
import { Shield, Award, Target, Users, Lock, Key, Mail, Network, Bug, Smartphone, Cloud, Search, UserCheck, Code, CreditCard, CheckSquare } from 'lucide-react'

const modules = [
  { icon: Lock, title: 'Secret Message Detective', description: 'Master cryptography techniques' },
  { icon: Key, title: 'Password Guardian', description: 'Learn password security' },
  { icon: Mail, title: 'Email Detective', description: 'Identify phishing attacks' },
  { icon: Network, title: 'Network Security', description: 'Analyze network threats' },
  { icon: Bug, title: 'Malware Hunter', description: 'Detect malicious software' },
  { icon: Shield, title: 'Firewall Specialist', description: 'Configure network protection' },
  { icon: Smartphone, title: 'Mobile Security', description: 'Secure mobile devices' },
  { icon: Cloud, title: 'Cloud Security', description: 'Protect cloud infrastructure' },
  { icon: Search, title: 'Digital Forensics', description: 'Investigate incidents' },
  { icon: Users, title: 'Social Engineering', description: 'Defend against manipulation' },
  { icon: Code, title: 'Secure Coding', description: 'Write secure applications' },
  { icon: CreditCard, title: 'Payment Security', description: 'Protect transactions' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background-page">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-hero font-bold text-neutral-900 mb-6">
            Master Cybersecurity Through
            <span className="block text-primary-500">Interactive Challenges</span>
          </h1>
          <p className="text-body-lg text-neutral-700 mb-8 max-w-3xl mx-auto">
            Learn cybersecurity fundamentals through 12 comprehensive modules and 72 hands-on CTF-style challenges. Build real-world skills while earning badges and competing on leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="inline-block px-8 py-4 bg-primary-500 text-white text-body font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              Start Learning Free
            </Link>
            <Link
              to="/security-checklist"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-primary-500 text-primary-500 text-body font-semibold rounded-md hover:bg-primary-50 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
            >
              <CheckSquare className="w-5 h-5" />
              Security Checklist
            </Link>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-background-surface">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-h3 font-semibold text-neutral-900 mb-3">12+ Modules</h3>
              <p className="text-body text-neutral-700">
                Comprehensive coverage from cryptography to cloud security
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-h3 font-semibold text-neutral-900 mb-3">CTF-Style Challenges</h3>
              <p className="text-body text-neutral-700">
                Hands-on learning with progressive difficulty levels
              </p>
            </div>
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-h3 font-semibold text-neutral-900 mb-3">Track Progress</h3>
              <p className="text-body text-neutral-700">
                Earn badges, climb leaderboards, and measure your growth
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Module Overview */}
      <section className="py-16">
        <div className="container mx-auto">
          <h2 className="text-h2 font-bold text-neutral-900 text-center mb-12">
            Learning Modules
          </h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const Icon = module.icon
              return (
                <div
                  key={index}
                  className="bg-background-surface p-6 rounded-lg border border-neutral-200 hover:border-primary-500 hover:shadow-card-hover transition-all duration-250"
                >
                  <Icon className="w-12 h-12 text-primary-500 mb-4" />
                  <h3 className="text-body font-semibold text-neutral-900 mb-2">{module.title}</h3>
                  <p className="text-small text-neutral-700">{module.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Security Checklist Feature */}
      <section className="py-16 bg-gradient-to-br from-primary-50 to-primary-100">
        <div className="container mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
                  <CheckSquare className="w-4 h-4" />
                  Free Resource - No Login Required
                </div>
                <h2 className="text-h2 font-bold text-neutral-900 mb-4">
                  Personal Security Checklist
                </h2>
                <p className="text-body-lg text-neutral-700 mb-6">
                  Access our comprehensive security checklist with 200+ actionable items to protect your digital life. 
                  Track your progress locally in your browser - no account needed.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">12 categories covering authentication, browsing, email, and more</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Priority levels: Essential, Optional, and Advanced</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Progress tracking with export/import functionality</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckSquare className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-neutral-700">Detailed explanations and best practices for each item</span>
                  </li>
                </ul>
                <Link
                  to="/security-checklist"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  View Security Checklist
                  <CheckSquare className="w-5 h-5" />
                </Link>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-2xl p-8 border border-primary-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <CheckSquare className="w-5 h-5 text-green-600" />
                        <span className="font-medium text-neutral-900">Use Strong Passwords</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">Essential</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
                        <span className="text-neutral-700">Enable 2FA</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">Essential</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
                        <span className="text-neutral-700">Use Password Manager</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">Essential</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-neutral-300 rounded-full" />
                        <span className="text-neutral-700">Review Active Sessions</span>
                      </div>
                      <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">Optional</span>
                    </div>
                    <div className="mt-6 pt-4 border-t border-neutral-200">
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-neutral-700">Your Progress</span>
                        <span className="font-bold text-primary-600">25%</span>
                      </div>
                      <div className="h-3 bg-neutral-200 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-primary-500 to-primary-600 w-1/4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-background-surface">
        <div className="container mx-auto">
          <h2 className="text-h2 font-bold text-neutral-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: 1, title: 'Sign Up', description: 'Create your free account' },
              { step: 2, title: 'Learn & Practice', description: 'Complete modules, challenges & simulations' },
              { step: 3, title: 'Earn Badges', description: 'Track your achievements & progress' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-full flex items-center justify-center text-h2 font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-body font-semibold text-neutral-900 mb-2">{item.title}</h3>
                <p className="text-small text-neutral-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Simulation Feature */}
      <section className="py-16">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-h2 font-bold text-neutral-900 mb-6">
              Interactive Cybersecurity Simulation
            </h2>
            <p className="text-large text-neutral-700 mb-8">
              Experience hands-on cybersecurity scenarios through our interactive simulation. 
              Practice real-world threat detection, security implementation, and incident response 
              in a safe, controlled environment.
            </p>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {[
                { title: 'Real-time Scenarios', description: 'Face authentic cybersecurity challenges' },
                { title: 'Safe Environment', description: 'Practice without real-world consequences' },
                { title: 'Immediate Feedback', description: 'Learn from your decisions instantly' },
              ].map((feature) => (
                <div key={feature.title} className="p-6 bg-white border border-neutral-200 rounded-lg shadow-sm">
                  <h3 className="text-body font-semibold text-neutral-900 mb-2">{feature.title}</h3>
                  <p className="text-small text-neutral-700">{feature.description}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center">
              <Link
                to="/signup"
                className="inline-block px-6 py-3 bg-primary-500 text-white text-body font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5"
              >
                Try the Simulation
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto text-center">
          <h2 className="text-h1 font-bold text-neutral-900 mb-6">
            Ready to Start Learning?
          </h2>
          <div className="mb-8">
            <Leaderboard showTitle={false} maxUsers={6} className="max-w-2xl mx-auto" />
          </div>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-primary-500 text-white text-body font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
          >
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-neutral-900 text-neutral-500 text-center">
        <div className="container mx-auto">
          <p className="text-small">2025 AwarenessHub. Professional Cybersecurity Learning Platform.</p>
        </div>
      </footer>
    </div>
  )
}
