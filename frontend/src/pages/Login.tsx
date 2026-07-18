import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(""); setBusy(true);
    try {
      if (isRegister) await register(email, name, password);
      else await login(email, password);
      navigate("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.detail ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ maxWidth: 380, margin: "80px auto", fontFamily: "system-ui" }}>
      <h1>TaskForge.AI</h1>
      <h2 style={{ fontSize: 18, fontWeight: 400 }}>
        {isRegister ? "Create an account" : "Sign in"}
      </h2>

      <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      {isRegister && (
        <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 10 }} />
      )}
      <input placeholder="Password" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: 10, marginBottom: 10 }} />

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <button onClick={submit} disabled={busy} style={{ width: "100%", padding: 10 }}>
        {busy ? "Please wait…" : isRegister ? "Register" : "Sign in"}
      </button>

      <p style={{ marginTop: 14, fontSize: 14 }}>
        <a href="#" onClick={(e) => { e.preventDefault(); setIsRegister(!isRegister); }}>
          {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
        </a>
      </p>
    </div>
  );
}