"use client";

import { useEffect, useRef, useState } from "react";

export type Repo = {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  owner: {
    login: string;
    avatar_url: string;
    html_url: string;
  };
};

export function GitHubRepoFinder() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  async function search(q: string) {
    if (!q.trim()) {
      setRepos([]);
      setError(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=24`
      );
      if (!res.ok) throw new Error(`GitHub API responded with ${res.status}`);
      const data = await res.json();
      setRepos(data.items || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to fetch repositories");
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => search(query), 350);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [query]);

  return (
    <div className="rounded-2xl border border-line bg-ink-900/60 p-5">
      <label className="text-sm font-medium text-white">Search GitHub repositories</label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, topic, or user…"
          className="w-full rounded-lg border border-line bg-ink-950 px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-600 outline-none focus:border-brand-500"
        />
        <button
          onClick={() => search(query)}
          className="btn-gold shrink-0"
        >
          Search
        </button>
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-400">{error}</p>
      )}

      {loading && (
        <p className="mt-4 text-sm text-neutral-400">Searching repositories…</p>
      )}

      {!loading && !error && repos.length > 0 && (
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {repos.map((r) => (
            <a
              key={r.id}
              href={r.html_url}
              target="_blank"
              rel="noreferrer"
              className="card-hover flex flex-col gap-2 rounded-xl border border-line bg-ink-950/60 p-4"
            >
              <div className="flex items-center gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.owner.avatar_url} alt="" className="h-5 w-5 rounded-full" />
                <span className="text-sm font-medium text-brand-400">{r.owner.login}</span>
                <span className="text-xs text-neutral-600">/</span>
                <span className="truncate text-sm font-medium text-white">{r.name}</span>
              </div>
              <p className="line-clamp-2 text-sm text-neutral-400">
                {r.description || "No description"}
              </p>
              <div className="flex items-center gap-4 text-xs text-neutral-500">
                {r.language && (
                  <span className="inline-flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
                    {r.language}
                  </span>
                )}
                <span>★ {r.stargazers_count.toLocaleString()}</span>
                <span>⑂ {r.forks_count.toLocaleString()}</span>
              </div>
            </a>
          ))}
        </div>
      )}

      {!loading && !error && query && repos.length === 0 && (
        <p className="mt-4 text-sm text-neutral-400">No repositories found.</p>
      )}
    </div>
  );
}
