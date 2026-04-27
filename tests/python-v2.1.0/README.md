# Python SDK v2.1.0 — Endpoint Verification

These scripts back the `sdks/python.mdx` refresh. Each exercises one
endpoint of `scrapegraph-py>=2.1.0` five or more times against the live
v2 API and prints `status` + `elapsed_ms` per call.

## How to run

```bash
python3 -m venv venv
./venv/bin/pip install "scrapegraph-py>=2.1.0"
export SGAI_API_KEY="sgai-..."     # your key

./venv/bin/python test_scrape.py
./venv/bin/python test_extract.py
./venv/bin/python test_search.py
./venv/bin/python test_utilities.py   # credits + health
./venv/bin/python test_crawl.py
./venv/bin/python test_monitor.py
```

## Results (2026-04-21, sdk 2.1.0)

Every run was `status=success` on every call. Captured output is in
[`results.txt`](./results.txt). Summary:

| Endpoint        | Calls | Success | Notes                                               |
| --------------- | ----- | ------- | --------------------------------------------------- |
| `scrape`        | 5     | 5       | 5 distinct URLs, `MarkdownFormatConfig`             |
| `extract`       | 5     | 5       | 5 URLs × distinct prompts, `json_data` populated    |
| `search`        | 5     | 5       | `num_results=3`, 2–3 hits per query                 |
| `credits`       | 5     | 5       | `remaining` / `used` returned                       |
| `health`        | 5     | 5       | `status=ok`                                         |
| `crawl`         | 5     | 5       | `max_pages=2, max_depth=1`, polled to `completed`   |
| `monitor`       | 5     | 5       | create → delete lifecycle, `cron_id` returned       |
