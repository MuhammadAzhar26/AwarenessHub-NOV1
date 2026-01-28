import React, { createContext, useContext, useEffect } from 'react'

type Theme = 'light'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme: Theme = 'light'

  useEffect(() => {
    // Always apply light theme
    document.documentElement.classList.remove('dark')
    document.documentElement.classList.add('light')
    document.body.style.backgroundColor = '#ffffff'
  }, [])

  const toggleTheme = () => {
    // Theme toggle disabled - always light mode
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}