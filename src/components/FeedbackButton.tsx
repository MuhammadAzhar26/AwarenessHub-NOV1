import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import FeedbackSurvey from './FeedbackSurvey';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    // Detect current page
    const path = window.location.pathname;
    const pageName = path === '/' 
      ? 'Home' 
      : path.split('/').filter(Boolean).map(p => 
          p.charAt(0).toUpperCase() + p.slice(1)
        ).join(' / ');
    setCurrentPage(pageName || 'Unknown Page');
  }, []);

  return (
    <>
      {/* Floating Feedback Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all hover:scale-110 z-40 group"
        aria-label="Open feedback survey"
      >
        <MessageSquare size={24} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          Share Feedback
        </span>
      </button>

      {/* Survey Modal */}
      <FeedbackSurvey 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        currentPage={currentPage}
      />
    </>
  );
}
