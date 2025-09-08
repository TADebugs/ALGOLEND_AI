"""
Yield Optimizer AI Agent
Optimizes portfolio allocation, maximizes returns, and manages risk
"""

import asyncio
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import statistics

class YieldOptimizer:
    def __init__(self):
        self.name = "Yield Optimizer"
        self.status = "active"
        self.performance = 91.5
        self.description = "Portfolio optimization and yield maximization"
        self.last_update = datetime.now()
        
        # Optimization parameters
        self.risk_tolerance_levels = {
            "conservative": {"max_risk": 0.1, "target_return": 0.08},
            "moderate": {"max_risk": 0.2, "target_return": 0.12},
            "aggressive": {"max_risk": 0.4, "target_return": 0.18}
        }
    
    async def get_status(self) -> Dict[str, Any]:
        """Get current status of the Yield Optimizer"""
        return {
            "name": self.name,
            "status": self.status,
            "performance": self.performance,
            "description": self.description,
            "last_update": self.last_update.isoformat(),
            "uptime_hours": (datetime.now() - self.last_update).total_seconds() / 3600
        }
    
    async def optimize_portfolio(self, current_portfolio: Dict[str, Any], user_preferences: Dict[str, Any]) -> Dict[str, Any]:
        """
        Optimize portfolio allocation for maximum yield
        """
        try:
            # Simulate AI optimization delay
            await asyncio.sleep(0.6)
            
            # Extract user preferences
            risk_tolerance = user_preferences.get("risk_tolerance", "moderate")
            investment_amount = user_preferences.get("investment_amount", 1000)
            time_horizon = user_preferences.get("time_horizon", 30)  # days
            
            # Get available lending pools
            available_pools = await self._get_available_pools()
            
            # Calculate optimal allocation
            optimal_allocation = self._calculate_optimal_allocation(
                available_pools, risk_tolerance, investment_amount, time_horizon
            )
            
            # Calculate expected returns
            expected_returns = self._calculate_expected_returns(optimal_allocation, time_horizon)
            
            # Generate rebalancing recommendations
            rebalancing = self._generate_rebalancing_recommendations(
                current_portfolio, optimal_allocation
            )
            
            # Risk analysis
            risk_analysis = self._analyze_portfolio_risk(optimal_allocation)
            
            # Generate action plan
            action_plan = self._generate_action_plan(optimal_allocation, current_portfolio)
            
            return {
                "optimal_allocation": optimal_allocation,
                "expected_returns": expected_returns,
                "rebalancing_recommendations": rebalancing,
                "risk_analysis": risk_analysis,
                "action_plan": action_plan,
                "optimization_confidence": self._calculate_optimization_confidence(optimal_allocation),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "error": f"Portfolio optimization failed: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
    
    async def _get_available_pools(self) -> List[Dict[str, Any]]:
        """Get available lending pools with current data"""
        # Mock data - in production, this would fetch from smart contracts
        pools = [
            {
                "id": "stable_pool",
                "name": "Stable Yield Pool",
                "apy": 8.5,
                "risk_score": 15,
                "tvl": 2400000,
                "min_deposit": 100,
                "max_deposit": 100000,
                "term_days": 30,
                "liquidity": 0.95
            },
            {
                "id": "growth_pool",
                "name": "High Growth Pool",
                "apy": 12.3,
                "risk_score": 35,
                "tvl": 1800000,
                "min_deposit": 500,
                "max_deposit": 50000,
                "term_days": 60,
                "liquidity": 0.85
            },
            {
                "id": "conservative_pool",
                "name": "Conservative Pool",
                "apy": 6.2,
                "risk_score": 8,
                "tvl": 3200000,
                "min_deposit": 50,
                "max_deposit": 200000,
                "term_days": 15,
                "liquidity": 0.98
            },
            {
                "id": "defi_pool",
                "name": "DeFi Innovation Pool",
                "apy": 15.8,
                "risk_score": 55,
                "tvl": 800000,
                "min_deposit": 1000,
                "max_deposit": 25000,
                "term_days": 90,
                "liquidity": 0.75
            },
            {
                "id": "liquid_pool",
                "name": "Liquid Staking Pool",
                "apy": 7.1,
                "risk_score": 12,
                "tvl": 5000000,
                "min_deposit": 200,
                "max_deposit": 1000000,
                "term_days": 7,
                "liquidity": 0.99
            }
        ]
        
        return pools
    
    def _calculate_optimal_allocation(self, pools: List[Dict[str, Any]], risk_tolerance: str, 
                                    investment_amount: float, time_horizon: int) -> List[Dict[str, Any]]:
        """Calculate optimal portfolio allocation using AI optimization"""
        risk_params = self.risk_tolerance_levels[risk_tolerance]
        max_risk = risk_params["max_risk"]
        target_return = risk_params["target_return"]
        
        # Filter pools based on risk tolerance
        suitable_pools = [pool for pool in pools if pool["risk_score"] <= max_risk * 100]
        
        if not suitable_pools:
            # If no pools meet risk criteria, use the lowest risk pools
            suitable_pools = sorted(pools, key=lambda x: x["risk_score"])[:3]
        
        # Calculate allocation using modern portfolio theory
        allocations = []
        total_weight = 0
        
        for pool in suitable_pools:
            # Calculate weight based on risk-adjusted return
            risk_adjusted_return = pool["apy"] / 100 - (pool["risk_score"] / 100) * 0.5
            weight = max(0, risk_adjusted_return)
            total_weight += weight
        
        # Normalize weights
        for pool in suitable_pools:
            risk_adjusted_return = pool["apy"] / 100 - (pool["risk_score"] / 100) * 0.5
            weight = max(0, risk_adjusted_return)
            normalized_weight = weight / total_weight if total_weight > 0 else 1 / len(suitable_pools)
            
            allocation_amount = investment_amount * normalized_weight
            
            # Ensure minimum deposit requirements
            if allocation_amount >= pool["min_deposit"]:
                allocations.append({
                    "pool_id": pool["id"],
                    "pool_name": pool["name"],
                    "allocation_percent": round(normalized_weight * 100, 1),
                    "allocation_amount": round(allocation_amount, 2),
                    "expected_apy": pool["apy"],
                    "risk_score": pool["risk_score"],
                    "term_days": pool["term_days"]
                })
        
        # If no allocations meet minimum requirements, suggest the most suitable pool
        if not allocations:
            best_pool = min(suitable_pools, key=lambda x: x["min_deposit"])
            allocations.append({
                "pool_id": best_pool["id"],
                "pool_name": best_pool["name"],
                "allocation_percent": 100.0,
                "allocation_amount": investment_amount,
                "expected_apy": best_pool["apy"],
                "risk_score": best_pool["risk_score"],
                "term_days": best_pool["term_days"]
            })
        
        return allocations
    
    def _calculate_expected_returns(self, allocation: List[Dict[str, Any]], time_horizon: int) -> Dict[str, Any]:
        """Calculate expected returns for the portfolio"""
        total_investment = sum(pool["allocation_amount"] for pool in allocation)
        weighted_apy = sum(
            pool["allocation_percent"] / 100 * pool["expected_apy"] 
            for pool in allocation
        )
        
        # Calculate returns for different time periods
        daily_return = weighted_apy / 365
        period_return = daily_return * time_horizon
        
        expected_profit = total_investment * period_return / 100
        expected_total = total_investment + expected_profit
        
        return {
            "total_investment": round(total_investment, 2),
            "weighted_apy": round(weighted_apy, 2),
            "expected_profit": round(expected_profit, 2),
            "expected_total": round(expected_total, 2),
            "daily_return": round(daily_return, 4),
            "period_return_percent": round(period_return, 2)
        }
    
    def _generate_rebalancing_recommendations(self, current_portfolio: Dict[str, Any], 
                                            optimal_allocation: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Generate rebalancing recommendations"""
        recommendations = []
        
        # Compare current vs optimal allocation
        current_pools = {pool["pool_id"]: pool for pool in current_portfolio.get("pools", [])}
        
        for optimal_pool in optimal_allocation:
            pool_id = optimal_pool["pool_id"]
            optimal_percent = optimal_pool["allocation_percent"]
            
            if pool_id in current_pools:
                current_percent = current_pools[pool_id].get("allocation_percent", 0)
                difference = optimal_percent - current_percent
                
                if abs(difference) > 5:  # Significant difference
                    if difference > 0:
                        recommendations.append({
                            "action": "increase",
                            "pool_id": pool_id,
                            "pool_name": optimal_pool["pool_name"],
                            "current_percent": current_percent,
                            "target_percent": optimal_percent,
                            "difference": round(difference, 1)
                        })
                    else:
                        recommendations.append({
                            "action": "decrease",
                            "pool_id": pool_id,
                            "pool_name": optimal_pool["pool_name"],
                            "current_percent": current_percent,
                            "target_percent": optimal_percent,
                            "difference": round(abs(difference), 1)
                        })
            else:
                recommendations.append({
                    "action": "add",
                    "pool_id": pool_id,
                    "pool_name": optimal_pool["pool_name"],
                    "target_percent": optimal_percent,
                    "allocation_amount": optimal_pool["allocation_amount"]
                })
        
        return recommendations
    
    def _analyze_portfolio_risk(self, allocation: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze portfolio risk characteristics"""
        if not allocation:
            return {"overall_risk": "Unknown", "risk_score": 0}
        
        # Calculate weighted risk score
        total_weight = sum(pool["allocation_percent"] for pool in allocation)
        weighted_risk = sum(
            pool["allocation_percent"] * pool["risk_score"] 
            for pool in allocation
        ) / total_weight if total_weight > 0 else 0
        
        # Determine risk level
        if weighted_risk <= 20:
            risk_level = "Low"
        elif weighted_risk <= 40:
            risk_level = "Medium"
        elif weighted_risk <= 60:
            risk_level = "High"
        else:
            risk_level = "Very High"
        
        # Calculate diversification score
        diversification_score = min(100, len(allocation) * 20)
        
        # Calculate concentration risk
        max_allocation = max(pool["allocation_percent"] for pool in allocation)
        concentration_risk = "Low" if max_allocation <= 40 else "Medium" if max_allocation <= 70 else "High"
        
        return {
            "overall_risk": risk_level,
            "risk_score": round(weighted_risk, 1),
            "diversification_score": diversification_score,
            "concentration_risk": concentration_risk,
            "number_of_pools": len(allocation)
        }
    
    def _generate_action_plan(self, optimal_allocation: List[Dict[str, Any]], 
                            current_portfolio: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Generate step-by-step action plan"""
        actions = []
        
        # Sort by priority (highest return first)
        sorted_allocation = sorted(optimal_allocation, key=lambda x: x["expected_apy"], reverse=True)
        
        for i, pool in enumerate(sorted_allocation):
            actions.append({
                "step": i + 1,
                "action": f"Invest {pool['allocation_amount']} ALGO in {pool['pool_name']}",
                "pool_id": pool["pool_id"],
                "amount": pool["allocation_amount"],
                "expected_apy": pool["expected_apy"],
                "term_days": pool["term_days"],
                "priority": "High" if i < 2 else "Medium"
            })
        
        # Add monitoring recommendations
        actions.append({
            "step": len(actions) + 1,
            "action": "Set up automated monitoring and rebalancing",
            "description": "Monitor portfolio performance and rebalance monthly",
            "priority": "Medium"
        })
        
        return actions
    
    def _calculate_optimization_confidence(self, allocation: List[Dict[str, Any]]) -> float:
        """Calculate confidence in the optimization"""
        if not allocation:
            return 0.0
        
        # More pools = higher confidence (diversification)
        diversification_factor = min(1.0, len(allocation) / 5)
        
        # Balanced allocation = higher confidence
        max_allocation = max(pool["allocation_percent"] for pool in allocation)
        balance_factor = 1.0 - (max_allocation - 20) / 80 if max_allocation > 20 else 1.0
        
        # Risk distribution = higher confidence
        risk_scores = [pool["risk_score"] for pool in allocation]
        risk_variance = statistics.variance(risk_scores) if len(risk_scores) > 1 else 0
        risk_factor = 1.0 - min(1.0, risk_variance / 1000)
        
        confidence = (diversification_factor + balance_factor + risk_factor) / 3
        return round(confidence, 2)
    
    async def get_yield_forecast(self, portfolio: Dict[str, Any], days: int = 30) -> Dict[str, Any]:
        """Get yield forecast for the next N days"""
        try:
            # Simulate AI forecasting delay
            await asyncio.sleep(0.4)
            
            # Mock forecast data (in production, use ML models)
            base_yield = 8.5  # Base APY
            volatility = 0.02  # Daily volatility
            
            forecast_data = []
            cumulative_yield = 0
            
            for day in range(1, days + 1):
                # Simulate daily yield with some randomness
                daily_yield = base_yield / 365 + (volatility * (0.5 - 0.5))  # Random walk
                cumulative_yield += daily_yield
                
                forecast_data.append({
                    "day": day,
                    "daily_yield": round(daily_yield * 100, 4),
                    "cumulative_yield": round(cumulative_yield * 100, 2),
                    "projected_apy": round(cumulative_yield * 365 / day * 100, 2)
                })
            
            return {
                "forecast_period_days": days,
                "forecast_data": forecast_data,
                "projected_total_yield": round(cumulative_yield * 100, 2),
                "confidence": 0.85,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "error": f"Yield forecast failed: {str(e)}",
                "timestamp": datetime.now().isoformat()
            }
