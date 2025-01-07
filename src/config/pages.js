export const PAGES = [
  {
    id: 'current-state',
    title: 'Current State Analysis',
    nextPage: 'competitive-analysis',
    previousPage: null
  },
  {
    id: 'competitive-analysis',
    title: 'Competitive Analysis',
    nextPage: 'goals-objectives',
    previousPage: 'current-state'
  },
  {
    id: 'goals-objectives',
    title: 'Goals and Objectives',
    nextPage: 'customer-segments',
    previousPage: 'competitive-analysis'
  },
  {
    id: 'customer-segments',
    title: 'Customer Segments',
    nextPage: 'program-structure',
    previousPage: 'goals-objectives'
  },
  {
    id: 'program-structure',
    title: 'Program Structure',
    nextPage: 'rewards-benefits',
    previousPage: 'customer-segments'
  },
  {
    id: 'rewards-benefits',
    title: 'Rewards and Benefits',
    nextPage: 'financial-analysis',
    previousPage: 'program-structure'
  },
  {
    id: 'financial-analysis',
    title: 'Financial Analysis',
    nextPage: null,
    previousPage: 'rewards-benefits'
  }
];