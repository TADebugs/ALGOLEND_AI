import { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { apiService, liveBackendPref, AccountAnalysisResult } from './services/api'
import {
  AGENTS,
  AgentName,
  RISK_FACTORS,
  RiskProfile,
  SEEDED_LOANS,
  SEEDED_POOLS,
  SeededPool,
  bps,
  oracleSeed,
  riskSeed,
  yieldSeed,
} from './data/seed'

type OracleSnapshot = {
  market_sentiment: string
  lending_opportunities: { type: string; apy: number; risk: string; description: string }[]
  risk_factors: string[]
  recommended_actions: string[]
}
type Receipt = { kind: 'deposit' | 'loan'; title: string; lines: string[] }

const TABS = ['dashboard', 'pools', 'loans', 'agents', 'about'] as const

const Home = () => {
  const { activeAddress, wallets, algodClient } = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('dashboard')
  const [live, setLive] = useState(liveBackendPref.get())
  const [oracle, setOracle] = useState<OracleSnapshot>(oracleSeed)
  const [oracleSource, setOracleSource] = useState<'seeded' | 'live'>('seeded')
  const [profileId, setProfileId] = useState(riskSeed.profiles[0].id)
  const [walletAnalysis, setWalletAnalysis] = useState<AccountAnalysisResult | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<AgentName | null>(null)
  const [selectedPool, setSelectedPool] = useState<SeededPool | null>(null)
  const [investAmount, setInvestAmount] = useState('')
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [loanPurpose, setLoanPurpose] = useState('')
  const [receipts, setReceipts] = useState<Receipt[]>([])
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [lastRound, setLastRound] = useState<number | null>(null)

  const profile: RiskProfile = riskSeed.profiles.find((p) => p.id === profileId) ?? riskSeed.profiles[0]

  const toggleLive = () => {
    const next = !live
    liveBackendPref.set(next)
    setLive(next)
    if (!next) {
      setOracle(oracleSeed)
      setOracleSource('seeded')
      setWalletAnalysis(null)
    }
  }

  // Live backend only when the toggle is on; any failure falls back to the seeded snapshot
  useEffect(() => {
    if (!live) return
    let cancelled = false
    apiService
      .getMarketInsights()
      .then((data) => {
        if (cancelled) return
        setOracle({
          market_sentiment: data.market_sentiment,
          lending_opportunities: data.lending_opportunities,
          risk_factors: data.risk_factors,
          recommended_actions: data.recommended_actions,
        })
        setOracleSource('live')
      })
      .catch(() => {
        if (cancelled) return
        enqueueSnackbar('Live backend unreachable. Showing seeded data.', { variant: 'info' })
      })
    return () => {
      cancelled = true
    }
  }, [live, enqueueSnackbar])

  // Public testnet node (not the app backend): show the current round if it answers, else nothing
  useEffect(() => {
    if (!algodClient) return
    algodClient
      .status()
      .do()
      .then((s) => setLastRound(Number(s.lastRound)))
      .catch(() => setLastRound(null))
  }, [algodClient])

  useEffect(() => {
    if (!activeAddress || !algodClient) {
      setWalletBalance(null)
      return
    }
    algodClient
      .accountInformation(activeAddress)
      .do()
      .then((info) => setWalletBalance(Number(info.amount) / 1_000_000))
      .catch(() => setWalletBalance(null))
  }, [activeAddress, algodClient])

  const analyzeWallet = async () => {
    if (!activeAddress) return
    setAnalyzing(true)
    try {
      setWalletAnalysis(await apiService.analyzeAccount(activeAddress))
    } catch {
      enqueueSnackbar('Live backend could not analyze this wallet. Seeded profiles still work.', { variant: 'info' })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleWalletConnect = async (walletId: string) => {
    try {
      await wallets.find((w) => w.id === walletId)?.connect()
      setShowWalletModal(false)
    } catch {
      enqueueSnackbar('Wallet connection was cancelled.', { variant: 'info' })
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      await wallets.find((w) => w.isConnected)?.disconnect()
    } catch {
      // nothing to undo
    }
  }

  // Deposits and loan requests are simulated: no LendingPool app is deployed to testnet yet
  const submitDeposit = () => {
    if (!selectedPool || !(parseFloat(investAmount) > 0)) return
    const amount = parseFloat(investAmount)
    setReceipts((r) => [
      {
        kind: 'deposit',
        title: `Deposit · ${selectedPool.name}`,
        lines: [
          `${amount} ALGO at ${bps(selectedPool.apy)} bps`,
          `Projected 1-year interest: ${((amount * selectedPool.apy) / 100).toFixed(2)} ALGO`,
          'Simulated: no transaction was sent',
        ],
      },
      ...r,
    ])
    setSelectedPool(null)
    setInvestAmount('')
  }

  const submitLoan = () => {
    if (!(parseFloat(loanAmount) > 0) || !loanPurpose.trim()) return
    setReceipts((r) => [
      {
        kind: 'loan',
        title: `Loan request · ${loanAmount} ALGO`,
        lines: [`${loanTerm}-day term`, `Purpose: ${loanPurpose.trim()}`, 'Simulated: no transaction was sent'],
      },
      ...r,
    ])
    setShowLoanModal(false)
    setLoanAmount('')
    setLoanTerm('30')
    setLoanPurpose('')
  }

  const riskReadout = (r: { credit_score: number; risk_level: string; risk_factors: string[]; recommendations: string[] }) => (
    <div className="analysis-result">
      <div className="score-display">
        <span className="score-label">Credit score (0–100)</span>
        <span className="score-value">{r.credit_score}</span>
      </div>
      <div className="risk-level">
        Grade: <span className="highlight">{r.risk_level}</span>
      </div>
      <div className="risk-factors">
        <h4>Risk factors</h4>
        {r.risk_factors.length ? (
          <ul>
            {r.risk_factors.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        ) : (
          <p className="muted">None flagged</p>
        )}
      </div>
      <div className="risk-factors">
        <h4>Recommendations</h4>
        <ul>
          {r.recommendations.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </div>
  )

  return (
    <div className="app">
      <div className="demo-banner" role="status">
        <span>
          <strong>{live ? 'Live backend' : 'Seeded demo'}</strong> · Algorand TestNet ·{' '}
          {live ? 'agent calls go to the live API, seeded data if it fails' : 'no backend calls, nothing is sent on-chain'}
        </span>
        <label className="live-toggle">
          <input type="checkbox" checked={live} onChange={toggleLive} />
          <span>Live backend</span>
        </label>
      </div>

      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-name">AlgoLend AI</span>
        </div>
        <div className="nav-tabs">
          {TABS.map((tab) => (
            <button key={tab} className={`nav-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="nav-actions">
          {activeAddress ? (
            <button className="wallet-connected" onClick={handleDisconnectWallet} title="Disconnect">
              <div className="wallet-info">
                <span className="wallet-address">
                  {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
                </span>
                {walletBalance !== null && <span className="wallet-balance">{walletBalance.toFixed(2)} ALGO (testnet)</span>}
              </div>
            </button>
          ) : (
            <button className="btn-secondary" onClick={() => setShowWalletModal(true)}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {activeTab === 'dashboard' && (
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                AI-assisted lending <br />
                <span className="gradient-text">on Algorand TestNet.</span>
              </h1>
              <p className="hero-subtitle">
                A lending-pool contract plus three agents: Market Oracle, Risk Analyzer and Yield Optimizer. Everything below is
                their real output on seeded inputs.
              </p>
              <div className="hero-actions">
                <button className="btn-primary large" onClick={() => setActiveTab('agents')}>
                  Meet the agents
                </button>
                <button className="btn-secondary large" onClick={() => setActiveTab('about')}>
                  What's real here
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            <section className="portfolio-panel">
              <h2 className="section-title">Risk Analyzer</h2>
              <div className="panel-content">
                <div className="chart-container">
                  <div className="profile-picker" role="radiogroup" aria-label="Seeded account profile">
                    {riskSeed.profiles.map((p) => (
                      <button
                        key={p.id}
                        role="radio"
                        aria-checked={p.id === profileId}
                        className={`nav-tab ${p.id === profileId ? 'active' : ''}`}
                        onClick={() => setProfileId(p.id)}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                  <p className="muted">{profile.summary} (synthetic profile)</p>
                  <div className="weight-bars">
                    {RISK_FACTORS.map((f) => {
                      const weight = riskSeed.weights[f.weight]
                      const score = profile.result.detailed_scores[f.score]
                      return (
                        <div key={f.weight} className="weight-row">
                          <span className="weight-label">
                            {f.label} <span className="muted">×{weight.toFixed(2)}</span>
                          </span>
                          <div className="progress-bar" aria-hidden="true">
                            <div className="progress-fill" style={{ width: `${score}%` }} />
                          </div>
                          <span className="weight-value">{score}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="ai-insights">{riskReadout(profile.result)}</div>
              </div>
              {live && (
                <div className="live-analyze">
                  {activeAddress ? (
                    <button className="btn-secondary" onClick={analyzeWallet} disabled={analyzing}>
                      {analyzing ? 'Analyzing…' : 'Analyze my testnet wallet (live)'}
                    </button>
                  ) : (
                    <p className="muted">Connect a testnet wallet to score it with the live backend.</p>
                  )}
                  {walletAnalysis && riskReadout(walletAnalysis)}
                </div>
              )}
            </section>

            <section className="portfolio-panel">
              <h2 className="section-title">Market Oracle</h2>
              <div className="panel-content">
                <div className="ai-insights">
                  <div className="insight-item">
                    <span className="insight-label">Sentiment</span>
                    <span className="insight-value">{oracle.market_sentiment}</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Recommended actions</span>
                    <div className="recommendations">
                      {oracle.recommended_actions.map((a) => (
                        <span key={a} className="recommendation-tag">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                  <p className="muted">
                    {oracleSource === 'live' ? 'Live backend output.' : 'Seeded snapshot.'} The oracle reads a mock market feed
                    in this build.
                  </p>
                </div>
                <div className="chart-container">
                  <h3>Lending calls</h3>
                  {oracle.lending_opportunities.map((o) => (
                    <div key={o.type} className="stat-item">
                      <span className="stat-label">
                        {o.type} · {o.risk} risk
                      </span>
                      <span className="stat-value">{bps(o.apy)} bps</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="portfolio-panel">
              <h2 className="section-title">Network</h2>
              <div className="network-stats">
                <div className="stat-item">
                  <span className="stat-label">Network</span>
                  <span className="stat-value">Algorand TestNet</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Min. transaction fee</span>
                  <span className="stat-value">0.001 ALGO</span>
                </div>
                {lastRound !== null && (
                  <div className="stat-item">
                    <span className="stat-label">Current round</span>
                    <span className="stat-value">{lastRound.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </section>

            {receipts.length > 0 && (
              <section className="portfolio-panel">
                <h2 className="section-title">Your simulated activity</h2>
                {receipts.map((r, i) => (
                  <div key={i} className="receipt">
                    <h3>{r.title}</h3>
                    {r.lines.map((l) => (
                      <p key={l} className="muted">
                        {l}
                      </p>
                    ))}
                  </div>
                ))}
              </section>
            )}
          </div>
        )}

        {activeTab === 'pools' && (
          <div className="pools-section">
            <div className="section-header">
              <h2 className="section-title">Lending Pools</h2>
            </div>
            <p className="muted">Seeded pools, the same five the Yield Optimizer allocates across. Risk score 0–100, lower is safer.</p>
            <div className="pools-grid">
              {SEEDED_POOLS.map((pool) => (
                <div key={pool.id} className="pool-card">
                  <div className="pool-header">
                    <h3>{pool.name}</h3>
                    <span className="risk-badge">risk {pool.riskScore}</span>
                  </div>
                  <div className="pool-metrics">
                    <div className="metric-row">
                      <span>Rate</span>
                      <span className="highlight">
                        {bps(pool.apy)} bps ({pool.apy}% APY)
                      </span>
                    </div>
                    <div className="metric-row">
                      <span>Term</span>
                      <span>{pool.termDays} days</span>
                    </div>
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => {
                      setSelectedPool(pool)
                      setInvestAmount('')
                    }}
                  >
                    Simulate deposit
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="loans-section">
            <div className="section-header">
              <h2 className="section-title">Loan Requests</h2>
            </div>
            <p className="muted">Seeded requests from fictional borrowers.</p>
            <div className="section-actions">
              <button className="btn-primary" onClick={() => setShowLoanModal(true)}>
                Simulate loan request
              </button>
            </div>
            <div className="loans-grid">
              {SEEDED_LOANS.map((loan) => (
                <div key={loan.id} className="loan-card">
                  <div className="loan-header">
                    <h3>{loan.borrower}</h3>
                    <span className="risk-badge">{loan.risk}</span>
                  </div>
                  <div className="loan-metrics">
                    <div className="metric-row">
                      <span>Amount</span>
                      <span>{loan.amount.toLocaleString()} ALGO</span>
                    </div>
                    <div className="metric-row">
                      <span>Funded</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${loan.funded}%` }}></div>
                      </div>
                      <span>{loan.funded}%</span>
                    </div>
                    <div className="metric-row">
                      <span>Term</span>
                      <span>{loan.term}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div className="ai-section">
            <h2 className="section-title">Agents</h2>
            <div className="agents-grid">
              {AGENTS.map((agent) => (
                <button key={agent.name} className="agent-card clickable" onClick={() => setSelectedAgent(agent.name)}>
                  <div className="agent-header">
                    <h3>{agent.name}</h3>
                  </div>
                  <p className="agent-description">{agent.description}</p>
                  <code className="muted">{agent.file}</code>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'about' && (
          <div className="transparency-section">
            <h2 className="section-title">What's real here</h2>
            <div className="transparency-grid">
              <div className="transparency-card">
                <h3>Agents</h3>
                <p>
                  The numbers on this page come from running the backend's own Python agents on synthetic inputs
                  (<code>backend/scripts/generate_demo_seed.py</code>). The Risk Analyzer is a fixed-weight rule score, not a
                  trained model, and there is no labeled data to measure its accuracy against, so no accuracy is claimed.
                </p>
              </div>
              <div className="transparency-card">
                <h3>Chain</h3>
                <p>
                  Wallet connect and balance read use Algorand TestNet. The LendingPool contract (deposit, withdraw, borrow,
                  repay; rate in basis points) is in the repo but not deployed, so deposits and loan requests here are
                  simulated and send nothing.
                </p>
              </div>
              <div className="transparency-card">
                <h3>Live backend</h3>
                <p>
                  Off by default. When on, the Market Oracle panel and wallet scoring call the FastAPI backend. If it is
                  asleep or down, the page keeps showing seeded data.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-bottom">
          <p>
            AlgoLend AI · seeded demo on Algorand TestNet ·{' '}
            <a href="https://github.com/TADebugs/ALGOLEND_AI" target="_blank" rel="noopener noreferrer">
              source
            </a>
          </p>
        </div>
      </footer>

      {selectedAgent && (
        <div className="modal-overlay" onClick={() => setSelectedAgent(null)}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-label={selectedAgent} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAgent}</h2>
              <button className="modal-close" aria-label="Close" onClick={() => setSelectedAgent(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p>{AGENTS.find((a) => a.name === selectedAgent)?.description}</p>

              {selectedAgent === 'Risk Analyzer' && (
                <div className="sample-analysis">
                  <h3>Weights</h3>
                  <ul>
                    {RISK_FACTORS.map((f) => (
                      <li key={f.weight}>
                        {f.label}: {riskSeed.weights[f.weight].toFixed(2)}
                      </li>
                    ))}
                  </ul>
                  <h3>Seeded output · {profile.label}</h3>
                  {riskReadout(profile.result)}
                </div>
              )}

              {selectedAgent === 'Yield Optimizer' && (
                <div className="optimization-demo">
                  <h3>
                    Seeded run · {yieldSeed.preferences.investment_amount.toLocaleString()} ALGO, {yieldSeed.preferences.risk_tolerance}{' '}
                    risk, {yieldSeed.preferences.time_horizon} days
                  </h3>
                  {yieldSeed.result.optimal_allocation.map((a) => (
                    <div key={a.pool_id} className="allocation-item">
                      <span>{a.pool_name}</span>
                      <span>
                        {a.allocation_percent}% · {a.allocation_amount.toLocaleString()} ALGO · {bps(a.expected_apy)} bps
                      </span>
                    </div>
                  ))}
                  <div className="expected-return">
                    Weighted rate {bps(yieldSeed.result.expected_returns.weighted_apy)} bps · projected{' '}
                    {yieldSeed.result.expected_returns.expected_profit} ALGO over {yieldSeed.preferences.time_horizon} days
                  </div>
                  <ol>
                    {yieldSeed.result.action_plan.map((s) => (
                      <li key={s.step}>{s.action}</li>
                    ))}
                  </ol>
                </div>
              )}

              {selectedAgent === 'Market Oracle' && (
                <div className="live-demo-section">
                  <h3>{oracleSource === 'live' ? 'Live output' : 'Seeded snapshot'}</h3>
                  <p>Sentiment: {oracle.market_sentiment}</p>
                  <ul>
                    {oracle.lending_opportunities.map((o) => (
                      <li key={o.type}>
                        {o.type}: {bps(o.apy)} bps, {o.risk} risk. {o.description}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selectedPool && (
        <div className="modal-overlay" onClick={() => setSelectedPool(null)}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-label={`Deposit to ${selectedPool.name}`} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Deposit · {selectedPool.name}</h2>
              <button className="modal-close" aria-label="Close" onClick={() => setSelectedPool(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="investment-form">
                <label htmlFor="invest-amount">Amount (ALGO)</label>
                <input
                  id="invest-amount"
                  type="number"
                  min="0"
                  placeholder="100"
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="amount-input"
                />
                {parseFloat(investAmount) > 0 && (
                  <div className="investment-preview">
                    <div className="preview-row">
                      <span>Rate</span>
                      <span>{bps(selectedPool.apy)} bps</span>
                    </div>
                    <div className="preview-row">
                      <span>Projected 1-year interest</span>
                      <span className="highlight">{((parseFloat(investAmount) * selectedPool.apy) / 100).toFixed(2)} ALGO</span>
                    </div>
                  </div>
                )}
              </div>
              <p className="muted">Simulated. No transaction is sent and no wallet is needed.</p>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setSelectedPool(null)}>
                  Cancel
                </button>
                <button className="btn-primary" onClick={submitDeposit} disabled={!(parseFloat(investAmount) > 0)}>
                  Simulate deposit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLoanModal && (
        <div className="modal-overlay" onClick={() => setShowLoanModal(false)}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-label="Loan request" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Loan request</h2>
              <button className="modal-close" aria-label="Close" onClick={() => setShowLoanModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="loan-form">
                <div className="form-group">
                  <label htmlFor="loan-amount">Amount (ALGO)</label>
                  <input
                    id="loan-amount"
                    type="number"
                    min="0"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="amount-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="loan-term">Term</label>
                  <select id="loan-term" value={loanTerm} onChange={(e) => setLoanTerm(e.target.value)} className="term-select">
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">180 days</option>
                    <option value="365">365 days</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="loan-purpose">Purpose</label>
                  <textarea
                    id="loan-purpose"
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    className="purpose-input"
                    rows={3}
                  />
                </div>
                <p className="muted">Simulated. No transaction is sent and no wallet is needed.</p>
                <div className="modal-actions">
                  <button className="btn-secondary" onClick={() => setShowLoanModal(false)}>
                    Cancel
                  </button>
                  <button className="btn-primary" onClick={submitLoan} disabled={!(parseFloat(loanAmount) > 0) || !loanPurpose.trim()}>
                    Simulate request
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showWalletModal && (
        <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="modal-content" role="dialog" aria-modal="true" aria-label="Connect wallet" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Connect a TestNet wallet</h2>
              <button className="modal-close" aria-label="Close" onClick={() => setShowWalletModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="wallet-description">Optional. The demo works without a wallet; connecting only shows your testnet balance.</p>
              <div className="wallet-grid">
                {wallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    className={`wallet-option ${wallet.isConnected ? 'connected' : ''}`}
                    onClick={() => !wallet.isConnected && handleWalletConnect(wallet.id)}
                  >
                    <div className="wallet-icon">
                      <img src={wallet.metadata.icon} alt="" />
                    </div>
                    <div className="wallet-info">
                      <h3>{wallet.metadata.name}</h3>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
