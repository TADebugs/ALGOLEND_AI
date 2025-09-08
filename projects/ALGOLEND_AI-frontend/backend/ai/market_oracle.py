"""
Market Oracle AI Agent
Analyzes market conditions, lending pool performance, and provides investment recommendations
"""

import asyncio
import aiohttp
import json
from datetime import datetime, timedelta
from typing import Dict, List, Any
import math
import random

class MarketOracle:
    def __init__(self):
        self.name = "Market Oracle"
        self.status = "active"
        self.performance = 94.2
        self.description = "Real-time market analysis and investment recommendations"
        self.last_update = datetime.now()
        
        # Mock market data (in production, this would connect to real market APIs)
        self.market_data = {
            "algo_price": 0.15,
            "market_cap": 1200000000,
            "volume_24h": 45000000,
            "price_change_24h": 0.025,
            "fear_greed_index": 65,
            "market_sentiment": "bullish"
        }
    
    async def get_status(self) -> Dict[str, Any]:
        """Get current status of the Market Oracle"""
        return {
            "name": self.name,
            "status": self.status,
            "performance": self.performance,
            "description": self.description,
            "last_update": self.last_update.isoformat(),
            "uptime_hours": (datetime.now() - self.last_update).total_seconds() / 3600
        }
    
    async def analyze_pool(self, pool_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Analyze a lending pool and provide AI recommendations
        """
        try:
            # Simulate AI analysis delay
            await asyncio.sleep(0.5)
            
            # Calculate risk score based on pool metrics
            tvl = pool_data.get("total_value_locked", 0)
            active_loans = pool_data.get("active_loans", 0)
            default_rate = pool_data.get("default_rate", 0)
            avg_loan_size = pool_data.get("average_loan_size", 0)
            
            # Risk scoring algorithm
            risk_score = 0
            
            # TVL factor (higher TVL = lower risk)
            if tvl > 1000000:
                risk_score += 20
            elif tvl > 500000:
                risk_score += 15
            elif tvl > 100000:
                risk_score += 10
            else:
                risk_score += 5
            
            # Default rate factor (lower default rate = lower risk)
            if default_rate < 0.01:
                risk_score += 25
            elif default_rate < 0.03:
                risk_score += 20
            elif default_rate < 0.05:
                risk_score += 15
            else:
                risk_score += 10
            
            # Activity factor (more active loans = higher risk but more opportunity)
            if active_loans > 50:
                risk_score += 15
            elif active_loans > 20:
                risk_score += 20
            elif active_loans > 10:
                risk_score += 15
            else:
                risk_score += 10
            
            # Calculate APY based on risk and market conditions
            base_apy = 8.0
            risk_premium = (100 - risk_score) * 0.1
            market_premium = self.market_data["fear_greed_index"] * 0.05
            apy = base_apy + risk_premium + market_premium
            
            # Calculate utilization rate
            utilization_rate = min(active_loans * avg_loan_size / tvl, 1.0) if tvl > 0 else 0
            
            # Generate AI recommendation
            if risk_score >= 80:
                recommendation = "Excellent investment opportunity with low risk"
                confidence = 0.95
            elif risk_score >= 60:
                recommendation = "Good investment with moderate risk"
                confidence = 0.85
            elif risk_score >= 40:
                recommendation = "Moderate investment with higher risk"
                confidence = 0.70
            else:
                recommendation = "High risk investment, proceed with caution"
                confidence = 0.60
            
            return {
                "apy": round(apy, 2),
                "risk_score": min(risk_score, 100),
                "tvl_algo": tvl,
                "utilization_rate": round(utilization_rate, 2),
                "recommendation": recommendation,
                "confidence": round(confidence, 2)
            }
            
        except Exception as e:
            return {
                "apy": 8.0,
                "risk_score": 50,
                "tvl_algo": pool_data.get("total_value_locked", 0),
                "utilization_rate": 0.5,
                "recommendation": "Unable to analyze pool",
                "confidence": 0.0
            }
    
    async def get_market_insights(self) -> Dict[str, Any]:
        """
        Get AI-powered market insights and predictions
        """
        try:
            # Simulate AI analysis delay
            await asyncio.sleep(0.3)
            
            # Generate truly dynamic market data based on time and randomness
            current_time = datetime.now()
            time_factor = math.sin(current_time.timestamp() / 1800) * 0.03  # 30-minute cycles
            random_factor = random.uniform(-0.02, 0.02)
            
            # Dynamic price with realistic movement
            self.market_data["algo_price"] *= (1 + time_factor + random_factor)
            
            # Dynamic volume with time-of-day patterns
            hour_factor = 1 + 0.3 * math.sin((current_time.hour - 12) / 24 * 2 * math.pi)
            self.market_data["volume_24h"] *= hour_factor * (1 + random.uniform(-0.1, 0.15))
            
            # Dynamic fear/greed with momentum
            momentum = random.uniform(-8, 8)
            self.market_data["fear_greed_index"] = max(0, min(100, 
                self.market_data["fear_greed_index"] + momentum))
            
            # Update price change based on new price
            self.market_data["price_change_24h"] = random.uniform(-0.08, 0.12)
            
            # Generate insights based on current market data
            insights = {
                "market_sentiment": self._analyze_sentiment(),
                "price_prediction": self._predict_price_movement(),
                "lending_opportunities": self._identify_lending_opportunities(),
                "risk_factors": self._identify_risk_factors(),
                "recommended_actions": self._generate_recommendations(),
                "market_data": self.market_data,
                "timestamp": datetime.now().isoformat()
            }
            
            return insights
            
        except Exception as e:
            return {
                "error": f"Failed to generate market insights: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
    
    def _analyze_sentiment(self) -> str:
        """Analyze market sentiment based on various factors"""
        fear_greed = self.market_data["fear_greed_index"]
        price_change = self.market_data["price_change_24h"]
        
        if fear_greed > 70 and price_change > 0:
            return "Very Bullish"
        elif fear_greed > 50 and price_change > 0:
            return "Bullish"
        elif fear_greed > 30:
            return "Neutral"
        elif fear_greed > 10:
            return "Bearish"
        else:
            return "Very Bearish"
    
    def _predict_price_movement(self) -> Dict[str, Any]:
        """Predict short-term price movement"""
        current_price = self.market_data["algo_price"]
        volatility = abs(self.market_data["price_change_24h"])
        
        # Simple prediction model (in production, use ML models)
        trend = "up" if self.market_data["price_change_24h"] > 0 else "down"
        confidence = min(0.9, 0.5 + volatility * 2)
        
        predicted_change = random.uniform(-0.05, 0.05) * (1 + volatility)
        predicted_price = current_price * (1 + predicted_change)
        
        return {
            "trend": trend,
            "confidence": round(confidence, 2),
            "predicted_price": round(predicted_price, 4),
            "predicted_change_percent": round(predicted_change * 100, 2)
        }
    
    def _identify_lending_opportunities(self) -> List[Dict[str, Any]]:
        """Identify current lending opportunities"""
        opportunities = []
        
        # Dynamic opportunities based on real-time market conditions
        market_multiplier = 1 + (self.market_data["fear_greed_index"] - 50) / 200
        volatility_bonus = abs(self.market_data["price_change_24h"]) * 50
        
        # High yield opportunities - vary with market sentiment
        if self.market_data["fear_greed_index"] > 40:
            base_apy = 10.0 + volatility_bonus
            opportunities.append({
                "type": "High Yield Pool",
                "apy": round(base_apy * market_multiplier + random.uniform(-1.5, 2.5), 2),
                "risk": "Medium" if self.market_data["fear_greed_index"] > 60 else "High",
                "description": f"{'Market optimism' if self.market_data['fear_greed_index'] > 60 else 'Volatility premium'} driving yields"
            })
        
        # Stable opportunities - always available but yield varies
        stable_apy = 6.0 + (self.market_data["fear_greed_index"] / 50) + volatility_bonus * 0.3
        opportunities.append({
            "type": "Stable Pool",
            "apy": round(stable_apy + random.uniform(-0.8, 1.2), 2),
            "risk": "Low",
            "description": "Consistent returns with managed risk exposure"
        })
        
        # Conservative opportunities - always available with lowest risk
        conservative_apy = 5.0 + (self.market_data["fear_greed_index"] / 100) + volatility_bonus * 0.1
        opportunities.append({
            "type": "Conservative Pool",
            "apy": round(conservative_apy + random.uniform(-0.5, 0.8), 2),
            "risk": "Low",
            "description": "Ultra-safe returns with minimal volatility"
        })
        
        # Emerging opportunities - appear during high activity
        if self.market_data["volume_24h"] > 45000000 or abs(self.market_data["price_change_24h"]) > 0.04:
            emerging_apy = 13.0 + volatility_bonus * 1.5
            opportunities.append({
                "type": "Volatility Pool" if abs(self.market_data["price_change_24h"]) > 0.04 else "Emerging Pool",
                "apy": round(emerging_apy + random.uniform(-3, 4), 2),
                "risk": "High",
                "description": "High activity creating arbitrage opportunities"
            })
        
        return opportunities
    
    def _identify_risk_factors(self) -> List[str]:
        """Identify current market risk factors"""
        risks = []
        
        if self.market_data["fear_greed_index"] > 80:
            risks.append("Market overconfidence - potential correction risk")
        
        if self.market_data["price_change_24h"] > 0.1:
            risks.append("High volatility - increased uncertainty")
        
        if self.market_data["volume_24h"] < 20000000:
            risks.append("Low liquidity - potential slippage")
        
        if self.market_data["fear_greed_index"] < 20:
            risks.append("Market panic - potential overselling")
        
        return risks
    
    def _generate_recommendations(self) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if self.market_data["fear_greed_index"] > 70:
            recommendations.append("Consider taking profits on high-risk positions")
            recommendations.append("Diversify into stable lending pools")
        elif self.market_data["fear_greed_index"] < 30:
            recommendations.append("Consider increasing lending positions")
            recommendations.append("Look for undervalued opportunities")
        else:
            recommendations.append("Maintain balanced portfolio")
            recommendations.append("Monitor market conditions closely")
        
        if self.market_data["volume_24h"] > 50000000:
            recommendations.append("High volume indicates strong interest - good time to lend")
        
        return recommendations
