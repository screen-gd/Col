# Contributing to Col

Thanks for helping make UI libraries easier to discover.

## Before you start

- Search existing [issues](https://github.com/screen-gd/Col/issues) and [pull requests](https://github.com/screen-gd/Col/pulls).
- Use an issue form for a library request, feature request, or bug report.
- Keep each issue and pull request focused on one outcome.
- For a larger product or design change, open an issue before implementation.

## Local setup

```bash
git clone https://github.com/screen-gd/Col.git
cd Col
npm install
npm run dev
```

Run `npm run check` before submitting changes.

## Add a library

Add one object to the `libraries` array in [`data/libraries.ts`](data/libraries.ts).

Checklist:

- Use the official project name and canonical URL.
- Use a unique lowercase kebab-case `slug`.
- Write a factual one-sentence description.
- Select existing category, stack, and use-case values where possible.
- Add only useful search tags; do not repeat every field.
- Do not add affiliate, tracking, or shortened URLs.
- Confirm the project is publicly accessible and actively useful.

If a new category or stack is genuinely required, explain why in the pull request.

## Fix a bug or add a feature

- Follow the existing TypeScript and component patterns.
- Avoid `any` and unrelated refactors.
- Preserve light mode, dark mode, keyboard access, and reduced-motion behavior.
- Keep copy short and specific.
- Update comments and documentation affected by the change.
- Add a focused test when the behavior has a stable test seam.

## Pull requests

Use a descriptive title, such as:

- `Add Ark UI to the directory`
- `Fix stack filter query handling`
- `Add dedicated library detail route`

In the description, explain what changed, why it changed, and how it was verified. Add screenshots for visible interface changes.

Reviewers may request metadata corrections, a smaller scope, accessibility fixes, or links to official sources before merging.
