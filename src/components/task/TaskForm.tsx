
import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Task, Priority, TaskType } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { fetchUserDetails, generateTaskSchedule } from '@/services/api';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

interface TaskFormProps {
  existingTask?: Task;
}

interface BatchTask {
  id: string;
  topic: string;
  subject: string;
  priority: Priority;
  type: TaskType;
  dueDate: Date;
}

const TaskForm: React.FC<TaskFormProps> = ({ existingTask }) => {
  const { addTask, updateTask } = useTaskContext();
  const navigate = useNavigate();
  
  const [topic, setTopic] = useState(existingTask?.topic || '');
  const [subject, setSubject] = useState(existingTask?.subject || '');
  const [priority, setPriority] = useState<Priority>(existingTask?.priority || 'Medium');
  const [type, setType] = useState<TaskType>(existingTask?.type || 'Custom');
  const [dueDate, setDueDate] = useState<Date>(existingTask?.dueDate || new Date());
  
  // Batch task creation state
  const [batchMode, setBatchMode] = useState(false);
  const [batchTasks, setBatchTasks] = useState<BatchTask[]>([
    {
      id: '1',
      topic: '',
      subject: '',
      priority: 'Medium',
      type: 'Custom',
      dueDate: new Date()
    }
  ]);
  
  // Auto-schedule option
  const [autoSchedule, setAutoSchedule] = useState(false);
  
  // Get user details for auto scheduling
  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserDetails
  });

  const subjects = [
    'Math', 'Science', 'History', 'English', 'Physics', 'Chemistry',
    'Biology', 'Computer Science', 'Art', 'Music', 'Physical Education',
    'Economics', 'Geography', 'Foreign Language', 'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (batchMode) {
      // Validate batch tasks
      const validTasks = batchTasks.filter(task => task.topic && task.subject);
      if (validTasks.length === 0) {
        toast.error("Please add at least one valid task");
        return;
      }
      
      // Add all batch tasks
      validTasks.forEach(task => {
        addTask({
          topic: task.topic,
          subject: task.subject,
          priority: task.priority,
          type: task.type,
          completed: false,
          dueDate: task.dueDate,
        });
      });
      
      if (autoSchedule && userData?.availableStudyTime) {
        toast.success("Tasks added and scheduled based on your available time!");
      } else {
        toast.success(`${validTasks.length} tasks added successfully!`);
      }
      
    } else {
      // Single task mode
      if (!topic || !subject) {
        toast.error("Please fill in all required fields");
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
    }
    
    navigate('/');
  };
  
  const addNewBatchTask = () => {
    setBatchTasks([
      ...batchTasks,
      {
        id: Date.now().toString(),
        topic: '',
        subject: '',
        priority: 'Medium',
        type: 'Custom',
        dueDate: new Date()
      }
    ]);
  };
  
  const updateBatchTask = (id: string, field: string, value: any) => {
    setBatchTasks(
      batchTasks.map(task => 
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };
  
  const removeBatchTask = (id: string) => {
    if (batchTasks.length > 1) {
      setBatchTasks(batchTasks.filter(task => task.id !== id));
    } else {
      toast.error("You need at least one task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {!existingTask && (
          <div className="flex items-center space-x-2">
            <Label htmlFor="batchMode">Batch Create Tasks</Label>
            <Switch 
              id="batchMode" 
              checked={batchMode} 
              onCheckedChange={setBatchMode} 
            />
          </div>
        )}
        
        {batchMode ? (
          // Batch task creation UI
          <div className="space-y-4">
            {batchTasks.map((task, index) => (
              <div key={task.id} className="p-4 border rounded-lg bg-white bg-opacity-80">
                <div className="flex justify-between mb-2">
                  <h3 className="text-sm font-medium">Task #{index + 1}</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBatchTask(task.id)}
                    className="h-6 w-6 p-0"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`topic-${task.id}`}>Task Name</Label>
                    <Input
                      id={`topic-${task.id}`}
                      value={task.topic}
                      onChange={(e) => updateBatchTask(task.id, 'topic', e.target.value)}
                      placeholder="Enter task name"
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor={`subject-${task.id}`}>Subject</Label>
                    <Select 
                      value={task.subject} 
                      onValueChange={(value) => updateBatchTask(task.id, 'subject', value)}
                    >
                      <SelectTrigger id={`subject-${task.id}`} className="bg-white">
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((sub) => (
                          <SelectItem key={`${task.id}-${sub}`} value={sub}>{sub}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor={`priority-${task.id}`}>Priority</Label>
                      <Select 
                        value={task.priority} 
                        onValueChange={(value) => updateBatchTask(task.id, 'priority', value as Priority)}
                      >
                        <SelectTrigger id={`priority-${task.id}`} className="bg-white">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Low">Low</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor={`type-${task.id}`}>Type</Label>
                      <Select 
                        value={task.type} 
                        onValueChange={(value) => updateBatchTask(task.id, 'type', value as TaskType)}
                      >
                        <SelectTrigger id={`type-${task.id}`} className="bg-white">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Reading">Reading</SelectItem>
                          <SelectItem value="Writing">Writing</SelectItem>
                          <SelectItem value="Practice">Practice</SelectItem>
                          <SelectItem value="Custom">Custom</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor={`dueDate-${task.id}`}>Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full bg-white justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {task.dueDate ? format(task.dueDate, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={task.dueDate}
                          onSelect={(date) => date && updateBatchTask(task.id, 'dueDate', date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addNewBatchTask}
              className="w-full"
            >
              <Plus size={16} className="mr-2" />
              Add Another Task
            </Button>
            
            {userData?.availableStudyTime && (
              <div className="flex items-center space-x-2 p-3 bg-white rounded-lg">
                <Checkbox 
                  id="autoSchedule" 
                  checked={autoSchedule} 
                  onCheckedChange={(checked) => setAutoSchedule(!!checked)} 
                />
                <Label htmlFor="autoSchedule" className="text-sm">
                  Auto-schedule tasks based on my available study time ({userData?.availableStudyTime}h/week)
                </Label>
              </div>
            )}
          </div>
        ) : (
          // Single task creation UI
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
        )}
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
          {existingTask ? 'Update Task' : batchMode ? 'Add Tasks' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
