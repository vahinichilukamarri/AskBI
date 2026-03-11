from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import sqlite3
import pandas as pd
import io
import os

from gemini_sql import generate_sql, generate_sql_with_schema, generate_insight

# -----------------------------
# CREATE FASTAPI APP
# -----------------------------
app = FastAPI(title="AskBI Backend", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# ACTIVE SESSION STATE
# stores the active table + schema per session
# (for a multi-user app, key this by session ID)
# -----------------------------
active_table = {"name": "campaigns", "columns": [], "is_custom": False}


# -----------------------------
# REQUEST MODELS
# -----------------------------
class ConversationMessage(BaseModel):
    role: str          # "user" | "assistant"
    content: str       # the prompt or the SQL/summary that was returned

class QueryRequest(BaseModel):
    prompt: str
    history: Optional[List[ConversationMessage]] = []   # ← NEW: conversation history


# -----------------------------
# TEST ROUTE
# -----------------------------
@app.get("/")
def home():
    return {"message": "AskBI backend v2 is running 🚀"}


# -----------------------------
# DATABASE QUERY FUNCTION
# -----------------------------
def run_query(sql_query: str, db_path: str = "campaigns.db"):
    try:
        conn = sqlite3.connect(db_path)
        df = pd.read_sql_query(sql_query, conn)
        conn.close()
        return df, None
    except Exception as e:
        print("SQL ERROR:", e)
        return pd.DataFrame(), str(e)


# -----------------------------
# CHART TYPE SUGGESTER
# -----------------------------
def suggest_chart_type(columns: list, row_count: int) -> str:
    cols_lower = [c.lower() for c in columns]
    if "date" in cols_lower or "month" in cols_lower or "year" in cols_lower:
        return "line"
    if row_count == 1 and len(columns) <= 3:
        return "stat"
    if row_count <= 6 and len(columns) == 2:
        return "pie"
    if len(columns) == 2:
        return "bar"
    return "bar"


# -----------------------------
# BUILD RESPONSE DICT
# -----------------------------
def build_response(df: pd.DataFrame, sql_query: str, prompt: str) -> dict:
    columns    = df.columns.tolist()
    records    = df.to_dict(orient="records")
    chart_type = suggest_chart_type(columns, len(records))
    x_key      = columns[0] if columns else None
    y_key      = columns[1] if len(columns) > 1 else columns[0]

    # Generate plain-English insight summary
    try:
        insight = generate_insight(prompt, records, columns)
    except Exception:
        insight = None

    return {
        "sql_generated": sql_query,
        "chart_type":    chart_type,
        "x_axis":        x_key,
        "y_axis":        y_key,
        "title":         prompt[:60],
        "data":          records,
        "row_count":     len(records),
        "table_name":    active_table["name"],
        "insight":       insight,
    }


# ════════════════════════════════════════════════════════════════════
# FEATURE 1 — CSV UPLOAD
# ════════════════════════════════════════════════════════════════════
@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    """
    Accept a CSV upload, store it as a new SQLite table called 'user_data',
    and return the column schema so the frontend can display it.
    """
    if not file.filename.endswith(".csv"):
        return JSONResponse(status_code=400, content={"error": "Only .csv files are supported."})

    try:
        contents = await file.read()
        df = pd.read_csv(io.BytesIO(contents))

        if df.empty:
            return JSONResponse(status_code=400, content={"error": "CSV file is empty."})

        # Sanitise column names (spaces → underscores, lowercase)
        df.columns = [c.strip().lower().replace(" ", "_").replace("-", "_") for c in df.columns]

        table_name = "user_data"
        conn = sqlite3.connect("campaigns.db")
        df.to_sql(table_name, conn, if_exists="replace", index=False)
        conn.close()

        # Update active session
        col_info = []
        for col in df.columns:
            dtype = str(df[col].dtype)
            if "int" in dtype:
                sql_type = "INTEGER"
            elif "float" in dtype:
                sql_type = "REAL"
            else:
                sql_type = "TEXT"
            sample = str(df[col].dropna().iloc[0]) if not df[col].dropna().empty else ""
            col_info.append({"name": col, "type": sql_type, "sample": sample})

        active_table["name"]      = table_name
        active_table["columns"]   = col_info
        active_table["is_custom"] = True

        return {
            "message":    f"CSV uploaded successfully! {len(df)} rows, {len(df.columns)} columns.",
            "table_name": table_name,
            "row_count":  len(df),
            "columns":    col_info,
            "preview":    df.head(3).to_dict(orient="records"),
        }

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Upload failed: {str(e)}"})


@app.post("/reset-to-default")
def reset_to_default():
    """Switch back to the built-in campaigns table."""
    active_table["name"]      = "campaigns"
    active_table["columns"]   = []
    active_table["is_custom"] = False
    return {"message": "Switched back to built-in campaigns dataset."}


# ════════════════════════════════════════════════════════════════════
# FEATURE 2 — GENERATE DASHBOARD (with conversation history)
# ════════════════════════════════════════════════════════════════════
@app.post("/generate-dashboard")
def generate_dashboard(request: QueryRequest):
    prompt  = request.prompt
    history = request.history or []

    # Step 1 — Generate SQL, passing conversation history for follow-up awareness
    try:
        if active_table["is_custom"]:
            sql_query = generate_sql_with_schema(
                user_prompt=prompt,
                table_name=active_table["name"],
                columns=active_table["columns"],
                history=history,
            )
        else:
            sql_query = generate_sql(prompt, history=history)

        print(f"\n[AskBI] Prompt   : {prompt}")
        print(f"[AskBI] History  : {len(history)} prior turns")
        print(f"[AskBI] SQL Query: {sql_query}\n")

    except RuntimeError as e:
        return JSONResponse(status_code=429, content={"error": str(e), "sql_generated": None})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"SQL generation failed: {str(e)}", "sql_generated": None})

    # Step 2 — Run SQL
    df, sql_error = run_query(sql_query)

    if sql_error:
        return JSONResponse(status_code=400, content={"error": f"SQL execution failed: {sql_error}", "sql_generated": sql_query})

    if df.empty:
        return JSONResponse(status_code=404, content={"error": "Query returned no results. Try rephrasing your question.", "sql_generated": sql_query})

    return build_response(df, sql_query, prompt)


# -----------------------------
# HEALTH CHECK
# -----------------------------
@app.get("/health")
def health():
    try:
        conn = sqlite3.connect("campaigns.db")
        conn.execute("SELECT COUNT(*) FROM campaigns")
        conn.close()
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status":       "ok",
        "database":     db_status,
        "active_table": active_table["name"],
        "is_custom_csv": active_table["is_custom"],
    }


@app.get("/active-table")
def get_active_table():
    return active_table