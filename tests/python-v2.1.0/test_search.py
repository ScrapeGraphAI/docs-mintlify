"""Search 5 queries with scrapegraph-py>=2.1.0. Reads SGAI_API_KEY from env."""
import time

from scrapegraph_py import ScrapeGraphAI

sgai = ScrapeGraphAI()

queries = [
    "best programming languages 2025",
    "latest AI research breakthroughs",
    "python web scraping libraries",
    "top e-commerce platforms",
    "climate change recent news",
]

for i, q in enumerate(queries, 1):
    res = sgai.search(q, num_results=3)
    n = len(res.data.results) if res.status == "success" and res.data else 0
    print(f"[search {i}/5] {q!r} -> status={res.status} results={n} elapsed_ms={res.elapsed_ms}")
    time.sleep(0.5)
