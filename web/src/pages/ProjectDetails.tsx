import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { TaskItem } from '../components/TaskItem';
import { TaskForm } from '../components/TaskForm';
import { SchedulerModal } from '../components/SchedulerModal';
import { Loader } from '../components/Loader';
import { Task } from '../types';
import { toast } from 'react-toastify';

export const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showScheduler, setShowScheduler] = useState(false);

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => projectService.getProject(id!),
    enabled: !!id,
  });

  const createTaskMutation = useMutation({
    mutationFn: (data: { title: string; dueDate?: string }) =>
      projectService.createTask(id!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Task created successfully!');
      setShowTaskForm(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create task');
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, data }: { taskId: string; data: any }) =>
      projectService.updateTask(taskId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Task updated successfully!');
      setEditingTask(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update task');
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: projectService.deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', id] });
      toast.success('Task deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete task');
    },
  });

  const handleCreateTask = (data: { title: string; dueDate?: string }) => {
    createTaskMutation.mutate(data);
  };

  const handleUpdateTask = (data: { title: string; dueDate?: string }) => {
    if (editingTask) {
      updateTaskMutation.mutate({
        taskId: editingTask.id,
        data: {
          title: data.title,
          dueDate: data.dueDate || null,
        },
      });
    }
  };

  const handleToggleTask = (taskId: string, isCompleted: boolean) => {
    updateTaskMutation.mutate({
      taskId,
      data: { isCompleted },
    });
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTaskMutation.mutate(taskId);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(false);
  };

  const handleSchedule = async (tasks: any[]) => {
    return await projectService.generateSchedule(id!, { tasks });
  };

  if (isLoading) {
    return <Loader />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Project not found</h2>
          <button onClick={() => navigate('/')} className="btn-nexus">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-72 h-72 bg-nexus-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-white/70 hover:text-white mb-6 transition-colors duration-200"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>

        <div className="card-glass mb-8">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-nexus-500 to-nexus-600 rounded-xl flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">{project.title}</h1>
          </div>
          {project.description && (
            <p className="text-white/70 mb-4 leading-relaxed">{project.description}</p>
          )}
          <div className="flex items-center text-sm text-white/60">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span>{project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}</span>
            </div>
            <span className="mx-2">•</span>
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold text-white">Tasks</h2>
          <div className="flex space-x-3">
            {project.tasks.length > 0 && (
              <button
                onClick={() => setShowScheduler(true)}
                className="btn-glass flex items-center"
              >
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Smart Schedule
              </button>
            )}
            <button
              onClick={() => {
                setShowTaskForm(!showTaskForm);
                setEditingTask(null);
              }}
              className={showTaskForm ? 'btn-glass' : 'btn-nexus'}
            >
              {showTaskForm ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Task
                </>
              )}
            </button>
          </div>
        </div>

        {(showTaskForm || editingTask) && (
          <div className="card-glass mb-6 floating-card">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent-emerald to-nexus-500 rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingTask ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M12 6v6m0 0v6m0-6h6m-6 0H6"} />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white">
                {editingTask ? 'Edit Task' : 'Add New Task'}
              </h3>
            </div>
            <TaskForm
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => {
                setShowTaskForm(false);
                setEditingTask(null);
              }}
              initialData={editingTask || undefined}
              isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
            />
          </div>
        )}

        {project.tasks.length === 0 ? (
          <div className="card-glass text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-accent-emerald to-nexus-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No tasks yet</h3>
            <p className="text-white/70 text-lg mb-6">Start organizing your project by adding your first task.</p>
            <button
              onClick={() => setShowTaskForm(true)}
              className="btn-nexus"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Your First Task
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {project.tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                onEdit={handleEditTask}
              />
            ))}
          </div>
        )}
      </div>

      <SchedulerModal
        isOpen={showScheduler}
        onClose={() => setShowScheduler(false)}
        tasks={project.tasks}
        onSchedule={handleSchedule}
      />
    </div>
  );
};
