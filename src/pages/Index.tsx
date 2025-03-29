
import React, { useState, useEffect } from 'react';
import { format, addDays, addWeeks, subWeeks, startOfWeek, isToday, isSameDay, parseISO } from 'date-fns';
import TaskCard from '@/components/task/TaskCard';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle2, ListChecks, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchUserDetails, generateTaskSchedule } from '@/services/api';

const Index = () => {
  const { getTasksByDate, tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [taskSchedule, setTaskSchedule] = useState([]);

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

  const tasksForSelectedDate = getTasksByDate(selectedDate);
  const completedTasksCount = tasks.filter(task => task.completed).length;

  // Find scheduled tasks for the selected day
  const scheduledTasksForToday = taskSchedule.filter(
    item => item.day === format(selectedDate, 'EEEE')
  );

  return (
    <div className="taskly-container page-transition">
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
        <h2 className="text-xl font-semibold">
          {isToday(selectedDate) ? 'Today' : format(selectedDate, 'MMMM d')}
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CheckCircle2 size={18} />
          <span>{completedTasksCount} completed</span>
        </div>
      </div>

      {scheduledTasksForToday.length > 0 && (
        <div className="mb-4">
          <h3 className="text-md font-medium mb-2">Scheduled Study Time</h3>
          <div className="bg-white rounded-lg p-3 shadow-sm">
            {scheduledTasksForToday.map((scheduled, idx) => (
              <div key={idx} className="flex justify-between items-center p-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{scheduled.taskName}</p>
                  <p className="text-sm text-gray-600">{scheduled.subject}</p>
                </div>
                <div className="text-right">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    scheduled.priority === 'High' ? 'bg-red-200 text-red-900' :
                    scheduled.priority === 'Medium' ? 'bg-yellow-200 text-yellow-900' :
                    'bg-green-200 text-green-900'
                  }`}>
                    {scheduled.hoursAllocated}h
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
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
