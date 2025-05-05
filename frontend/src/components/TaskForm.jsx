import React, { useContext, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance';

const TaskForm = ({task:initialTask, onClose}) => {
    const {user} = useContext(AuthContext);
    const navigate = useNavigate();
    const [task, setTask] = useState(initialTask || {
        title: '',
        description: '',
        status: 'TODO',
        priority: 'Low',
        category_id: null,
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const {name, value} = e.target;
        setTask((prev) => ({...prev, [name]: value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (initialTask) {
                // update existing task
                await axiosInstance.patch('tasks/${initialTask.id}/', task)
            } else {
                // create new task
                await axiosInstance.post('tasks/', {...task, user: user?.id});
            }
            setError(null);
            onClose(); //close the form or refresh the list
            navigate('/');
        }
        catch (err) {
            setError('Failed to save task. Please check your input or try again');
            console.error(err);
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
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Description</label>
                        <textarea
                            name="description"
                            value={task.description}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block mb-1">Status</label>
                        <select
                            name="status"
                            value={task.status}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
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
                        />
                    </div>
                    <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
                        {initialTask ? 'Update Task' : 'Add Task'}
                    </button>
                    <button type="button" onClick={onClose} className="w-full bg-gray-500 text-white p-2 rounded mt-2 hover:bg-gray-600">
                        Cancel
                    </button>
                </form>
        </div>
    );
}

export default TaskForm