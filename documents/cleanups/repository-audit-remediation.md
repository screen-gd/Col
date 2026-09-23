# Col repository audit remediation

## Objective

Fix the confirmed release, runtime, accessibility, metadata, testing, and dead-code problems found during the repository audit.

Work through the units in order. Finish and verify one unit before starting the next so later changes do not rely on a broken foundation.

## Working rules

- Preserve the current product design and behavior unless a unit explicitly changes them.
- Keep the diff focused on the unit being completed.
- Do not redesign the site while completing maintenance work.
- Use npm as the package manager because `README.md` and `CONTRIBUTING.md` already instruct contributors to use npm.
- Preserve unrelated user changes. Do not reset or overwrite work that appears while this plan is being executed.
- Do not add compatibility wrappers for code that can be deleted cleanly.
- Do not commit or push unless the user explicitly requests it.
- Keep `@webgpu/types`; the shader code and `tsconfig.json` require it.
- Prefer deletion over new abstractions.
- Add or update tests when a change has a stable test seam.

## Baseline findings

The following were confirmed before this plan was written:

- `npm run build` passes.
- `npx tsc --noEmit` passes.
- `node --test` passes under the current Node version after a build.
- `npm audit` reports zero known vulnerabilities.
- `npm ci --dry-run` fails because `package-lock.json` is missing `@webgpu/types`.
- `/libraries?q=react&q=vue` returns HTTP 500.
- The shader test fails under Node 20.20.2 because it imports TypeScript directly.
- Knip reports unused application files and four dependencies used only by dead files.

A clean dependency install must work before any dependency cleanup is considered reliable.

---

## Unit 1: Repair the package-management baseline

### Problems

- `package.json:32` declares `@webgpu/types`.
- `package-lock.json:26-33` does not contain `@webgpu/types`.
- The repository contains both `package-lock.json` and `pnpm-lock.yaml`.
- `pnpm-workspace.yaml` contains release-age exclusions but the contributor documentation uses npm.
- `package.json:2` and the lockfile still name the package `coc` instead of `col`.
- There is no `packageManager` declaration or dedicated type-check/test script.

### Work

1. Rename the package from `coc` to a valid lowercase npm name, preferably `col`.
2. Regenerate `package-lock.json` so it includes `@webgpu/types` and matches `package.json`.
3. Verify no workflow or script depends on pnpm.
4. Remove `pnpm-lock.yaml` and `pnpm-workspace.yaml` after the npm lockfile passes a clean-install check.
5. Add an explicit package-manager version only if the selected npm version is intended to be enforced.
6. Add `typecheck`, `test`, and a combined verification script.

Suggested scripts:

```json
{
  "typecheck": "tsc --noEmit",
  "test": "node --test",
  "check": "npm run typecheck && npm run test && npm run build"
}
```

Adjust the test script only if Unit 2 introduces a required build fixture.

### Completion criteria

- `npm ci` succeeds from a clean dependency state.
- `npm run typecheck` succeeds.
- The package and lockfile use the same valid package name.
- Exactly one supported lockfile remains.
- `git diff --check` passes.

---

## Unit 2: Make the test suite reliable and supported

### Problems

- `package.json` has no `test` script.
- The documented contributor workflow runs only `npm run build`.
- `tests/discovery.test.mjs` reads private `.next/server/app/*.body` files and fails on a clean checkout unless a build ran first.
- The discovery test duplicates route expectations instead of using the route source of truth.
- `components/shader-runtime.test.mjs` imports `shader-runtime.ts` directly and fails under the documented Node.js 20.9+ minimum.
- There is no CI workflow.
- Core search, filtering, local saving, theme behavior, route input, and accessibility flows have no coverage.

### Work

1. Make `components/shader-runtime.test.mjs` compatible with the minimum supported Node version. Transpile the small TypeScript module in the test instead of relying on Node's direct TypeScript loader.
2. Refactor `tests/discovery.test.mjs` so it does not depend on private Next.js build-output paths or run-order state.
3. Prefer testing route functions and registry data directly. Keep a separate production smoke test for rendered routes if needed.
4. Import shared route metadata from its source of truth instead of hard-coding it in the test.
5. Add a CI workflow that installs with `npm ci`, type-checks, tests, and builds.
6. Update `README.md` and `CONTRIBUTING.md` to use the supported verification command.
7. Add focused tests for:
   - repeated and malformed `q` route input;
   - search token matching;
   - stack and use-case filter intersection;
   - sorting;
   - local-save parsing and stale slug reconciliation;
   - registry slug, URL, and taxonomy invariants.

### Completion criteria

- `npm test` succeeds under the current environment.
- The shader test succeeds under Node 20.
- The discovery test succeeds without relying on a previous ad hoc build.
- A clean CI run passes `npm ci`, type-check, tests, and build.
- The documented verification command runs every required check.

