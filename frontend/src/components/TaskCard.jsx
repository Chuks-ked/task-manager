import React from 'react';

const TaskCard = ({ task }) => {
    return (
        <div className="border rounded-lg p-4 shadow-md">
        <h3 className="text-lg font-bold">{task.title}</h3>
        <p className="text-gray-600">{task.description}</p>
        <p className="text-sm">Status: {task.status}</p>
        <p className="text-sm">Priority: {task.priority}</p>
        <p className="text-sm">Category: {task.category.name}</p>
        </div>
    );
};

export default TaskCard;