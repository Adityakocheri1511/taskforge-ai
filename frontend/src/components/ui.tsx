import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";

/* ---------------------------------------------------------------
   Primitives. Every screen composes from these — nothing styles
   itself ad hoc, which is what keeps the UI coherent as it grows.
   --------------------------------------------------------------- */

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-[var(--radius-md)] " +
    "font-medium transition-all duration-150 disabled:opacity-40 " +
    "disabled:cursor-not-allowed active:scale-[0.98]";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary: "bg-ink text-canvas hover:bg-[#2C2825]",
    secondary: "bg-surface text-ink border border-hairline hover:bg-raised",
    ghost: "text-muted hover:text-ink",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export function Input({ className = "", ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-[var(--radius-md)] border border-hairline bg-surface
        px-4 py-3 text-base text-ink placeholder:text-faint
        focus:border-ember focus:outline-none transition-colors ${className}`}
      {...props}
    />
  );
}

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-[var(--radius-lg)] bg-surface border border-hairline
        ${hover ? "transition-shadow hover:shadow-[0_2px_12px_rgba(28,25,23,0.06)]" : ""}
        ${className}`}
    >
      {children}
    </div>
  );
}

/* Status reads through weight and a small mark, not loud colour blocks */
export function StatusMark({ status }: { status: string }) {
  const map: Record<string, { color: string; label: string }> = {
    done: { color: "var(--color-done)", label: "Done" },
    in_progress: { color: "var(--color-active)", label: "In progress" },
    todo: { color: "var(--color-faint)", label: "To do" },
  };
  const s = map[status] ?? map.todo;

  return (
    <span className="inline-flex items-center gap-2 text-xs text-muted whitespace-nowrap">
      <span
        className="h-1.5 w-1.5 rounded-full transition-colors"
        style={{ background: s.color }}
      />
      {s.label}
    </span>
  );
}

/* An empty screen is an invitation to act, not a dead end */
export function Empty({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: ReactNode;
}) {
  return (
    <div className="py-20 text-center">
      <p className="text-lg font-medium">{title}</p>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">{hint}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function Spinner({ label = "Loading" }: { label?: string }) {
  return (
    <p className="py-16 text-center text-sm text-muted" role="status">
      {label}…
    </p>
  );
}

/* Small caps label used to head sections — structural, not decorative */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium uppercase tracking-[0.14em] text-faint">
      {children}
    </p>
  );
}
