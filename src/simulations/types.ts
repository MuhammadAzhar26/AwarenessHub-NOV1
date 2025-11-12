export interface DragItem {
  id: string;
  content: string;
  category?: string;
  color?: string;
  metadata?: any;
}

export interface DropZone {
  id: string;
  title: string;
  description?: string;
  accepts: string[];
  color?: string;
}

export interface MatchPair {
  id: string;
  left: {
    id: string;
    content: string;
    category?: string;
  };
  right: {
    id: string;
    content: string;
    category?: string;
  };
}

export interface TimelineEvent {
  id: string;
  content: string;
  order: number;
}

export interface EnhancedScenario {
  id: string;
  title: string;
  description: string;
  type: 'chat' | 'drag-drop' | 'matching' | 'timeline' | 'multiple-choice';
  content: {
    chatMessages?: string[];
    dragDropData?: {
      items: DragItem[];
      dropZones: DropZone[];
    };
    matchingData?: {
      pairs: MatchPair[];
    };
    timelineData?: {
      events: TimelineEvent[];
      correctOrder: number[];
    };
    question?: string;
    options?: Array<{
      id: string;
      text: string;
      isCorrect: boolean;
      explanation: string;
    }>;
  };
  points: number;
  timeLimit?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon?: React.ComponentType<{ className?: string }>
  requirement: number
  unlocked?: boolean
  progress?: number
  color: string
}

export interface ScoreData {
  simulationId: string
  score: number
  maxScore: number
  correctAnswers: number
  totalQuestions: number
  timeSpent?: number
  achievements: Achievement[]
}