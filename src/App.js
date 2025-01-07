import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<div>Welcome to Loyalty Frontend</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;