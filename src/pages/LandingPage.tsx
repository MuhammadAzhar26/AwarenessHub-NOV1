import { Link } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import { Shield, Award, Target, Lock, Mail, Bug, CheckSquare, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Hero Section */}
      <section className="py-20 md:py-28 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Shield className="w-4 h-4" />
              Professional Cybersecurity Training Platform
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master Cybersecurity Through
              <span className="block text-blue-600 mt-2">Interactive Learning</span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Develop practical security skills through hands-on training modules, real-world simulations, and comprehensive security assessments.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Start Learning Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/security-checklist"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-200"
              >
                <CheckSquare className="w-5 h-5" />
                Security Checklist
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Comprehensive Training</h3>
                <p className="text-gray-600">
                  12+ modules covering essential cybersecurity topics from fundamentals to advanced techniques
                </p>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Hands-On Practice</h3>
                <p className="text-gray-600">
                  Real-world simulations and interactive challenges to build practical security skills
                </p>
              </div>
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Track Progress</h3>
                <p className="text-gray-600">
                  Monitor your learning journey with detailed analytics, badges, and achievement tracking
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Areas */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-4">
              Key Training Areas
            </h2>
            <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
              Develop expertise across critical cybersecurity domains
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <Lock className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Cryptography & Authentication</h3>
                <p className="text-sm text-gray-600">Master encryption, password security, and identity management</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <Mail className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Threat Detection</h3>
                <p className="text-sm text-gray-600">Learn to identify phishing, social engineering, and cyber attacks</p>
              </div>
              <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-all">
                <Bug className="w-10 h-10 text-blue-600 mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">Security Operations</h3>
                <p className="text-sm text-gray-600">Practice incident response, forensics, and security monitoring</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Elevate Your Cybersecurity Skills?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of learners building essential security expertise through practical, hands-on training.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-lg hover:bg-gray-100 transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-gray-400 text-center">
        <div className="container mx-auto px-4">
          <p className="text-sm">© 2025 AwarenessHub. Professional Cybersecurity Training Platform.</p>
        </div>
      </footer>
    </div>
  )
}
