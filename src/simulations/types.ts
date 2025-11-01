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

export interface ScoreData {
  score: number;
  timeElapsed: number;
  correctAnswers: number;
  totalAnswers: number;
  percentage: number;
  scenarios: {
    id: string;
    score: number;
    points: number;
    timeElapsed: number;
  }[];
}