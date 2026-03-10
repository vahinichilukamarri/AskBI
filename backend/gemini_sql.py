from groq import Groq
import os
import re
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))


def generate_sql(user_prompt: str) -> str:

    system_prompt = """You are an expert SQL analyst working with a SQLite database.

Table name: campaigns

Columns:
- campaign_id       TEXT     (e.g. NY-CMP-1000)
- campaign_type     TEXT     (Social Media, Paid Ads, SEO, Email, Influencer)
- target_audience   TEXT     (College Students, Youth, Working Women, Premium Shoppers, Tier 2 City Customers)
- duration_days     INTEGER
- channel_used      TEXT     (YouTube, Instagram, Google, WhatsApp, Facebook, Email)
- impressions       INTEGER
- clicks            INTEGER
- leads             INTEGER
- conversions       INTEGER
- revenue           INTEGER  (in INR)
- acquisition_cost  REAL
- roi               REAL     (can be negative)
- language          TEXT     (Hindi, English, Tamil, Bengali)
- engagement_score  REAL
- customer_segment  TEXT
- date              TEXT     (YYYY-MM-DD format)

STRICT RULES:
1. Return ONLY the raw SQL query — no markdown, no backticks, no explanation, nothing else.
2. Use exact lowercase column names as listed.
3. SQLite syntax only — use LIKE not ILIKE.
4. For aggregations (SUM, AVG, COUNT, GROUP BY) do NOT add LIMIT.
5. For raw row queries add LIMIT 500.
6. Always ORDER BY the most relevant metric DESC."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",  # free, fast, very capable
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": f"Generate SQL for: {user_prompt}"}
        ],
        temperature=0,        # deterministic SQL output
        max_tokens=512,
    )

    sql = response.choices[0].message.content.strip()

    # Strip markdown fences just in case
    sql = re.sub(r"^```(?:sql)?\s*", "", sql, flags=re.IGNORECASE)
    sql = re.sub(r"\s*```$", "", sql)
    sql = sql.strip()

    return sql
