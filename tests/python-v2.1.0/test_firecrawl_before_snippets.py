"""Verify the Firecrawl 'Before' snippets in transition-from-firecrawl.mdx
actually run against the live Firecrawl API and return the documented
attributes (doc.markdown, started.id, etc.).

Reads FIRECRAWL_API_KEY from env.
"""
import os
import time

from firecrawl import Firecrawl

fc = Firecrawl(api_key=os.environ["FIRECRAWL_API_KEY"])


def ok(label, cond, detail=""):
    mark = "OK " if cond else "FAIL"
    print(f"[{mark}] {label} {detail}")


# 1) Scrape — guide claims: fc.scrape(url, formats=["markdown"]) → doc.markdown
try:
    doc = fc.scrape("https://example.com", formats=["markdown"])
    md = getattr(doc, "markdown", None)
    ok("scrape", isinstance(md, str) and len(md) > 0, f"len(markdown)={len(md) if md else 0}")
except Exception as e:
    ok("scrape", False, f"{type(e).__name__}: {e}")

# 2) Extract — guide claims: fc.extract(urls=[...], prompt=..., schema=...)
try:
    result = fc.extract(
        urls=["https://example.com"],
        prompt="Extract the main heading",
        schema={"type": "object", "properties": {"title": {"type": "string"}}},
    )
    data = getattr(result, "data", None)
    ok("extract", data is not None, f"data={data!r}")
except Exception as e:
    ok("extract", False, f"{type(e).__name__}: {e}")

# 3) Search — guide claims: fc.search(query=..., limit=5)
try:
    hits = fc.search(query="best programming languages 2026", limit=3)
    # hits should be iterable / have results
    web = getattr(hits, "web", None) or getattr(hits, "data", None) or hits
    ok("search", web is not None, f"type={type(hits).__name__}")
except Exception as e:
    ok("search", False, f"{type(e).__name__}: {e}")

# 4) Crawl (non-blocking) — guide claims: fc.start_crawl(...).id then fc.get_crawl_status(id)
try:
    started = fc.start_crawl("https://example.com", limit=2)
    job_id = getattr(started, "id", None)
    ok("start_crawl", isinstance(job_id, str), f"id={job_id}")
    if job_id:
        time.sleep(2)
        status = fc.get_crawl_status(job_id)
        st = getattr(status, "status", None)
        ok("get_crawl_status", st is not None, f"status={st}")
except Exception as e:
    ok("crawl", False, f"{type(e).__name__}: {e}")
