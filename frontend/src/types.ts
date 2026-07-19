export interface Workspace { id: string; name: string; }
export interface Project { id: string; workspace_id: string; name: string; description?: string | null; }
export interface Task {
  id: string; project_id: string; title: string;
  description?: string | null; status: string; priority?: string | null;
}
export interface SearchHit { id: string; title: string; score: number; }