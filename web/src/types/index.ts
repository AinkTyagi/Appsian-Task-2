export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  tasks: Task[];
}

export interface ProjectListItem {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  taskCount: number;
}

export interface CreateProjectRequest {
  title: string;
  description?: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  dueDate?: string;
  isCompleted: boolean;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  dueDate?: string;
  isCompleted?: boolean;
}

export interface ScheduleTaskInput {
  title: string;
  estimatedHours: number;
  dueDate?: string;
  dependencies: string[];
}

export interface ScheduleRequest {
  tasks: ScheduleTaskInput[];
}

export interface ScheduleResponse {
  recommendedOrder: string[];
}
