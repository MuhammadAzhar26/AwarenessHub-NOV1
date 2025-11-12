import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, RotateCcw, Move, ArrowRight } from 'lucide-react';
import { DragItem, DropZone } from './types';

interface DragDropActivityProps {
  title: string;
  description?: string;
  items: DragItem[];
  dropZones: DropZone[];
  onComplete: (correct: number, total: number) => void;
  className?: string;
}

interface SelectableItemProps {
  item: DragItem;
  isSelected?: boolean;
  isCorrect?: boolean;
  onSelect: () => void;
  onRemove?: () => void;
}

const SelectableItem: React.FC<SelectableItemProps> = ({ 
  item, 
  isSelected, 
  isCorrect, 
  onSelect, 
  onRemove 
}) => {
  return (
    <motion.div
      className={`
        p-3 rounded-lg border cursor-pointer transition-all duration-200
        ${isCorrect ? 'bg-green-900/20 border-green-500 text-green-400' : 'bg-gray-800 border-gray-600 text-gray-300'}
        ${isSelected ? 'border-blue-500 bg-blue-900/30 ring-2 ring-blue-500/50' : 'hover:bg-gray-700'}
        ${isCorrect && onRemove ? 'opacity-75' : ''}
      `}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{item.content}</span>
        <div className="flex items-center space-x-2">
          {isSelected && (
            <Move className="w-4 h-4 text-blue-400" />
          )}
          {isCorrect && (
            <CheckCircle className="w-5 h-5 text-green-500" />
          )}
          {onRemove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

interface DropZoneComponentProps {
  zone: DropZone;
  items: DragItem[];
  selectedItemId?: string;
  onPlaceItem: (zoneId: string) => void;
  onRemoveItem: (itemId: string, zoneId: string) => void;
  isCorrect?: boolean;
}

const DropZoneComponent: React.FC<DropZoneComponentProps> = ({
  zone,
  items,
  selectedItemId,
  onPlaceItem,
  onRemoveItem,
  isCorrect
}) => {
  const getZoneColor = () => {
    if (isCorrect !== undefined) {
      return isCorrect ? 'border-green-500 bg-green-900/20' : 'border-red-500 bg-red-900/20';
    }
    if (selectedItemId) {
      return 'border-blue-500 bg-blue-900/30';
    }
    return 'border-gray-600 bg-gray-900/50';
  };

  const handleClick = () => {
    if (selectedItemId) {
      onPlaceItem(zone.id);
    }
  };

  return (
    <motion.div
      className={`
        min-h-[200px] p-6 rounded-lg border-2 border-dashed transition-all duration-200 cursor-pointer
        ${getZoneColor()}
        ${selectedItemId ? 'hover:border-blue-400 hover:bg-blue-900/40' : 'hover:border-gray-500'}
      `}
      whileHover={{ scale: 1.02 }}
      onClick={handleClick}
    >
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className={`text-lg font-semibold ${
            isCorrect !== undefined 
              ? isCorrect ? 'text-green-400' : 'text-red-400'
              : 'text-gray-300'
          }`}>
            {zone.title}
          </h3>
          {selectedItemId && (
            <ArrowRight className="w-5 h-5 text-blue-400" />
          )}
        </div>
        {zone.description && (
          <p className="text-sm text-gray-400">{zone.description}</p>
        )}
      </div>
      
      <div className="space-y-2">
        {items.map((item) => (
          <SelectableItem
            key={item.id}
            item={item}
            isCorrect={isCorrect}
            onSelect={() => {}} // Items in zones can't be selected for moving
            onRemove={() => onRemoveItem(item.id, zone.id)}
          />
        ))}
      </div>
      
      {items.length === 0 && (
        <div className="text-gray-500 text-center py-8 border-2 border-dashed border-gray-700 rounded-lg">
          {selectedItemId ? 'Click to place selected item' : 'No items placed'}
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
  const [zoneItems, setZoneItems] = useState<Record<string, DragItem[]>>({});
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Initialize zone items
  React.useEffect(() => {
    const initialZoneItems: Record<string, DragItem[]> = {};
    initialDropZones.forEach(zone => {
      initialZoneItems[zone.id] = [];
    });
    setZoneItems(initialZoneItems);
  }, [initialDropZones]);

  const handleItemSelect = (itemId: string) => {
    if (isSubmitted) return;
    
    setSelectedItemId(selectedItemId === itemId ? null : itemId);
  };

  const handlePlaceItem = (zoneId: string) => {
    if (!selectedItemId || isSubmitted) return;

    const item = items.find(item => item.id === selectedItemId);
    if (!item) return;

    // Remove from unused items
    setItems(prev => prev.filter(item => item.id !== selectedItemId));
    
    // Add to the target zone
    setZoneItems(prev => ({
      ...prev,
      [zoneId]: [...(prev[zoneId] || []), item]
    }));

    setSelectedItemId(null);
  };

  const handleRemoveItem = (itemId: string, zoneId: string) => {
    if (isSubmitted) return;

    const item = Object.values(zoneItems)
      .flat()
      .find(item => item.id === itemId);
    
    if (!item) return;

    // Remove from the zone
    setZoneItems(prev => ({
      ...prev,
      [zoneId]: prev[zoneId].filter(item => item.id !== itemId)
    }));

    // Add back to unused items
    setItems(prev => [...prev, item]);

    // Clear selection if this item was selected
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    }
  };

  const checkAnswers = () => {
    const newResults: Record<string, boolean> = {};
    let correctCount = 0;

    Object.entries(zoneItems).forEach(([zoneId, zoneItemsList]) => {
      const zone = initialDropZones.find(z => z.id === zoneId);
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
    setSelectedItemId(null);

    setTimeout(() => {
      onComplete(correctCount, initialItems.length);
    }, 2000);
  };

  const resetActivity = () => {
    setItems(initialItems);
    setZoneItems({});
    setSelectedItemId(null);
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
  const selectedItem = selectedItemId ? items.find(item => item.id === selectedItemId) : null;

  return (
    <div className={`max-w-6xl mx-auto p-6 ${className}`}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">{title}</h2>
        {description && (
          <p className="text-gray-300 text-lg">{description}</p>
        )}
        
        {selectedItem && (
          <div className="mt-4 p-4 bg-blue-900/30 border border-blue-500 rounded-lg">
            <p className="text-blue-300">
              <strong>Selected:</strong> {selectedItem.content}
            </p>
            <p className="text-blue-400 text-sm mt-1">
              Click on a drop zone below to place this item
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Unused Items */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white flex items-center space-x-2">
            <span>Items to Sort</span>
            {selectedItem && (
              <span className="text-sm text-blue-400">(Select an item to place)</span>
            )}
          </h3>
          <div className="bg-gray-900 p-6 rounded-lg border-2 border-gray-700 min-h-[300px]">
            <div className="space-y-3">
              {items.map((item) => (
                <SelectableItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItemId === item.id}
                  onSelect={() => handleItemSelect(item.id)}
                />
              ))}
            </div>
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
            {initialDropZones.map((zone) => (
              <DropZoneComponent
                key={zone.id}
                zone={zone}
                items={zoneItems[zone.id] || []}
                selectedItemId={selectedItemId}
                onPlaceItem={handlePlaceItem}
                onRemoveItem={handleRemoveItem}
                isCorrect={isSubmitted ? 
                  zoneItems[zone.id]?.some(item => getItemResult(item.id, zone.id)) 
                  : undefined}
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