import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Zap } from 'lucide-react';
import { MatchPair } from './types';

interface MatchingActivityProps {
  title: string;
  description?: string;
  pairs: MatchPair[];
  onComplete: (correct: number, total: number) => void;
  feedback?: string;
  className?: string;
}

interface MatchableItem {
  id: string;
  content: string;
  category?: string;
  isMatched: boolean;
  matchedWith?: string;
}

export const MatchingActivity: React.FC<MatchingActivityProps> = ({
  title,
  description,
  pairs,
  onComplete,
  feedback,
  className = '',
}) => {
  const [leftItems, setLeftItems] = useState<MatchableItem[]>([]);
  const [rightItems, setRightItems] = useState<MatchableItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lastMatchResult, setLastMatchResult] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Initialize items
    const leftInitial = pairs.map(pair => ({
      id: pair.left.id,
      content: pair.left.content,
      category: pair.left.category,
      isMatched: false,
    }));

    const rightInitial = pairs.map(pair => ({
      id: pair.right.id,
      content: pair.right.content,
      category: pair.right.category,
      isMatched: false,
    }));

    setLeftItems(shuffleArray(leftInitial));
    setRightItems(shuffleArray(rightInitial));
  }, [pairs]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const isCorrectMatch = (leftId: string, rightId: string): boolean => {
    const pair = pairs.find(p => p.left.id === leftId);
    return pair?.right.id === rightId;
  };

  const handleLeftSelect = (itemId: string) => {
    if (leftItems.find(item => item.id === itemId)?.isMatched) return;
    setSelectedLeft(selectedLeft === itemId ? null : itemId);
  };

  const handleRightSelect = (itemId: string) => {
    if (rightItems.find(item => item.id === itemId)?.isMatched) return;
    setSelectedRight(selectedRight === itemId ? null : itemId);
  };

  const attemptMatch = () => {
    if (!selectedLeft || !selectedRight) return;

    const correct = isCorrectMatch(selectedLeft, selectedRight);
    const newCombo = correct ? combo + 1 : 0;
    const points = correct ? 10 * (newCombo + 1) : 0;

    // Update items
    setLeftItems(prev => prev.map(item => 
      item.id === selectedLeft 
        ? { ...item, isMatched: true, matchedWith: selectedRight }
        : item
    ));
    setRightItems(prev => prev.map(item => 
      item.id === selectedRight 
        ? { ...item, isMatched: true, matchedWith: selectedLeft }
        : item
    ));

    // Update score and combo
    setScore(prev => prev + points);
    setCombo(newCombo);

    // Show feedback
    const message = correct 
      ? `Correct! +${points} points${newCombo > 0 ? ` (${newCombo}x combo!)` : ''}`
      : 'Incorrect match!';
    
    setLastMatchResult({ isCorrect: correct, message });

    // Clear selection
    setSelectedLeft(null);
    setSelectedRight(null);

    // Clear feedback after 2 seconds
    setTimeout(() => setLastMatchResult(null), 2000);

    // Check if completed
    const allMatched = leftItems.every(item => item.isMatched) || 
                     rightItems.every(item => item.isMatched);
    
    if (allMatched && !isCompleted) {
      setIsCompleted(true);
      setTimeout(() => {
        setShowResults(true);
        const correctMatches = pairs.filter(pair => {
          const leftItem = leftItems.find(item => item.id === pair.left.id);
          return leftItem?.matchedWith === pair.right.id;
        }).length;
        onComplete(correctMatches, pairs.length);
      }, 1000);
    }
  };

  const resetActivity = () => {
    setLeftItems(prev => prev.map(item => ({ ...item, isMatched: false, matchedWith: undefined })));
    setRightItems(prev => prev.map(item => ({ ...item, isMatched: false, matchedWith: undefined })));
    setSelectedLeft(null);
    setSelectedRight(null);
    setScore(0);
    setCombo(0);
    setLastMatchResult(null);
    setIsCompleted(false);
    setShowResults(false);

    // Reshuffle
    const leftInitial = pairs.map(pair => ({
      id: pair.left.id,
      content: pair.left.content,
      category: pair.left.category,
      isMatched: false,
    }));

    const rightInitial = pairs.map(pair => ({
      id: pair.right.id,
      content: pair.right.content,
      category: pair.right.category,
      isMatched: false,
    }));

    setLeftItems(shuffleArray(leftInitial));
    setRightItems(shuffleArray(rightInitial));
  };

  const canAttemptMatch = selectedLeft && selectedRight;
  const allMatched = leftItems.every(item => item.isMatched);

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        {description && (
          <p className="text-gray-300 text-lg mb-4">{description}</p>
        )}
        
        {/* Score Display */}
        <div className="flex items-center space-x-6 mb-6">
          <div className="bg-blue-900/50 px-4 py-2 rounded-lg">
            <span className="text-blue-400 font-semibold">Score: {score}</span>
          </div>
          {combo > 0 && (
            <div className="bg-orange-900/50 px-4 py-2 rounded-lg flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-400" />
              <span className="text-orange-400 font-semibold">{combo}x Combo</span>
            </div>
          )}
        </div>

        {/* Feedback */}
        <AnimatePresence>
          {lastMatchResult && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-4 rounded-lg mb-6 ${
                lastMatchResult.isCorrect ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                {lastMatchResult.isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className={lastMatchResult.isCorrect ? 'text-green-400' : 'text-red-400'}>
                  {lastMatchResult.message}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Items</h3>
          <div className="space-y-3">
            {leftItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleLeftSelect(item.id)}
                disabled={item.isMatched}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  item.isMatched
                    ? 'bg-green-900/30 border-green-600 text-green-400 cursor-not-allowed'
                    : selectedLeft === item.id
                    ? 'bg-blue-900/50 border-blue-500 text-blue-300'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                }`}
                whileHover={!item.isMatched ? { scale: 1.02 } : {}}
                whileTap={!item.isMatched ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.content}</span>
                  {item.isMatched && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-2 flex-shrink-0" />
                  )}
                  {!item.isMatched && selectedLeft === item.id && (
                    <div className="w-3 h-3 bg-blue-400 rounded-full ml-2 flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">Matches</h3>
          <div className="space-y-3">
            {rightItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleRightSelect(item.id)}
                disabled={item.isMatched}
                className={`w-full p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                  item.isMatched
                    ? 'bg-green-900/30 border-green-600 text-green-400 cursor-not-allowed'
                    : selectedRight === item.id
                    ? 'bg-blue-900/50 border-blue-500 text-blue-300'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500'
                }`}
                whileHover={!item.isMatched ? { scale: 1.02 } : {}}
                whileTap={!item.isMatched ? { scale: 0.98 } : {}}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">{item.content}</span>
                  {item.isMatched && (
                    <CheckCircle className="w-5 h-5 text-green-400 ml-2 flex-shrink-0" />
                  )}
                  {!item.isMatched && selectedRight === item.id && (
                    <div className="w-3 h-3 bg-blue-400 rounded-full ml-2 flex-shrink-0" />
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Match Button */}
      <div className="mt-8 text-center">
        <button
          onClick={attemptMatch}
          disabled={!canAttemptMatch}
          className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          {canAttemptMatch ? 'Match Selected Items' : 'Select items to match'}
        </button>
      </div>

      {/* Reset Button */}
      <div className="mt-4 text-center">
        <button
          onClick={resetActivity}
          className="px-6 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2 mx-auto"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Activity</span>
        </button>
      </div>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 p-8 rounded-lg max-w-md w-full mx-4"
            >
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Activity Complete!</h3>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {score} pts
                </div>
                <p className="text-gray-300 mb-6">
                  Total score for this activity
                </p>
                {feedback && (
                  <p className="text-blue-400 mb-6">{feedback}</p>
                )}
                <button
                  onClick={resetActivity}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};