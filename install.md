---
title: "Installation"
description: "Install and get started with ScrapeGraphAI v2 SDKs"
---

## Prerequisites

- Obtain your **API key** by signing up on the [ScrapeGraphAI Dashboard](https://scrapegraphai.com/dashboard) Python SDK

Requires **Python ≥ 3.12**.

```bash
pip install "scrapegraph-py>=2.1.0"
```

**Usage:**

```python
from scrapegraph_py import ScrapeGraphAI

sgai = ScrapeGraphAI(api_key="your-api-key-here")

# Extract data from a website
res = sgai.extract(
    "Extract information about the company",
    url="https://scrapegraphai.com",
)
print(res.data.json_data if res.status == "success" else res.error)
```

<Note>
  You can also set the `SGAI_API_KEY` environment variable and initialize the client without parameters: `sgai = ScrapeGraphAI()`.
</Note>

For more advanced usage, see the [Python SDK documentation](/sdks/python).

---

## JavaScript SDK

Requires **Node.js \>= 22**.

Install using npm, pnpm, yarn, or bun:

```bash
# Using npm
npm i scrapegraph-js

# Using pnpm
pnpm i scrapegraph-js

# Using yarn
yarn add scrapegraph-js

# Using bun
bun add scrapegraph-js
```

**Usage:**

```javascript
import scrapegraphai from "scrapegraph-js";

const sgai = scrapegraphai({ apiKey: "your-api-key-here" });

const { data } = await sgai.extract(
  "https://scrapegraphai.com",
  { prompt: "What does the company do?" }
);

console.log(data);
```

<Note>
  Store your API keys securely in environment variables. Use `.env` files and libraries like `dotenv` to load them into your app.
</Note>

For more advanced usage, see the [JavaScript SDK documentation](/sdks/javascript).

---

## Key Concepts

### Scrape (formerly Markdownify)

Convert any webpage into markdown, HTML, screenshot, or branding format. [Learn more](/services/scrape)

### Extract (formerly SmartScraper)

Extract specific information from any webpage using AI. Provide a URL and a prompt describing what you want to extract. [Learn more](/services/extract)

### Search (formerly SearchScraper)

Search and extract information from multiple web sources using AI. Start with just a query - Search will find relevant websites and extract the information you need. [Learn more](/services/search)

### Crawl (formerly SmartCrawler)

Multi-page website crawling with flexible output formats. Traverse multiple pages, follow links, and return content in your preferred format. [Learn more](/services/crawl)

### Monitor

Scheduled web monitoring with AI-powered extraction. Set up recurring scraping jobs that automatically extract data on a cron schedule. [Learn more](/services/monitor)

### Structured Output with Schemas

Both SDKs support structured output using schemas:

- **Python**: Use Pydantic models
- **JavaScript**: Use Zod schemas

---

## Example: Extract Structured Data with Schema

### Python Example

```python
from scrapegraph_py import ScrapeGraphAI

sgai = ScrapeGraphAI(api_key="your-api-key")

res = sgai.extract(
    "Extract company information",
    url="https://scrapegraphai.com",
    schema={
        "type": "object",
        "properties": {
            "company_name": {"type": "string", "description": "The company name"},
            "description":  {"type": "string", "description": "Company description"},
            "website":      {"type": "string", "description": "Company website URL"},
            "industry":     {"type": "string", "description": "Industry sector"},
        },
        "required": ["company_name"],
    },
)
print(res.data.json_data if res.status == "success" else res.error)
```

### JavaScript Example

```javascript
import scrapegraphai from "scrapegraph-js";
import { z } from "zod";

const sgai = scrapegraphai({ apiKey: "your-api-key" });

const CompanySchema = z.object({
  companyName: z.string().describe("The company name"),
  description: z.string().describe("Company description"),
  website: z.string().url().describe("Company website URL"),
  industry: z.string().describe("Industry sector"),
});

const { data } = await sgai.extract(
  "https://scrapegraphai.com",
  {
    prompt: "Extract company information",
    schema: CompanySchema,
  }
);
console.log(data);
```

---

## Next Steps

- Explore our [use cases](/use-cases/overview) to see how ScrapeGraphAI can help your projects
- Check out the [Cookbook](/cookbook/introduction) for real-world examples
- Read the [API Reference](/api-reference/introduction) for detailed endpoint documentation
- Join our [Discord community](https://discord.gg/uJN7TYcpNa) for support and updates