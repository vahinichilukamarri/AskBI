# 📊 AskBI – AI-Powered Business Intelligence Dashboard

## 🚀 Overview

AskBI is an AI-powered business intelligence tool that enables users to generate **interactive dashboards using natural language queries**.

It implements an **end-to-end NL-to-SQL pipeline using Large Language Models (LLMs)**, allowing non-technical users to query structured data and visualize insights in real time.

---

## ❗ Problem Statement

Traditional business intelligence tools require:

* SQL expertise
* Manual query writing
* Time-consuming dashboard creation

This creates a barrier for users who want to quickly extract insights from data without technical knowledge.

---

## 💡 Solution

AskBI bridges this gap by translating **natural language queries into executable SQL** and automatically generating visual insights.

This allows users to:

* Query data using plain English
* Instantly retrieve results
* Visualize insights without manual effort

---

## 🧠 Key Features

### 🔹 Natural Language to SQL

* Converts user queries into SQL using LLMs
* Enables intuitive interaction with structured data

---

### 🔹 Real-Time Data Visualization

* Generates charts dynamically based on query results
* Supports quick insight discovery

---

### 🔹 Interactive Dashboard

* Clean and user-friendly interface
* Real-time updates based on user input

---

## ⚙️ Tech Stack

* **Frontend:** React
* **Backend:** FastAPI
* **Data Processing:** Pandas
* **AI/ML:** LLM APIs (NL → SQL conversion)
* **Database:** SQL / CSV datasets

---

## 🏗️ How It Works

1. User enters a query in natural language
2. LLM converts the query into SQL
3. Backend executes the SQL query on dataset
4. Data is processed using Pandas
5. Results are visualized as charts in real time

---

## 📊 Example

**User Query:**

> “Show monthly sales trends for 2024”

**System Output:**

* Generated SQL query
* Retrieved relevant data
* Displayed line chart with monthly trends

---

## ▶️ How to Run Locally

```bash id="askbi-run"
git clone https://github.com/your-username/askbi-dashboard.git
cd askbi-dashboard
pip install -r requirements.txt
npm install
npm start
```

---

## 💡 Key Insight

> AskBI simplifies business intelligence by enabling users to interact with data using natural language, eliminating the need for manual query writing.

---

## 🚀 Future Improvements

* Support for multiple databases (PostgreSQL, MySQL)
* Query optimization and validation
* Role-based access control
* Integration with enterprise BI tools

---

## 👥 Contributors

* **Vahini** – Designed the NL-to-SQL pipeline, backend architecture, and LLM integration
* **Parinamika** – Developed frontend components, UI/UX, and contributed to dashboard integration

---

## 👤 Author

**Vahini**

* Software Developer | AI/ML Enthusiast
* Focused on building intelligent, data-driven systems
  
GitHub: @vahini_chilukamarri

LinkedIn: Venkata Vahini Chilukamarri

**Parinamika Bhanu**

* Software Developer | AI/ML Enthusiast
* Creating efficient solutions through clean code and smart design

Github: Parinamika-13

LinkedIn: Parinamika Bhanu Chanamala
