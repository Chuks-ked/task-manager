import React from 'react';

const TaskCard = ({ task, onEdit }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="text-gray-600">{task.description}</p>
        <p className="text-sm">Status: {task.status}</p>
        <p className="text-sm">Priority: {task.priority}</p>
        <p className="text-sm">Category: {task.category.name}</p>
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