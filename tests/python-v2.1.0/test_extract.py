"""Extract against 5 URLs with scrapegraph-py>=2.1.0. Reads SGAI_API_KEY from env."""
import time

from scrapegraph_py import ScrapeGraphAI

sgai = ScrapeGraphAI()

cases = [
    ("https://example.com",       "Extract the page title and main heading"),
    ("https://scrapegraphai.com", "What does this company do in one sentence?"),
    ("https://www.iana.org/",     "Extract the main purpose of this organization"),
    ("https://example.org",       "Extract title and description"),
    ("https://httpbin.org/html",  "Summarize the page content in one line"),
]

for i, (u, p) in enumerate(cases, 1):
    res = sgai.extract(p, url=u)
    j = res.data.json_data if res.status == "success" and res.data else None
    keys = list(j.keys()) if isinstance(j, dict) else type(j).__name__
    print(f"[extract {i}/5] {u} -> status={res.status} elapsed_ms={res.elapsed_ms} keys={keys}")
    time.sleep(0.5)
