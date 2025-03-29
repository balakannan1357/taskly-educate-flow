
import React, { useState, useEffect, useRef } from 'react';
import { format, addDays, addWeeks, subWeeks, startOfWeek, isToday, isSameDay, parseISO } from 'date-fns';
import TaskCard from '@/components/task/TaskCard';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle2, ListChecks, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserDetails, generateTaskSchedule } from '@/services/api';
import { TaskTimeline } from '@/components/task/TaskTimeline';
import { useDailyTaskStats } from '@/hooks/useDailyTaskStats';

const Index = () => {
  const { getTasksByDate, tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 0 }));
  const [taskSchedule, setTaskSchedule] = useState([]);
  const containerRef = useRef(null);
  const { completedTasksCount, totalTasksCount, tasksForSelectedDate } = useDailyTaskStats(selectedDate);

  // Touch swipe handling for day navigation
  const touchStartX = useRef(null);
  
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    
    // Swipe threshold of 50px
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        // Swipe left - next day
        setSelectedDate(prev => addDays(prev, 1));
      } else {
        // Swipe right - previous day
        setSelectedDate(prev => addDays(prev, -1));
      }
    }
    
    touchStartX.current = null;
  };

  // Fetch user details to get available study time and tuition schedule
  const { data: userData } = useQuery({
    queryKey: ['userData'],
    queryFn: fetchUserDetails
  });

  // Effect to generate task schedule when user data or tasks change
  useEffect(() => {
    if (userData?.availableStudyTime && tasks.length > 0) {
      const schedule = generateTaskSchedule(
        tasks, 
        userData.availableStudyTime, 
        userData.tuitionSchedule || []
      );
      setTaskSchedule(schedule);
    }
  }, [userData, tasks]);

  // Navigate to previous day
  const goToPreviousDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, -1));
  };

  // Navigate to next day
  const goToNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  // Navigate to previous week
  const goToPreviousWeek = () => {
    setCurrentWeekStart(prevWeekStart => subWeeks(prevWeekStart, 1));
  };

  // Navigate to next week
  const goToNextWeek = () => {
    setCurrentWeekStart(prevWeekStart => addWeeks(prevWeekStart, 1));
  };

  // Create an array of 7 days starting from the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(currentWeekStart, i);
    return {
      date: day,
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
    };
  });
  
  // Find scheduled tasks for the selected day
  const scheduledTasksForToday = taskSchedule.filter(
    item => item.day === format(selectedDate, 'EEEE')
  );

  return (
    <div 
      className="taskly-container page-transition"
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <header className="mb-6">
        <h1 className="text-2xl font-bold">TaskApp</h1>
        <p className="text-gray-600">Organize your student life</p>
      </header>

      <div className="mb-4 p-4 bg-white bg-opacity-80 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToPreviousWeek} 
            className="p-0 h-8 w-8"
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-sm font-medium text-gray-600">
            {format(weekDays[0].date, 'MMM d')} - {format(weekDays[6].date, 'MMM d')}
          </span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToNextWeek} 
            className="p-0 h-8 w-8"
          >
            <ChevronRight size={20} />
          </Button>
        </div>
        <div className="flex justify-between mb-2">
          {weekDays.map((day) => (
            <Button
              key={day.dayName}
              variant="ghost"
              className={`flex flex-col p-1 h-auto ${
                isSameDay(day.date, selectedDate)
                  ? 'bg-primary bg-opacity-20'
                  : ''
              } ${
                isToday(day.date) ? 'border border-primary' : ''
              }`}
              onClick={() => setSelectedDate(day.date)}
            >
              <span className="text-xs">{day.dayName}</span>
              <span className={`text-lg font-medium ${isToday(day.date) ? 'text-primary' : ''}`}>
                {day.dayNumber}
              </span>
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToPreviousDay}
            className="p-1 h-8 w-8"
          >
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-xl font-semibold">
            {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMMM d')}
          </h2>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToNextDay}
            className="p-1 h-8 w-8"
          >
            <ChevronRight size={16} />
          </Button>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 size={18} />
          <span>{completedTasksCount} of {totalTasksCount}</span>
        </div>
      </div>

      {/* Daily Timeline - show for every day, regardless of scheduled tasks */}
      <TaskTimeline 
        scheduledTasks={scheduledTasksForToday} 
        selectedDate={selectedDate}
      />

      <div className="space-y-4 mt-4">
        {tasksForSelectedDate.length > 0 ? (
          tasksForSelectedDate.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))
        ) : (
          <div className="text-center py-8 bg-white bg-opacity-70 rounded-xl">
            <ListChecks className="mx-auto h-12 w-12 text-gray-400 mb-2" />
            <h3 className="font-medium text-lg text-gray-700">No tasks for this day</h3>
            <p className="text-gray-500 text-sm mt-1">
              Add a new task using the + button below
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
