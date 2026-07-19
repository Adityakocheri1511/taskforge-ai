import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" }) {
  const base =
    "inline-flex items-center justify-center rounded-[var(--radius-md)] px-4 py-2 " +
    "text-sm font-medium transition-colors duration-150 disabled:opacity-40 " +
    "disabled:cursor-not-allowed";
  const styles = {
    primary: "bg-accent text-white hover:bg-[#0077ED]",
    secondary: "bg-surface text-ink border border-hairline hover:bg-canvas",
    ghost: "text-muted hover:text-ink",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-[var(--radius-md)] border border-hairline bg-surface
        px-3.5 py-2.5 text-base text-ink placeholder:text-muted
        focus:border-accent focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] bg-surface border border-hairline
        shadow-[0_1px_3px_rgba(0,0,0,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

/* Status via typographic weight and a small dot — not loud colored badges */
export function StatusDot({ status }: { status: string }) {
  const color =
    status === "done" ? "#30D158" : status === "in_progress" ? "#FF9F0A" : "#C7C7CC";
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted">
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
      {status.replace("_", " ")}
    </span>
  );
}

export function Empty({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="py-16 text-center">
      <p className="text-lg text-ink">{title}</p>
      <p className="mt-1 text-sm text-muted">{hint}</p>
    </div>
  );
}