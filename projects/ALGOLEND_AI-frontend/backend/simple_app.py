#!/usr/bin/env python3
"""
Simple FastAPI backend for AlgoLend AI MVP
Minimal dependencies for hackathon demo
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import json
import random
import time
import asyncio
from datetime import datetime

app = FastAPI(
    title="AlgoLend AI API",
    description="AI-driven DeFi lending platform on Algorand",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class AccountAnalysisRequest(BaseModel):
    address: str
    include_transaction_history: bool = True

class AccountAnalysisResult(BaseModel):
    address: str
    credit_score: int
    risk_level: str
    analysis_timestamp: str
    risk_factors: list
    recommendations: list
    transaction_count: int
    total_volume: float

class NetworkStats(BaseModel):
    tps: float
    finality_time: float
    transaction_fee: float
    block_height: int
    timestamp: str

class AIAgentStatus(BaseModel):
    name: str
    status: str
    performance: float
    last_update: str

class MarketInsight(BaseModel):
    insight_type: str
    message: str
    confidence: float
    timestamp: str

# Mock data generators
def generate_credit_score():
    return random.randint(300, 850)

def generate_risk_level(credit_score):
    if credit_score >= 750:
        return "Low"
    elif credit_score >= 650:
        return "Medium"
    elif credit_score >= 550:
        return "High"
    else:
        return "Very High"

def generate_risk_factors():
    factors = [
        "Limited transaction history",
        "High volatility in account balance",
        "Frequent small transactions",
        "Recent account creation",
        "Unusual transaction patterns"
    ]
    return random.sample(factors, random.randint(1, 3))

def generate_recommendations():
    recommendations = [
        "Consider providing additional collateral",
        "Build longer transaction history",
        "Maintain consistent account balance",
        "Diversify transaction patterns",
        "Consider smaller loan amounts initially"
    ]
    return random.sample(recommendations, random.randint(2, 4))

# API Routes
@app.get("/")
async def root():
    return {
        "message": "AlgoLend AI API",
        "version": "1.0.0",
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "services": {
            "ai_agents": "operational",
            "algorand_connection": "operational",
            "database": "operational"
        }
    }

@app.post("/api/analyze-account", response_model=AccountAnalysisResult)
async def analyze_account(request: AccountAnalysisRequest):
    """Analyze an Algorand account for credit scoring and risk assessment"""
    
    # Simulate AI analysis delay
    await asyncio.sleep(1)
    
    credit_score = generate_credit_score()
    risk_level = generate_risk_level(credit_score)
    
    return AccountAnalysisResult(
        address=request.address,
        credit_score=credit_score,
        risk_level=risk_level,
        analysis_timestamp=datetime.now().isoformat(),
        risk_factors=generate_risk_factors(),
        recommendations=generate_recommendations(),
        transaction_count=random.randint(10, 1000),
        total_volume=random.uniform(1000, 100000)
    )

@app.get("/api/network-stats", response_model=NetworkStats)
async def get_network_stats():
    """Get real-time Algorand network statistics"""
    
    return NetworkStats(
        tps=random.uniform(1000, 2000),
        finality_time=random.uniform(4.0, 5.0),
        transaction_fee=random.uniform(0.001, 0.01),
        block_height=random.randint(30000000, 40000000),
        timestamp=datetime.now().isoformat()
    )

@app.get("/api/ai-agents/status")
async def get_ai_agents_status():
    """Get status of all AI agents"""
    
    agents = [
        AIAgentStatus(
            name="Market Oracle",
            status="operational",
            performance=94.2,
            last_update=datetime.now().isoformat()
        ),
        AIAgentStatus(
            name="Risk Analyzer", 
            status="operational",
            performance=98.7,
            last_update=datetime.now().isoformat()
        ),
        AIAgentStatus(
            name="Yield Optimizer",
            status="operational", 
            performance=91.5,
            last_update=datetime.now().isoformat()
        )
    ]
    
    return {
        "agents": agents,
        "overall_status": "operational",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/market-insights")
async def get_market_insights():
    """Get AI-generated market insights"""
    
    insights = [
        MarketInsight(
            insight_type="price_prediction",
            message="ALGO price expected to increase 5-8% in next 24h",
            confidence=0.87,
            timestamp=datetime.now().isoformat()
        ),
        MarketInsight(
            insight_type="risk_assessment",
            message="Market volatility within normal range",
            confidence=0.92,
            timestamp=datetime.now().isoformat()
        ),
        MarketInsight(
            insight_type="yield_optimization",
            message="Consider rebalancing portfolio towards stablecoins",
            confidence=0.78,
            timestamp=datetime.now().isoformat()
        )
    ]
    
    return {
        "insights": insights,
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/lending-pools")
async def get_lending_pools():
    """Get available lending pools"""
    
    pools = [
        {
            "id": "pool_1",
            "name": "Stablecoin Lending Pool",
            "apy": 12.5,
            "risk_level": "Low",
            "total_liquidity": 2500000,
            "available_liquidity": 500000,
            "min_deposit": 100,
            "max_deposit": 100000
        },
        {
            "id": "pool_2", 
            "name": "ALGO Lending Pool",
            "apy": 18.7,
            "risk_level": "Medium",
            "total_liquidity": 1800000,
            "available_liquidity": 300000,
            "min_deposit": 50,
            "max_deposit": 50000
        },
        {
            "id": "pool_3",
            "name": "High Yield Pool",
            "apy": 25.3,
            "risk_level": "High", 
            "total_liquidity": 800000,
            "available_liquidity": 150000,
            "min_deposit": 200,
            "max_deposit": 20000
        }
    ]
    
    return {
        "pools": pools,
        "timestamp": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    import asyncio
    
    print("🚀 Starting AlgoLend AI Backend...")
    print("📊 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/health")
    print("🌐 CORS enabled for frontend integration")
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
