
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task, Priority, TaskType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';

interface TaskFormProps {
  existingTask?: Task;
}

const TaskForm: React.FC<TaskFormProps> = ({ existingTask }) => {
  const { addTask, updateTask } = useTaskContext();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState(existingTask?.topic || '');
  const [subject, setSubject] = useState(existingTask?.subject || '');
  const [priority, setPriority] = useState<Priority>(existingTask?.priority || 'Medium');
  const [type, setType] = useState<TaskType>(existingTask?.type || 'Custom');
  const [dueDate, setDueDate] = useState<Date>(existingTask?.dueDate || new Date());

  const subjects = [
    'Math', 'Science', 'History', 'English', 'Physics', 'Chemistry',
    'Biology', 'Computer Science', 'Art', 'Music', 'Physical Education',
    'Economics', 'Geography', 'Foreign Language', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic || !subject) {
      return;
    }
    
    if (existingTask) {
      updateTask(existingTask.id, {
        topic,
        subject,
        priority,
        type,
        dueDate,
      });
    } else {
      addTask({
        topic,
        subject,
        priority,
        type,
        completed: false,
        dueDate,
      });
    }
    
    navigate('/');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="topic">Task Name</Label>
          <Input
            id="topic"
            placeholder="Enter task name"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            className="bg-white bg-opacity-80"
          />
        </div>
        
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Select value={subject} onValueChange={setSubject} required>
            <SelectTrigger id="subject" className="bg-white bg-opacity-80">
              <SelectValue placeholder="Select a subject" />
            </SelectTrigger>
            <SelectContent>
              {subjects.map((sub) => (
                <SelectItem key={sub} value={sub}>
                  {sub}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
            <SelectTrigger id="priority" className="bg-white bg-opacity-80">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="type">Task Type</Label>
          <Select value={type} onValueChange={(value) => setType(value as TaskType)}>
            <SelectTrigger id="type" className="bg-white bg-opacity-80">
              <SelectValue placeholder="Select task type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Reading">Reading</SelectItem>
              <SelectItem value="Writing">Writing</SelectItem>
              <SelectItem value="Practice">Practice</SelectItem>
              <SelectItem value="Custom">Custom</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label htmlFor="dueDate">Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-white bg-opacity-80 justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => date && setDueDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/')}
          className="w-full"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="w-full"
        >
          {existingTask ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
