import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProjectSelector from './components/ProjectSelector';
import PageTemplate from './components/PageTemplate';

function App() {
  console.log('App component rendered');
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<ProjectSelector />} />
          <Route path="/:pageId" element={<PageTemplate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;