import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import TaskList from './components/TaskList';
import Login from './components/Login';
import Signup from './components/Signup';
import TaskForm from './components/TaskForm';

const App = () => {
  const { user, logout } = useContext(AuthContext);
  const [showform, setShowForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

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
  }

  return (
    <Router>
      <nav className="bg-gray-800 text-white p-4">
        <ul className="flex space-x-4">
          <li><Link to="/" className="hover:text-gray-300">Dashboard</Link></li>
          {user ? (
            <>
              <li><span className="text-gray-300">Welcome, {user.username}</span></li>
              <li>
                <button onClick={logout} className="hover:text-gray-300">Logout</button>
              </li>
              <li>
                <button onClick={handleAddTask} className='hover:text-gray-300'>Add Task</button>
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
          <Route 
            path='/' 
            element={<TaskList onEditTask={handleEditTask} />}  />
          <Route path="/" element={<TaskList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
        {showform && (
          <TaskForm task={selectedTask} onClose={handleCloseForm} />
        )}
      </div>
    </Router>
  );
};

export default App;