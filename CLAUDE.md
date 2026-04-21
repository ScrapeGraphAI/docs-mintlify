# Project instructions

This is the ScrapeGraphAI Mintlify documentation repo. Code snippets in the docs are what users copy-paste, so they must actually work.

## Testing generated code

When you write or modify a code example in the docs (Python, JavaScript/TypeScript, curl, etc.), run it before committing:

- Execute the snippet end-to-end against the real SDK/API it documents. Don't rely on "it looks right" — types, import paths, and API shapes drift.
- If the snippet needs an API key or external service that isn't available locally, say so explicitly instead of claiming it works. Ask the user to run it, or mock only the network boundary and note what was mocked.
- If you change shared setup (install commands, auth, client construction), re-test at least one downstream snippet that depends on it.
- Prefer the SDK versions already pinned in existing snippets. If you bump a version, verify the new version still works with surrounding examples.

## PR descriptions must include proof

When you open a PR that adds or changes code in the docs, include evidence the code runs. In the PR body, under a `## Verification` section, show:

- The exact command(s) run (e.g. `python examples/extract.py`, `node snippet.mjs`, `curl ...`).
- The output — or a trimmed, representative excerpt if it's long. Paste real output in a fenced block, don't paraphrase.
- The SDK version / runtime used (e.g. `scrapegraph-py>=2.1.0`, `node 20.11`).
- If any snippet could not be executed, list it and say why (e.g. "requires paid-tier endpoint").

No verification section = the PR isn't ready. This applies to new snippets and to edits that change behavior; pure prose or typo PRs are exempt.