---

## Unit 3: Fix route input and saved-library state

### Problems

#### Duplicate query crash

`app/libraries/page.tsx:4-5` types `q` as a string, but Next.js can supply `string[]`. The value reaches `components/DirectoryExplorer.tsx:48`, where `query.toLowerCase()` throws.

Confirmed failure:

```text
/libraries?q=react&q=vue
HTTP 500
TypeError: b.toLowerCase is not a function
```

#### Cross-tab save loss

`components/DirectoryExplorer.tsx:38-45` loads saved slugs once. Each tab then writes its complete stale `Set` at `components/DirectoryExplorer.tsx:60-67`, so one tab can erase another tab's saves.

#### Stale saved slugs

The saved count accepts any string and never checks whether the slug still exists in `libraries`. Removed or renamed entries can inflate the count and produce an empty saved view.

### Work

1. Parse `q` at the route boundary using the smallest boundary type that represents Next.js input.
2. Define one deterministic policy for repeated values, such as accepting the first string.
3. Add a regression test for the confirmed repeated-query URL.
4. Reconcile stored saved slugs with the current registry when loading them.
5. Write saves using the latest local storage value rather than only the component's initial state.
6. Listen for the browser `storage` event so open tabs update their UI.
7. Keep saved state functional for the current session when storage is unavailable.

### Completion criteria

- Repeated `q` parameters return a valid filtered page rather than HTTP 500.
- A removed slug no longer contributes to the saved count.
- Two tabs can save different libraries without erasing each other's changes.
- Regression tests cover the repeated-query and stale-slug cases.

---

## Unit 4: Correct product claims and stale registry data

### Problems

#### Open-source claim

`components/LibraryExplorer.tsx:87-92` displays `100% Open source`, and `components/LibraryExplorer.tsx:115-117` describes every entry as open source.

The registry has no license field. GSAP uses Webflow's proprietary no-charge license, which is not an OSI open-source license. 21st.dev is a marketplace whose entries can have different licenses.

#### Stale entries

- `data/libraries.ts:85-93` uses `Transition.dev` and `https://transition.dev`; the current project is `Transitions.dev` at `https://transitions.dev`.
- `data/libraries.ts:316-324` uses `https://recharts.org`; that address now says the project has moved and points to `https://recharts.github.io/en-US/`.
- Motion at `data/libraries.ts:129-137` omits its first-class Vue target.
- Lucide's description says it works with every framework, while the registry taxonomy cannot represent several official targets.

#### Promotional copy

Several descriptions use subjective claims that conflict with the repository's factual-copy policy.

### Work

1. Remove the hardcoded `100% Open source` percentage and replace it with a factual, supportable label such as `Curated libraries`.
2. Rewrite the hero copy so it does not claim every listed resource is open source.
3. Correct the Transitions.dev name, slug, and canonical URL.
4. Update the Recharts URL to its current canonical documentation.
5. Add Vue to Motion's supported stacks after confirming the official project documentation.
6. Resolve the Lucide mismatch by either narrowing its description to the supported taxonomy or expanding the taxonomy intentionally. Do not claim coverage the filters cannot express.
7. Replace subjective terms such as `trendy`, `powerful`, `industry-standard`, `most popular`, and `most complete` with factual descriptions.
8. Add registry validation for:
   - unique lowercase kebab-case slugs;
   - unique names;
   - non-empty required fields;
   - HTTPS URLs;
   - values drawn from the declared taxonomy;
   - no duplicate values inside stack or use-case arrays.
9. Add a test for these local invariants. Do not add network-dependent link-health checks to the normal test suite.

### Completion criteria

- The site makes no unsupported universal open-source claim.
- Transitions.dev and Recharts resolve to their current canonical projects.
- Motion is discoverable through the Vue filter.
- Registry validation fails on malformed or duplicate metadata.
- Registry descriptions remain factual and do not present unverified popularity or quality claims.

---

## Unit 5: Fix keyboard and screen-reader behavior

### Problems

#### Filter focus

`app/globals.css:496-518` makes focused dropdown items transparent and removes their outline. Keyboard users cannot see the focused option.

#### Search focus

`components/Header.tsx:36-47` and `components/Header.tsx:135-142` navigate to `/#hero-search` but do not focus the search input.

The directory displays a `Ctrl K` hint at `components/FilterBar.tsx:67`, but the shortcut is only implemented by the homepage search component.

#### Wrong category semantics

`components/FilterBar.tsx:86-90` renders category filters as Radix Tabs without tab panels. They are filters, not tabs.

#### Result announcements

`components/DirectoryExplorer.tsx:89-130` changes result counts and empty states without a live status announcement.

#### Focus loss

Activating Clear unmounts the focused Clear button, dropping focus to the document body.

#### Mobile hash navigation

