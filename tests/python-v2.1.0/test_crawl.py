"""Start + poll + cleanup a 2-page crawl against 5 URLs. Reads SGAI_API_KEY from env."""
import time

from scrapegraph_py import MarkdownFormatConfig, ScrapeGraphAI

sgai = ScrapeGraphAI()

urls = [
    "https://example.com",
    "https://scrapegraphai.com",
    "https://example.org",
    "https://www.iana.org/",
    "https://httpbin.org/",
]

for i, u in enumerate(urls, 1):
    start = sgai.crawl.start(u, formats=[MarkdownFormatConfig()], max_pages=2, max_depth=1)
    if start.status != "success" or not start.data:
        print(f"[crawl {i}/5] start failed: {start.error}")
        continue
    cid = start.data.id
    final_status = start.data.status
    for _ in range(15):
        if final_status in ("completed", "failed", "stopped"):
            break
        time.sleep(2)
        g = sgai.crawl.get(cid)
        if g.status == "success" and g.data:
            final_status = g.data.status
        else:
            break
    print(f"[crawl {i}/5] {u} id={cid[:8]} final={final_status}")
    sgai.crawl.delete(cid)
