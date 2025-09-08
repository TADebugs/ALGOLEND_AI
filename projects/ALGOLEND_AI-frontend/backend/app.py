from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
import math

# AI Modules
from ai.market_oracle import MarketOracle
from ai.risk_analyzer import RiskAnalyzer
from algorand.client import AlgorandClient
from algorand.transactions import TransactionHelper

app = FastAPI(title="AlgoLend AI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI agents
market_oracle = MarketOracle()
risk_analyzer = RiskAnalyzer()
algorand_client = AlgorandClient()
tx_helper = TransactionHelper()

class AccountAnalysisRequest(BaseModel):
    address: str
    include_transaction_history: bool = True

class AccountAnalysisResponse(BaseModel):
    address: str
    credit_score: int
    risk_level: str
    account_age_days: int
    total_transactions: int
    balance_algo: float
    transaction_frequency: float
    risk_factors: List[str]
    recommendations: List[str]
    ai_confidence: float

class NetworkStatsResponse(BaseModel):
    tps: int
    finality_seconds: float
    fees_microalgos: int
    block_height: int
    last_block_time: str
    network_health: str

class LendingPoolAnalysis(BaseModel):
    pool_id: str
    apy: float
    risk_score: int
    tvl_algo: float
    utilization_rate: float
    ai_recommendation: str
    confidence_score: float

@app.get("/")
async def root():
    return {"message": "AlgoLend AI API", "status": "active", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.post("/api/analyze-account", response_model=AccountAnalysisResponse)
async def analyze_account(request: AccountAnalysisRequest):
    """
    Analyze an Algorand account using AI to determine creditworthiness
    """
    try:
        # Get account data from Algorand
        account_data = await algorand_client.get_account_info(request.address)
        
        if not account_data:
            raise HTTPException(status_code=404, detail="Account not found")
        
        # Get transaction history if requested
        transaction_history = []
        if request.include_transaction_history:
            transaction_history = await algorand_client.get_transaction_history(request.address, limit=100)
        
        # AI Analysis
        analysis = await risk_analyzer.analyze_account(
            account_data=account_data,
            transaction_history=transaction_history
        )
        
        return AccountAnalysisResponse(
            address=request.address,
            credit_score=analysis['credit_score'],
            risk_level=analysis['risk_level'],
            account_age_days=analysis['account_age_days'],
            total_transactions=analysis['total_transactions'],
            balance_algo=analysis['balance_algo'],
            transaction_frequency=analysis['transaction_frequency'],
            risk_factors=analysis['risk_factors'],
            recommendations=analysis['recommendations'],
            ai_confidence=analysis['ai_confidence']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/api/network-stats", response_model=NetworkStatsResponse)
async def get_network_stats():
    """
    Get live Algorand network statistics
    """
    try:
        stats = await algorand_client.get_network_stats()
        
        return NetworkStatsResponse(
            tps=stats['tps'],
            finality_seconds=stats['finality_seconds'],
            fees_microalgos=stats['fees_microalgos'],
            block_height=stats['block_height'],
            last_block_time=stats['last_block_time'],
            network_health=stats['network_health']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch network stats: {str(e)}")

@app.get("/api/ai-agents/status")
async def get_ai_agents_status():
    """
    Get status of all AI agents
    """
    try:
        oracle_status = await market_oracle.get_status()
        risk_status = await risk_analyzer.get_status()
        
        return {
            "market_oracle": oracle_status,
            "risk_analyzer": risk_status,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get AI status: {str(e)}")

@app.post("/api/analyze-lending-pool")
async def analyze_lending_pool(pool_id: str):
    """
    Analyze a lending pool using AI
    """
    try:
        # Get pool data (mock for now, would integrate with actual pool contracts)
        pool_data = {
            "pool_id": pool_id,
            "total_value_locked": 1000000,  # Mock data
            "active_loans": 25,
            "default_rate": 0.02,
            "average_loan_size": 50000
        }
        
        analysis = await market_oracle.analyze_pool(pool_data)
        
        return LendingPoolAnalysis(
            pool_id=pool_id,
            apy=analysis['apy'],
            risk_score=analysis['risk_score'],
            tvl_algo=analysis['tvl_algo'],
            utilization_rate=analysis['utilization_rate'],
            ai_recommendation=analysis['recommendation'],
            confidence_score=analysis['confidence']
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pool analysis failed: {str(e)}")

@app.get("/api/market-insights")
async def get_market_insights():
    """
    Get AI-powered market insights
    """
    try:
        insights = await market_oracle.get_market_insights()
        return insights
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get market insights: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
