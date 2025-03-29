
import React from 'react';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface TaskTimelineProps {
  scheduledTasks: any[];
  selectedDate: Date;
}

export const TaskTimeline: React.FC<TaskTimelineProps> = ({ scheduledTasks, selectedDate }) => {
  // Always show the timeline component, even if there are no tasks
  return (
    <div className="bg-white rounded-lg p-3 shadow-sm mb-4">
      <h3 className="text-md font-medium mb-2 flex items-center">
        <Clock size={16} className="mr-2" />
        <span>Timeline for {format(selectedDate, 'EEEE')}</span>
      </h3>
      
      {scheduledTasks.length > 0 ? (
        <div className="space-y-3">
          {scheduledTasks.map((scheduled, idx) => (
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
      ) : (
        <p className="text-sm text-gray-500 text-center py-2">
          No scheduled tasks for this day
        </p>
      )}
    </div>
  );
};
