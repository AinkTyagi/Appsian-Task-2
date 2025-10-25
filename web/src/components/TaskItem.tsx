import { Task } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, isCompleted: boolean) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

export const TaskItem = ({ task, onToggle, onDelete, onEdit }: TaskItemProps) => {
  const handleToggle = () => {
    onToggle(task.id, !task.isCompleted);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      onDelete(task.id);
    }
  };

  return (
    <div className="card-nexus floating-card group">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="checkbox"
            checked={task.isCompleted}
            onChange={handleToggle}
            className="h-5 w-5 text-nexus-500 bg-white/10 border-white/20 rounded focus:ring-nexus-500 focus:ring-2"
          />
          {task.isCompleted && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <svg className="w-3 h-3 text-nexus-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className={`font-medium transition-all duration-200 ${
            task.isCompleted 
              ? 'line-through text-white/50' 
              : 'text-white group-hover:text-nexus-300'
          }`}>
            {task.title}
          </p>
          {task.dueDate && (
            <div className="flex items-center mt-1 text-sm text-white/60">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Due: {new Date(task.dueDate).toLocaleDateString()}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-white/60 hover:text-nexus-400 hover:bg-nexus-500/20 rounded-lg transition-all duration-200"
            title="Edit task"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          
          <button
            onClick={handleDelete}
            className="p-2 text-white/60 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all duration-200"
            title="Delete task"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
