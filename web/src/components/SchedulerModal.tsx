import { useState } from 'react';
import { ScheduleResponse, Task } from '../types';

interface SchedulerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
  onSchedule: (tasks: Array<{ title: string; estimatedHours: number; dueDate?: string; dependencies: string[] }>) => Promise<ScheduleResponse>;
}

export const SchedulerModal = ({ isOpen, onClose, tasks, onSchedule }: SchedulerModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskInputs, setTaskInputs] = useState<Record<string, { hours: string; deps: string }>>(
    tasks.reduce((acc, task) => ({
      ...acc,
      [task.id]: { hours: '5', deps: '' }
    }), {})
  );

  if (!isOpen) return null;

  const handleSchedule = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const scheduleTasks = tasks.map(task => ({
        title: task.title,
        estimatedHours: parseFloat(taskInputs[task.id]?.hours || '5'),
        dueDate: task.dueDate || undefined,
        dependencies: taskInputs[task.id]?.deps
          ? taskInputs[task.id].deps.split(',').map(d => d.trim()).filter(Boolean)
          : []
      }));

      const response = await onSchedule(scheduleTasks);
      setResult(response.recommendedOrder);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to generate schedule');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (taskId: string, field: 'hours' | 'deps', value: string) => {
    setTaskInputs(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Smart Task Scheduler</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!result ? (
            <>
              <p className="text-gray-600 mb-4">
                Configure estimated hours and dependencies for each task to generate an optimal execution order.
              </p>

              <div className="space-y-4 mb-6">
                {tasks.map(task => (
                  <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-3">{task.title}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Estimated Hours
                        </label>
                        <input
                          type="number"
                          min="0.1"
                          step="0.5"
                          value={taskInputs[task.id]?.hours || '5'}
                          onChange={(e) => handleInputChange(task.id, 'hours', e.target.value)}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dependencies (comma-separated task titles)
                        </label>
                        <input
                          type="text"
                          value={taskInputs[task.id]?.deps || ''}
                          onChange={(e) => handleInputChange(task.id, 'deps', e.target.value)}
                          placeholder="e.g., Task A, Task B"
                          className="input-field"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{error}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button onClick={onClose} className="btn-secondary" disabled={isLoading}>
                  Cancel
                </button>
                <button onClick={handleSchedule} className="btn-primary" disabled={isLoading}>
                  {isLoading ? 'Generating...' : 'Generate Schedule'}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommended Execution Order</h3>
                <div className="space-y-2">
                  {result.map((taskTitle, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-semibold">
                        {index + 1}
                      </span>
                      <span className="text-gray-900">{taskTitle}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button onClick={onClose} className="btn-primary">
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
