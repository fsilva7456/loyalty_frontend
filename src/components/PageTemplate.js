import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PAGES } from '../config/pages';
import { fetchPageContent, sendFeedback } from '../services/api';

const PageTemplate = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  const currentPage = PAGES.find(page => page.id === pageId);

  useEffect(() => {
    if (!currentPage) {
      navigate('/', { replace: true });
      return;
    }
    loadPageContent();
  }, [pageId, currentPage, navigate]);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching content for page:', pageId);
      const data = await fetchPageContent(pageId);
      console.log('Received data:', data);
      
      if (!data) {
        throw new Error('No content found');
      }
      setContent(data);
    } catch (err) {
      setError('Failed to load content. Please try again.');
      console.error('Error loading page content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateClick = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      await sendFeedback(pageId, feedback);
      await loadPageContent();
      setShowFeedbackModal(false);
      setFeedback('');
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error('Error submitting feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!currentPage) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{currentPage.title}</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <div className="prose max-w-none mb-8 whitespace-pre-wrap">
          {/* Debug information */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-gray-100 p-4 mb-4 rounded">
              <p>Debug Info:</p>
              <pre className="text-sm">
                {JSON.stringify({ pageId, content }, null, 2)}
              </pre>
            </div>
          )}
          
          {/* Actual content */}
          <div dangerouslySetInnerHTML={{ __html: content?.content || 'No content available' }} />
        </div>
      )}

      <div className="flex justify-between mt-8">
        {currentPage.previousPage && (
          <button
            onClick={() => navigate(`/${currentPage.previousPage}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Previous
          </button>
        )}
        <button
          onClick={handleRegenerateClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          Regenerate
        </button>
        {currentPage.nextPage && (
          <button
            onClick={() => navigate(`/${currentPage.nextPage}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            disabled={loading}
          >
            Next
          </button>
        )}
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full m-4">
            <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
              disabled={loading}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTemplate;