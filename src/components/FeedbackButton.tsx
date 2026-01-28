import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import FeedbackSurvey from './FeedbackSurvey';

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    console.log('FeedbackButton mounted');
    // Detect current page
    const path = window.location.pathname;
    const pageName = path === '/' 
      ? 'Home' 
      : path.split('/').filter(Boolean).map(p => 
          p.charAt(0).toUpperCase() + p.slice(1)
        ).join(' / ');
    setCurrentPage(pageName || 'Unknown Page');
    console.log('FeedbackButton - Current page:', pageName);
  }, []);

  return (
    <>
      {/* Floating Feedback Button - Responsive */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          bottom: '16px',
          right: '16px',
          zIndex: 9999,
          borderRadius: '50%',
          background: 'linear-gradient(to right, #2563eb, #9333ea)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 hover:scale-110 transition-transform group"
        aria-label="Open feedback survey"
      >
        <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7" />
        <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
