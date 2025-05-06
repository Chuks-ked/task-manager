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

    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalCount: 0,
        next: null,
        previous: null,
    })

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

    const fetchTasks = async (page = 1) => {
        try {
            setLoading(true)
            console.log('Fetching tasks with filters:', filters, 'page', page);
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.category_id) params.append('category', filters.category_id);
            params.append('page', page);

            const response = await axiosInstance.get(`tasks/?${params.toString()}`);
            console.log('Tasks received:', response.data);
            setTasks(response.data.results || []);
            setPagination({
                currentPage: page,
                totalCount: response.data.count || 0,
                next: response.data.next,
                previous: response.data.previous,
            })
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
        fetchTasks(1);
    }, [filters]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteTask = (taskId) => {
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
        setPagination((prev) => ({
            ...prev,
            totalCount: prev.totalCount - 1,
        }));
        if (tasks.length === 1 && pagination.currentPage > 1) {
            fetchTasks(pagination.currentPage - 1);
        } 
        else {
            fetchTasks(pagination.currentPage); //refresh current page after deletion
        }
    };

    const handlePageChange = (newPage) => {
        fetchTasks(newPage);
    };

    const refreshTasks = () => {
        fetchTasks(pagination.currentPage);
    };

    console.log('Rendering TaskList with tasks:', tasks, 'error:', error);

    if (loading) {
        return <div className='p-4 text-center text-gray-600'>Loading tasks...</div>
    }

    if (error) {
        return (
        <div className="text-red-500 p-4 text-center">
            {error}
            <button 
                onClick={refreshTasks} 
                className="ml-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
            >
                Retry
            </button>
        </div>
        );
    }

    const totalPages = Math.ceil(pagination.totalCount / 5); // Assuming PAGE_SIZE=5 from backend

    return (
        <div className="p-6">
            <div className="mb-6 flex space-x-4">
                <div className='flex-1' >
                    <label className='block text-sm font-medium text-gray-700 mb-1'>Status</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Statuses</option>
                        <option value="TODO">TODO</option>
                        <option value="IN_PROGRESS">IN PROGRESS</option>
                        <option value="DONE">DONE</option>
                    </select>
                </div>
                <div className='flex-1' >
                <label className='block text-sm font-medium text-gray-700 mb-1'>Priority</label>
                    <select
                        name="priority"
                        value={filters.priority}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Priorities</option>
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                    </select>
                </div>
                <div className='flex-1' >
                <label className='block text-sm font-medium text-gray-700 mb-1'>Category</label>
                    <select
                        name="category_id"
                        value={filters.category_id}
                        onChange={handleFilterChange}
                        className="w-full p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">All Categories</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                            {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            {totalPages > 1 && (
                <div className="mt-6 flex justify-center items-center space-x-4">
                    <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.previous}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
                    >
                        Previous
                    </button>
                    <span className="text-gray-700">
                        Page {pagination.currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.next}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskList;

