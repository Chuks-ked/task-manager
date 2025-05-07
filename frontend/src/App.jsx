import React, { useState, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Signup from './components/Signup';
import TaskForm from './components/TaskForm';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'

const queryclient = new QueryClient();

const App = () => {
  const { user, logout, error } = useContext(AuthContext);
  const [showForm, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0)

  const handleAddTask = () => {
    setSelectedTask(null);
    setShowForm(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  const handleTaskSaved = () => {
    setRefreshKey((prev) => prev + 1)
  };

  const handleLogout = () => {
    logout();
    // No need to redirect here since Navigate will handle it
  };

  console.log('Rendering App with user:', user, 'error:', error);

  return (
    <QueryClientProvider client={queryclient}>
      <Router>
        <nav className="bg-gray-800 text-white p-4 shadow-lg">
          <div className='container mx-auto flex justify-between items-center'>
              <Link to="/" className="text-2xl font-bold hover:text-gray-300">
                Task Manager
              </Link>
            <ul className="flex space-x-4 items-center gap-4">
              {user ? (
                <>
                  <li><span className="text-gray-300">Welcome, {user.username || 'User'}</span></li>
                  <li>
                    <button onClick={handleLogout} className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition">
                      Logout
                    </button>
                  </li>
                  <li>
                    <button onClick={handleAddTask} className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition">
                      Add Task
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-gray-300 px-4 py-2">Login</Link></li>
                  <li><Link to="/signup" className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition">Signup</Link></li>
                </>
              )}
            </ul>
          </div>
        </nav>
        <div className="container mx-auto p-4">
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <Routes>
            <Route
              path="/"
              element={user ? <TaskList key={refreshKey} onEditTask={handleEditTask} /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
            <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
          </Routes>
          {showForm && user && (
            <TaskForm 
              task={selectedTask} 
              onClose={handleCloseForm} 
              onTaskSaved={handleTaskSaved}
            />
          )}
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
