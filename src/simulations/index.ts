// Enhanced Simulation Framework
export { default as EnhancedSimulation } from './EnhancedSimulation';

// Supporting Components
export { default as ChatInterface } from './ChatInterface';
export { default as AchievementSystem } from './AchievementSystem';
export { default as ProgressIndicator } from './ProgressIndicator';
export { default as ProgressProvider, useProgress } from './ProgressProvider';

// Interactive Activity Components
export { DragDropActivity } from './DragDropActivity';
export { MatchingActivity } from './MatchingActivity';
export { TimelineSorter } from './TimelineSorter';

// Type Definitions
export type {
  DragItem,
  DropZone,
  MatchPair,
  TimelineEvent,
  EnhancedScenario,
  ScoreData
} from './types';

// Enhanced Simulations (15 scenarios each)
export { default as SocialEngineeringSimEnhanced } from './SocialEngineeringSimEnhanced';
export { default as PasswordSecuritySimEnhanced } from './PasswordSecuritySimEnhanced';
export { default as MalwareProtectionSimEnhanced } from './MalwareProtectionSimEnhanced';

// Utility Hooks
export { useIsMobile } from './use-mobile';

// Legacy Components (kept for compatibility)
export { default as PhishingEmailSimEnhanced } from './PhishingEmailSimEnhanced';
export { default as DataBreachResponseSimEnhanced } from './DataBreachResponseSimEnhanced';
export { default as MalwareIncidentSimEnhanced } from './MalwareIncidentSimEnhanced';