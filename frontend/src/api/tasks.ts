import axios from "axios";
import { taskApi } from "./client";
import type { Workspace, Project, Task, SearchHit } from "../types";

export const listWorkspaces = () =>
  taskApi.get<Workspace[]>("/api/v1/workspaces").then((r) => r.data);

export const createWorkspace = (name: string) =>
  taskApi.post<Workspace>("/api/v1/workspaces", { name }).then((r) => r.data);

export const listProjects = (wsId: string) =>
  taskApi.get<Project[]>(`/api/v1/workspaces/${wsId}/projects`).then((r) => r.data);

export const createProject = (wsId: string, name: string) =>
  taskApi.post<Project>(`/api/v1/workspaces/${wsId}/projects`, { name }).then((r) => r.data);

export const listTasks = (projectId: string) =>
  taskApi.get<Task[]>(`/api/v1/projects/${projectId}/tasks`).then((r) => r.data);

export const createTask = (projectId: string, title: string) =>
  taskApi.post<Task>(`/api/v1/projects/${projectId}/tasks`, { title }).then((r) => r.data);

export const updateTaskStatus = (taskId: string, status: string) =>
  taskApi.patch<Task>(`/api/v1/tasks/${taskId}`, { status }).then((r) => r.data);

// AI service — no auth required on these endpoints
const aiApi = axios.create({ baseURL: import.meta.env.VITE_AI_URL });
export const semanticSearch = (query: string) =>
  aiApi.post<SearchHit[]>("/api/v1/search", { query, limit: 5 }).then((r) => r.data);