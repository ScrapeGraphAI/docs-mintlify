"""Verify Pydantic-derived JSON schemas with scrapegraph-py>=2.1.0.

The SDK's `schema=` parameter expects a JSON Schema dict. A Pydantic
BaseModel produces one via `MyModel.model_json_schema()`, so the same
class can both describe the desired shape and validate the response on
the client side. This script exercises that flow against the live v2 API
for `extract`, `scrape` (with `JsonFormatConfig`), and `search`.

Reads SGAI_API_KEY from env.
"""
from pydantic import BaseModel, Field

from scrapegraph_py import JsonFormatConfig, ScrapeGraphAI


class CompanyInfo(BaseModel):
    company_name: str = Field(description="Name of the company")
    tagline: str | None = Field(default=None, description="Tagline if present")
    features: list[str] = Field(default_factory=list, description="Listed features")


class LanguageSummary(BaseModel):
    language: str
    reason: str


class TopLanguages(BaseModel):
    languages: list[LanguageSummary]


sgai = ScrapeGraphAI()

# 1) extract()
res = sgai.extract(
    "Extract the company name, tagline, and any listed features.",
    url="https://scrapegraphai.com",
    schema=CompanyInfo.model_json_schema(),
)
keys = list((res.data.json_data or {}).keys()) if res.status == "success" and res.data else None
print(f"[extract] status={res.status} elapsed_ms={res.elapsed_ms} keys={keys}")

# 2) scrape() with JsonFormatConfig
res = sgai.scrape(
    "https://scrapegraphai.com",
    formats=[
        JsonFormatConfig(
            prompt="Extract the company name, tagline, and any listed features.",
            schema=CompanyInfo.model_json_schema(),
        ),
    ],
)
data_keys = None
if res.status == "success" and res.data:
    block = res.data.results.get("json", {})
    if isinstance(block, dict) and isinstance(block.get("data"), dict):
        data_keys = list(block["data"].keys())
print(f"[scrape]  status={res.status} elapsed_ms={res.elapsed_ms} keys={data_keys}")

# 3) search()
res = sgai.search(
    "best programming languages 2025",
    num_results=3,
    prompt="Summarize the top languages and the reason each is recommended.",
    schema=TopLanguages.model_json_schema(),
)
keys = list((res.data.json_data or {}).keys()) if res.status == "success" and res.data else None
print(f"[search]  status={res.status} elapsed_ms={res.elapsed_ms} keys={keys}")
