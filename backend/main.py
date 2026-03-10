from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
import pandas as pd

app = FastAPI()

# allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    prompt: str


@app.get("/")
def home():
    return {"message": "AskBI backend is running"}


# -----------------------------
# DATABASE QUERY FUNCTION
# -----------------------------
def run_query(sql_query: str):

    try:
        with sqlite3.connect("campaigns.db") as conn:
            df = pd.read_sql_query(sql_query, conn)

        return df

    except Exception as e:
        print("SQL ERROR:", e)
        return None


# -----------------------------
# MAIN DASHBOARD ENDPOINT
# -----------------------------
@app.post("/generate-dashboard")
def generate_dashboard(request: QueryRequest):

    prompt = request.prompt.lower()

    try:

        # Revenue by Channel
        if "revenue" in prompt and "channel" in prompt:

            sql = """
            SELECT Channel_Used, SUM(Revenue) as Revenue
            FROM campaigns
            GROUP BY Channel_Used
            ORDER BY Revenue DESC
            """

            df = run_query(sql)

            return {
                "charts": [
                    {
                        "chart_type": "bar",
                        "title": "Revenue by Channel",
                        "x_axis": "Channel_Used",
                        "y_axis": "Revenue",
                        "data": df.to_dict(orient="records")
                    }
                ]
            }

        # ROI by Campaign Type
        if "roi" in prompt:

            sql = """
            SELECT Campaign_Type, AVG(ROI) as ROI
            FROM campaigns
            GROUP BY Campaign_Type
            ORDER BY ROI DESC
            """

            df = run_query(sql)

            return {
                "charts": [
                    {
                        "chart_type": "bar",
                        "title": "ROI by Campaign Type",
                        "x_axis": "Campaign_Type",
                        "y_axis": "ROI",
                        "data": df.to_dict(orient="records")
                    }
                ]
            }

        # Conversions by Audience
        if "conversion" in prompt or "audience" in prompt:

            sql = """
            SELECT Target_Audience, SUM(Conversions) as Conversions
            FROM campaigns
            GROUP BY Target_Audience
            ORDER BY Conversions DESC
            """

            df = run_query(sql)

            return {
                "charts": [
                    {
                        "chart_type": "pie",
                        "title": "Conversions by Audience",
                        "x_axis": "Target_Audience",
                        "y_axis": "Conversions",
                        "data": df.to_dict(orient="records")
                    }
                ]
            }

        return {"message": "Sorry, I couldn't understand the query yet."}

    except Exception as e:

        return {
            "error": "Server error",
            "details": str(e)
        }