"""Exercise the NEW snippets added to transition-from-firecrawl.mdx in the
detailed rewrite: multi-format scrape, fetchConfig, Pydantic schema in
extract, inline html/markdown extract, search-with-extract, crawl with
JsonFormatConfig, crawl lifecycle (stop/resume/delete), async client.

Reads SGAI_API_KEY from env.
"""
import asyncio
import time

from pydantic import BaseModel, Field
from scrapegraph_py import (
    ScrapeGraphAI,
    AsyncScrapeGraphAI,
    MarkdownFormatConfig,
    HtmlFormatConfig,
    LinksFormatConfig,
    ScreenshotFormatConfig,
    JsonFormatConfig,
    FetchConfig,
)

sgai = ScrapeGraphAI()


def line(label, res):
    err = "" if res.status == "success" else f" error={res.error!r}"
    print(f"[{label:20}] status={res.status} elapsed_ms={res.elapsed_ms}{err}")


# 1) Multi-format scrape
res = sgai.scrape(
    "https://example.com",
    formats=[
        MarkdownFormatConfig(),
        HtmlFormatConfig(mode="reader"),
        LinksFormatConfig(),
        ScreenshotFormatConfig(full_page=True, width=1440, height=900),
    ],
)
line("multi-format scrape", res)
if res.status == "success":
    keys = sorted(res.data.results.keys())
    print(f"                       formats={keys}")

# 2) fetchConfig (js mode, wait, scrolls)
res = sgai.scrape(
    "https://example.com",
    formats=[MarkdownFormatConfig()],
    fetch_config=FetchConfig(mode="js", wait=500, scrolls=1, country="US"),
)
line("fetchConfig js+wait", res)

# 3) Pydantic schema in extract
class Heading(BaseModel):
    title: str = Field(description="Main page heading")

res = sgai.extract(
    "Extract the main heading",
    url="https://example.com",
    schema=Heading.model_json_schema(),
)
line("extract+pydantic", res)
if res.status == "success":
    parsed = Heading.model_validate(res.data.json_data)
    print(f"                       parsed={parsed.title!r}")

# 4) Extract from inline html (no fetch)
res = sgai.extract(
    "Extract the heading text",
    html="<html><body><h1>Hello World</h1></body></html>",
    schema={"type": "object", "properties": {"heading": {"type": "string"}}},
)
line("extract inline html", res)

# 5) Search with inline extraction
res = sgai.search(
    "best programming languages 2026",
    num_results=3,
    prompt="Extract the article title and main argument",
    schema={
        "type": "object",
        "properties": {
            "title": {"type": "string"},
            "main_argument": {"type": "string"},
        },
    },
)
line("search+extract", res)

# 6) Crawl with JsonFormatConfig
start = sgai.crawl.start(
    "https://example.com",
    max_depth=1,
    max_pages=2,
    formats=[
        MarkdownFormatConfig(mode="reader"),
        JsonFormatConfig(
            prompt="Extract the page title",
            schema={"type": "object", "properties": {"title": {"type": "string"}}},
        ),
    ],
)
line("crawl+json format", start)

# 7) Crawl lifecycle: stop on the existing job
if start.status == "success":
    stop = sgai.crawl.stop(start.data.id)
    line("crawl.stop", stop)
    # Don't bother resuming a 2-page demo — just delete
    delete = sgai.crawl.delete(start.data.id)
    line("crawl.delete", delete)

# 8) URL discovery via shallow crawl (LinksFormatConfig only)
disc = sgai.crawl.start(
    "https://example.com",
    max_depth=1,
    max_pages=5,
    max_links_per_page=20,
    formats=[LinksFormatConfig()],
)
line("url-discovery crawl", disc)

# 9) Async client
async def run_async():
    async with AsyncScrapeGraphAI() as a_sgai:
        urls = ["https://example.com", "https://example.org"]
        results = await asyncio.gather(*[
            a_sgai.scrape(u, formats=[MarkdownFormatConfig()]) for u in urls
        ])
        for u, r in zip(urls, results):
            print(f"[async {u:24}] status={r.status} elapsed_ms={r.elapsed_ms}")

asyncio.run(run_async())
