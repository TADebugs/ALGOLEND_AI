import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metrics, setMetrics] = useState({
    totalEarned: 12450.32,
    aiCreditScore: 847,
    activePositions: 12,
    reputation: 98.5
  })

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        totalEarned: prev.totalEarned + (Math.random() * 10 - 5),
        aiCreditScore: Math.max(800, Math.min(900, prev.aiCreditScore + (Math.random() * 4 - 2))),
        activePositions: prev.activePositions + (Math.random() > 0.9 ? 1 : 0),
        reputation: Math.max(95, Math.min(100, prev.reputation + (Math.random() * 0.2 - 0.1)))
      }))
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const lendingPools = [
    { id: 1, name: "Stable Yield Pool", apy: 8.5, risk: "A+", tvl: 2.4, term: "30 days" },
    { id: 2, name: "High Growth Pool", apy: 12.3, risk: "B+", tvl: 1.8, term: "60 days" },
    { id: 3, name: "Conservative Pool", apy: 6.2, risk: "A", tvl: 3.2, term: "15 days" }
  ]

  const loanRequests = [
    { id: 1, borrower: "Tech Startup", amount: 50000, funded: 75, risk: "B+", term: "90 days" },
    { id: 2, borrower: "Real Estate", amount: 120000, funded: 45, risk: "A-", term: "180 days" },
    { id: 3, borrower: "Small Business", amount: 25000, funded: 90, risk: "A+", term: "60 days" }
  ]

  const aiAgents = [
    { name: "Market Oracle", status: "Active", performance: 94.2, description: "Real-time market analysis" },
    { name: "Fraud Detective", status: "Active", performance: 98.7, description: "Risk assessment & fraud detection" },
    { name: "Yield Optimizer", status: "Active", performance: 91.5, description: "Portfolio optimization" }
  ]

  return (
    <div className="app">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-brand">
          <div className="logo">🚀</div>
          <span className="brand-name">AlgoLend AI</span>
      </div>
        <div className="nav-tabs">
          {['dashboard', 'pools', 'loans', 'ai', 'transparency'].map(tab => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
          ))}
        </div>
        <div className="nav-actions">
          <button className="btn-secondary">Connect Wallet</button>
          <button className="btn-primary">Get Started</button>
        </div>
      </nav>

      {/* Hero Section */}
      {activeTab === 'dashboard' && (
        <section className="hero">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                AI-driven lending. <br />
                <span className="gradient-text">Transparent. Global. Instant.</span>
              </h1>
              <p className="hero-subtitle">
                Experience the future of DeFi with AI-powered lending on Algorand. 
                Smart contracts, intelligent risk assessment, and transparent returns.
              </p>
              <div className="hero-actions">
                <button className="btn-primary large">Get Started</button>
                <button className="btn-secondary large">Learn More</button>
              </div>
              <div className="social-proof">
                <span className="badge">Over 7,000 active users</span>
              </div>
            </div>
            <div className="hero-visual">
              <div className="demo-animation">
                <div className="floating-card">AI Analysis</div>
                <div className="floating-card">Smart Contract</div>
                <div className="floating-card">Instant Lending</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="main-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard">
            {/* Key Metrics */}
            <section className="metrics-section">
              <h2 className="section-title">Portfolio Overview</h2>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">💰</div>
                  <div className="metric-content">
                    <h3>Total Earned</h3>
                    <p className="metric-value">${metrics.totalEarned.toFixed(2)}</p>
                    <span className="metric-change positive">+2.4%</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🧠</div>
                  <div className="metric-content">
                    <h3>AI Credit Score</h3>
                    <p className="metric-value">{Math.round(metrics.aiCreditScore)}</p>
                    <span className="metric-change positive">+5</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">📊</div>
                  <div className="metric-content">
                    <h3>Active Positions</h3>
                    <p className="metric-value">{metrics.activePositions}</p>
                    <span className="metric-change neutral">+1</span>
                  </div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">⭐</div>
                  <div className="metric-content">
                    <h3>Reputation</h3>
                    <p className="metric-value">{metrics.reputation.toFixed(1)}%</p>
                    <span className="metric-change positive">+0.2%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Smart Portfolio Panel */}
            <section className="portfolio-panel">
              <h2 className="section-title">Smart Portfolio Panel</h2>
              <div className="panel-content">
                <div className="chart-container">
                  <div className="chart-placeholder">
                    <h3>Portfolio Performance</h3>
                    <div className="chart-bars">
                      {[65, 78, 82, 91, 87, 94].map((height, i) => (
                        <div key={i} className="bar" style={{height: `${height}%`}}></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="ai-insights">
                  <h3>AI Intelligence</h3>
                  <div className="insight-item">
                    <span className="insight-label">Market Sentiment:</span>
                    <span className="insight-value positive">Bullish</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Risk Level:</span>
                    <span className="insight-value neutral">Low-Medium</span>
                  </div>
                  <div className="insight-item">
                    <span className="insight-label">Recommended Action:</span>
                    <span className="insight-value">Diversify Portfolio</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Lending Opportunities */}
            <section className="opportunities-section">
              <h2 className="section-title">My Lending Opportunities</h2>
              <div className="opportunities-grid">
                {lendingPools.slice(0, 3).map(pool => (
                  <div key={pool.id} className="opportunity-card">
                    <div className="opportunity-header">
                      <h3>{pool.name}</h3>
                      <span className={`risk-badge ${pool.risk}`}>{pool.risk}</span>
                    </div>
                    <div className="opportunity-metrics">
                      <div className="metric">
                        <span className="label">APY</span>
                        <span className="value">{pool.apy}%</span>
                      </div>
                      <div className="metric">
                        <span className="label">TVL</span>
                        <span className="value">${pool.tvl}M</span>
                      </div>
                      <div className="metric">
                        <span className="label">Term</span>
                        <span className="value">{pool.term}</span>
                      </div>
                    </div>
                    <button className="btn-primary small">Invest Now</button>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'pools' && (
          <div className="pools-section">
            <div className="section-header">
              <h2 className="section-title">Lending Pools</h2>
              <div className="filters">
                <select className="filter-select">
                  <option>All Risk Levels</option>
                  <option>A+</option>
                  <option>A</option>
                  <option>B+</option>
                </select>
                <select className="filter-select">
                  <option>Sort by APY</option>
                  <option>Sort by TVL</option>
                  <option>Sort by Term</option>
                </select>
              </div>
            </div>
            <div className="pools-grid">
              {lendingPools.map(pool => (
                <div key={pool.id} className="pool-card">
                  <div className="pool-header">
                    <h3>{pool.name}</h3>
                    <span className={`risk-badge ${pool.risk}`}>{pool.risk}</span>
                  </div>
                  <div className="pool-metrics">
                    <div className="metric-row">
                      <span>APY</span>
                      <span className="highlight">{pool.apy}%</span>
                    </div>
                    <div className="metric-row">
                      <span>Total Value Locked</span>
                      <span>${pool.tvl}M</span>
                    </div>
                    <div className="metric-row">
                      <span>Term</span>
                      <span>{pool.term}</span>
                    </div>
                  </div>
                  <button className="btn-primary">Invest Now</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'loans' && (
          <div className="loans-section">
            <div className="section-header">
              <h2 className="section-title">Loan Requests</h2>
              <div className="filters">
                <select className="filter-select">
                  <option>All Risk Levels</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                </select>
                <select className="filter-select">
                  <option>Sort by Progress</option>
                  <option>Sort by Amount</option>
                  <option>Sort by Term</option>
                </select>
              </div>
            </div>
            <div className="loans-grid">
              {loanRequests.map(loan => (
                <div key={loan.id} className="loan-card">
                  <div className="loan-header">
                    <h3>{loan.borrower}</h3>
                    <span className={`risk-badge ${loan.risk}`}>{loan.risk}</span>
                  </div>
                  <div className="loan-metrics">
                    <div className="metric-row">
                      <span>Amount</span>
                      <span>${loan.amount.toLocaleString()}</span>
                    </div>
                    <div className="metric-row">
                      <span>Progress</span>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{width: `${loan.funded}%`}}></div>
                      </div>
                      <span>{loan.funded}%</span>
                    </div>
                    <div className="metric-row">
                      <span>Term</span>
                      <span>{loan.term}</span>
                    </div>
                  </div>
                  <button className="btn-primary">Fund Loan</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="ai-section">
            <h2 className="section-title">AI Intelligence</h2>
            <div className="ai-overview">
              <div className="how-ai-works">
                <h3>How AI Works</h3>
                <div className="ai-flow">
                  <div className="flow-step">AI Analysis</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">Smart Contracts</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">Lending Pools</div>
                  <div className="flow-arrow">→</div>
                  <div className="flow-step">User Benefits</div>
                </div>
              </div>
            </div>
            <div className="ai-agents">
              <h3>AI Agents</h3>
              <div className="agents-grid">
                {aiAgents.map((agent, index) => (
                  <div key={index} className="agent-card">
                    <div className="agent-header">
                      <h4>{agent.name}</h4>
                      <span className={`status ${agent.status.toLowerCase()}`}>{agent.status}</span>
                    </div>
                    <p className="agent-description">{agent.description}</p>
                    <div className="agent-performance">
                      <span>Performance: {agent.performance}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'transparency' && (
          <div className="transparency-section">
            <h2 className="section-title">Transparency Panel</h2>
            <div className="transparency-grid">
              <div className="transparency-card">
                <h3>Network Stats</h3>
                <div className="stat-item">
                  <span>TPS</span>
                  <span className="highlight">1,200</span>
                </div>
                <div className="stat-item">
                  <span>Finality</span>
                  <span className="highlight">4.5s</span>
                </div>
                <div className="stat-item">
                  <span>Fees</span>
                  <span className="highlight">$0.001</span>
                </div>
              </div>
              <div className="transparency-card">
                <h3>AI Decisions</h3>
                <div className="decision-item">
                  <span>Risk Assessment</span>
                  <span className="status active">Active</span>
                </div>
                <div className="decision-item">
                  <span>Yield Optimization</span>
                  <span className="status active">Active</span>
                </div>
                <div className="decision-item">
                  <span>Fraud Detection</span>
                  <span className="status active">Active</span>
                </div>
              </div>
              <div className="transparency-card">
                <h3>Decentralization</h3>
                <div className="stat-item">
                  <span>Validators</span>
                  <span className="highlight">150+</span>
                </div>
                <div className="stat-item">
                  <span>Geographic Distribution</span>
                  <span className="highlight">Global</span>
                </div>
                <div className="stat-item">
                  <span>Carbon Neutral</span>
                  <span className="status positive">✓</span>
                </div>
              </div>
            </div>
            <button className="btn-secondary">View Full Audit Trail</button>
          </div>
        )}
      </main>

      {/* Global Impact Section */}
      <section className="global-impact">
        <div className="impact-content">
          <h2>Why AlgoLend Matters</h2>
          <div className="impact-grid">
            <div className="impact-item">
              <div className="impact-icon">🌍</div>
              <h3>Financial Inclusion</h3>
              <p>AI reduces bias and enables fair access to lending opportunities</p>
            </div>
            <div className="impact-item">
              <div className="impact-icon">🚀</div>
              <h3>Global Access</h3>
              <p>No banking restrictions - lend and borrow from anywhere</p>
            </div>
            <div className="impact-item">
              <div className="impact-icon">👁️</div>
              <h3>Transparent Returns</h3>
              <p>On-chain visibility of all transactions and returns</p>
            </div>
            <div className="impact-item">
              <div className="impact-icon">🛡️</div>
              <h3>Risk Mitigation</h3>
              <p>AI monitors continuously to protect your investments</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <div className="works-content">
          <h2>How it works in 3 steps</h2>
          <div className="steps">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Connect Wallet</h3>
              <p>Securely connect your Algorand wallet to get started</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Choose Pool or Loan</h3>
              <p>Select from AI-optimized lending pools or fund loan requests</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Let AI Optimize & Track</h3>
              <p>Our AI continuously optimizes your portfolio and tracks performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-brand">
              <div className="logo">🚀</div>
              <span className="brand-name">AlgoLend AI</span>
            </div>
            <p>AI-driven lending on Algorand. Transparent. Global. Instant.</p>
          </div>
          <div className="footer-links">
            <div className="link-group">
              <h4>Product</h4>
              <a href="#">About</a>
              <a href="#">Features</a>
              <a href="#">Pricing</a>
            </div>
            <div className="link-group">
              <h4>Resources</h4>
              <a href="#">Documentation</a>
              <a href="#">API</a>
              <a href="#">Support</a>
            </div>
            <div className="link-group">
              <h4>Legal</h4>
              <a href="#">Terms</a>
              <a href="#">Privacy</a>
              <a href="#">Security</a>
            </div>
          </div>
          <div className="footer-social">
            <h4>Connect</h4>
            <div className="social-icons">
              <a href="#">Twitter</a>
              <a href="#">Discord</a>
              <a href="#">Telegram</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 AlgoLend AI. All rights reserved.</p>
        </div>
      </footer>
      </div>
  )
}

export default App
