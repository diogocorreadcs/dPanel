import os
import pandas as pd
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="dPanel Analytics Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_methods=["GET"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)


@app.get("/analytics/health")
def health():
    return {"status": "online", "service": "dPanel Python Analytics"}


@app.get("/analytics/overview")
def get_overview():
    df_active = pd.read_sql("SELECT * FROM dbounty_active", engine)
    df_stats = pd.read_sql("SELECT * FROM dbounty_stats", engine)
    df_clans = pd.read_sql("SELECT * FROM dclans_clans", engine)

    total_bounty_money = float(df_active["total_amount"].sum()) if not df_active.empty else 0.0
    total_claimed_money = float(df_stats["total_earned"].sum()) if not df_stats.empty else 0.0
    total_heads_claimed = int(df_stats["bounties_claimed"].sum()) if not df_stats.empty else 0
    active_bounties_count = int(len(df_active))
    total_clans = int(len(df_clans))

    peak_hours = []
    if not df_active.empty and "created_at" in df_active.columns:
        df_active["datetime"] = pd.to_datetime(df_active["created_at"], unit="ms")
        df_active["hour"] = df_active["datetime"].dt.hour
        hourly = df_active.groupby("hour")["total_amount"].agg(["count", "sum"]).reset_index()
        peak_hours = [
            {
                "hour": f"{int(row['hour']):02d}:00",
                "count": int(row["count"]),
                "volume": float(row["sum"]),
            }
            for _, row in hourly.iterrows()
        ]

    return {
        "economy": {
            "active_bounty_pool": total_bounty_money,
            "total_claimed_volume": total_claimed_money,
            "active_bounties_count": active_bounties_count,
            "total_heads_claimed": total_heads_claimed,
            "total_clans": total_clans,
        },
        "peak_hours": peak_hours,
    }