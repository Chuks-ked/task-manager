import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const TaskCard = ({ task, onEdit, onDelete }) => {
    const [status, setStatus] = useState(task.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus);
        setIsUpdating(true)
        try {
            await axiosInstance.patch(`tasks/${task.id}/`, { status: newStatus });
            // window.location.reload(); // Refresh to update the task list
        } 
        catch (err) {
            console.error('Failed to update status:', err);
            setStatus(task.status); // Revert on failure
            alert('Failed to update status. Please try again.');
        }
        finally {
            setIsUpdating(false);
        }
    };

    const handleDelete = async (e) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            setIsDeleting(true);
            try {
                await axiosInstance.delete(`tasks/${task.id}/`);
                onDelete(task.id); //Notify parent to remove task from list
            }
            catch (err) {
                console.error('Failed to delete task:', err);
                alert('Failed to delete task. Please try again.');
            }
            finally {
                setIsDeleting(false);
            }
        }
    }

    // Priority color mapping
    const priorityColors = {
        LOW: 'bg-green-100 text-green-800',
        MEDIUM: 'bg-yellow-100 text-yellow-800',
        HIGH: 'bg-red-100 text-red-800',
    };

    // Status color mapping
    const statusColors = {
        TODO: 'bg-gray-100 text-gray-800',
        IN_PROGRESS: 'bg-blue-100 text-blue-800',
        DONE: 'bg-green-100 text-green-800',
    };

    return (
        <div className="border rounded-lg p-4 shadow-lg bg-white hover:shadow-xl transition-shadow">
            <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
            <p className="text-gray-600 mt-1">{task.description || "No description" }</p>
            <div className="mt-2 flex items-center space-x-2">
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${priorityColors[task.priority]}`}>
                    {task.priority}
                </span>
                <span className="text-sm text-gray-500">Category: {task.category ? task.category.name : 'None'}</span>
            </div>
            <div className="mt-3 flex items-center space-x-2">
                <label className="text-md font-medium text-gray-700">Status:</label>

                <select
                    value={status}
                    onChange={handleStatusChange}
                    className={`p-1 border rounded-lg ${statusColors[status]} focus:ring-2 focus:ring-blue-500`}
                    disabled={isUpdating}
                >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                </select>
                {isUpdating && <span className='text-sm text-blue-500'>Updating...</span> }
            </div>
            <div className='mt-4 flex space-x-3'>
                <button
                    onClick={onEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400"
                    disabled={isUpdating || isDeleting}
                >
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition disabled:bg-red-400'
                    disabled={isUpdating || isDeleting}
                >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
            </div>
        </div>
    );
};

export default TaskCard;
