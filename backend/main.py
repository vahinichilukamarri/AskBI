from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import pandas as pd

# -----------------------------
# CREATE FASTAPI APP
# -----------------------------
app = FastAPI()

# allow frontend access
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

        return df

    except Exception as e:
        print("SQL ERROR:", e)
        return pd.DataFrame()


# -----------------------------
# MAIN DASHBOARD ENDPOINT
# -----------------------------
@app.post("/generate-dashboard")
def generate_dashboard(request: QueryRequest):

    prompt = request.prompt.lower()

    # -----------------------------
    # REVENUE BY CHANNEL
    # -----------------------------
    if "revenue" in prompt and "channel" in prompt:

        sql = """
        SELECT channel_used, SUM(revenue) as revenue
        FROM campaigns
        GROUP BY channel_used
        ORDER BY revenue DESC
        """

        df = run_query(sql)

        return {
            "charts": [
                {
                    "chart_type": "bar",
                    "title": "Revenue by Channel",
                    "x_axis": "channel_used",
                    "y_axis": "revenue",
                    "data": df.to_dict(orient="records")
                }
            ]
        }

    # -----------------------------
    # ROI BY CAMPAIGN TYPE
    # -----------------------------
    if "roi" in prompt:

        sql = """
        SELECT campaign_type, AVG(roi) as roi
        FROM campaigns
        GROUP BY campaign_type
        ORDER BY roi DESC
        """

        df = run_query(sql)

        return {
            "charts": [
                {
                    "chart_type": "bar",
                    "title": "ROI by Campaign Type",
                    "x_axis": "campaign_type",
                    "y_axis": "roi",
                    "data": df.to_dict(orient="records")
                }
            ]
        }

    # -----------------------------
    # CONVERSIONS BY AUDIENCE
    # -----------------------------
    if "conversion" in prompt or "audience" in prompt:

        sql = """
        SELECT target_audience, SUM(conversions) as conversions
        FROM campaigns
        GROUP BY target_audience
        ORDER BY conversions DESC
        """

        df = run_query(sql)

        return {
            "charts": [
                {
                    "chart_type": "pie",
                    "title": "Conversions by Audience",
                    "x_axis": "target_audience",
                    "y_axis": "conversions",
                    "data": df.to_dict(orient="records")
                }
            ]
        }

    # -----------------------------
    # DEFAULT FALLBACK
    # -----------------------------
    return {
        "message": "Sorry, I couldn't understand the query yet."
    }