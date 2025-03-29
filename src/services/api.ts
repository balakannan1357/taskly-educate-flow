
import { User } from '@/types';

interface UserDetails extends User {
  dateOfBirth: string;
  school: string;
  availableStudyTime: number; // in hours per week
  tuitionSchedule: {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
  }[];
}

// This simulates an API call - in a real app, you would replace this with actual API endpoints
export const fetchUserDetails = async (): Promise<UserDetails> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return mock data
  return {
    name: "John Doe",
    email: "john.doe@example.com",
    profilePicture: "",
    dateOfBirth: "2005-07-15",
    school: "Springfield High School",
    availableStudyTime: 20, // 20 hours per week
    tuitionSchedule: [
      {
        day: "Monday",
        startTime: "16:00",
        endTime: "18:00",
        subject: "Math"
      },
      {
        day: "Wednesday",
        startTime: "17:00",
        endTime: "19:00",
        subject: "Physics"
      },
      {
        day: "Friday",
        startTime: "15:30",
        endTime: "17:30",
        subject: "Chemistry"
      }
    ]
  };
};

// Function to automatically schedule tasks based on available study time
export const generateTaskSchedule = (
  tasks: any[], 
  availableHours: number, 
  tuitionSchedule: any[]
) => {
  // Convert tuition schedule to blocked time slots
  const blockedTimes = tuitionSchedule.map(session => ({
    day: session.day,
    blocked: true,
    startTime: session.startTime,
    endTime: session.endTime,
    subject: session.subject
  }));
  
  // Calculate total estimated hours needed for all tasks
  const totalTaskHours = tasks.reduce((sum, task) => {
    // Estimate hours based on priority
    const hoursByPriority = {
      'High': 3,
      'Medium': 2,
      'Low': 1
    };
    
    // Default to medium if priority not recognized
    return sum + (hoursByPriority[task.priority] || 2);
  }, 0);
  
  // Simple distribution: allocate time proportionally
  const schedule = [];
  const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Distribute available study time across days (excluding times blocked by tuition)
  let remainingHours = availableHours;
  
  // Sort tasks by priority (High -> Medium -> Low)
  const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
  const sortedTasks = [...tasks].sort((a, b) => 
    priorityOrder[a.priority] - priorityOrder[b.priority]
  );
  
  // Create a simple schedule
  sortedTasks.forEach(task => {
    if (remainingHours <= 0) return;
    
    // Estimate hours needed for this task
    const hoursByPriority = {
      'High': Math.min(3, remainingHours),
      'Medium': Math.min(2, remainingHours),
      'Low': Math.min(1, remainingHours)
    };
    
    const hoursNeeded = hoursByPriority[task.priority] || Math.min(2, remainingHours);
    
    // Find the best day to schedule this task
    // Simple algorithm: put High priority tasks earlier in the week
    let scheduledDay;
    
    if (task.priority === 'High') {
      scheduledDay = weekdays[0]; // Monday
    } else if (task.priority === 'Medium') {
      scheduledDay = weekdays[2]; // Wednesday
    } else {
      scheduledDay = weekdays[4]; // Friday
    }
    
    // Check if this conflicts with tuition
    const hasTuition = blockedTimes.some(slot => slot.day === scheduledDay);
    if (hasTuition) {
      // Find next available day
      for (const day of weekdays) {
        if (!blockedTimes.some(slot => slot.day === day)) {
          scheduledDay = day;
          break;
        }
      }
    }
    
    schedule.push({
      taskId: task.id,
      day: scheduledDay,
      hoursAllocated: hoursNeeded,
      taskName: task.topic,
      subject: task.subject,
      priority: task.priority
    });
    
    remainingHours -= hoursNeeded;
  });
  
  return schedule;
};