On the homepage, same-page hash links do not change `pathname`, so the mobile menu can remain open after navigation.

### Work

1. Give focused and highlighted dropdown items a visible background or outline in both themes.
2. Make the header search link and `/` shortcut focus the homepage search input after navigation.
3. Implement the advertised `Ctrl K`/`Cmd K` behavior on the directory search input.
4. Replace the category Tabs pattern with controls whose ARIA semantics match filtering.
5. Add a concise live status for the current result count and empty state.
6. Move focus to a stable control after Clear removes the focused button.
7. Close the mobile menu for every navigation action, including same-page hash links.
8. Mark fragment-only navigation appropriately without incorrectly using `aria-current="page"` for a section that is not a route.

### Completion criteria

- Every interactive filter has a visible keyboard-focus state.
- Search links and advertised shortcuts focus the search input.
- Category filters expose correct accessible semantics.
- Search result changes are announced.
- Triggering Clear or mobile navigation never leaves focus on a removed control or an open overlay.
- Keyboard checks are added where the project has a stable browser-test seam.

---

## Unit 6: Make theme behavior resilient

### Problems

- The initialization script in `app/layout.tsx:40-42` catches storage errors without applying the system theme fallback.
- `components/ThemeToggle.tsx:25-39` changes root classes before `localStorage.setItem`.
- If storage throws, React state is not updated, leaving the control label and icon stale.
- View-transition state can remain inconsistent if the theme callback throws.

### Work

1. Separate reading storage, resolving the preferred theme, and applying the theme.
2. Fall back to `prefers-color-scheme` when storage is unavailable.
3. Apply the UI state even when persistence fails.
4. Keep persistence failure session-local rather than allowing it to corrupt theme state.
5. Ensure a rejected view transition cannot leave the toggle permanently blocked.
6. Add focused tests for the pure theme-resolution and persistence-failure behavior where possible.

### Completion criteria

- The root theme, React state, icon, and accessible label always agree.
- Blocked storage does not break toggling.
- A failed view transition does not lock future toggles.
- The system theme is respected when no saved preference exists.

---

## Unit 7: Remove dead components and dependencies

### Dead component files

Confirm imports once more immediately before deletion, then remove:

- `components/AsciiFluid.tsx`
- `components/CategoryBento.tsx`
- `components/GlareHover.tsx`
- `components/HeroLogoTrail.tsx`
- `components/Marquee.tsx`
- `components/RevealText.tsx`
- `components/ui/border-beam-search.tsx`
- `components/ui/glowing-effect.tsx`
- `components/ui/hover-border-gradient.tsx`
- `components/ui/magnet.tsx`
- `components/ui/select.tsx`
- `components/ui/separator.tsx`
- `components/ui/star-border.tsx`

`CategoryBento` and `GlareHover` are one dead subtree and should be removed together.

### Dead dependencies

After deleting the files that import them, remove:

- `@gsap/react`
- `gsap`
- `border-beam`
- `motion`

Regenerate the selected lockfile after dependency removal.

### Dead CSS

Remove selectors used only by deleted components, including:

- old `gooey-*` and `hero-search-surface` rules;
- unused hero background modifiers;
- unused `.delay-3`;
- marquee-specific rules;
- any CSS made unreferenced by the deleted components.

Use source searches after deletion to confirm each selector is unused.

### Completion criteria

- The listed files no longer exist.
- No route, component, test, configuration, or documented pattern references them.
- The four dead dependencies are absent from `package.json` and the lockfile.
- CSS made dead by the removals is also removed.
- Type-check, tests, build, and route smoke tests pass after dependency regeneration.

---

## Unit 8: Consolidate utilities and prune generated dead exports

### Problems

The project has a local `cn` implementation in `lib/utils.ts`, while active generated components import the separate `cn` package.

Unused generated exports include `CardDescription`, `TabsContent`, several dropdown-menu exports, and public variant exports that are only used inside their own files.

`components/ui/border-beam-search.tsx` is a pure package re-export wrapper and is removed in Unit 7.

Hostname parsing is duplicated across four locations.

### Work

1. Confirm the local and package `cn` implementations are behaviorally equivalent for current usage.
2. Replace active imports of the external `cn` package with `@/lib/utils`.
3. Remove the external `cn` package and regenerate the lockfile.
4. Remove unused generated components and exports only where the application does not intentionally expose a reusable component API.
5. Keep conventional shadcn exports if the repository is later declared as a component distribution package. The current product is an application, so unused local surface should be pruned.
6. Add one small hostname helper only if it centralizes meaningful invalid-URL and `www.` behavior across all callers.

Do not merge the WebGL and WebGPU shader implementations. Their backend-specific rendering logic should remain separate.

### Completion criteria

- One `cn` implementation remains.
- Type-check, tests, build, and route smoke tests pass.
- The hostname helper has focused tests for valid, invalid, and `www.` URLs if it is introduced.
- The shader backends remain independently understandable and testable.

