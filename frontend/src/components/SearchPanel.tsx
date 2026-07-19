import { useState } from "react";
import { Input, Card } from "./ui";
import { semanticSearch } from "../api/tasks";
import type { SearchHit } from "../types";

export default function SearchPanel() {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<SearchHit[] | null>(null);
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!query.trim()) return;
    setBusy(true);
    try {
      setHits(await semanticSearch(query.trim()));
    } catch {
      setHits([]);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section>
      <h2 className="text-xl font-semibold">Search by meaning</h2>
      <p className="mt-1 text-sm text-muted">
        Describe what you're looking for. Matching words aren't required.
      </p>

      <div className="mt-4">
        <Input
          placeholder="Try: authentication problem"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
        />
      </div>

      {busy && <p className="mt-4 text-sm text-muted">Searching…</p>}

      {hits && !busy && (
        <div className="mt-4 space-y-2">
          {hits.length === 0 ? (
            <p className="text-sm text-muted">Nothing matched. Try describing it differently.</p>
          ) : (
            hits.map((hit) => (
              <Card key={hit.id} className="px-5 py-4">
                <div className="flex items-center justify-between gap-6">
                  <span className="text-sm">{hit.title}</span>
                  {/* The signature: a quiet bar showing semantic confidence */}
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="h-1 w-16 overflow-hidden rounded-full bg-canvas">
                      <div
                        className="h-full rounded-full bg-accent transition-all duration-500"
                        style={{ width: `${Math.round(hit.score * 100)}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-xs tabular-nums text-muted">
                      {Math.round(hit.score * 100)}%
                    </span>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </section>
  );
}