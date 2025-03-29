
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TaskForm from '@/components/task/TaskForm';
import { useTaskContext } from '@/context/TaskContext';
import { Task } from '@/types';

const EditTaskPage = () => {
  const { id } = useParams<{ id: string }>();
  const { tasks } = useTaskContext();
  const [task, setTask] = useState<Task | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      const foundTask = tasks.find(t => t.id === id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        navigate('/not-found');
      }
    }
  }, [id, tasks, navigate]);

  if (!task) {
    return (
      <div className="taskly-container page-transition">
        <div className="text-center py-10">Loading task...</div>
      </div>
    );
  }

  return (
    <div className="taskly-container page-transition">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Edit Task</h1>
        <p className="text-gray-600">Update your task details</p>
      </header>
      
      <TaskForm existingTask={task} />
    </div>
  );
};

export default EditTaskPage;
