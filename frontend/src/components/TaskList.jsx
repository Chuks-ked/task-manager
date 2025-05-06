import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import axiosInstance from '../api/axiosInstance';

const TaskList = ({ onEditTask }) => {
    const [tasks, setTasks] = useState([]);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category_id: '',
    });

    useEffect (() => {
        const fetchCategories = async () => {
            try {
                setLoading(true)
                const response = await axiosInstance.get('categories/')
                setCategories(response.data)
            }
            catch (err) {
                console.error('Error fetching categories:', err)
            }
            finally {
                setLoading(false);
            }
        }
        fetchCategories();
    }, []);

    const fetchTasks = async (filters) => {
        try {
            setLoading(true)
            console.log('Fetching tasks with filters:', filters);
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.category_id) params.append('category', filters.category_id);

            const response = await axiosInstance.get(`tasks/?${params.toString()}`);
            console.log('Tasks received:', response.data);
            setTasks(response.data);
        } 
        catch (err) {
            console.error('Error fetching tasks:', err);
            setError('Failed to fetch tasks. Please log in or try again later.');
        }
        finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        console.log('useEffect triggered with filters:', filters);
        fetchTasks(filters);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    };

    const refreshTasks = () => {
        fetchTasks(filters);
    };

    console.log('Rendering TaskList with tasks:', tasks, 'error:', error);

    if (loading) {
        return <div className='p-4 text-center'>Loading tasks...</div>
    }

    if (error) {
        return (
        <div className="text-red-500 p-4">
            {error}
            <button onClick={refreshTasks} className="ml-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-600">
            Retry
            </button>
        </div>
        );
    }

    return (
        <div className="p-4">
            <div className="mb-4 space-y-2">
                <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Statuses</option>
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                </select>
                <select
                    name="priority"
                    value={filters.priority}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Priorities</option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                </select>
                <select
                    name="category_id"
                    value={filters.category_id}
                    onChange={handleFilterChange}
                    className="p-2 border rounded"
                >
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                        {category.name}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {tasks.length === 0 ? (
                <p>No tasks available.</p>
                ) : (
                tasks.map((task) => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onEdit={() => onEditTask(task)} 
                        onDelete={handleDeleteTask}
                    />
                ))
                )}
            </div>
        </div>
    );
};

export default TaskList;

