
import { useTaskContext } from '@/context/TaskContext';

export const useDailyTaskStats = (selectedDate: Date) => {
  const { getTasksByDate } = useTaskContext();
  
  // Get tasks for the selected date
  const tasksForSelectedDate = getTasksByDate(selectedDate);
  
  // Count completed tasks for the selected date
  const completedTasksCount = tasksForSelectedDate.filter(task => task.completed).length;
  const totalTasksCount = tasksForSelectedDate.length;
  
  return {
    completedTasksCount,
    totalTasksCount,
    tasksForSelectedDate
  };
};
