import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageTemplate from './components/PageTemplate';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Navigate to="/current-state" replace />} />
          <Route path="/:pageId" element={<PageTemplate />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;