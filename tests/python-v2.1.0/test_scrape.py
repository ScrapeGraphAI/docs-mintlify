"""Scrape 5 distinct URLs with scrapegraph-py>=2.1.0. Reads SGAI_API_KEY from env."""
import time

from scrapegraph_py import MarkdownFormatConfig, ScrapeGraphAI

sgai = ScrapeGraphAI()

urls = [
    "https://example.com",
    "https://scrapegraphai.com",
    "https://httpbin.org/html",
    "https://www.iana.org/",
    "https://example.org",
]

for i, u in enumerate(urls, 1):
    res = sgai.scrape(u, formats=[MarkdownFormatConfig()])
    md = ""
    if res.status == "success":
        md = (res.data.results.get("markdown", {}) or {}).get("data") or ""
        if isinstance(md, list):
            md = md[0] if md else ""
    print(f"[scrape {i}/5] {u} -> status={res.status} len={len(md)} elapsed_ms={res.elapsed_ms}")
    time.sleep(0.5)
