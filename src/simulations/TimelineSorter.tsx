import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { TimelineEvent } from './types';

interface TimelineSorterProps {
  title: string;
  description?: string;
  events: TimelineEvent[];
  correctOrder: number[];
  onComplete: (correct: number, total: number) => void;
  className?: string;
}

export const TimelineSorter: React.FC<TimelineSorterProps> = ({
  title,
  description,
  events,
  correctOrder,
  onComplete,
  className = '',
}) => {
  const [currentOrder, setCurrentOrder] = useState<TimelineEvent[]>([...events]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [showResults, setShowResults] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const checkOrder = () => {
    const newResults: Record<string, boolean> = {};
    let correctCount = 0;

    currentOrder.forEach((event, index) => {
      const isCorrect = event.order === correctOrder[index];
      newResults[event.id] = isCorrect;
      if (isCorrect) correctCount++;
    });

    setResults(newResults);
    setIsSubmitted(true);
    setShowResults(true);

    setTimeout(() => {
      onComplete(correctCount, events.length);
    }, 2000);
  };

  const resetActivity = () => {
    setCurrentOrder([...events]);
    setResults({});
    setIsSubmitted(false);
    setShowResults(false);
    setDragIndex(null);
  };

  const moveItem = (fromIndex: number, toIndex: number) => {
    if (isSubmitted) return;
    
    const newOrder = [...currentOrder];
    const [movedItem] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, movedItem);
    setCurrentOrder(newOrder);
  };

  const moveItemUp = (index: number) => {
    if (index === 0 || isSubmitted) return;
    moveItem(index, index - 1);
  };

  const moveItemDown = (index: number) => {
    if (index === currentOrder.length - 1 || isSubmitted) return;
    moveItem(index, index + 1);
  };

  const getEventResult = (eventId: string) => {
    if (!isSubmitted) return undefined;
    return results[eventId];
  };

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        {description && (
          <p className="text-gray-300 text-lg mb-6">{description}</p>
        )}
        
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-300">
            <Clock className="w-5 h-5" />
            <span className="font-medium">Instructions:</span>
          </div>
          <p className="text-blue-200 mt-2">
            Drag the events or use the arrow buttons to arrange them in the correct chronological order.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white mb-6">
          Arrange Events in Correct Order ({currentOrder.length} events)
        </h3>
        
        <div className="space-y-3">
          {currentOrder.map((event, index) => {
            const isCorrect = getEventResult(event.id);
            const isDragging = dragIndex === index;
            
            return (
              <motion.div
                key={event.id}
                layout
                className={`
                  relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer
                  ${isSubmitted && isCorrect !== undefined
                    ? isCorrect
                      ? 'bg-green-900/20 border-green-500 text-green-400'
                      : 'bg-red-900/20 border-red-500 text-red-400'
                    : 'bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700'
                  }
                  ${isDragging ? 'scale-105 shadow-lg z-50' : ''}
                `}
                whileHover={!isSubmitted ? { scale: 1.02 } : {}}
                style={{
                  zIndex: isDragging ? 50 : 1,
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Position Number */}
                    <div className={`
                      w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${isSubmitted && isCorrect !== undefined
                        ? isCorrect
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : 'bg-blue-600 text-white'
                      }
                    `}>
                      {index + 1}
                    </div>
                    
                    {/* Event Content */}
                    <div className="flex-1">
                      <p className="font-medium">{event.content}</p>
                    </div>
                    
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {isSubmitted && isCorrect !== undefined && (
                        isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )
                      )}
                    </div>
                  </div>
                  
                  {/* Controls */}
                  {!isSubmitted && (
                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={() => moveItemUp(index)}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Move up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveItemDown(index)}
                        disabled={index === currentOrder.length - 1}
                        className="p-1 text-gray-400 hover:text-white disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                        title="Move down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Timeline Connector */}
                {index < currentOrder.length - 1 && (
                  <div className="absolute left-8 top-full w-0.5 h-4 bg-gray-600 transform -translate-x-1/2" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-8 flex justify-center space-x-4">
        <button
          onClick={checkOrder}
          disabled={isSubmitted}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Check Order
        </button>
        <button
          onClick={resetActivity}
          className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
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
                <h3 className="text-2xl font-bold text-white mb-4">Timeline Complete!</h3>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {Object.values(results).filter(Boolean).length} / {events.length}
                </div>
                <p className="text-gray-300 mb-6">
                  Correct events in the right order
                </p>
                {Object.values(results).filter(Boolean).length === events.length ? (
                  <p className="text-green-400 font-semibold mb-6">
                    Perfect! All events are in the correct chronological order.
                  </p>
                ) : (
                  <p className="text-yellow-400 font-semibold mb-6">
                    Review the events and try again to improve your score.
                  </p>
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