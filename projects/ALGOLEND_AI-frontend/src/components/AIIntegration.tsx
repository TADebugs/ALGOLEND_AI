import React, { useState, useEffect } from 'react'

interface AIAgent {
  name: string
  status: string
  performance: number
  description: string
  last_update: string
  uptime_hours: number
}

interface AccountAnalysis {
  address: string
  credit_score: number
  risk_level: string
  account_age_days: number
  total_transactions: number
  balance_algo: number
  transaction_frequency: number
  risk_factors: string[]
  recommendations: string[]
  ai_confidence: number
  detailed_scores: {
    balance_score: number
    age_score: number
    frequency_score: number
    consistency_score: number
    amount_score: number
    network_score: number
    reputation_score: number
  }
}

interface NetworkStats {
  tps: number
  finality_seconds: number
  fees_microalgos: number
  block_height: number
  last_block_time: string
  network_health: string
}

interface MarketInsights {
  market_sentiment: string
  price_prediction: {
    trend: string
    confidence: number
    predicted_price: number
    predicted_change_percent: number
  }
  lending_opportunities: Array<{
    type: string
    apy: number
    risk: string
    description: string
  }>
  risk_factors: string[]
  recommended_actions: string[]
  market_data: {
    algo_price: number
    market_cap: number
    volume_24h: number
    price_change_24h: number
    fear_greed_index: number
    market_sentiment: string
  }
}

