import { GitHubRepoFinder } from "@/components/github-repo-finder";

export const metadata = {
  title: "GitHub Repository Finder — Dev Studio",
};

export default function GitHubFinderPage() {
  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="mb-8">
        <span className="eyebrow">github.dev.tools</span>
        <h1 className="serif mt-3 text-3xl font-semibold tracking-tight text-white">
          GitHub Repository Finder
        </h1>
        <p className="mt-2 max-w-2xl text-neutral-400">
          Discover public repositories across GitHub. Search by name, topic, or owner to find
          interesting projects, libraries, and tools.
        </p>
      </div>

      <GitHubRepoFinder />
    </main>
  );
}
