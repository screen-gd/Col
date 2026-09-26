import { Effect, Schema } from "effect";

const Contributor = Schema.Struct({
  id: Schema.Number,
  login: Schema.String,
  avatar_url: Schema.String,
  html_url: Schema.String,
  contributions: Schema.Number,
  type: Schema.String,
});

const Contributors = Schema.Array(Contributor);

export type GitHubContributor = Schema.Schema.Type<typeof Contributor>;

/** Fetches every contributor page and returns an empty list when GitHub data is unavailable or invalid. */
export function getContributors(request: typeof fetch = fetch): Promise<GitHubContributor[]> {
  const load = Effect.gen(function* () {
    const contributors: GitHubContributor[] = [];

    for (let page = 1; ; page += 1) {
      const response = yield* Effect.tryPromise(() =>
        request(`https://api.github.com/repos/screen-gd/Col/contributors?per_page=100&page=${page}`, {
          headers: { Accept: "application/vnd.github+json", "User-Agent": "Col-directory" },
          next: { revalidate: 3600 },
        }),
      );

      if (!response.ok) return yield* Effect.fail(new Error(`GitHub contributors returned ${response.status}`));

      const payload: unknown = yield* Effect.tryPromise(() => response.json());
      const batch = yield* Schema.decodeUnknown(Contributors)(payload);
      contributors.push(...batch);
      if (batch.length < 100) break;
    }

    return contributors.filter((contributor) => contributor.type === "User");
  });

  return Effect.runPromise(load.pipe(Effect.catchAll((error) => Effect.sync(() => {
    console.warn("Unable to load GitHub contributors", error);
    return [] as GitHubContributor[];
  }))));
}
