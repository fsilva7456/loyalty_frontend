import { createClient } from '@supabase/supabase-js';

// Vercel deployment will use these environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseKey 
  });
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchPageContent = async (pageId) => {
  try {
    console.log('Fetching content for pageId:', pageId);
    console.log('Supabase connection:', { 
      hasUrl: !!supabaseUrl, 
      hasKey: !!supabaseKey 
    });

    const { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('page_id', pageId)
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Received data from Supabase:', data);
    return data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

export const sendFeedback = async (pageId, feedback) => {
  const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    console.error('Missing API URL environment variable');
    return;
  }

  try {
    const response = await fetch(`${apiUrl}/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pageId, feedback }),
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