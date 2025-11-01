import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { DragItem, DropZone } from './types';

interface DragDropActivityProps {
  title: string;
  description?: string;
  items: DragItem[];
  dropZones: DropZone[];
  onComplete: (correct: number, total: number) => void;
  className?: string;
}

interface SortableItemProps {
  item: DragItem;
  isCorrect?: boolean;
  isDragging?: boolean;
  onRemove?: () => void;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, isCorrect, isDragging, onRemove }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        p-4 rounded-lg border cursor-grab active:cursor-grabbing transition-all duration-200
        ${isCorrect ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-gray-800 border-gray-600 text-gray-300'}
        ${isSortableDragging || isDragging ? 'scale-105 shadow-lg z-50' : 'hover:bg-gray-700'}
        ${isCorrect && onRemove ? 'opacity-75 cursor-not-allowed' : ''}
      `}
      whileHover={{ scale: onRemove ? 1 : 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{item.content}</span>
        {isCorrect && (
          <CheckCircle className="w-5 h-5 text-green-500 ml-2 flex-shrink-0" />
        )}
        {!isCorrect && onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="ml-2 text-gray-400 hover:text-red-400 transition-colors"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};

interface DropZoneComponentProps {
  zone: DropZone;
  items: DragItem[];
  isOver: boolean;
  onDrop: (itemId: string, zoneId: string) => void;
  isCorrect?: boolean;
}

const DropZoneComponent: React.FC<DropZoneComponentProps> = ({
  zone,
  items,
  isOver,
  onDrop,
  isCorrect
}) => {
  const getZoneColor = () => {
    if (isCorrect !== undefined) {
      return isCorrect ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10';
    }
    if (isOver) {
      return 'border-blue-500 bg-blue-900/20';
    }
    return 'border-gray-600 bg-gray-900/50';
  };

  return (
    <motion.div
      className={`
        min-h-[200px] p-6 rounded-lg border-2 border-dashed transition-all duration-200
        ${getZoneColor()}
      `}
      whileHover={{ scale: 1.02 }}
    >
      <div className="mb-4">
        <h3 className={`text-lg font-semibold mb-2 ${
          isCorrect !== undefined 
            ? isCorrect ? 'text-green-400' : 'text-red-400'
            : 'text-gray-300'
        }`}>
          {zone.title}
        </h3>
        {zone.description && (
          <p className="text-sm text-gray-400">{zone.description}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          {items.map((item) => (
            <SortableItem
              key={item.id}
              item={item}
              isCorrect={isCorrect}
              onRemove={() => onDrop(item.id, 'unused')}
            />
          ))}
        </SortableContext>
      </div>
      
      {items.length === 0 && (
        <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
          Drop items here
        </div>
      )}
    </motion.div>
  );
};

export const DragDropActivity: React.FC<DragDropActivityProps> = ({
  title,
  description,
  items: initialItems,
  dropZones: initialDropZones,
  onComplete,
  className = '',
}) => {
  const [items, setItems] = useState<DragItem[]>(initialItems);
  const [dropZones, setDropZones] = useState<DropZone[]>(initialDropZones);
  const [zoneItems, setZoneItems] = useState<Record<string, DragItem[]>>({});
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Initialize zone items
  useState(() => {
    const initialZoneItems: Record<string, DragItem[]> = {};
    initialDropZones.forEach(zone => {
      initialZoneItems[zone.id] = [];
    });
    setZoneItems(initialZoneItems);
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // If dropping on a zone
    if (initialDropZones.find(zone => zone.id === overId)) {
      const item = items.find(item => item.id === activeId);
      if (!item) return;

      // Remove from current location
      setItems(prev => prev.filter(item => item.id !== activeId));
      setZoneItems(prev => ({
        ...prev,
        [overId]: [...(prev[overId] || []), item]
      }));
    }
    // If dropping back to unused items
    else if (overId === 'unused') {
      const item = Object.values(zoneItems)
        .flat()
        .find(item => item.id === activeId);
      if (!item) return;

      setZoneItems(prev => {
        const newZoneItems = { ...prev };
        Object.keys(newZoneItems).forEach(zoneId => {
          newZoneItems[zoneId] = newZoneItems[zoneId].filter(item => item.id !== activeId);
        });
        return newZoneItems;
      });
      setItems(prev => [...prev, item]);
    }
  };

  const checkAnswers = () => {
    const newResults: Record<string, boolean> = {};
    let correctCount = 0;

    Object.entries(zoneItems).forEach(([zoneId, zoneItemsList]) => {
      const zone = dropZones.find(z => z.id === zoneId);
      if (!zone) return;

      zoneItemsList.forEach(item => {
        const isCorrect = zone.accepts.includes(item.category || '');
        newResults[`${zoneId}-${item.id}`] = isCorrect;
        if (isCorrect) correctCount++;
      });
    });

    setResults(newResults);
    setIsSubmitted(true);
    setShowResults(true);

    setTimeout(() => {
      onComplete(correctCount, initialItems.length);
    }, 2000);
  };

  const resetActivity = () => {
    setItems(initialItems);
    setZoneItems({});
    setResults({});
    setIsSubmitted(false);
    setShowResults(false);

    // Reinitialize zone items
    const initialZoneItems: Record<string, DragItem[]> = {};
    initialDropZones.forEach(zone => {
      initialZoneItems[zone.id] = [];
    });
    setZoneItems(initialZoneItems);
  };

  const getItemResult = (itemId: string, zoneId: string) => {
    const key = `${zoneId}-${itemId}`;
    return results[key];
  };

  const isAllItemsPlaced = items.length === 0;

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        {description && (
          <p className="text-gray-300 text-lg">{description}</p>
        )}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Unused Items */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Items to Sort</h3>
            <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-700 min-h-[300px]">
              <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
                <div className="space-y-3">
                  {items.map((item) => (
                    <SortableItem
                      key={item.id}
                      item={item}
                      isDragging={true}
                    />
                  ))}
                </div>
              </SortableContext>
              {items.length === 0 && (
                <div className="text-gray-500 text-center py-8">
                  All items have been placed
                </div>
              )}
            </div>
          </div>

          {/* Drop Zones */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Drop Zones</h3>
            <div className="space-y-6">
              {dropZones.map((zone) => (
                <DropZoneComponent
                  key={zone.id}
                  zone={zone}
                  items={zoneItems[zone.id] || []}
                  isOver={false}
                  onDrop={(itemId, targetZoneId) => {
                    if (targetZoneId === 'unused') {
                      const item = Object.values(zoneItems)
                        .flat()
                        .find(item => item.id === itemId);
                      if (item) {
                        setZoneItems(prev => {
                          const newZoneItems = { ...prev };
                          Object.keys(newZoneItems).forEach(zId => {
                            newZoneItems[zId] = newZoneItems[zId].filter(item => item.id !== itemId);
                          });
                          return newZoneItems;
                        });
                        setItems(prev => [...prev, item]);
                      }
                    }
                  }}
                  isCorrect={isSubmitted ? undefined : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={checkAnswers}
            disabled={!isAllItemsPlaced || isSubmitted}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
          >
            Check Answers
          </button>
          <button
            onClick={resetActivity}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>
        </div>
      </DndContext>

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
                <h3 className="text-2xl font-bold text-white mb-4">Results</h3>
                <div className="text-4xl font-bold text-green-400 mb-2">
                  {Object.values(results).filter(Boolean).length} / {initialItems.length}
                </div>
                <p className="text-gray-300 mb-6">
                  Correct answers out of {initialItems.length} total
                </p>
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