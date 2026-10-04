"""
Generate the frontend's seeded agent output by running the real RiskAnalyzer
and YieldOptimizer on synthetic inputs, plus one MarketOracle snapshot
(fixed random seed; the oracle reads a mock market feed). No network.

    cd projects/ALGOLEND_AI-frontend/backend
    python3 scripts/generate_demo_seed.py   # writes ../src/data/riskSeed.json + yieldSeed.json + oracleSeed.json
"""

import asyncio
import json
import random
import sys
from datetime import datetime, timedelta
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from ai.risk_analyzer import RiskAnalyzer  # noqa: E402
from ai.yield_optimizer import YieldOptimizer  # noqa: E402
from ai.market_oracle import MarketOracle  # noqa: E402

DAY = 86400


def txs(amounts_algo, counterparties, span_days):
    """Transactions spread evenly over span_days, cycling through counterparties."""
    n = len(amounts_algo)
    step = (span_days * DAY) // max(1, n - 1)
    return [
        {
            "amount": int(a * 1_000_000),
            "sender": "SELF",
            "receiver": f"PEER{i % counterparties}",
            "confirmed-round": 1 + i * step,
        }
        for i, a in enumerate(amounts_algo)
    ]


PROFILES = [
    {
        "id": "established",
        "label": "Established wallet",
        "summary": "6,200 ALGO, 14 months old, steady payments to 25 counterparties",
        "balance_algo": 6200,
        "age_days": 420,
        "transactions": txs([40 + (i % 5) * 5 for i in range(120)], 25, 60),
    },
    {
        "id": "volatile",
        "label": "Volatile trader",
        "summary": "900 ALGO, 4 months old, irregular amounts to 8 counterparties",
        "balance_algo": 900,
        "age_days": 120,
        "transactions": txs([2, 450, 5, 1200, 1, 80, 3, 900, 10, 2] * 4, 8, 90),
    },
    {
        "id": "new",
        "label": "New wallet",
        "summary": "15 ALGO, 3 days old, 4 transactions",
        "balance_algo": 15,
        "age_days": 3,
        "transactions": txs([5, 5, 3, 2], 1, 2),
    },
]


async def main():
    analyzer = RiskAnalyzer()
    out = {"weights": analyzer.weights, "profiles": []}
    for p in PROFILES:
        created = datetime.now() - timedelta(days=p["age_days"], hours=1)
        account = {"address": p["id"], "amount": p["balance_algo"] * 1_000_000, "created-at": created.timestamp()}
        result = await analyzer.analyze_account(account, p["transactions"])
        out["profiles"].append({k: p[k] for k in ("id", "label", "summary")} | {"result": result})
    dest = Path(__file__).resolve().parents[2] / "src" / "data" / "riskSeed.json"
    dest.write_text(json.dumps(out, indent=2) + "\n")
    print(f"wrote {dest}")
    for p in out["profiles"]:
        print(p["id"], p["result"]["credit_score"], p["result"]["risk_level"])

    prefs = {"risk_tolerance": "moderate", "investment_amount": 10000, "time_horizon": 30}
    result = await YieldOptimizer().optimize_portfolio({"positions": []}, prefs)
    result.pop("timestamp", None)
    ydest = dest.with_name("yieldSeed.json")
    ydest.write_text(json.dumps({"preferences": prefs, "result": result}, indent=2) + "\n")
    print(f"wrote {ydest}")

    random.seed(42)
    insights = await MarketOracle().get_market_insights()
    snapshot = {k: insights[k] for k in ("market_sentiment", "lending_opportunities", "risk_factors", "recommended_actions")}
    odest = dest.with_name("oracleSeed.json")
    odest.write_text(json.dumps(snapshot, indent=2) + "\n")
    print(f"wrote {odest}")


if __name__ == "__main__":
    asyncio.run(main())
