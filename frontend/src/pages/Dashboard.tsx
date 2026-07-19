import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button, Input, Card, StatusDot, Empty } from "../components/ui";
import {
  listWorkspaces, createWorkspace, listProjects, createProject,
  listTasks, createTask, updateTaskStatus,
} from "../api/tasks";
import type { Workspace, Project, Task } from "../types";
import SearchPanel from "../components/SearchPanel";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWs, setActiveWs] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listWorkspaces().then((ws) => {
      setWorkspaces(ws);
      if (ws.length) setActiveWs(ws[0].id);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeWs) return;
    listProjects(activeWs).then((p) => {
      setProjects(p);
      setActiveProject(p.length ? p[0].id : null);
    });
  }, [activeWs]);

  useEffect(() => {
    if (!activeProject) { setTasks([]); return; }
    listTasks(activeProject).then(setTasks);
  }, [activeProject]);

  const addWorkspace = async () => {
    const name = prompt("Workspace name");
    if (!name) return;
    const ws = await createWorkspace(name);
    setWorkspaces([...workspaces, ws]);
    setActiveWs(ws.id);
  };

  const addProject = async () => {
    if (!activeWs) return;
    const name = prompt("Project name");
    if (!name) return;
    const p = await createProject(activeWs, name);
    setProjects([...projects, p]);
    setActiveProject(p.id);
  };

  const addTask = async () => {
    if (!activeProject || !newTask.trim()) return;
    const t = await createTask(activeProject, newTask.trim());
    setTasks([t, ...tasks]);
    setNewTask("");
  };

  const cycleStatus = async (task: Task) => {
    const next = task.status === "todo" ? "in_progress" : task.status === "in_progress" ? "done" : "todo";
    const updated = await updateTaskStatus(task.id, next);
    setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
  };

  if (loading) return <p className="mt-24 text-center text-sm text-muted">Loading…</p>;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-hairline bg-surface/80 backdrop-blur sticky top-0 z-10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <span className="font-semibold">TaskForge</span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted">{user?.name}</span>
            <Button variant="ghost" onClick={logout}>Sign out</Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12">
        {/* Workspaces */}
        <div className="flex items-center gap-2 mb-10">
          {workspaces.map((ws) => (
            <button
              key={ws.id}
              onClick={() => setActiveWs(ws.id)}
              className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                activeWs === ws.id ? "bg-ink text-white" : "text-muted hover:text-ink"
              }`}
            >
              {ws.name}
            </button>
          ))}
          <button onClick={addWorkspace} className="text-sm text-accent hover:underline px-2">
            + Workspace
          </button>
        </div>

        {workspaces.length === 0 ? (
          <Empty title="No workspaces yet" hint="Create one to start organizing your work." />
        ) : (
          <>
            <SearchPanel />

            {/* Projects */}
            <div className="mt-12 flex items-center gap-2">
              {projects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setActiveProject(p.id)}
                  className={`text-sm transition-colors ${
                    activeProject === p.id
                      ? "text-ink font-medium"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {p.name}
                </button>
              ))}
              <button onClick={addProject} className="text-sm text-accent hover:underline ml-2">
                + Project
              </button>
            </div>

            {/* Tasks */}
            {activeProject ? (
              <>
                <div className="mt-6 flex gap-2">
                  <Input
                    placeholder="What needs doing?"
                    value={newTask}
                    onChange={(e) => setNewTask(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addTask()}
                  />
                  <Button onClick={addTask}>Add</Button>
                </div>

                <div className="mt-6 space-y-2">
                  {tasks.length === 0 ? (
                    <Empty title="Nothing here yet" hint="Add your first task above." />
                  ) : (
                    tasks.map((task) => (
                      <Card key={task.id} className="px-5 py-4">
                        <div className="flex items-center justify-between gap-4">
                          <span className={task.status === "done" ? "text-muted line-through" : ""}>
                            {task.title}
                          </span>
                          <button onClick={() => cycleStatus(task)} className="shrink-0">
                            <StatusDot status={task.status} />
                          </button>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </>
            ) : (
              <Empty title="No projects yet" hint="Create a project to add tasks." />
            )}
          </>
        )}
      </main>
    </div>
  );
}