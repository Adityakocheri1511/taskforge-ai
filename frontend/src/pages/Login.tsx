import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
    setError("");
    setBusy(true);
    try {
      if (isRegister) await register(email, name, password);
      else await login(email, password);
      navigate("/app");
    } catch (e: any) {
      // Errors state what happened and what to do — they don't apologise
      setError(
        e.response?.data?.detail ??
          "That email and password didn't match. Check them and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="px-6 py-5">
        <Link to="/" className="font-display text-base font-semibold tracking-tight">
          TaskForge<span className="text-ember">.</span>ai
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 pb-24">
        <div className="w-full max-w-[360px] rise">
          <h1 className="text-xl font-semibold">
            {isRegister ? "Create your account" : "Sign in"}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {isRegister
              ? "Takes a moment. No email confirmation needed."
              : "Welcome back."}
          </p>

          <div className="mt-8 space-y-3">
            <Input
              placeholder="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isRegister && (
              <Input
                placeholder="Name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            <Input
              placeholder="Password"
              type="password"
              autoComplete={isRegister ? "new-password" : "current-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
            />
          </div>

          {error && (
            <p className="mt-4 text-sm text-danger" role="alert">
              {error}
            </p>
          )}

          <Button onClick={submit} disabled={busy} size="lg" className="mt-6 w-full">
            {busy ? "One moment" : isRegister ? "Create account" : "Sign in"}
          </Button>

          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="mt-6 w-full text-sm text-muted transition-colors hover:text-ink"
          >
            {isRegister
              ? "Already have an account? Sign in"
              : "New to TaskForge? Create an account"}
          </button>
        </div>
      </main>
    </div>
  );
}