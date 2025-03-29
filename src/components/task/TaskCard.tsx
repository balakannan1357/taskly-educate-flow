
import React from 'react';
import { Task } from '@/types';
import { Check, Clock, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTaskContext } from '@/context/TaskContext';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskCompletion, deleteTask } = useTaskContext();
  const navigate = useNavigate();
  
  const handleEdit = () => {
    navigate(`/edit-task/${task.id}`);
  };

  const getPriorityClass = () => {
    switch (task.priority) {
      case 'High':
        return 'bg-priority-high';
      case 'Medium':
        return 'bg-priority-medium';
      case 'Low':
        return 'bg-priority-low';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`task-card ${task.completed ? 'opacity-70' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => toggleTaskCompletion(task.id)}
            className="w-5 h-5"
          />
          <h3 className={`font-medium text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
            {task.topic}
          </h3>
        </div>
        <div className="flex items-center gap-1">
          <span
            className={`text-xs px-2 py-1 rounded-full ${getPriorityClass()} text-white font-medium`}
          >
            {task.priority}
          </span>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-3">
        <div>
          <span className="text-sm bg-taskly-blue bg-opacity-30 px-2 py-1 rounded text-gray-700">
            {task.subject}
          </span>
          <span className="text-sm bg-taskly-purple bg-opacity-30 ml-2 px-2 py-1 rounded text-gray-700">
            {task.type}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleEdit} className="h-8 w-8">
            <Edit size={16} />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="h-8 w-8 text-destructive">
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex items-center">
        <Clock size={14} className="mr-1" />
        Due: {new Date(task.dueDate).toLocaleDateString()}
      </div>
    </div>
  );
};

export default TaskCard;
