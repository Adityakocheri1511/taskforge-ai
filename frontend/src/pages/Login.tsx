import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { Button, Input } from "../components/ui";

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
      setError(e.response?.data?.detail ?? "That didn't work. Check your details and try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[340px]">
        <h1 className="text-2xl font-semibold text-center">TaskForge</h1>
        <p className="mt-2 mb-10 text-center text-sm text-muted">
          {isRegister ? "Create your account." : "Sign in to continue."}
        </p>

        <div className="space-y-3">
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          {isRegister && (
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          )}
          <Input
            placeholder="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>

        {error && <p className="mt-3 text-sm text-danger">{error}</p>}

        <Button onClick={submit} disabled={busy} className="mt-6 w-full">
          {busy ? "One moment…" : isRegister ? "Create account" : "Sign in"}
        </Button>

        <button
          onClick={() => setIsRegister(!isRegister)}
          className="mt-6 w-full text-sm text-accent hover:underline"
        >
          {isRegister ? "Already have an account? Sign in" : "New here? Create an account"}
        </button>
      </div>
    </div>
  );
}