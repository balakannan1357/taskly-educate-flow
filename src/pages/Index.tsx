
import React, { useState } from 'react';
import { format, addDays, startOfWeek, isToday, isSameDay } from 'date-fns';
import TaskCard from '@/components/task/TaskCard';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle2, ListChecks } from 'lucide-react';

const Index = () => {
  const { getTasksByDate, tasks } = useTaskContext();
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Create an array of 7 days starting from the current week
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const day = addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i);
    return {
      date: day,
      dayName: format(day, 'EEE'),
      dayNumber: format(day, 'd'),
    };
  });

  const tasksForSelectedDate = getTasksByDate(selectedDate);
  const completedTasksCount = tasks.filter(task => task.completed).length;

  return (
    <div className="taskly-container page-transition">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">TaskApp</h1>
        <p className="text-gray-600">Organize your student life</p>
      </header>

      <div className="mb-4 p-4 bg-white bg-opacity-80 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">This Week</span>
          <span className="text-sm text-gray-500">
            {format(weekDays[0].date, 'MMM d')} - {format(weekDays[6].date, 'MMM d')}
          </span>
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
