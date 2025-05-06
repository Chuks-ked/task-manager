import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import axiosInstance from '../api/axiosInstance';
import { useQuery, useMutation } from '@tanstack/react-query'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

const TaskList = ({ onEditTask }) => {
    const [filters, setFilters] = useState({
        status: '',
        priority: '',
        category_id: '',
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
    })

    const { data: tasksData, isLoading: tasksLoading, error: tasksError, refetch: refetchTasks } = useQuery({
        queryKey: ['tasks', filters, pagination.currentPage],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.category_id) params.append('category', filters.category_id);
            params.append('page', pagination.currentPage);
            const response = await axiosInstance.get(`tasks/?${params.toString()}`);
            setPagination({
                currentPage: pagination.currentPage,
                totalCount: response.data.count || 0,
                next: response.data.next,
                previous: response.data.previous,
            });
            return response.data.results || [];
        },
    });

    const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError} =  useQuery({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await axiosInstance.get('categories/')
            return Array.isArray(response.data) ? response.data : response.data.results || [];
        }
    });

    const updateTaskOrderMutation = useMutation({
        mutationFn: async ({ taskId, newOrder }) => {
            await axiosInstance.patch(`tasks/${taskId}/`, { order: newOrder });
        },
        onSuccess: () => refetchTasks(),
    });

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleDeleteTask = (taskId) => {
        setPagination((prev) => ({
            ...prev,
            totalCount: prev.totalCount - 1,
        }));
        if (tasksData.length === 1 && pagination.currentPage > 1) {
            setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
        } 
    };
    
    const handlePageChange = (newPage) => {
        setPagination((prev) => ({ ...prev, currentPage: newPage }));
    };

    const refreshTasks = () => {
        setPagination((prev) => ({ ...prev, currentPage: 1 }));
    };

    const onDragEnd = (result) => {
        if (!result.destination) 
            return;
        const items = Array.from(tasksData);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const updatedTasks = items.map((task, index) => ({
        ...task,
        order: index,
        }));

        setPagination((prev) => ({ ...prev, totalCount: prev.totalCount })); // Trigger re-render
        updatedTasks.forEach((task, index) => {
        updateTaskOrderMutation.mutate({ taskId: task.id, newOrder: index });
        });
    }

    if (tasksLoading || categoriesLoading) {
        return <div className='p-4 text-center text-gray-600'>Loading tasks...</div>
    }

    if (tasksError || categoriesError) {
        return (
        <div className="text-red-500 p-4 text-center">
            {tasksError?.message || categoriesError?.message || 'Failed to fetch data.'}
            <button 
                onClick={refreshTasks} 
                className="ml-2 bg-blue-500 text-white p-1 rounded hover:bg-blue-600 transition"
            >
                Retry
            </button>
        </div>
        );
    }
    const tasks = tasksData || [];
    const categories = categoriesData || [];
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
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="tasks">
                {(provided) => (
                    <div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    >
                    {tasks.length === 0 ? (
                        <p className="text-gray-600 text-center">No tasks available.</p>
                    ) : (
                        tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                            {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <TaskCard
                                task={task}
                                onEdit={() => onEditTask(task)}
                                onDelete={handleDeleteTask}
                                />
                            </div>
                            )}
                        </Draggable>
                        ))
                    )}
                    {provided.placeholder}
                    </div>
                )}
                </Droppable>
            </DragDropContext>
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

