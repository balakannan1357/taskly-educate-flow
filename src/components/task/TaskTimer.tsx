
import React, { useState, useEffect } from 'react';
import { Task } from '@/types';
import { Button } from '@/components/ui/button';
import { Pause, Play, Check } from 'lucide-react';

interface TaskTimerProps {
  task: Task;
  onComplete: () => void;
}

export const TaskTimer: React.FC<TaskTimerProps> = ({ task, onComplete }) => {
  // Default time is 25 minutes (in seconds) if not specified
  const defaultTime = 25 * 60;
  const initialTime = task.estimatedTime ? task.estimatedTime * 60 : defaultTime;
  
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(true);
  
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      onComplete();
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft, onComplete]);
  
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const toggleTimer = () => {
    setIsActive(!isActive);
  };
  
  const handleComplete = () => {
    onComplete();
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-4">{task.topic}</h2>
      
      <div className="text-5xl font-mono font-bold mb-8">
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={toggleTimer}>
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </Button>
        
        <Button onClick={handleComplete} className="bg-green-500 hover:bg-green-600">
          <Check className="mr-2 h-4 w-4" /> Mark Complete
        </Button>
      </div>
    </div>
  );
};
