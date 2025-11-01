import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SimulationProgress {
  completed: boolean;
  score: number;
  scenariosCompleted: string[];
  lastPlayed: string | null;
}

interface Progress {
  socialEngineering: SimulationProgress;
  passwordSecurity: SimulationProgress;
  malwareProtection: SimulationProgress;
}

interface ProgressContextType {
  progress: Progress;
  updateSimulationProgress: (simulation: keyof Progress, data: Partial<SimulationProgress>) => void;
  getOverallProgress: () => { completed: number; total: number; percentage: number };
}

const defaultProgress: Progress = {
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
};

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<Progress>(defaultProgress);

  // Load progress from localStorage on mount
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('cybersecurityTrainingProgress');
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.warn('Failed to load progress from localStorage:', error);
    }
  }, []);

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('cybersecurityTrainingProgress', JSON.stringify(progress));
    } catch (error) {
      console.warn('Failed to save progress to localStorage:', error);
    }
  }, [progress]);

  const updateSimulationProgress = (
    simulation: keyof Progress,
    data: Partial<SimulationProgress>
  ) => {
    setProgress(prev => ({
      ...prev,
      [simulation]: {
        ...prev[simulation],
        ...data,
        lastPlayed: new Date().toISOString()
      }
    }));
  };

  const getOverallProgress = () => {
    const completed = Object.values(progress).filter(sim => sim.completed).length;
    const total = 3; // Total number of simulations
    const percentage = Math.round((completed / total) * 100);
    
    return { completed, total, percentage };
  };

  const value = {
    progress,
    updateSimulationProgress,
    getOverallProgress
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};