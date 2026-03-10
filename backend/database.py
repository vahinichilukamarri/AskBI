import pandas as pd
import sqlite3

def load_data():

    df = pd.read_csv("../data/2. Nykaa Digital Marketing/Nykaa_Digital_Marketing.csv", sep=",")

    print("\nPreview of dataset:")
    print(df.head())

    print("\nColumns loaded:")
    print(df.columns)

    conn = sqlite3.connect("campaigns.db")

    df.to_sql("campaigns", conn, if_exists="replace", index=False)

    conn.close()

    print("\nDatabase created successfully")

if __name__ == "__main__":
    load_data()