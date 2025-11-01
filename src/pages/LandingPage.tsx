import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Leaderboard from '@/components/Leaderboard'
import { Shield, Award, Target, Users, Lock, Key, Mail, Network, Bug, Smartphone, Cloud, Search, UserCheck, Code, CreditCard } from 'lucide-react'

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
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-primary-500 text-white text-body font-semibold rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-1 hover:shadow-card-hover"
          >
            Start Learning Free
          </Link>
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

      {/* How It Works */}
      <section className="py-16 bg-background-surface">
        <div className="container mx-auto">
          <h2 className="text-h2 font-bold text-neutral-900 text-center mb-12">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {[
              { step: 1, title: 'Sign Up', description: 'Create your free account' },
              { step: 2, title: 'Choose Module', description: 'Pick a topic to learn' },
              { step: 3, title: 'Complete Challenges', description: 'Solve CTF-style problems' },
              { step: 4, title: 'Earn Badges', description: 'Track your achievements' },
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
