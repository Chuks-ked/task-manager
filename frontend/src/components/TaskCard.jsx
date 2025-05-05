import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const TaskCard = ({ task, onEdit }) => {
    const [status, setStatus] = useState(task.status)

    const handleStatusChange = async (e) => {
        const newStatus = e.targer.value;
        setStatus(newStatus);
        try{
            await axiosInstance.patch(`tasks/${task.id}/`, {status: newStatus})
        }
        catch (err) {
            console.error('Failed to update status:', err);
            setStatus(task.status)
        }
    }


    return (
        <div className="border rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="text-gray-600">{task.description}</p>
        <p className="text-sm">Priority: {task.priority}</p>
        <p className="text-sm">Category: {task.category.name}</p>
        <div className="mt-2">
            <label className="mr-2">Status:</label>
            <select
                value={status}
                onChange={handleStatusChange}
                className="p-1 border rounded"
            >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
            </select>
        </div>
        <button
            onClick={onEdit}
            className='mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600'
        >
            Edit
        </button>
        </div>
    );
};

export default TaskCard;