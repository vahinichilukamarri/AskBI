from groq import Groq
import os
import re
from typing import List, Optional
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

# ── Default system prompt for the built-in campaigns table ───────────
CAMPAIGNS_SYSTEM_PROMPT = """You are an expert SQL analyst working with a SQLite database.

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
6. Always ORDER BY the most relevant metric DESC.
7. For follow-up questions, ALWAYS apply the same filters/groups from prior SQL in the conversation."""


def _clean_sql(raw: str) -> str:
    """Strip markdown fences and whitespace from model output."""
    sql = raw.strip()
    sql = re.sub(r"^```(?:sql)?\s*", "", sql, flags=re.IGNORECASE)
    sql = re.sub(r"\s*```$", "", sql)
    return sql.strip()


def _history_to_messages(history: list) -> list:
    """
    Convert frontend ConversationMessage list into Groq message dicts.
    Each history entry has {role, content}. We pass them verbatim.
    """
    msgs = []
    for h in history:
        role    = h.get("role", "user") if isinstance(h, dict) else h.role
        content = h.get("content", "")  if isinstance(h, dict) else h.content
        msgs.append({"role": role, "content": content})
    return msgs


# ── Generate SQL for the built-in campaigns table ────────────────────
def generate_sql(user_prompt: str, history: Optional[list] = None) -> str:
    messages = [{"role": "system", "content": CAMPAIGNS_SYSTEM_PROMPT}]

    # Inject prior conversation turns so the model has follow-up context
    if history:
        messages.extend(_history_to_messages(history))

    messages.append({"role": "user", "content": f"Generate SQL for: {user_prompt}"})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0,
        max_tokens=512,
    )

    return _clean_sql(response.choices[0].message.content)


# ── Generate SQL for a user-uploaded CSV with a dynamic schema ───────
def generate_sql_with_schema(
    user_prompt: str,
    table_name: str,
    columns: list,          # list of {name, type, sample} dicts
    history: Optional[list] = None,
) -> str:
    # Build a dynamic system prompt from the uploaded CSV's actual columns
    col_lines = "\n".join(
        f"- {c['name']:<25} {c['type']:<10} (e.g. {c['sample']})"
        for c in columns
    )
    system_prompt = f"""You are an expert SQL analyst working with a SQLite database.

Table name: {table_name}

Columns:
{col_lines}

STRICT RULES:
1. Return ONLY the raw SQL query — no markdown, no backticks, no explanation, nothing else.
2. Use exact column names as listed above (they are already lowercase with underscores).
3. SQLite syntax only — use LIKE not ILIKE, use strftime for date operations.
4. For aggregations (SUM, AVG, COUNT, GROUP BY) do NOT add LIMIT.
5. For raw row queries add LIMIT 500.
6. Always ORDER BY the most relevant metric DESC.
7. For follow-up questions, ALWAYS apply the same filters/groups from prior SQL in the conversation."""

    messages = [{"role": "system", "content": system_prompt}]

    if history:
        messages.extend(_history_to_messages(history))

    messages.append({"role": "user", "content": f"Generate SQL for: {user_prompt}"})

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0,
        max_tokens=512,
    )

    return _clean_sql(response.choices[0].message.content)


# ── Generate a plain-English insight summary from query results ───────
def generate_insight(user_prompt: str, records: list, columns: list) -> str:
    """
    Given the user's original question and the rows returned from the DB,
    produce a short 2-3 sentence plain-English insight summary.
    """
    preview = records[:20]  # cap to avoid token overuse

    system_prompt = """You are a concise data analyst.
Given a user's question and the data returned, write a 2-3 sentence plain-English insight summary.
Focus on the most important finding — the top performer, biggest gap, key trend, or standout number.
Do NOT mention SQL, tables, or databases. Write as if explaining to a business stakeholder.
Be specific: include actual values/numbers from the data. No bullet points, just natural prose."""

    user_msg = f"""User asked: "{user_prompt}"

Data returned:
Columns: {columns}
Rows (up to 20): {preview}

Write a 2-3 sentence insight summary."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user",   "content": user_msg},
        ],
        temperature=0.3,
        max_tokens=200,
    )

    return response.choices[0].message.content.strip()