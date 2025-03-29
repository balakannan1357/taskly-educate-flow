
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
}

export interface User {
  name: string;
  email: string;
  profilePicture?: string;
}
