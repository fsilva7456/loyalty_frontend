import { createClient } from '@supabase/supabase-js';

// Vercel deployment will use these environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
  supabase = createClient(supabaseUrl, supabaseKey);
}

export const fetchPageContent = async (pageId, projectName, companyName) => {
  try {
    // If Supabase isn't initialized, return mock data for development
    if (!supabase) {
      console.warn('Supabase not initialized - missing environment variables');
      return null;
    }

    let table;
    switch (pageId) {
      case 'current-state':
        table = 'current_state_analysis';
        break;
      case 'competitive-analysis':
        table = 'competitive_analysis';
        break;
      case 'goals-objectives':
        table = 'goals_objectives';
        break;
      case 'customer-segments':
        table = 'customer_segments';
        break;
      case 'program-structure':
        table = 'program_structure';
        break;
      case 'rewards-benefits':
        table = 'rewards_benefits';
        break;
      case 'financial-analysis':
        table = 'financial_analysis';
        break;
      default:
        throw new Error('Invalid page ID');
    }

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('project_name', projectName)
      .eq('company_name', companyName)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return null;
  }
};

export const sendFeedback = async (pageId, projectName, companyName, feedback) => {
  const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
  
  try {
    if (!apiUrl) {
      console.warn('Missing API URL environment variable');
      return;
    }

    const response = await fetch(`${apiUrl}/regenerate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        pageId, 
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
