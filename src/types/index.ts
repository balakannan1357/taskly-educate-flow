
export type Priority = 'High' | 'Medium' | 'Low';

export type TaskType = 'Reading' | 'Writing' | 'Practice' | 'Custom';

export interface Task {
  id: string;
  topic: string;
  subject: string;
  priority: Priority;
  type: TaskType;
  completed: boolean;
  dueDate: Date;
  createdAt: Date;
  estimatedTime?: number; // in minutes
}

export interface User {
  name: string;
  email: string;
  profilePicture?: string;
  dateOfBirth?: string;
  school?: string;
  availableStudyTime?: number;
  tuitionSchedule?: {
    day: string;
    startTime: string;
    endTime: string;
    subject: string;
  }[];
}

export interface TaskSchedule {
  taskId: string;
  day: string;
  hoursAllocated: number;
  taskName: string;
  subject: string;
  priority: Priority;
}
