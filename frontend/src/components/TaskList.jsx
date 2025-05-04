import React from 'react';
import TaskCard from './TaskCard';

const TaskList = () => {
    const tasks = [
        {
        id: 1,
        title: 'Finish report',
        description: 'Complete the quarterly report',
        status: 'TODO',
        priority: 'HIGH',
        category: { name: 'Work' },
        },
        {
        id: 2,
        title: 'Plan meeting',
        description: 'Schedule team meeting',
        status: 'DONE',
        priority: 'LOW',
        category: { name: 'Work' },
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
        ))}
        </div>
    );
};

export default TaskList;