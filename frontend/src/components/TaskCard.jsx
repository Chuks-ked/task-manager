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

    return (
        <div className="border rounded-lg p-4 shadow-md">
            <h3 className="text-lg font-bold">{task.title}</h3>
            <p className="text-gray-600">{task.description}</p>
            <p className="text-sm">Priority: {task.priority}</p>
            <p className="text-sm">Category: {task.category ? task.category.name : 'None'}</p>
            <div className="mt-2">
                <label className="mr-2">Status:</label>
                <select
                    value={status}
                    onChange={handleStatusChange}
                    className="p-1 border rounded"
                    disabled={isUpdating}
                >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="DONE">DONE</option>
                </select>
                {isUpdating && <span className='ml-2 text-blue-500'>Updating...</span> }
            </div>
            <button
                onClick={onEdit}
                className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={isUpdating || isDeleting}
            >
                Edit
            </button>
            <button
                onClick={handleDelete}
                className='bg-red-500 text-white p-2 rounded hover:bg-red-600'
                disabled={isUpdating || isDeleting}
            >
                {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
        </div>
    );
};

export default TaskCard;
