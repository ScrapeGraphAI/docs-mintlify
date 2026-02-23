---
title: Installation
description: 'Install and get started with ScrapeGraphAI SDKs'
---

## Prerequisites

- Obtain your **API key** by signing up on the [ScrapeGraphAI Dashboard](https://dashboard.scrapegraphai.com)

---

## Python SDK

```bash
pip install scrapegraph-py
```

**Usage:**

```python
from scrapegraph_py import Client

client = Client(api_key="your-api-key-here")

# Scrape a website
response = client.smartscraper(
    website_url="https://scrapegraphai.com",
    user_prompt="Extract information about the company"
)
print(response)
```

<Note>
You can also set the `SGAI_API_KEY` environment variable and initialize the client without parameters: `client = Client()`
</Note>

For more advanced usage, see the [Python SDK documentation](/sdks/python).

---

## JavaScript SDK

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
import { smartScraper } from "scrapegraph-js";

const apiKey = "your-api-key-here";

const response = await smartScraper(apiKey, {
  website_url: "https://scrapegraphai.com",
  user_prompt: "What does the company do?",
});

if (response.status === "error") {
  console.error("Error:", response.error);
} else {
  console.log(response.data.result);
}
```

<Note>
Store your API keys securely in environment variables. Use `.env` files and libraries like `dotenv` to load them into your app.
</Note>

For more advanced usage, see the [JavaScript SDK documentation](/sdks/javascript).

---

## Key Concepts

### SmartScraper
Extract specific information from any webpage using AI. Provide a URL and a prompt describing what you want to extract. [Learn more](/services/smartscraper)

### SearchScraper
Search and extract information from multiple web sources using AI. Start with just a prompt - SearchScraper will find relevant websites and extract the information you need. [Learn more](/services/searchscraper)

### SmartCrawler
AI-powered extraction for any webpage with crawl capabilities. Automatically navigate and extract data from multiple pages. [Learn more](/services/smartcrawler)

### Markdownify
Convert any webpage into clean, formatted markdown. Perfect for content aggregation and processing. [Learn more](/services/markdownify)

### Structured Output with Schemas
Both SDKs support structured output using schemas:
- **Python**: Use Pydantic models
- **JavaScript**: Use Zod schemas

---

## Example: Extract Structured Data with Schema

### Python Example

```python
from scrapegraph_py import Client
from pydantic import BaseModel, Field

class CompanyInfo(BaseModel):
    company_name: str = Field(description="The company name")
    description: str = Field(description="Company description")
    website: str = Field(description="Company website URL")
    industry: str = Field(description="Industry sector")

client = Client(api_key="your-api-key")
result = client.smartscraper(
    website_url="https://scrapegraphai.com",
    user_prompt="Extract company information",
    output_schema=CompanyInfo
)
print(result)
```

### JavaScript Example

```javascript
import { smartScraper } from "scrapegraph-js";
import { z } from "zod";

const CompanySchema = z.object({
  company_name: z.string().describe("The company name"),
  description: z.string().describe("Company description"),
  website: z.string().url().describe("Company website URL"),
  industry: z.string().describe("Industry sector"),
});

const apiKey = "your-api-key";
const response = await smartScraper(apiKey, {
  website_url: "https://scrapegraphai.com",
  user_prompt: "Extract company information",
  output_schema: CompanySchema,
});
console.log(response.data.result);
```

---

## Next Steps

- Explore our [use cases](/use-cases/overview) to see how ScrapeGraphAI can help your projects
- Check out the [Cookbook](/cookbook/introduction) for real-world examples
- Read the [API Reference](/api-reference/introduction) for detailed endpoint documentation
- Join our [Discord community](https://discord.gg/uJN7TYcpNa) for support and updates
