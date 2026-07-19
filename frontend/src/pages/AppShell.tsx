import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button, Input, Card, StatusMark, Empty, Spinner, Eyebrow } from "../components/ui";
import SearchPanel from "../components/SearchPanel";
import {
  listWorkspaces, createWorkspace, listProjects, createProject,
  listTasks, createTask, updateTaskStatus,
} from "../api/tasks";
import type { Workspace, Project, Task } from "../types";

const NEXT_STATUS: Record<string, string> = {
  todo: "in_progress",
  in_progress: "done",
  done: "todo",
};

export default function AppShell() {
  const { user, logout } = useAuth();

  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [activeWs, setActiveWs] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    listWorkspaces()
      .then((ws) => {
        setWorkspaces(ws);
        if (ws.length) setActiveWs(ws[0].id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeWs) return;
    listProjects(activeWs).then((p) => {
      setProjects(p);
      setActiveProject(p.length ? p[0].id : null);
    });
  }, [activeWs]);

  useEffect(() => {
    if (!activeProject) return setTasks([]);
    listTasks(activeProject).then(setTasks);
  }, [activeProject]);

  const addWorkspace = async () => {
    const name = prompt("Name this workspace");
    if (!name?.trim()) return;
    const ws = await createWorkspace(name.trim());
    setWorkspaces([...workspaces, ws]);
    setActiveWs(ws.id);
  };

  const addProject = async () => {
    if (!activeWs) return;
    const name = prompt("Name this project");
    if (!name?.trim()) return;
    const p = await createProject(activeWs, name.trim());
    setProjects([...projects, p]);
    setActiveProject(p.id);
  };

  const addTask = async () => {
    if (!activeProject || !newTask.trim()) return;
    const t = await createTask(activeProject, newTask.trim());
    setTasks([t, ...tasks]);
    setNewTask("");
  };

  const advance = async (task: Task) => {
    const updated = await updateTaskStatus(task.id, NEXT_STATUS[task.status] ?? "todo");
    setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
  };

  const counts = {
    todo: tasks.filter((t) => t.status === "todo").length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  if (loading) return <Spinner />;

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-hairline bg-canvas/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-base font-semibold tracking-tight">
            TaskForge<span className="text-ember">.</span>ai
          </span>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-muted sm:inline">{user?.name}</span>
            <Button variant="ghost" size="sm" onClick={logout}>Sign out</Button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl gap-12 px-6 py-10 lg:flex">
        {/* Sidebar */}
        <aside className="mb-10 shrink-0 lg:mb-0 lg:w-52">
          <Eyebrow>Workspaces</Eyebrow>
          <nav className="mt-4 flex gap-2 lg:flex-col">
            {workspaces.map((ws) => (
              <button
                key={ws.id}
                onClick={() => setActiveWs(ws.id)}
                className={`rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm transition-colors ${
                  activeWs === ws.id
                    ? "bg-surface font-medium text-ink border border-hairline"
                    : "text-muted hover:text-ink"
                }`}
              >
                {ws.name}
              </button>
            ))}
            <button
              onClick={addWorkspace}
              className="rounded-[var(--radius-sm)] px-3 py-2 text-left text-sm text-ember transition-opacity hover:opacity-70"
            >
              New workspace
            </button>
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {workspaces.length === 0 ? (
            <Empty
              title="No workspaces yet"
              hint="A workspace holds your projects and the people working on them."
              action={<Button onClick={addWorkspace}>Create a workspace</Button>}
            />
          ) : (
            <>
              <SearchPanel onBusyChange={setSearching} />

              <section className="mt-14">
                <div className="flex flex-wrap items-center gap-4 border-b border-hairline pb-4">
                  {projects.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setActiveProject(p.id)}
                      className={`relative pb-1 text-sm transition-colors ${
                        activeProject === p.id ? "font-medium text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      {p.name}
                      {activeProject === p.id && (
                        <span className="absolute -bottom-[17px] left-0 h-px w-full bg-ember" />
                      )}
                    </button>
                  ))}
                  <button
                    onClick={addProject}
                    className="text-sm text-ember transition-opacity hover:opacity-70"
                  >
                    New project
                  </button>
                </div>

                {activeProject ? (
                  <>
                    <div className="mt-6 flex gap-2">
                      <Input
                        placeholder="What needs doing?"
                        value={newTask}
                        onChange={(e) => setNewTask(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addTask()}
                      />
                      <Button onClick={addTask} disabled={!newTask.trim()}>Add</Button>
                    </div>

                    {tasks.length > 0 && (
                      <div className="mt-5 flex gap-5 font-mono text-xs text-faint">
                        <span>{counts.todo} to do</span>
                        <span>{counts.in_progress} in progress</span>
                        <span>{counts.done} done</span>
                      </div>
                    )}

                    <div className="mt-4 space-y-2">
                      {tasks.length === 0 ? (
                        <Empty
                          title="Nothing here yet"
                          hint="Add your first task above. It'll be searchable by meaning within seconds."
                        />
                      ) : (
                        tasks.map((task) => (
                          <Card key={task.id} hover className="px-5 py-4">
                            <div className="flex items-center justify-between gap-4">
                              <span
                                className={`text-sm ${
                                  task.status === "done" ? "text-faint line-through" : "text-ink"
                                }`}
                              >
                                {task.title}
                              </span>
                              <button
                                onClick={() => advance(task)}
                                className="shrink-0 rounded px-1"
                                aria-label={`Advance status of ${task.title}`}
                              >
                                <StatusMark status={task.status} />
                              </button>
                            </div>
                          </Card>
                        ))
                      )}
                    </div>
                  </>
                ) : (
                  <Empty
                    title="No projects yet"
                    hint="Projects group related tasks inside a workspace."
                    action={<Button onClick={addProject}>Create a project</Button>}
                  />
                )}
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}