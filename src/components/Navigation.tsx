import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Shield, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = user
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Tools Training', path: '/tools' },
        { name: 'DFIR', path: '/dfir' },
        { name: 'Simulation', path: '/simulation' },
        { name: 'Security Checklist', path: '/security-checklist' },
        { name: 'Badges', path: '/badges' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Profile', path: '/profile' },
      ]
    : [
        { name: 'Security Checklist', path: '/security-checklist' },
      ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className="sticky top-0 z-50 border-b bg-white border-gray-200 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <span className="text-h3 font-bold text-gray-900">
              AwarenessHub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-body transition-colors duration-200 ${
                  isActive(item.path)
                    ? 'text-blue-600 font-semibold'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <button
                onClick={() => signOut()}
                className="flex items-center gap-2 px-5 py-3 text-body text-gray-600 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Sign Out
              </button>
            )}
            
            {!user && (
              <>
                <Link
                  to="/login"
                  className="px-5 py-3 text-body text-gray-600 hover:text-blue-600 transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-body transition-colors ${
                  isActive(item.path)
                    ? 'text-blue-600 font-semibold bg-blue-50'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <button
                onClick={() => {
                  signOut()
                  setMobileMenuOpen(false)
                }}
                className="w-full text-left px-4 py-3 text-body text-red-600"
              >
                Sign Out
              </button>
            )}
            
            {!user && (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-body text-gray-600"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-body text-blue-600 font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
