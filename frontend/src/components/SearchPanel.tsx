import { useState } from "react";
import { Input, Card, Eyebrow } from "./ui";
import { semanticSearch } from "../api/tasks";
import type { SearchHit } from "../types";

/* ---------------------------------------------------------------
   The signature element. A confidence bar makes cosine similarity
   visible, which is the honest way to show the system matched
   meaning rather than words — and it explains the AI service to
   someone who has never heard of an embedding.
   --------------------------------------------------------------- */

const SUGGESTIONS = ["authentication problem", "release the app", "performance issues"];

export default function SearchPanel({
  onBusyChange,
}: {
  onBusyChange?: (busy: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  const run = async (q: string = query) => {
    if (!q.trim()) return;
    setBusy(true);
    setFailed(false);
    onBusyChange?.(true);
    try {
      setHits(await semanticSearch(q.trim()));
    } catch {
      setHits(null);
      setFailed(true);
    } finally {
      setBusy(false);
      onBusyChange?.(false);
    }
  };

  return (
    <section>
      <Eyebrow>Search</Eyebrow>
      <h2 className="mt-3 text-lg font-semibold">Describe what you're looking for</h2>
      <p className="mt-1 text-sm text-muted">
        Matching words aren't required. TaskForge searches on meaning.
      </p>

      <div className="mt-5">
        <Input
          placeholder="Try: authentication problem"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
        />
      </div>

      {!hits && !busy && !failed && (
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => {
                setQuery(s);
                run(s);
              }}
              className="rounded-full border border-hairline bg-surface px-3 py-1.5
                text-xs text-muted transition-colors hover:border-ember hover:text-ink"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {busy && <p className="mt-5 text-sm text-muted">Searching…</p>}

      {failed && (
        <p className="mt-5 text-sm text-danger" role="alert">
          Search is unavailable. Check that the AI service is running on port 8003.
        </p>
      )}

      {hits && !busy && (
        <div className="mt-5">
          {hits.length === 0 ? (
            <p className="text-sm text-muted">
              Nothing matched. Try describing it a different way.
            </p>
          ) : (
            <>
              <div className="space-y-2">
                {hits.map((hit, i) => (
                  <Card key={hit.id} className="px-5 py-4">
                    <div className="flex items-center justify-between gap-6">
                      <span className={`text-sm ${i === 0 ? "text-ink" : "text-muted"}`}>
                        {hit.title}
                      </span>
                      <div className="flex shrink-0 items-center gap-3">
                        <div className="h-1 w-20 overflow-hidden rounded-full bg-raised">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-out"
                            style={{
                              width: `${Math.round(hit.score * 100)}%`,
                              background:
                                i === 0 ? "var(--color-ember)" : "var(--color-hairline)",
                            }}
                          />
                        </div>
                        <span className="w-9 text-right font-mono text-xs tabular-nums text-faint">
                          {Math.round(hit.score * 100)}%
                        </span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <p className="mt-3 text-xs text-faint">
                Confidence is cosine similarity between your query and each task.
              </p>
            </>
          )}
        </div>
      )}
    </section>
  );
}