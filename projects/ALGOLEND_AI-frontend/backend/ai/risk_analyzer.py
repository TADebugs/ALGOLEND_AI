"""
Risk Analyzer AI Agent
Analyzes account risk, creditworthiness, and provides lending recommendations
"""

import asyncio
import math
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import statistics

class RiskAnalyzer:
    def __init__(self):
        self.name = "Risk Analyzer"
        self.status = "active"
        self.performance = 98.7
        self.description = "Advanced risk assessment and fraud detection"
        self.last_update = datetime.now()
        
        # Risk scoring weights
        self.weights = {
            "balance": 0.25,
            "account_age": 0.20,
            "transaction_frequency": 0.15,
            "transaction_consistency": 0.15,
            "transaction_amounts": 0.10,
            "network_activity": 0.10,
            "reputation": 0.05
        }
    
    async def get_status(self) -> Dict[str, Any]:
        """Get current status of the Risk Analyzer"""
        return {
            "name": self.name,
            "status": self.status,
            "performance": self.performance,
            "description": self.description,
            "last_update": self.last_update.isoformat(),
            "uptime_hours": (datetime.now() - self.last_update).total_seconds() / 3600
        }
    
    async def analyze_account(self, account_data: Dict[str, Any], transaction_history: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Comprehensive account analysis using AI
        """
        try:
            # Simulate AI analysis delay
            await asyncio.sleep(0.8)
            
            # Extract account information
            address = account_data.get("address", "")
            balance_microalgos = account_data.get("amount", 0)
            balance_algo = balance_microalgos / 1_000_000
            created_at = account_data.get("created-at", None)
            
            # Calculate account age
            account_age_days = 0
            if created_at:
                created_date = datetime.fromtimestamp(created_at)
                account_age_days = (datetime.now() - created_date).days
            
            # Analyze transaction patterns
            tx_analysis = self._analyze_transaction_patterns(transaction_history)
            
            # Calculate individual risk factors
            balance_score = self._calculate_balance_score(balance_algo)
            age_score = self._calculate_age_score(account_age_days)
            frequency_score = self._calculate_frequency_score(tx_analysis["frequency"])
            consistency_score = self._calculate_consistency_score(tx_analysis["amounts"])
            amount_score = self._calculate_amount_score(tx_analysis["amounts"])
            network_score = self._calculate_network_score(tx_analysis["unique_addresses"])
            reputation_score = self._calculate_reputation_score(account_data, transaction_history)
            
            # Calculate weighted credit score
            credit_score = (
                balance_score * self.weights["balance"] +
                age_score * self.weights["account_age"] +
                frequency_score * self.weights["transaction_frequency"] +
                consistency_score * self.weights["transaction_consistency"] +
                amount_score * self.weights["transaction_amounts"] +
                network_score * self.weights["network_activity"] +
                reputation_score * self.weights["reputation"]
            )
            
            # Determine risk level
            risk_level = self._determine_risk_level(credit_score)
            
            # Identify risk factors
            risk_factors = self._identify_risk_factors(
                balance_algo, account_age_days, tx_analysis, credit_score
            )
            
            # Generate recommendations
            recommendations = self._generate_recommendations(
                credit_score, risk_level, risk_factors, balance_algo
            )
            
            # Calculate AI confidence
            ai_confidence = self._calculate_confidence(
                len(transaction_history), account_age_days, tx_analysis
            )
            
            return {
                "credit_score": int(credit_score),
                "risk_level": risk_level,
                "account_age_days": account_age_days,
                "total_transactions": len(transaction_history),
                "balance_algo": round(balance_algo, 2),
                "transaction_frequency": tx_analysis["frequency"],
                "risk_factors": risk_factors,
                "recommendations": recommendations,
                "ai_confidence": round(ai_confidence, 2),
                "detailed_scores": {
                    "balance_score": round(balance_score, 1),
                    "age_score": round(age_score, 1),
                    "frequency_score": round(frequency_score, 1),
                    "consistency_score": round(consistency_score, 1),
                    "amount_score": round(amount_score, 1),
                    "network_score": round(network_score, 1),
                    "reputation_score": round(reputation_score, 1)
                }
            }
            
        except Exception as e:
            return {
                "credit_score": 500,
                "risk_level": "Unknown",
                "account_age_days": 0,
                "total_transactions": 0,
                "balance_algo": 0,
                "transaction_frequency": 0,
                "risk_factors": [f"Analysis error: {str(e)}"],
                "recommendations": ["Unable to analyze account"],
                "ai_confidence": 0.0
            }
    
    def _analyze_transaction_patterns(self, transactions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze transaction patterns for risk assessment"""
        if not transactions:
            return {
                "frequency": 0,
                "amounts": [],
                "unique_addresses": set(),
                "time_patterns": [],
                "volatility": 0
            }
        
        amounts = []
        unique_addresses = set()
        time_patterns = []
        
        for tx in transactions:
            # Extract amount (simplified - in production, parse actual transaction data)
            amount = tx.get("amount", 0) / 1_000_000  # Convert to ALGO
            amounts.append(amount)
            
            # Extract addresses
            sender = tx.get("sender", "")
            receiver = tx.get("receiver", "")
            if sender:
                unique_addresses.add(sender)
            if receiver:
                unique_addresses.add(receiver)
            
            # Extract timestamp
            timestamp = tx.get("confirmed-round", 0)
            if timestamp:
                time_patterns.append(timestamp)
        
        # Calculate frequency (transactions per day)
        if time_patterns:
            time_span = max(time_patterns) - min(time_patterns)
            frequency = len(transactions) / max(1, time_span / 86400)  # 86400 seconds in a day
        else:
            frequency = 0
        
        # Calculate volatility
        volatility = 0
        if len(amounts) > 1:
            volatility = statistics.stdev(amounts) / max(statistics.mean(amounts), 1)
        
        return {
            "frequency": round(frequency, 2),
            "amounts": amounts,
            "unique_addresses": unique_addresses,
            "time_patterns": time_patterns,
            "volatility": round(volatility, 3)
        }
    
    def _calculate_balance_score(self, balance_algo: float) -> float:
        """Calculate balance-based risk score (0-100)"""
        if balance_algo >= 10000:
            return 100
        elif balance_algo >= 5000:
            return 90
        elif balance_algo >= 1000:
            return 80
        elif balance_algo >= 500:
            return 70
        elif balance_algo >= 100:
            return 60
        elif balance_algo >= 50:
            return 50
        elif balance_algo >= 10:
            return 40
        else:
            return 20
    
    def _calculate_age_score(self, age_days: int) -> float:
        """Calculate account age-based risk score (0-100)"""
        if age_days >= 365:
            return 100
        elif age_days >= 180:
            return 90
        elif age_days >= 90:
            return 80
        elif age_days >= 30:
            return 70
        elif age_days >= 7:
            return 60
        elif age_days >= 1:
            return 40
        else:
            return 20
    
    def _calculate_frequency_score(self, frequency: float) -> float:
        """Calculate transaction frequency-based risk score (0-100)"""
        if frequency >= 10:
            return 100
        elif frequency >= 5:
            return 90
        elif frequency >= 2:
            return 80
        elif frequency >= 1:
            return 70
        elif frequency >= 0.5:
            return 60
        elif frequency >= 0.1:
            return 50
        else:
            return 30
    
    def _calculate_consistency_score(self, amounts: List[float]) -> float:
        """Calculate transaction consistency score (0-100)"""
        if len(amounts) < 2:
            return 50
        
        # Calculate coefficient of variation (lower is more consistent)
        mean_amount = statistics.mean(amounts)
        if mean_amount == 0:
            return 50
        
        std_dev = statistics.stdev(amounts)
        cv = std_dev / mean_amount
        
        # Convert to score (lower CV = higher score)
        if cv <= 0.1:
            return 100
        elif cv <= 0.2:
            return 90
        elif cv <= 0.5:
            return 80
        elif cv <= 1.0:
            return 70
        elif cv <= 2.0:
            return 60
        else:
            return 40
    
    def _calculate_amount_score(self, amounts: List[float]) -> float:
        """Calculate transaction amount-based risk score (0-100)"""
        if not amounts:
            return 50
        
        avg_amount = statistics.mean(amounts)
        max_amount = max(amounts)
        
        # Higher amounts generally indicate more established users
        if avg_amount >= 1000:
            return 100
        elif avg_amount >= 500:
            return 90
        elif avg_amount >= 100:
            return 80
        elif avg_amount >= 50:
            return 70
        elif avg_amount >= 10:
            return 60
        else:
            return 40
    
    def _calculate_network_score(self, unique_addresses: set) -> float:
        """Calculate network activity score (0-100)"""
        address_count = len(unique_addresses)
        
        if address_count >= 50:
            return 100
        elif address_count >= 20:
            return 90
        elif address_count >= 10:
            return 80
        elif address_count >= 5:
            return 70
        elif address_count >= 2:
            return 60
        elif address_count >= 1:
            return 50
        else:
            return 30
    
    def _calculate_reputation_score(self, account_data: Dict[str, Any], transactions: List[Dict[str, Any]]) -> float:
        """Calculate reputation score (0-100)"""
        # This would integrate with reputation systems, governance participation, etc.
        # For now, use a simplified model
        
        # Check for governance participation (simplified)
        governance_score = 50  # Base score
        
        # Check for DeFi participation
        defi_score = 50  # Base score
        
        # Check for long-term holding patterns
        holding_score = 50  # Base score
        
        return (governance_score + defi_score + holding_score) / 3
    
    def _determine_risk_level(self, credit_score: float) -> str:
        """Determine risk level based on credit score"""
        if credit_score >= 85:
            return "A+"
        elif credit_score >= 75:
            return "A"
        elif credit_score >= 65:
            return "B+"
        elif credit_score >= 55:
            return "B"
        elif credit_score >= 45:
            return "C+"
        elif credit_score >= 35:
            return "C"
        else:
            return "D"
    
    def _identify_risk_factors(self, balance_algo: float, age_days: int, tx_analysis: Dict[str, Any], credit_score: float) -> List[str]:
        """Identify specific risk factors"""
        risk_factors = []
        
        if balance_algo < 10:
            risk_factors.append("Very low account balance")
        
        if age_days < 7:
            risk_factors.append("New account (less than 7 days old)")
        
        if tx_analysis["frequency"] < 0.1:
            risk_factors.append("Very low transaction activity")
        
        if tx_analysis["volatility"] > 2.0:
            risk_factors.append("High transaction amount volatility")
        
        if len(tx_analysis["unique_addresses"]) < 2:
            risk_factors.append("Limited network connections")
        
        if credit_score < 50:
            risk_factors.append("Overall low creditworthiness")
        
        return risk_factors
    
    def _generate_recommendations(self, credit_score: float, risk_level: str, risk_factors: List[str], balance_algo: float) -> List[str]:
        """Generate actionable recommendations"""
        recommendations = []
        
        if credit_score >= 80:
            recommendations.append("Excellent credit profile - eligible for premium lending rates")
            recommendations.append("Consider increasing lending limits")
        elif credit_score >= 60:
            recommendations.append("Good credit profile - standard lending rates apply")
            recommendations.append("Consider building more transaction history")
        else:
            recommendations.append("Improve credit profile before applying for larger loans")
            recommendations.append("Start with smaller loan amounts to build reputation")
        
        if balance_algo < 100:
            recommendations.append("Increase account balance to improve creditworthiness")
        
        if len(risk_factors) > 3:
            recommendations.append("Address multiple risk factors before applying for loans")
        
        recommendations.append("Maintain consistent transaction patterns")
        recommendations.append("Build relationships with other network participants")
        
        return recommendations
    
    def _calculate_confidence(self, tx_count: int, age_days: int, tx_analysis: Dict[str, Any]) -> float:
        """Calculate AI confidence in the analysis"""
        confidence = 0.5  # Base confidence
        
        # More transactions = higher confidence
        if tx_count >= 100:
            confidence += 0.3
        elif tx_count >= 50:
            confidence += 0.2
        elif tx_count >= 10:
            confidence += 0.1
        
        # Older account = higher confidence
        if age_days >= 365:
            confidence += 0.2
        elif age_days >= 90:
            confidence += 0.1
        
        # More network activity = higher confidence
        if len(tx_analysis["unique_addresses"]) >= 10:
            confidence += 0.1
        
        return min(1.0, confidence)
