import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import axiosInstance from '../api/axiosInstance';

const TaskList = ({onEditTask}) => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axiosInstance.get('tasks/');
                setTasks(response.data);
            }
            catch (err) {
                setError('Failed to fetch tasks. Please log in or try again later.');
                console.error(err);
            }
            };

        fetchTasks();
    }, []);

    if (error) {
        return <div className="text-red-500 p-4">{error}</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={() => onEditTask(task)} />
                ))
            )}
        </div>
    );
};

export default TaskList;