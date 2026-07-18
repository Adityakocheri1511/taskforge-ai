import { useAuth } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, logout } = useAuth();
  return (
    <div style={{ maxWidth: 720, margin: "60px auto", fontFamily: "system-ui" }}>
      <h1>Dashboard</h1>
      <p>Signed in as <strong>{user?.name}</strong> ({user?.email})</p>
      <p style={{ color: "#666", fontSize: 14 }}>User ID: {user?.id}</p>
      <button onClick={logout} style={{ padding: "8px 16px" }}>Log out</button>
      <hr style={{ margin: "30px 0" }} />
      <p style={{ color: "#888" }}>Workspaces and tasks land here next session.</p>
    </div>
  );
}