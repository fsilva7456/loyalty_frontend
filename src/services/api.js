import { createClient } from '@supabase/supabase-js';

// Access environment variables with REACT_APP prefix
const SUPABASE_URL = window.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_KEY = window.REACT_APP_SUPABASE_KEY || process.env.REACT_APP_SUPABASE_KEY;

console.log('Environment Check:', {
  windowUrl: window.REACT_APP_SUPABASE_URL,
  windowKey: window.REACT_APP_SUPABASE_KEY,
  envUrl: process.env.REACT_APP_SUPABASE_URL,
  envKey: process.env.REACT_APP_SUPABASE_KEY
});

let supabase = null;

try {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
}

export const fetchPageContent = async (pageId, projectName, companyName) => {
  console.log('Fetching content for:', { pageId, projectName, companyName });
  
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
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

    console.log('Querying table:', table);

    const { data, error } = await supabase
      .from(table)
      .select('*')
      .eq('project_name', projectName)
      .eq('company_name', companyName);

    console.log('Query result:', { data, error });

    if (error) throw error;
    if (!data || data.length === 0) throw new Error('No content found');
    
    return data[0];
  } catch (error) {
    console.error('Error fetching page content:', error);
    throw error;
  }
};