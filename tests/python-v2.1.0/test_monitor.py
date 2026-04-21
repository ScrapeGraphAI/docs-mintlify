"""Create + delete 5 monitors. Reads SGAI_API_KEY from env."""
from scrapegraph_py import MarkdownFormatConfig, ScrapeGraphAI

sgai = ScrapeGraphAI()

urls = [
    "https://example.com",
    "https://example.org",
    "https://www.iana.org/",
    "https://httpbin.org/html",
    "https://scrapegraphai.com",
]

created = []
for i, u in enumerate(urls, 1):
    res = sgai.monitor.create(
        u,
        "0 * * * *",
        name=f"doc-test-monitor-{i}",
        formats=[MarkdownFormatConfig()],
    )
    if res.status != "success" or not res.data:
        print(f"[monitor {i}/5] create failed: {res.error}")
        continue
    cron_id = res.data.cron_id
    created.append(cron_id)
    print(f"[monitor {i}/5] created id={cron_id[:8]} interval={res.data.interval}")

for cid in created:
    sgai.monitor.delete(cid)
print(f"Cleaned up {len(created)} monitors")
