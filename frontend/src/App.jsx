import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  const { user, logout } = useContext(AuthContext);
  
  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
          {user ? (
            <>
              <li><span className='text-gray-300'>Welcome, {user.username}</span></li>
              <li>
                <button onClick={logout} className='hover:text-gray-300'>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="hover:text-gray-300">Login</Link></li>
              <li><Link to="/signup" className="hover:text-gray-300">Signup</Link></li>
            </>
          )
          }

        </ul>
      </nav>
      <div className="p-4">
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/" element={<Login />} />
          <Route path="/" element={<Signup />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;