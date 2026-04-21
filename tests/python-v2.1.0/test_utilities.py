"""Call credits() + health() 5 times each. Reads SGAI_API_KEY from env."""
import time

from scrapegraph_py import ScrapeGraphAI

sgai = ScrapeGraphAI()

for i in range(1, 6):
    c = sgai.credits()
    h = sgai.health()
    remaining = c.data.remaining if c.status == "success" and c.data else "?"
    used = c.data.used if c.status == "success" and c.data else "?"
    h_status = h.data.status if h.status == "success" and h.data else "?"
    print(
        f"[utils {i}/5] credits.status={c.status} remaining={remaining} used={used}"
        f" | health.status={h.status} service={h_status}"
    )
    time.sleep(0.3)