const AIIntegration: React.FC = () => {
  const [aiAgents, setAiAgents] = useState<AIAgent[]>([])
  const [accountAnalysis, setAccountAnalysis] = useState<AccountAnalysis | null>(null)
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null)
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const API_BASE_URL = 'http://localhost:8000'

  useEffect(() => {
    fetchAIAgentsStatus()
    fetchNetworkStats()
    fetchMarketInsights()
    
    // Set up real-time updates
    const interval = setInterval(() => {
      fetchAIAgentsStatus()
      fetchNetworkStats()
      fetchMarketInsights()
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  const fetchAIAgentsStatus = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/ai-agents/status`)
      if (response.ok) {
        const data = await response.json()
        const agents = [
          data.market_oracle,
          data.risk_analyzer
        ]
        setAiAgents(agents)
      }
    } catch (err) {
      console.error('Error fetching AI agents status:', err)
    }
  }

  const fetchNetworkStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/network-stats`)
      if (response.ok) {
        const data = await response.json()
        setNetworkStats(data)
      }
    } catch (err) {
      console.error('Error fetching network stats:', err)
    }
  }

  const fetchMarketInsights = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/market-insights`)
      if (response.ok) {
        const data = await response.json()
        setMarketInsights(data)
      }
    } catch (err) {
      console.error('Error fetching market insights:', err)
    }
  }

  const analyzeAccount = async (address: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/analyze-account`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: address,
          include_transaction_history: true
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAccountAnalysis(data)
      } else {
        const errorData = await response.json()
        setError(errorData.detail || 'Analysis failed')
      }
    } catch (err) {
      setError('Network error: Unable to connect to AI backend')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="ai-integration">
      <h2>AI Integration Dashboard</h2>
      
      {/* AI Agents Status */}
      <div className="ai-agents-section">
        <h3>AI Agents Status</h3>
        <div className="agents-grid">
          {aiAgents.map((agent, index) => (
            <div key={index} className="agent-status-card">
              <div className="agent-header">
                <h4>{agent.name}</h4>
                <span className={`status-indicator ${agent.status.toLowerCase()}`}>
                  {agent.status}
                </span>
              </div>
              <p className="agent-description">{agent.description}</p>
              <div className="agent-metrics">
                <div className="metric">
                  <span className="label">Performance:</span>
                  <span className="value">{agent.performance}%</span>
                </div>
                <div className="metric">
                  <span className="label">Uptime:</span>
                  <span className="value">{agent.uptime_hours.toFixed(1)}h</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Network Stats */}
      {networkStats && (
        <div className="network-stats-section">
          <h3>Live Network Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">TPS</span>
              <span className="stat-value">{networkStats.tps.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Finality</span>
              <span className="stat-value">{networkStats.finality_seconds}s</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Fees</span>
              <span className="stat-value">{networkStats.fees_microalgos} μALGO</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Health</span>
              <span className={`stat-value ${networkStats.network_health.toLowerCase()}`}>
                {networkStats.network_health}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Market Insights */}
      {marketInsights && (
        <div className="market-insights-section">
          <h3>AI Market Insights</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <h4>Market Sentiment</h4>
              <span className={`sentiment ${marketInsights.market_sentiment.toLowerCase().replace(' ', '-')}`}>
                {marketInsights.market_sentiment}
              </span>
            </div>
            <div className="insight-card">
              <h4>Price Prediction</h4>
              <div className="prediction">
                <span className={`trend ${marketInsights.price_prediction.trend}`}>
                  {marketInsights.price_prediction.trend}
                </span>
                <span className="confidence">
                  {Math.round(marketInsights.price_prediction.confidence * 100)}% confidence
                </span>
              </div>
            </div>
            <div className="insight-card">
              <h4>ALGO Price</h4>
              <span className="price">${marketInsights.market_data.algo_price.toFixed(4)}</span>
              <span className={`change ${marketInsights.market_data.price_change_24h >= 0 ? 'positive' : 'negative'}`}>
                {marketInsights.market_data.price_change_24h >= 0 ? '+' : ''}
                {(marketInsights.market_data.price_change_24h * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Account Analysis */}
      <div className="account-analysis-section">
        <h3>AI Account Analysis</h3>
        <div className="analysis-controls">
          <input
            type="text"
            placeholder="Enter Algorand address"
            className="address-input"
            id="analysis-address"
          />
          <button
            onClick={() => {
              const address = (document.getElementById('analysis-address') as HTMLInputElement)?.value
              if (address) analyzeAccount(address)
            }}
            disabled={loading}
            className="analyze-button"
          >
            {loading ? 'Analyzing...' : 'Analyze Account'}
          </button>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        {accountAnalysis && (
          <div className="analysis-results">
            <div className="analysis-header">
              <h4>Analysis Results for {accountAnalysis.address.slice(0, 8)}...</h4>
              <span className={`risk-level ${accountAnalysis.risk_level}`}>
                {accountAnalysis.risk_level}
              </span>
            </div>
            
            <div className="analysis-metrics">
              <div className="metric-card">
                <span className="metric-label">Credit Score</span>
                <span className="metric-value">{accountAnalysis.credit_score}</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">AI Confidence</span>
                <span className="metric-value">{Math.round(accountAnalysis.ai_confidence * 100)}%</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Account Age</span>
                <span className="metric-value">{accountAnalysis.account_age_days} days</span>
              </div>
              <div className="metric-card">
                <span className="metric-label">Balance</span>
                <span className="metric-value">{accountAnalysis.balance_algo} ALGO</span>
              </div>
            </div>

            <div className="detailed-scores">
              <h5>Detailed Analysis Scores</h5>
              <div className="scores-grid">
                {Object.entries(accountAnalysis.detailed_scores).map(([key, value]) => (
                  <div key={key} className="score-item">
                    <span className="score-label">{key.replace('_', ' ')}</span>
                    <div className="score-bar">
                      <div 
                        className="score-fill" 
                        style={{ width: `${value}%` }}
                      ></div>
                    </div>
                    <span className="score-value">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {accountAnalysis.risk_factors.length > 0 && (
              <div className="risk-factors">
                <h5>Risk Factors</h5>
                <ul>
                  {accountAnalysis.risk_factors.map((factor, index) => (
                    <li key={index} className="risk-factor">{factor}</li>
                  ))}
                </ul>
              </div>
            )}

            {accountAnalysis.recommendations.length > 0 && (
              <div className="recommendations">
                <h5>AI Recommendations</h5>
                <ul>
                  {accountAnalysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="recommendation">{recommendation}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AIIntegration

