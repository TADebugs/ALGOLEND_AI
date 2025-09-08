// API service for AlgoLend AI backend integration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export interface AccountAnalysisResult {
  address: string
  credit_score: number
  risk_level: string
  analysis_timestamp: string
  risk_factors: string[]
  recommendations: string[]
  transaction_count: number
  total_volume: number
}

export interface NetworkStats {
  tps: number
  finality_seconds: number
  fees_microalgos: number
  block_height: number
  last_block_time: string
  network_health: string
}

export interface AIAgentStatus {
  name: string
  status: string
  performance: number
  last_update: string
}

export interface MarketInsights {
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
  timestamp: string
}

export interface LendingPool {
  id: string
  name: string
  apy: number
  risk_level: string
  total_liquidity: number
  available_liquidity: number
  min_deposit: number
  max_deposit: number
}

// API Functions
export const apiService = {
  // Health check
  async healthCheck() {
    const response = await fetch(`${API_BASE_URL}/health`)
    return response.json()
  },

  // Analyze account for credit scoring
  async analyzeAccount(address: string, network: string = 'testnet'): Promise<AccountAnalysisResult> {
    const response = await fetch(`${API_BASE_URL}/api/analyze-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        address,
        network
      })
    })
    
    if (!response.ok) {
      throw new Error(`Failed to analyze account: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get network statistics
  async getNetworkStats(): Promise<NetworkStats> {
    const response = await fetch(`${API_BASE_URL}/api/network-stats`)
    
    if (!response.ok) {
      throw new Error(`Failed to get network stats: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get AI agents status
  async getAIAgentsStatus(): Promise<{ market_oracle: AIAgentStatus, risk_analyzer: AIAgentStatus, timestamp: string }> {
    const response = await fetch(`${API_BASE_URL}/api/ai-agents/status`)
    
    if (!response.ok) {
      throw new Error(`Failed to get AI agents status: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Get market insights
  async getMarketInsights(): Promise<MarketInsights> {
    const response = await fetch(`${API_BASE_URL}/api/market-insights`)
    
    if (!response.ok) {
      throw new Error(`Failed to get market insights: ${response.statusText}`)
    }
    
    return response.json()
  },

  // Analyze lending pool
  async analyzeLendingPool(poolId: string, poolData: any): Promise<{
    pool_id: string
    apy: number
    risk_score: number
    tvl_algo: number
    utilization_rate: number
    ai_recommendation: string
    confidence_score: number
  }> {
    const response = await fetch(`${API_BASE_URL}/api/analyze-lending-pool?pool_id=${poolId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pool_data: poolData })
    })
    
    if (!response.ok) {
      throw new Error(`Failed to analyze lending pool: ${response.statusText}`)
    }
    
    return response.json()
  }
}

export default apiService
