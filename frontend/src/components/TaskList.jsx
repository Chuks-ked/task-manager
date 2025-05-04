import React, { useEffect, useState } from 'react';
import TaskCard from './TaskCard';
import axiosInstance from '../api/axiosinstance';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axiosInstance.get('tasks/');
                setTasks(response.data);
            }
            catch (err) {
                setError('Failed to fetch tasks. Please log in or try again later.')
                console.error(err)
            }
        }
        fetchTasks()
    }, []);

    if (error) {
        return <div className='text-red-500'>{error}</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                tasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                ))
            )}
        </div>
    );
};

export default TaskList;