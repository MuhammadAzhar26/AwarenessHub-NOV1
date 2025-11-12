import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SimulationProgress {
  socialEngineering: {
    completed: boolean
    score: number
    scenariosCompleted: string[]
    lastPlayed: string | null
  }
  passwordSecurity: {
    completed: boolean
    score: number
    scenariosCompleted: string[]
    lastPlayed: string | null
  }
  malwareProtection: {
    completed: boolean
    score: number
    scenariosCompleted: string[]
    lastPlayed: string | null
  }
}

interface ProgressContextType {
  progress: SimulationProgress
  updateSimulationProgress: (simulation: keyof SimulationProgress, data: Partial<SimulationProgress[keyof SimulationProgress]>) => void
  getOverallProgress: () => { completed: number; total: number; percentage: number }
}

const defaultProgress: SimulationProgress = {
  socialEngineering: {
    completed: false,
    score: 0,
    scenariosCompleted: [],
    lastPlayed: null
  },
  passwordSecurity: {
    completed: false,
    score: 0,
    scenariosCompleted: [],
    lastPlayed: null
  },
  malwareProtection: {
    completed: false,
    score: 0,
    scenariosCompleted: [],
    lastPlayed: null
  }
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined)

export const ProgressProvider = ({ children }: { children: ReactNode }) => {
  const [progress, setProgress] = useState<SimulationProgress>(defaultProgress)

  // Load progress from localStorage on mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('cybersecurityTrainingProgress')
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress))
      } catch (error) {
        console.error('Failed to load progress from localStorage:', error)
      }
    }
  }, [])

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cybersecurityTrainingProgress', JSON.stringify(progress))
  }, [progress])

  const updateSimulationProgress = (
    simulation: keyof SimulationProgress,
    data: Partial<SimulationProgress[keyof SimulationProgress]>
  ) => {
    setProgress(prev => ({
      ...prev,
      [simulation]: {
        ...prev[simulation],
        ...data,
        lastPlayed: new Date().toISOString()
      }
    }))
  }

  const getOverallProgress = () => {
    const simulations = Object.values(progress)
    const completed = simulations.filter(sim => sim.completed).length
    const total = simulations.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
    
    return { completed, total, percentage }
  }

  return (
    <ProgressContext.Provider value={{ progress, updateSimulationProgress, getOverallProgress }}>
      {children}
    </ProgressContext.Provider>
  )
}

export const useProgress = () => {
  const context = useContext(ProgressContext)
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider')
  }
  return context
}

export default ProgressProvider
