import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PAGES } from '../config/pages';
import { fetchPageContent, sendFeedback } from '../services/api';

const PageTemplate = () => {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  
  const currentPage = PAGES.find(page => page.id === pageId);

  useEffect(() => {
    loadPageContent();
  }, [pageId]);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      const data = await fetchPageContent(pageId);
      setContent(data);
    } catch (error) {
      console.error('Error loading page content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerateClick = () => {
    setShowFeedbackModal(true);
  };

  const handleFeedbackSubmit = async () => {
    try {
      setLoading(true);
      await sendFeedback(pageId, feedback);
      await loadPageContent();
      setShowFeedbackModal(false);
      setFeedback('');
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{currentPage.title}</h1>
      
      <div className="prose max-w-none mb-8">
        {content?.content}
      </div>

      <div className="flex justify-between mt-8">
        {currentPage.previousPage && (
          <button
            onClick={() => navigate(`/${currentPage.previousPage}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleRegenerateClick}
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2"
        >
          Regenerate
        </button>
        {currentPage.nextPage && (
          <button
            onClick={() => navigate(`/${currentPage.nextPage}`)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        )}
      </div>

      {showFeedbackModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg max-w-lg w-full">
            <h2 className="text-xl font-bold mb-4">Provide Feedback</h2>
            <textarea
              className="w-full h-32 p-2 border rounded mb-4"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Enter your feedback here..."
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PageTemplate;