---

## Unit 9: Resolve dependency updates conservatively

### Available updates found during the audit

- Next.js `16.3.5` to `16.3.6`
- border-beam `1.4.0` to `1.4.1`, unless removed with dead code
- motion `13.4.0` to `13.4.2`, unless removed with dead code
- TypeScript `5.9.3` to `7.0.2`
- `@types/node` `24.13.6` to `26.6.2`

### Work

1. Complete dead dependency removal first.
2. Apply relevant patch updates through the canonical lockfile.
3. Evaluate TypeScript 7 and Node 26 type updates as separate compatibility work.
4. Keep the documented Node minimum and installed type packages aligned.
5. Do not perform major upgrades inside the cleanup branch without compatibility evidence.

### Completion criteria

- `npm outdated` contains no relevant patch update that can be applied safely.
- Major-version upgrades are either completed with full verification or explicitly left out.
- The build, tests, type-check, and route smoke tests pass after lockfile changes.
- `npm audit` still reports no known vulnerabilities.

---

## Unit 10: Align documentation and UI consistency

### Problems

- `README.md:34` and `PRODUCT.md:15` promise comparison, but the application has no comparison feature.
- `README.md:160-169` omits `lib/` and `tests/`.
- `/libraries` omits the site footer used by the other content routes.
- The library request form does not collect all metadata requested by the documentation.
- Sponsors is a hash section, not a page route, so it should not use route-level active-state logic.

### Work

1. Use the smallest truthful change: describe current behavior as search, filter, sort, save, and open unless comparison is explicitly approved as a new feature.
2. Keep dedicated library pages labeled as future work unless their routes and data model are implemented.
3. Add `lib/` and `tests/` to the project structure.
4. Add `SiteFooter` to `/libraries` if the route is intended to have the same site chrome as the other content pages.
5. Align the library request form with the documented required metadata, or simplify the documentation to match the form.
6. Update screenshots or product copy only where the completed units changed actual behavior.

### Completion criteria

- README and product documentation describe only shipped behavior as current.
- Future features remain clearly marked as future work.
- All top-level content routes use consistent site chrome.
- The contribution form collects every field required by the contributor documentation.

---

## Unit 11: Final low-risk polish

### Problems

- Light-mode `.library-subtle` text at `app/globals.css:547` is approximately 3.8:1 contrast on white and is used at 10-11px.
- `components/LibraryCard.tsx:51-52` renders `1 stacks` and `1 uses`.
- The mobile directory's advertised keyboard hint should match actual behavior after Unit 5.
- Sponsors active-state behavior should reflect fragment navigation without pretending it is a separate page.

### Work

1. Increase small metadata text contrast to at least 4.5:1 in light mode.
2. Add correct singular and plural labels for stack and use-case counts.
3. Re-run a dead-code and unused-export scan after all behavior changes.
4. Review unreferenced public brand assets separately from application code. Delete abandoned design explorations only when their purpose is clear.
5. Re-run contrast, keyboard, and responsive checks on the final artifact.

### Completion criteria

- Small text meets WCAG AA contrast requirements.
- Counts read naturally for one and multiple values.
- The final dead-code scan contains no unexplained application files or dependencies.
- No public asset is deleted solely because it is not referenced by the application.

---

## Final verification gate

Run the repository's supported verification command after every unit. Before declaring the remediation complete, run the equivalent of:

```bash
npm ci
npm run typecheck
npm test
npm run build
npm audit
npx --yes knip --reporter compact
git diff --check
```

Then start the production server and smoke-test:

- `/`
- `/libraries`
- `/libraries?q=react`
- `/libraries?q=react&q=vue`
- `/docs`
- `/contributors`
- `/robots.txt`
- `/sitemap.xml`
- `/llms.txt`

Required outcomes:

- Every route returns the expected status.
- Repeated `q` parameters return a valid page.
- Search, category, stack, use-case, sort, clear, and saved-library flows work.
- Light and dark themes remain usable when storage is blocked.
- Keyboard focus is visible and search shortcuts focus the input.
- The final dependency audit has no known vulnerabilities.
- Every remaining warning from Knip is explained as framework convention, test discovery, public API surface, or an accepted follow-up.
- `git status` shows only intended changes.
- The final response lists changed files, verification evidence, remaining risks, and anything intentionally deferred.

## Explicitly deferred work

Do not add these unless the user requests a new product feature after the cleanup is complete:

- Side-by-side library comparison
- Dedicated library detail routes
- Agent setup prompts
- Expanded library metadata beyond what the cleanup requires
- Public component-library packaging
- Visual redesign
- Additional shader abstractions

Keeping these deferred preserves the cleanup's focus and prevents documentation promises from turning into unrelated implementation work.
