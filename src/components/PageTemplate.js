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

  const projectName = localStorage.getItem('currentProject');
  const companyName = localStorage.getItem('currentCompany');

  console.log('PageTemplate rendered:', { pageId, projectName, companyName });
  
  const currentPage = PAGES.find(page => page.id === pageId);

  useEffect(() => {
    if (!projectName || !companyName) {
      console.log('No project or company found, redirecting to home');
      navigate('/');
      return;
    }

    if (!currentPage) {
      console.log('Invalid page ID, redirecting to home');
      navigate('/');
      return;
    }
    
    loadPageContent();
  }, [pageId, currentPage, navigate, projectName, companyName]);

  const loadPageContent = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Loading content for:', { pageId, projectName, companyName });
      
      const data = await fetchPageContent(pageId, projectName, companyName);
      console.log('Content loaded:', data);
      
      if (!data) {
        throw new Error('No content found');
      }
      setContent(data);
    } catch (err) {
      console.error('Error loading page content:', err);
      setError(err.message || 'Failed to load content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Rest of the component remains the same...

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">{currentPage?.title}</h1>
          <div className="text-sm text-gray-600">
            Project: {projectName} | Company: {companyName}
          </div>
        </div>
        <button
          onClick={() => {
            localStorage.removeItem('currentProject');
            localStorage.removeItem('currentCompany');
            navigate('/');
          }}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Start New Project
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : content ? (
        <div className="prose max-w-none mb-8">
          {Object.entries(content).map(([key, value]) => {
            if (['id', 'created_at', 'updated_at', 'project_name', 'company_name'].includes(key)) {
              return null;
            }
            
            return (
              <div key={key} className="mb-6">
                <h3 className="text-lg font-semibold capitalize">
                  {key.replace(/_/g, ' ')}
                </h3>
                <div className="mt-2">
                  {Array.isArray(value) 
                    ? value.map((item, i) => (
                        <div key={i} className="mb-1">• {item}</div>
                      ))
                    : typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : value}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          No content available for this section. Please regenerate content.
        </div>
      )}

      <div className="flex justify-between mt-8">
        {currentPage?.previousPage && (
          <button
            onClick={() => navigate(`/${currentPage.previousPage}`)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            disabled={loading}
          >
            Previous
          </button>
        )}
        <button
          onClick={() => setShowFeedbackModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded mx-2 hover:bg-blue-600 transition-colors"
          disabled={loading}
        >
          {content ? 'Regenerate' : 'Generate Content'}
        </button>
        {currentPage?.nextPage && (
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
                onClick={async () => {
                  try {
                    setLoading(true);
                    await sendFeedback(pageId, projectName, companyName, feedback);
                    await loadPageContent();
                    setShowFeedbackModal(false);
                    setFeedback('');
                  } catch (err) {
                    setError('Failed to submit feedback. Please try again.');
                  } finally {
                    setLoading(false);
                  }
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                disabled={loading || !feedback.trim()}
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