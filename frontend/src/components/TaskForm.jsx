import React, { useState, useContext } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TaskForm = ({ task: initialTask, onClose, onTaskSaved }) => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [task, setTask] = useState(initialTask || {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'LOW',
        category_id: null,
    });
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTask((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true)
        try {
            if (initialTask) {
                await axiosInstance.patch(`tasks/${initialTask.id}/`, task);
            } 
            else {
                await axiosInstance.post('tasks/', { ...task, user: user?.id });
            }
            setError(null);
            onTaskSaved();
            onClose();
            navigate('/');
            // window.location.reload(); // Refresh to update the task list
        } 
        catch (err) {
            setError('Failed to save task. Please check your input or try again.');
            console.error(err);
        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">{initialTask ? 'Edit Task' : 'Add Task'}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block mb-1">Title</label>
            <input
                type="text"
                name="title"
                value={task.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                disabled={isSubmitting}
            />
            </div>
            <div>
            <label className="block mb-1">Description</label>
            <textarea
                name="description"
                value={task.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={isSubmitting}
            />
            </div>
            <div>
            <label className="block mb-1">Status</label>
            <select
                name="status"
                value={task.status}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={isSubmitting}
            >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
            </select>
            </div>
            <div>
            <label className="block mb-1">Priority</label>
            <select
                name="priority"
                value={task.priority}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={isSubmitting}
            >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
            </select>
            </div>
            <div>
            <label className="block mb-1">Category ID (optional)</label>
            <input
                type="number"
                name="category_id"
                value={task.category_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                disabled={isSubmitting}
            />
            </div>
            <button 
                type="submit" 
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Saving...' : initialTask ? 'Update Task' : 'Add Task'}
            </button>
            <button 
                type="button" 
                onClick={onClose} 
                className="w-full bg-gray-500 text-white p-2 rounded mt-2 hover:bg-gray-600 disabled:bg-gray-300"
            >
                Cancel
            </button>
        </form>
        </div>
    );
};

export default TaskForm;

