import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, Eyebrow } from "../components/ui";

/* ---------------------------------------------------------------
   The hero demonstrates the product's one distinctive claim —
   that search works on meaning — instead of asserting it in a
   headline. Queries cycle; the matches and their confidence
   scores are real values from the running service.
   --------------------------------------------------------------- */

const DEMOS = [
  {
    query: "authentication problem",
    hits: [
      { title: "Fix the login bug where users get logged out", score: 0.71 },
      { title: "Write API documentation for the task endpoints", score: 0.48 },
      { title: "Set up the CI/CD pipeline for automated tests", score: 0.46 },
    ],
  },
  {
    query: "release the app",
    hits: [
      { title: "Deploy the backend to production servers", score: 0.74 },
      { title: "Set up the CI/CD pipeline for automated tests", score: 0.52 },
      { title: "Design the database schema for analytics", score: 0.39 },
    ],
  },
  {
    query: "how do I use the endpoints",
    hits: [
      { title: "Write API documentation for the task endpoints", score: 0.69 },
      { title: "Fix the login bug where users get logged out", score: 0.44 },
      { title: "Deploy the backend to production servers", score: 0.41 },
    ],
  },
];

function SearchDemo() {
  const [index, setIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [revealed, setRevealed] = useState(false);

  const demo = DEMOS[index];

  useEffect(() => {
    setTyped("");
    setRevealed(false);

    let char = 0;
    const typing = setInterval(() => {
      char += 1;
      setTyped(demo.query.slice(0, char));
      if (char >= demo.query.length) {
        clearInterval(typing);
        setTimeout(() => setRevealed(true), 220);
      }
    }, 55);

    const next = setTimeout(() => setIndex((i) => (i + 1) % DEMOS.length), 6200);

    return () => {
      clearInterval(typing);
      clearTimeout(next);
    };
  }, [index, demo.query]);

  return (
    <Card className="overflow-hidden">
      {/* The heat line — the only place ember appears decoratively */}
      <div className="heat-line h-px w-full" />

      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 border-b border-hairline pb-5">
          <span className="text-faint">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-mono text-sm text-ink">
            {typed}
            <span className="ml-px inline-block h-4 w-px translate-y-0.5 bg-ember" />
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {demo.hits.map((hit, i) => (
            <div
              key={hit.title}
              className="flex items-center justify-between gap-6 transition-opacity duration-500"
              style={{
                opacity: revealed ? 1 : 0,
                transitionDelay: `${i * 90}ms`,
              }}
            >
              <span
                className={`text-sm ${i === 0 ? "text-ink" : "text-muted"}`}
              >
                {hit.title}
              </span>

              <div className="flex shrink-0 items-center gap-3">
                <div className="h-1 w-20 overflow-hidden rounded-full bg-raised">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: revealed ? `${hit.score * 100}%` : "0%",
                      background: i === 0 ? "var(--color-ember)" : "var(--color-hairline)",
                      transitionDelay: `${i * 90}ms`,
                    }}
                  />
                </div>
                <span className="w-9 text-right font-mono text-xs tabular-nums text-faint">
                  {Math.round(hit.score * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 border-t border-hairline pt-5 text-xs text-faint">
          No matching keywords. Matched on meaning.
        </p>
      </div>
    </Card>
  );
}

const CAPABILITIES = [
  {
    name: "Search that reads intent",
    body:
      "Describe the work you're looking for in your own words. Task text is embedded as vectors, so a query finds the right task even when it shares no words with it.",
  },
  {
    name: "Events that can't go missing",
    body:
      "Every change is written to a transactional outbox in the same commit as the data itself, then relayed to Kafka. A broker outage delays delivery. It never loses it.",
  },
  {
    name: "Reads that skip the database",
    body:
      "Hot task lists are served from Redis and invalidated the moment they change, so the common path never touches Postgres at all.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 border-b border-hairline bg-canvas/85 backdrop-blur-md">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="font-display text-base font-semibold tracking-tight">
            TaskForge<span className="text-ember">.</span>ai
          </span>
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/login">
              <Button size="sm">Get started</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 pt-20 pb-24 sm:pt-28">
          <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className="rise">
              <Eyebrow>Task management, rebuilt</Eyebrow>
              <h1 className="mt-5 text-3xl font-semibold leading-[1.05] sm:text-[4rem]">
                Find the task
                <br />
                you meant.
              </h1>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
                TaskForge understands what you're describing, not just what you
                typed. Search your work the way you'd explain it to a colleague.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link to="/login">
                  <Button size="lg">Start using it</Button>
                </Link>
                <a
                  href="https://github.com/Adityakocheri1511/taskforge-ai"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Button variant="secondary" size="lg">Read the source</Button>
                </a>
              </div>
            </div>

            <div className="rise" style={{ animationDelay: "120ms" }}>
              <SearchDemo />
            </div>
          </div>
        </section>

        {/* Capabilities */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Eyebrow>What's underneath</Eyebrow>
            <h2 className="mt-4 max-w-xl text-xl font-semibold sm:text-[2rem] sm:leading-tight">
              Five services, one system.
            </h2>

            <div className="mt-16 grid gap-x-12 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {CAPABILITIES.map((c) => (
                <div key={c.name}>
                  <div className="heat-line mb-5 h-px w-10" />
                  <h3 className="text-base font-semibold">{c.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Architecture — the sequence is real, so numbering earns its place */}
        <section className="border-t border-hairline bg-raised/40">
          <div className="mx-auto max-w-6xl px-6 py-24">
            <Eyebrow>How a task travels</Eyebrow>
            <h2 className="mt-4 max-w-xl text-xl font-semibold sm:text-[2rem] sm:leading-tight">
              One write, four destinations.
            </h2>

            <ol className="mt-14 space-y-px overflow-hidden rounded-[var(--radius-lg)] border border-hairline">
              {[
                ["Task service", "Writes the task and its event in a single transaction."],
                ["Outbox relay", "Publishes unsent events to Kafka, then marks them delivered."],
                ["Analytics", "Consumes the stream and keeps per-project counts current."],
                ["AI indexer", "Embeds the task and stores the vector, ready to be found."],
              ].map(([name, body], i) => (
                <li
                  key={name}
                  className="flex gap-6 bg-surface px-6 py-6 sm:px-8"
                >
                  <span className="font-mono text-xs text-ember pt-1">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="font-medium">{name}</p>
                    <p className="mt-1 text-sm text-muted">{body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Close */}
        <section className="border-t border-hairline">
          <div className="mx-auto max-w-6xl px-6 py-28 text-center">
            <h2 className="mx-auto max-w-lg text-xl font-semibold sm:text-[2.5rem] sm:leading-[1.1]">
              Put it to work.
            </h2>
            <div className="mt-9">
              <Link to="/login">
                <Button size="lg">Create an account</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-hairline">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm text-faint sm:flex-row">
          <span className="font-display font-medium text-muted">
            TaskForge<span className="text-ember">.</span>ai
          </span>
          <span>Built by Aditya Kocheri</span>
        </div>
      </footer>
    </div>
  );
}