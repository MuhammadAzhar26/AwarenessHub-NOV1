import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { X, Star, Camera, Send, CheckCircle } from 'lucide-react';

interface FeedbackSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage: string;
}

interface RatingCategory {
  id: string;
  label: string;
  rating: number;
}

export default function FeedbackSurvey({ isOpen, onClose, currentPage }: FeedbackSurveyProps) {
  const [ratings, setRatings] = useState<RatingCategory[]>([
    { id: 'usability', label: 'Ease of Use', rating: 0 },
    { id: 'design', label: 'Design & Layout', rating: 0 },
    { id: 'content', label: 'Content Quality', rating: 0 },
    { id: 'engagement', label: 'Engagement Level', rating: 0 },
    { id: 'learning', label: 'Learning Experience', rating: 0 },
  ]);
  
  const [feedback, setFeedback] = useState('');
  const [email, setEmail] = useState('');
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const wordCount = feedback.trim().split(/\s+/).filter(word => word.length > 0).length;
  const maxWords = 100;

  const handleRating = (categoryId: string, rating: number) => {
    setRatings(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, rating } : cat
      )
    );
  };

  const captureScreenshot = async () => {
    setIsCapturing(true);
    setError('');
    
    try {
      // Hide the survey modal temporarily
      const surveyModal = document.getElementById('feedback-survey-modal');
      if (surveyModal) {
        surveyModal.style.display = 'none';
      }

      // Wait a bit for the modal to disappear
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture the entire page
      const canvas = await html2canvas(document.body, {
        allowTaint: true,
        useCORS: true,
        scrollY: -window.scrollY,
        scrollX: -window.scrollX,
        windowHeight: document.documentElement.scrollHeight,
        windowWidth: document.documentElement.scrollWidth,
      });

      const screenshotData = canvas.toDataURL('image/png');
      setScreenshot(screenshotData);

      // Show the modal again
      if (surveyModal) {
        surveyModal.style.display = 'flex';
      }
    } catch (err) {
      console.error('Screenshot capture failed:', err);
      setError('Failed to capture screenshot. Please try again.');
      const surveyModal = document.getElementById('feedback-survey-modal');
      if (surveyModal) {
        surveyModal.style.display = 'flex';
      }
    } finally {
      setIsCapturing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (wordCount > maxWords) {
      setError(`Feedback exceeds ${maxWords} words limit.`);
      return;
    }

    const averageRating = ratings.reduce((sum, cat) => sum + cat.rating, 0) / ratings.length;
    if (averageRating === 0) {
      setError('Please provide at least one rating.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const surveyData = {
        timestamp: new Date().toISOString(),
        page: currentPage,
        ratings: ratings.reduce((acc, cat) => {
          acc[cat.id] = { label: cat.label, rating: cat.rating };
          return acc;
        }, {} as Record<string, { label: string; rating: number }>),
        feedback: feedback.trim(),
        email: email.trim() || 'anonymous',
        screenshot: screenshot,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
      };

      // Save survey data to localStorage
      const surveyId = `survey_${Date.now()}`;
      localStorage.setItem(surveyId, JSON.stringify(surveyData));
      
      // Also keep a list of all survey IDs
      const surveyIds = JSON.parse(localStorage.getItem('survey_ids') || '[]');
      surveyIds.push(surveyId);
      localStorage.setItem('survey_ids', JSON.stringify(surveyIds));
      
      console.log('Survey saved locally:', surveyId);
      console.log('Survey data:', { 
        page: surveyData.page, 
        ratings: surveyData.ratings,
        hasScreenshot: !!screenshot,
        timestamp: surveyData.timestamp 
      });

      setSubmitted(true);
      setTimeout(() => {
        onClose();
        // Reset form
        setTimeout(() => {
          setRatings(ratings.map(cat => ({ ...cat, rating: 0 })));
          setFeedback('');
          setEmail('');
          setScreenshot(null);
          setSubmitted(false);
        }, 500);
      }, 2000);
    } catch (err) {
      console.error('Survey submission error:', err);
      setError('Failed to submit survey. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (submitted) {
    return (
      <div
        id="feedback-survey-modal"
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9998] p-4"
      >
        <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-gray-600 mb-4">Your feedback has been submitted successfully.</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600">Questions or concerns?</p>
            <p className="text-lg font-semibold text-blue-600">survey@awarenesshub.app</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="feedback-survey-modal"
      className="fixed inset-0 bg-black bg-opacity-50 flex items-start sm:items-center justify-center z-[9998] p-2 sm:p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-lg max-w-2xl w-full my-2 sm:my-8 shadow-xl max-h-[98vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 rounded-t-lg sticky top-0 z-10">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Help Us Improve</h2>
              <p className="text-blue-100 text-sm sm:text-base">We value your feedback on {currentPage}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1 transition"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Rating Categories */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="font-semibold text-base sm:text-lg">Rate Your Experience</h3>
            {ratings.map((category) => (
              <div key={category.id} className="space-y-1 sm:space-y-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700">
                  {category.label}
                </label>
                <div className="flex gap-1 sm:gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(category.id, star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={`sm:w-8 sm:h-8 ${
                          star <= category.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                  {category.rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600 self-center">
                      {category.rating} / 5
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Feedback Text */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Additional Feedback (Max {maxWords} words)
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              placeholder="Share your thoughts, suggestions, or report issues..."
            />
            <div className="flex justify-between mt-1 text-xs">
              <span className={wordCount > maxWords ? 'text-red-500' : 'text-gray-500'}>
                {wordCount} / {maxWords} words
              </span>
              {wordCount > maxWords && (
                <span className="text-red-500">Exceeds limit!</span>
              )}
            </div>
          </div>

          {/* Email (Optional) */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email (Optional - for follow-up)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="your.email@example.com"
            />
          </div>

          {/* Screenshot Capture */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Screenshot (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-start">
              <button
                type="button"
                onClick={captureScreenshot}
                disabled={isCapturing}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 disabled:cursor-not-allowed rounded-lg transition"
              >
                <Camera size={20} />
                {isCapturing ? 'Capturing...' : screenshot ? 'Recapture' : 'Capture Page'}
              </button>
              {screenshot && (
                <div className="flex-1">
                  <img
                    src={screenshot}
                    alt="Page screenshot"
                    className="border border-gray-300 rounded max-h-32 object-contain"
                  />
                  <button
                    type="button"
                    onClick={() => setScreenshot(null)}
                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                  >
                    Remove screenshot
                  </button>
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Captures the current page to help us understand your feedback better
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || wordCount > maxWords}
              className="flex-1 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} className="sm:w-5 sm:h-5" />
                  Submit Feedback
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
