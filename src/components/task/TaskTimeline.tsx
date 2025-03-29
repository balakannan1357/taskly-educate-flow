
import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface TaskTimelineProps {
  scheduledTasks: any[];
  selectedDate: Date;
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ scheduledTasks, selectedDate }) => {
  if (scheduledTasks.length === 0) return null;
  
  // Sort tasks by time (for now using a simple approximation)
  const sortedTasks = [...scheduledTasks].sort((a, b) => {
    // This is a simple sort - in a real app you'd use actual scheduled times
    return a.priority === 'High' ? -1 : b.priority === 'High' ? 1 : 0;
  });

  return (
    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
      <h3 className="text-md font-medium mb-2 flex items-center">
        <Clock size={16} className="mr-2" />
        <span>Timeline for {format(selectedDate, 'EEEE')}</span>
      </h3>
      
      <div className="space-y-3">
        {sortedTasks.map((scheduled, idx) => (
          <div 
            key={idx} 
            className="flex items-start p-2 border-l-4 rounded-r-md"
            style={{
              borderLeftColor: 
                scheduled.priority === 'High' ? 'var(--priority-high)' : 
                scheduled.priority === 'Medium' ? 'var(--priority-medium)' : 
                'var(--priority-low)'
            }}
          >
            <div className="flex-1">
              <p className="font-medium">{scheduled.taskName}</p>
              <div className="flex justify-between items-center mt-1">
                <p className="text-sm text-gray-600">{scheduled.subject}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  scheduled.priority === 'High' ? 'bg-red-200 text-red-900' :
                  scheduled.priority === 'Medium' ? 'bg-yellow-200 text-yellow-900' :
                  'bg-green-200 text-green-900'
                }`}>
                  {scheduled.hoursAllocated}h
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
