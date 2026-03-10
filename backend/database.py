import pandas as pd
import sqlite3


def load_data():

    # Load CSV
    df = pd.read_csv(
        "../data/2. Nykaa Digital Marketing/Nykaa-Digital-Marketing.csv",
        sep="\t",
        encoding="latin1"
    )

    # Clean column names
    df.columns = (
        df.columns
        .str.strip()
        .str.replace(" ", "_")
        .str.replace("-", "_")
        .str.replace("/", "_")
    )

    # Remove duplicate columns if any
    df = df.loc[:, ~df.columns.duplicated()]

    print("\nColumns loaded into database:")
    print(df.columns)

    # Create SQLite DB
    conn = sqlite3.connect("campaigns.db")

    # Write table
    df.to_sql("campaigns", conn, if_exists="replace", index=False)

    conn.close()

    print("\nDatabase created successfully: campaigns.db")


if __name__ == "__main__":
    load_data()