---
name: pre-main-push
description: Use before pushing to main. Blocks direct pushes to main - instead prompts the user for a ScrapeGraph API key, tests the chosen endpoint against 5 different websites, and only then opens a PR. Trigger when the user says "push to main", "merge to main", or invokes /pre-main-push directly.
---

# Pre-main push gate

This skill enforces the rule: **never push directly to `main`**. Before any change lands on `main`, the agent must (1) collect an API key from the user, (2) verify the ScrapeGraph endpoint works against 5 different real websites, and (3) open a pull request instead of pushing.

If any step fails, STOP. Do not push, do not open the PR. Report the failure and wait for the user.

## Step 1 — Ask for the API key (ALWAYS FIRST)

Do this before anything else, even before checking git state. Do NOT proceed without a key.

Ask the user:

> I need your ScrapeGraph API key to validate the endpoint before opening the PR. Please paste it here (it will only be used for this session and will not be committed).

Rules:
- Never read the key from `.env`, shell history, or any file silently — the user must paste it explicitly in this turn.
- Never log, print, echo, or write the key to any file, including commit messages, PR descriptions, or test output.
- Store it only in an environment variable for the current shell invocations: `SGAI_API_KEY=<pasted value>`.
- If the user refuses or doesn't provide one, abort the skill and tell them the push is blocked.

## Step 2 — Pick the endpoint to test

Ask the user which v2 endpoint to validate against. The current v2 surface (per `transition-from-v1-to-v2.mdx` in this repo) is:

- **`scrape`** — raw page fetch with output formats (e.g. `format="markdown"`). Replaces v1 `markdownify`.
- **`extract`** — structured extraction from a URL with a natural-language prompt. Replaces v1 `smartscraper`.
- **`search`** — web search + extraction. Replaces v1 `searchscraper`.
- **`crawl.start`** — multi-page async crawl (poll with `crawl.get`). Replaces v1 `smartcrawler`.
- **`monitor.create`** (and related) — monitoring.

Default: `extract`. If the user names a v1 endpoint (`smartscraper`, `searchscraper`, `markdownify`, `smartcrawler`, `agenticscraper`, `sitemap`), translate it to the v2 equivalent and confirm with them before running.

REST host for v2 is `https://v2-api.scrapegraphai.com/api/<endpoint>` — note this is a **different subdomain** from v1 (`https://api.scrapegraphai.com/v1/...`). Don't mix them.

## Step 3 — Test against 5 different websites

Run the chosen endpoint against these 5 URLs (diverse domains, stable, safe to hit):

1. `https://example.com`
2. `https://news.ycombinator.com`
3. `https://en.wikipedia.org/wiki/Web_scraping`
4. `https://scrapegraphai.com`
5. `https://httpbin.org/html`

Use a short inline script (do NOT commit it — run it from a temp path or stdin). v2 SDK shape for `extract`:

```bash
SGAI_API_KEY="$SGAI_API_KEY" python3 - <<'PY'
import os, sys
from scrapegraph_py import ScrapeGraphAI, ExtractRequest

urls = [
    "https://example.com",
    "https://news.ycombinator.com",
    "https://en.wikipedia.org/wiki/Web_scraping",
    "https://scrapegraphai.com",
    "https://httpbin.org/html",
]
sgai = ScrapeGraphAI()  # reads SGAI_API_KEY from env
failures = []
for u in urls:
    try:
        res = sgai.extract(ExtractRequest(
            url=u,
            prompt="Summarize the page in one sentence.",
        ))
        if getattr(res, "status", None) != "success":
            raise RuntimeError(f"status={getattr(res, 'status', '?')}")
        print(f"OK  {u}")
    except Exception as e:
        print(f"FAIL {u} :: {e}")
        failures.append(u)
sys.exit(1 if failures else 0)
PY
```

For other v2 endpoints, swap the method and request class:

| endpoint | method | request class (example) |
|---|---|---|
| `scrape` | `sgai.scrape(ScrapeRequest(url=..., formats=[MarkdownFormatConfig()]))` | `ScrapeRequest`, `MarkdownFormatConfig` |
| `extract` | `sgai.extract(ExtractRequest(url=..., prompt=...))` | `ExtractRequest` |
| `search` | `sgai.search(SearchRequest(query=..., prompt=...))` | `SearchRequest` |
| `crawl.start` | `sgai.crawl.start(CrawlStartRequest(url=..., ...))` then poll `crawl.get` | `CrawlStartRequest` |

Before running: confirm the exact method/request-class names against the installed `scrapegraph_py >= 2.x` version (the v2 SDK). Field names (`url`, `prompt`) replaced v1's (`website_url`, `user_prompt`) — do not mix them. If the user named a v1 endpoint, translate per the mapping in Step 2 and confirm.

Pass criteria: **all 5 must succeed**. If any fails, abort — do NOT open the PR. Show the user which URLs failed and why.

Do not paste the API key into any tool output, commit message, or PR body. Reference it only via `$SGAI_API_KEY`.

## Step 4 — Open a PR (never push to main)

Only if step 3 passed with 5/5:

1. If the current branch is `main`, create a feature branch first:
   - `git checkout -b <username>/<type>/<short-description>` (see `gh-pr.md` skill for branch conventions)
   - Move the commits off `main` — do NOT push them to `origin/main`.
2. Push the feature branch: `git push -u origin <branch>`
3. Open the PR with `gh pr create`. In the PR body, include a short "Validation" section stating:
   > Endpoint `<name>` tested against 5 live websites — all passed. API key supplied by user at PR creation time (not stored).
   Do not include the key itself or any response data that might contain it.
4. After the PR is open, post the per-URL test results as a PR comment with `gh pr comment <number> --body ...`. Include one line per URL with status and `elapsed_ms` (and response key names if useful), e.g.:
   ```
   [extract 1/5] https://example.com -> status=success elapsed_ms=534 keys=['page_title', 'main_heading']
   ```
   Never paste the API key, request headers, raw response bodies, or any field that might echo the key. If the endpoint returns content that could contain user data, summarize (keys only) instead of dumping the payload.

Defer to the `creating-pr` skill (`gh-pr.md`) for PR title/body formatting and branch naming conventions.

## Hard stops

Abort the skill and report to the user if any of these are true:

- The user did not provide an API key.
- Any of the 5 test URLs failed.
- The current branch is `main` and there are uncommitted or unpushed changes that would require a force-push to move.
- `gh` is not authenticated (`gh auth status` fails).

Never bypass these checks with `--force`, `--no-verify`, or by pushing directly to `origin/main`.
