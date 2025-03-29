
import React from 'react';
import TaskForm from '@/components/task/TaskForm';

const AddTaskPage = () => {
  return (
    <div className="taskly-container page-transition">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Add New Task</h1>
        <p className="text-gray-600">Create a new task for your schedule</p>
      </header>
      
      <TaskForm />
    </div>
  );
};

export default AddTaskPage;
