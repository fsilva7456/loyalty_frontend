import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const fetchPageContent = async (pageId) => {
  const { data, error } = await supabase
    .from('page_content')
    .select('*')
    .eq('page_id', pageId)
    .single();

  if (error) throw error;
  return data;
};

export const sendFeedback = async (pageId, feedback) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/regenerate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ pageId, feedback }),
  });

  if (!response.ok) {
    throw new Error('Failed to send feedback');
  }

  return response.json();
};