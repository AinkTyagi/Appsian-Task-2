import { api } from '../lib/api';
import {
  Project,
  ProjectListItem,
  CreateProjectRequest,
  CreateTaskRequest,
  UpdateTaskRequest,
  Task,
  ScheduleRequest,
  ScheduleResponse,
} from '../types';

export const projectService = {
  // Projects
  getProjects: async (): Promise<ProjectListItem[]> => {
    const response = await api.get<ProjectListItem[]>('/api/projects');
    return response.data;
  },

  getProject: async (id: string): Promise<Project> => {
    const response = await api.get<Project>(`/api/projects/${id}`);
    return response.data;
  },

  createProject: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await api.post<Project>('/api/projects', data);
    return response.data;
  },

  deleteProject: async (id: string): Promise<void> => {
    await api.delete(`/api/projects/${id}`);
  },

  // Tasks
  createTask: async (projectId: string, data: CreateTaskRequest): Promise<Task> => {
    const response = await api.post<Task>(`/api/projects/${projectId}/tasks`, data);
    return response.data;
  },

  updateTask: async (taskId: string, data: UpdateTaskRequest): Promise<Task> => {
    const response = await api.put<Task>(`/api/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (taskId: string): Promise<void> => {
    await api.delete(`/api/tasks/${taskId}`);
  },

  // Scheduler
  generateSchedule: async (projectId: string, data: ScheduleRequest): Promise<ScheduleResponse> => {
    const response = await api.post<ScheduleResponse>(`/api/v1/projects/${projectId}/schedule`, data);
    return response.data;
  },
};
