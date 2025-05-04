import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import TaskList from './components/TaskList';

const App = () => {
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
          <li><Link to="/signup" className="hover:text-gray-300">Signup</Link></li>
        </ul>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/login" element={<div>Login Page (Placeholder)</div>} />
          <Route path="/signup" element={<div>Signup Page (Placeholder)</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;