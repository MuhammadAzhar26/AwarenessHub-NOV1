import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { Shield, User, Trophy, LogOut, Menu, X, Sun, Moon, CheckSquare } from 'lucide-react'
import { useState } from 'react'

export default function Navigation() {
  const { user, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = user
    ? [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Tools Training', path: '/tools' },
        { name: 'DFIR', path: '/dfir' },
        { name: 'Simulation', path: '/simulation' },
        { name: 'Security Checklist', path: '/security-checklist' },
        { name: 'Leaderboard', path: '/leaderboard' },
        { name: 'Profile', path: '/profile' },
      ]
    : [
        { name: 'Security Checklist', path: '/security-checklist' },
      ]

  const isActive = (path: string) => location.pathname === path

  return (
    <nav className={`sticky top-0 z-50 border-b shadow-lg backdrop-blur-sm transition-colors duration-200 ${
      theme === 'dark' 
        ? 'bg-neutral-900 border-neutral-800' 
        : 'bg-white border-neutral-200'
    }`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary-500" />
            <span className={`text-h3 font-bold transition-colors ${
              theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'
            }`}>
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
                    ? 'text-primary-500 font-semibold'
                    : theme === 'dark'
                    ? 'text-neutral-400 hover:text-primary-400'
                    : 'text-neutral-600 hover:text-primary-500'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <>
                {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                  theme === 'dark'
                    ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
                title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              
                <button
                  onClick={() => signOut()}
                  className={`flex items-center gap-2 px-5 py-3 text-body transition-colors ${
                    theme === 'dark'
                      ? 'text-neutral-400 hover:text-error-500'
                      : 'text-neutral-600 hover:text-error-500'
                  }`}
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            )}
            
            {!user && (
              <>
                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className={`p-2 rounded-lg transition-all duration-200 hover:scale-105 ${
                    theme === 'dark'
                      ? 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                  title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                </button>
                
                <Link
                  to="/login"
                  className={`px-5 py-3 text-body transition-colors ${
                    theme === 'dark'
                      ? 'text-neutral-400 hover:text-primary-400'
                      : 'text-neutral-600 hover:text-primary-500'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-all duration-200 hover:-translate-y-0.5"
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
              <X className={`w-6 h-6 ${theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'}`} />
            ) : (
              <Menu className={`w-6 h-6 ${theme === 'dark' ? 'text-neutral-100' : 'text-neutral-900'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden py-4 border-t transition-colors ${
            theme === 'dark' 
              ? 'border-neutral-800 bg-neutral-900' 
              : 'border-neutral-200 bg-white'
          }`}>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-3 text-body transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-500 font-semibold bg-primary-900/20'
                    : theme === 'dark'
                    ? 'text-neutral-400'
                    : 'text-neutral-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {user && (
              <>
                
                {/* Mobile Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme()
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    theme === 'dark'
                      ? 'text-neutral-400 hover:bg-neutral-800'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
                
                <button
                  onClick={() => {
                    signOut()
                    setMobileMenuOpen(false)
                  }}
                  className="w-full text-left px-4 py-3 text-body text-error-500"
                >
                  Sign Out
                </button>
              </>
            )}
            
            {!user && (
              <>
                {/* Mobile Theme Toggle */}
                <button
                  onClick={() => {
                    toggleTheme()
                    setMobileMenuOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                    theme === 'dark'
                      ? 'text-neutral-400 hover:bg-neutral-800'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-5 h-5" />
                  ) : (
                    <Moon className="w-5 h-5" />
                  )}
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </button>
                
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 text-body transition-colors ${
                    theme === 'dark' ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-body text-primary-500 font-semibold"
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
