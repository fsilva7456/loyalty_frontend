// Base API URL from environment variable
const API_URL = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  console.warn('API URL not configured');
}

export const fetchPageContent = async (pageId, projectName, companyName) => {
  console.log('Fetching content for:', { pageId, projectName, companyName });
  
  try {
    const response = await fetch(`${API_URL}/content/${pageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectName,
        companyName
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API response:', data);

    if (!data) {
      throw new Error('No content found');
    }

    return data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};

export const sendFeedback = async (pageId, projectName, companyName, feedback) => {
  try {
    const response = await fetch(`${API_URL}/regenerate/${pageId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        projectName, 
        companyName, 
        feedback 
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending feedback:', error);
    throw error;
  }
};