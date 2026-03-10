from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import sqlite3
import pandas as pd

from gemini_sql import generate_sql

# -----------------------------
# CREATE FASTAPI APP
# -----------------------------
app = FastAPI(title="AskBI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# REQUEST MODEL
# -----------------------------
class QueryRequest(BaseModel):
    prompt: str

# -----------------------------
# TEST ROUTE
# -----------------------------
@app.get("/")
def home():
    return {"message": "AskBI backend is running 🚀"}

# -----------------------------
# DATABASE QUERY FUNCTION
# -----------------------------
def run_query(sql_query: str):
    try:
        conn = sqlite3.connect("campaigns.db")
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

    # Time series → line chart
    if "date" in cols_lower or "month" in cols_lower or "year" in cols_lower:
        return "line"

    # Single aggregated value → stat card
    if row_count == 1 and len(columns) <= 3:
        return "stat"

    # 2 columns → bar
    if len(columns) == 2:
        return "bar"

    # Many categories → pie (if small number of rows)
    if row_count <= 6 and len(columns) == 2:
        return "pie"

    # Default → bar
    return "bar"

# -----------------------------
# MAIN DASHBOARD ENDPOINT
# -----------------------------
@app.post("/generate-dashboard")
def generate_dashboard(request: QueryRequest):
    prompt = request.prompt

    # Step 1 — Generate SQL
    try:
        sql_query = generate_sql(prompt)
        print(f"\n[AskBI] Prompt   : {prompt}")
        print(f"[AskBI] SQL Query: {sql_query}\n")
    except RuntimeError as e:
        return JSONResponse(
            status_code=429,
            content={"error": str(e), "sql_generated": None}
        )
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"SQL generation failed: {str(e)}", "sql_generated": None}
        )

    # Step 2 — Run SQL against DB
    df, sql_error = run_query(sql_query)

    if sql_error:
        return JSONResponse(
            status_code=400,
            content={
                "error": f"SQL execution failed: {sql_error}",
                "sql_generated": sql_query
            }
        )

    if df.empty:
        return JSONResponse(
            status_code=404,
            content={
                "error": "Query returned no results. Try rephrasing your question.",
                "sql_generated": sql_query
            }
        )

    # Step 3 — Build clean flat response
    columns    = df.columns.tolist()
    records    = df.to_dict(orient="records")
    chart_type = suggest_chart_type(columns, len(records))
    x_key      = columns[0] if columns else None
    y_key      = columns[1] if len(columns) > 1 else columns[0]

    return {
        "sql_generated": sql_query,
        "chart_type":    chart_type,
        "x_axis":        x_key,
        "y_axis":        y_key,
        "title":         prompt[:60],
        "data":          records,
        "row_count":     len(records)
    }


# -----------------------------
# HEALTH CHECK ENDPOINT
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
        "status":   "ok",
        "database": db_status
    }