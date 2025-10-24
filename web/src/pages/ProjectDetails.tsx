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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Project not found</h2>
          <button onClick={() => navigate('/')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
        >
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Projects
        </button>

        <div className="card mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
          {project.description && (
            <p className="text-gray-600 mb-4">{project.description}</p>
          )}
          <div className="flex items-center text-sm text-gray-500">
            <span>{project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}</span>
            <span className="mx-2">•</span>
            <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <div className="flex space-x-3">
            {project.tasks.length > 0 && (
              <button
                onClick={() => setShowScheduler(true)}
                className="btn-secondary flex items-center"
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
              className="btn-primary"
            >
              {showTaskForm ? 'Cancel' : '+ Add Task'}
            </button>
          </div>
        </div>

        {(showTaskForm || editingTask) && (
          <div className="card mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
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
          <div className="card text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by adding a new task.</p>
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
