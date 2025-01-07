import { createClient } from '@supabase/supabase-js';

// For debugging environment variables
console.log('All environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  // Log all environment variables that start with REACT_APP or NEXT_PUBLIC
  ...Object.fromEntries(
    Object.entries(process.env).filter(([key]) =>
      key.startsWith('REACT_APP_') || key.startsWith('NEXT_PUBLIC_')
    )
  )
});

// Try both REACT_APP and NEXT_PUBLIC prefixes
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY || process.env.NEXT_PUBLIC_SUPABASE_KEY;

console.log('Supabase Config:', {
  hasUrl: Boolean(supabaseUrl),
  hasKey: Boolean(supabaseKey),
  urlPrefix: supabaseUrl?.substring(0, 10),
  keyPrefix: supabaseKey?.substring(0, 10)
});

let supabase = null;

try {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables. Please check your configuration.');
  }
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('Supabase client created successfully');
} catch (error) {
  console.error('Error creating Supabase client:', error);
}

export const fetchPageContent = async (pageId, projectName, companyName) => {
  console.log('Fetching content for:', { pageId, projectName, companyName });
  
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized. Please check your environment variables.');
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

export const sendFeedback = async (pageId, projectName, companyName, feedback) => {
  const apiUrl = process.env.REACT_APP_API_URL || process.env.NEXT_PUBLIC_API_URL;
  
  try {
    if (!apiUrl) {
      throw new Error('Missing API URL environment variable');
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