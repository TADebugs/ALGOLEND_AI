// Seeded demo data. The agent outputs (riskSeed/yieldSeed/oracleSeed.json) are produced by
// running the backend's own Python agents: backend/scripts/generate_demo_seed.py
import riskSeed from './riskSeed.json'
import yieldSeed from './yieldSeed.json'
import oracleSeed from './oracleSeed.json'

export { riskSeed, yieldSeed, oracleSeed }

export type RiskProfile = (typeof riskSeed.profiles)[number]
export type RiskResult = RiskProfile['result']

// Labels for RiskAnalyzer.weights keys and the matching detailed_scores keys
export const RISK_FACTORS: { weight: keyof typeof riskSeed.weights; score: keyof RiskResult['detailed_scores']; label: string }[] = [
  { weight: 'balance', score: 'balance_score', label: 'Balance' },
  { weight: 'account_age', score: 'age_score', label: 'Account age' },
  { weight: 'transaction_frequency', score: 'frequency_score', label: 'Tx frequency' },
  { weight: 'transaction_consistency', score: 'consistency_score', label: 'Tx consistency' },
  { weight: 'transaction_amounts', score: 'amount_score', label: 'Tx amounts' },
  { weight: 'network_activity', score: 'network_score', label: 'Network activity' },
  { weight: 'reputation', score: 'reputation_score', label: 'Reputation' },
]

// Same pools the backend's YieldOptimizer uses (backend/ai/yield_optimizer.py); risk score is 0–100, lower is safer
export const SEEDED_POOLS = [
  { id: 'stable_pool', name: 'Stable Yield Pool', apy: 8.5, riskScore: 15, termDays: 30 },
  { id: 'growth_pool', name: 'High Growth Pool', apy: 12.3, riskScore: 35, termDays: 60 },
  { id: 'conservative_pool', name: 'Conservative Pool', apy: 6.2, riskScore: 8, termDays: 15 },
  { id: 'defi_pool', name: 'DeFi Innovation Pool', apy: 15.8, riskScore: 55, termDays: 90 },
  { id: 'liquid_pool', name: 'Liquid Staking Pool', apy: 7.1, riskScore: 12, termDays: 7 },
]

export type SeededPool = (typeof SEEDED_POOLS)[number]

// APY as basis points, the unit the LendingPool contract stores
export const bps = (apy: number) => Math.round(apy * 100)

export const SEEDED_LOANS = [
  { id: 1, borrower: 'Tech Startup', amount: 50000, funded: 75, risk: 'B+', term: '90 days' },
  { id: 2, borrower: 'Real Estate', amount: 120000, funded: 45, risk: 'A-', term: '180 days' },
  { id: 3, borrower: 'Small Business', amount: 25000, funded: 90, risk: 'A+', term: '60 days' },
]

export const AGENTS = [
  {
    name: 'Market Oracle',
    file: 'backend/ai/market_oracle.py',
    description: 'Calls market sentiment and lending opportunities. Reads a mock market feed in this build.',
  },
  {
    name: 'Risk Analyzer',
    file: 'backend/ai/risk_analyzer.py',
    description: 'Scores an account 0–100 from seven weighted on-chain factors and maps it to a grade (A+ … D).',
  },
  {
    name: 'Yield Optimizer',
    file: 'backend/ai/yield_optimizer.py',
    description: 'Splits a deposit across pools by risk tolerance and term, then returns an action plan.',
  },
] as const

export type AgentName = (typeof AGENTS)[number]['name']
