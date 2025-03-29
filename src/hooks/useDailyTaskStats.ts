
import { useTaskContext } from '@/context/TaskContext';

export const useDailyTaskStats = (selectedDate: Date) => {
  const { getTasksByDate } = useTaskContext();
  
  const tasksForSelectedDate = getTasksByDate(selectedDate);
  const completedTasksCount = tasksForSelectedDate.filter(task => task.completed).length;
  const totalTasksCount = tasksForSelectedDate.length;
  
  return {
    completedTasksCount,
    totalTasksCount,
    tasksForSelectedDate
  };
};
