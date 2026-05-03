"""Verify every Python sample in transition-from-firecrawl.mdx runs against
the live v2 API with scrapegraph-py>=2.1.0.

The guide's pre-2.1.0 wrapper-based snippets (`ScrapeRequest(...)`,
`ExtractRequest(...)`, etc.) raised ValidationError on every call once
2.1.0 switched to direct positional/keyword arguments. This script
exercises the rewritten samples end-to-end.

Reads SGAI_API_KEY from env.
"""
import time

from scrapegraph_py import (
    ScrapeGraphAI,
    MarkdownFormatConfig,
)

sgai = ScrapeGraphAI()


def line(label: str, res):
    print(f"[{label:7}] status={res.status} elapsed_ms={res.elapsed_ms}")


# 1) Scrape → `scrape`
res = sgai.scrape(
    "https://example.com",
    formats=[MarkdownFormatConfig()],
)
line("scrape", res)

# 2) Extract → `extract`
res = sgai.extract(
    "Extract the main heading",
    url="https://example.com",
    schema={"type": "object", "properties": {"title": {"type": "string"}}},
)
line("extract", res)

# 3) Search → `search`
res = sgai.search(
    "best programming languages 2026",
    num_results=3,
)
line("search", res)

# 4) Crawl → `crawl.start` + `crawl.get`
start = sgai.crawl.start(
    "https://example.com",
    max_depth=1,
    max_pages=2,
    include_patterns=["/*"],
)
line("crawl", start)
if start.status == "success":
    # Brief poll so the guide's `crawl.get` snippet is exercised too.
    time.sleep(2)
    status = sgai.crawl.get(start.data.id)
    print(
        f"           crawl.get -> status={status.status} "
        f"job={status.data.status} {status.data.finished}/{status.data.total}"
    )

# 5) Monitor → `monitor.create` + `monitor.activity`
res = sgai.monitor.create(
    "https://example.com",
    "*/30 * * * *",
    name="firecrawl-transition-smoke",
    formats=[MarkdownFormatConfig()],
)
line("monitor", res)
if res.status == "success":
    cron_id = res.data.cron_id
    act = sgai.monitor.activity(cron_id, limit=5)
    print(f"           monitor.activity -> status={act.status}")
    sgai.monitor.delete(cron_id)
    print(f"           cleaned up cron_id={cron_id}")
