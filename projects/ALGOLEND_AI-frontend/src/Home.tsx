import { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import algosdk from 'algosdk'
import { apiService, NetworkStats, MarketInsights } from './services/api'
import { SmartContractService, LendingPoolContract, UserPosition, MOCK_LENDING_POOLS } from './services/smartContracts'

const Home = () => {
  const { 
    activeAddress, 
    wallets,
    isReady,
    algodClient,
    transactionSigner
  } = useWallet()

  // Debug wallet detection
  useEffect(() => {
    console.log('Wallet Debug Info:', {
      isReady,
      walletsCount: wallets.length,
      wallets: wallets.map(w => ({
        id: w.id,
        name: w.metadata.name,
        isActive: w.isActive,
        isConnected: w.isConnected
      }))
    })

    // Check for wallet extensions in window object
    console.log('Browser Wallet Detection:', {
      exodus: !!(window as any).exodus,
      algorand: !!(window as any).algorand,
      pera: !!(window as any).PeraWallet,
      defly: !!(window as any).DeflyWallet
    })
  }, [isReady, wallets])
  const [activeTab, setActiveTab] = useState('dashboard')
  const [metrics, setMetrics] = useState({
    totalEarned: 12450.32,
    aiCreditScore: 847,
    activePositions: 12,
    reputation: 98.5
  })
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null)
  const [marketInsights, setMarketInsights] = useState<MarketInsights | null>(null)
  const [aiAgentsStatus, setAiAgentsStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [agentDemo, setAgentDemo] = useState<any>(null)
  const [demoLoading, setDemoLoading] = useState(false)
  const [showInvestModal, setShowInvestModal] = useState(false)
  const [selectedPool, setSelectedPool] = useState<any>(null)
  const [investAmount, setInvestAmount] = useState('')
  const [showLoanModal, setShowLoanModal] = useState(false)
  const [loanAmount, setLoanAmount] = useState('')
  const [loanTerm, setLoanTerm] = useState('30')
  const [loanPurpose, setLoanPurpose] = useState('')
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [showWalletModal, setShowWalletModal] = useState(false)
  const [walletBalance, setWalletBalance] = useState<number | null>(null)
  const [accountInfo, setAccountInfo] = useState<any>(null)
  const [demoMode, setDemoMode] = useState(false)
  const [smartContractService, setSmartContractService] = useState<SmartContractService | null>(null)
  const [deployedPools, setDeployedPools] = useState<LendingPoolContract[]>(MOCK_LENDING_POOLS)
  const [userPositions, setUserPositions] = useState<{[poolId: number]: UserPosition}>({})
  const [showContractModal, setShowContractModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState<LendingPoolContract | null>(null)

  // Load wallet balance
  const loadWalletBalance = async () => {
    if (!activeAddress || !algodClient) return
    
    try {
      const accountInfo = await algodClient.accountInformation(activeAddress).do()
      setWalletBalance(parseInt(accountInfo.amount.toString()) / 1000000) // Convert microALGOs to ALGOs
      setAccountInfo(accountInfo)
    } catch (error) {
      console.error('Failed to load wallet balance:', error)
      setWalletBalance(null)
      setAccountInfo(null)
    }
  }

  // Load backend data on component mount
  useEffect(() => {
    const loadBackendData = async () => {
      try {
        setLoading(true)
        
        // Load network stats
        const networkData = await apiService.getNetworkStats()
        setNetworkStats(networkData)
        
        // Load market insights
        const marketData = await apiService.getMarketInsights()
        setMarketInsights(marketData)
        
        // Load AI agents status
        const agentsData = await apiService.getAIAgentsStatus()
        setAiAgentsStatus(agentsData)
        
        setLoading(false)
      } catch (error) {
        console.error('Failed to load backend data:', error)
        console.error('Error details:', {
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        })
        setLoading(false)
      }
    }
    
    loadBackendData()
  }, [])

  // Load wallet balance when wallet connects
  useEffect(() => {
    if (activeAddress && algodClient) {
      loadWalletBalance()
    }
  }, [activeAddress, algodClient])

  // Initialize smart contract service
  useEffect(() => {
    if (algodClient) {
      const contractService = new SmartContractService(algodClient)
      setSmartContractService(contractService)
      
      // Load user positions for deployed pools
      if (activeAddress) {
        loadUserPositions(contractService)
      }
    }
  }, [algodClient, activeAddress])

  // Load user positions in smart contracts
  const loadUserPositions = async (contractService: SmartContractService) => {
    if (!activeAddress) return
    
    const positions: {[poolId: number]: UserPosition} = {}
    
    for (const pool of deployedPools) {
      try {
        const position = await contractService.getUserPosition(activeAddress, pool.appId)
        if (position) {
          positions[pool.appId] = position
        }
      } catch (error) {
        console.error(`Failed to load position for pool ${pool.appId}:`, error)
      }
    }
    
    setUserPositions(positions)
  }

  // Wallet connection handlers
  const handleConnectWallet = () => {
    setShowWalletModal(true)
  }

  const handleWalletConnect = async (walletId: string) => {
    try {
      const wallet = wallets.find(w => w.id === walletId)
      if (wallet) {
        await wallet.connect()
        setShowWalletModal(false)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const handleDisconnectWallet = async () => {
    try {
      const connectedWallet = wallets.find(w => w.isConnected)
      if (connectedWallet) {
        await connectedWallet.disconnect()
      }
    } catch (error) {
      console.error('Failed to disconnect wallet:', error)
    }
  }

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

  // Convert backend AI agents data to display format
  const aiAgents = aiAgentsStatus ? [
    {
      name: aiAgentsStatus.market_oracle?.name || "Market Oracle",
      status: aiAgentsStatus.market_oracle?.status || "Unknown",
      performance: aiAgentsStatus.market_oracle?.performance || 0,
      description: aiAgentsStatus.market_oracle?.description || "Real-time market analysis"
    },
    {
      name: aiAgentsStatus.risk_analyzer?.name || "Risk Analyzer",
      status: aiAgentsStatus.risk_analyzer?.status || "Unknown",
      performance: aiAgentsStatus.risk_analyzer?.performance || 0,
      description: aiAgentsStatus.risk_analyzer?.description || "Risk assessment & fraud detection"
    },
    {
      name: "Yield Optimizer",
      status: "Active",
      performance: 91.5,
      description: "Portfolio optimization and yield maximization"
    }
  ] : [
    { name: "Market Oracle", status: "Loading...", performance: 0, description: "Real-time market analysis" },
    { name: "Risk Analyzer", status: "Loading...", performance: 0, description: "Risk assessment & fraud detection" },
    { name: "Yield Optimizer", status: "Loading...", performance: 0, description: "Portfolio optimization" }
  ]

  // AI Agent interaction handlers
  const handleAgentClick = async (agentName: string) => {
    console.log('Agent clicked:', agentName)
    setSelectedAgent(agentName)
    setDemoLoading(true)
    
    try {
      let demoData
      
      if (agentName === 'Market Oracle') {
        // Demo Market Oracle capabilities
        demoData = {
          title: 'Market Oracle AI Analysis',
          capabilities: [
            'Real-time market sentiment analysis',
            'Price prediction with confidence scoring',
            'Lending opportunity identification',
            'Risk factor detection',
            'Market trend analysis'
          ],
          liveDemo: marketInsights,
          actions: [
            'Analyze current ALGO price trends',
            'Identify optimal lending pools',
            'Generate market predictions',
            'Assess market risks'
          ]
        }
      } else if (agentName === 'Risk Analyzer') {
        // Demo Risk Analyzer with sample analysis
        const sampleAddress = 'SAMPLE_ALGORAND_ADDRESS_FOR_DEMO'
        demoData = {
          title: 'Risk Analyzer AI Assessment',
          capabilities: [
            'Account creditworthiness scoring',
            'Transaction pattern analysis',
            'Fraud detection algorithms',
            'Risk factor identification',
            'Credit score calculation'
          ],
          sampleAnalysis: {
            address: sampleAddress,
            creditScore: 847,
            riskLevel: 'Low',
            factors: [
              'Consistent transaction history',
              'High account balance',
              'Low volatility patterns',
              'Verified identity'
            ],
            recommendations: [
              'Eligible for premium lending rates',
              'Suitable for high-value transactions',
              'Low collateral requirements'
            ]
          },
          actions: [
            'Analyze wallet creditworthiness',
            'Detect suspicious patterns',
            'Calculate lending eligibility',
            'Generate risk reports'
          ]
        }
      } else if (agentName === 'Yield Optimizer') {
        // Demo Yield Optimizer capabilities
        demoData = {
          title: 'Yield Optimizer AI Strategy',
          capabilities: [
            'Portfolio optimization algorithms',
            'Yield maximization strategies',
            'Risk-adjusted return calculations',
            'Automated rebalancing',
            'Performance forecasting'
          ],
          sampleOptimization: {
            currentPortfolio: {
              totalValue: 10000,
              allocation: [
                { pool: 'Stable Pool', amount: 4000, apy: 7.5 },
                { pool: 'High Yield Pool', amount: 6000, apy: 12.3 }
              ]
            },
            optimizedPortfolio: {
              expectedReturn: 15.2,
              riskScore: 35,
              allocation: [
                { pool: 'Conservative Pool', amount: 2000, apy: 6.2 },
                { pool: 'Stable Pool', amount: 5000, apy: 7.8 },
                { pool: 'High Yield Pool', amount: 3000, apy: 13.1 }
              ]
            }
          },
          actions: [
            'Optimize portfolio allocation',
            'Maximize yield potential',
            'Minimize risk exposure',
            'Generate rebalancing plan'
          ]
        }
      }
      
      setAgentDemo(demoData)
    } catch (error) {
      console.error('Failed to load agent demo:', error)
    } finally {
      setDemoLoading(false)
    }
  }

  const closeAgentModal = () => {
    setSelectedAgent(null)
    setAgentDemo(null)
  }

  const runAgentAction = async (action: string) => {
    setDemoLoading(true)
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (selectedAgent === 'Market Oracle' && action.includes('Analyze current ALGO price')) {
      // Trigger fresh market analysis
      try {
        const freshData = await apiService.getMarketInsights()
        setMarketInsights(freshData)
        setAgentDemo((prev: any) => ({ ...prev, liveDemo: freshData }))
      } catch (error) {
        console.error('Failed to get fresh market data:', error)
      }
    }
    
    setDemoLoading(false)
  }

  // Investment and lending handlers
  const handleInvestClick = (pool: any) => {
    setSelectedPool(pool)
    setShowInvestModal(true)
    setInvestAmount('')
    setTransactionStatus('idle')
  }

  const handleInvestSubmit = async () => {
    if (!investAmount || !selectedPool) return
    
    if (!activeAddress || !transactionSigner || !smartContractService) {
      alert('Please connect your wallet first')
      return
    }

    setTransactionStatus('pending')
    
    try {
      // Find the corresponding smart contract pool
      const contractPool = deployedPools.find(p => p.name === selectedPool.name)
      
      if (contractPool) {
        // Use actual smart contract deposit function
        console.log(`🔗 Calling smart contract deposit on App ID: ${contractPool.appId}`)
        console.log(`📄 Contract Address: ${contractPool.appAddress}`)
        console.log(`💰 Depositing: ${investAmount} ALGO`)
        
        const txId = await smartContractService.depositToPool(
          activeAddress,
          transactionSigner,
          contractPool.appId,
          parseFloat(investAmount)
        )
        
        console.log(`✅ Smart contract deposit successful! TX: ${txId}`)
        
        // Refresh user positions
        await loadUserPositions(smartContractService)
        
        alert(`✅ Smart Contract Deposit Successful!\n\n🔗 App ID: ${contractPool.appId}\n💰 Amount: ${investAmount} ALGO\n📄 TX ID: ${txId}\n\nYour deposit is now earning ${contractPool.interestRate/100}% APY through the smart contract!`)
      } else {
        // Fallback to simple payment for demo pools
        const suggestedParams = await algodClient.getTransactionParams().do()
        
        const investmentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: activeAddress,
          receiver: selectedPool.address || 'ALGOLEND7POOL7ADDRESS7EXAMPLE7INVESTMENT7POOL',
          amount: Math.floor(parseFloat(investAmount) * 1000000),
          suggestedParams,
          note: new Uint8Array(Buffer.from(`Investment in ${selectedPool.name} (Demo)`))
        })

        const signedTxns = await transactionSigner([investmentTxn], [0])
        const response = await algodClient.sendRawTransaction(signedTxns[0]).do()
        const txId = response.txid
        
        await algosdk.waitForConfirmation(algodClient, txId, 4)
        
        alert(`💡 Demo Investment Successful!\n\n💰 Amount: ${investAmount} ALGO\n📄 TX ID: ${txId}\n\n⚠️ This was a demo transaction. Connect to a real smart contract pool for actual lending!`)
      }
      
      // Update user metrics
      setMetrics((prev: any) => ({
        ...prev,
        totalEarned: prev.totalEarned + (parseFloat(investAmount) * selectedPool.apy / 100),
        activePositions: prev.activePositions + 1
      }))
      
      // Refresh wallet balance
      await loadWalletBalance()
      
      setShowInvestModal(false)
      setInvestAmount('')
      setTransactionStatus('success')
    } catch (error: any) {
      console.error('Investment failed:', error)
      setTransactionStatus('error')
      alert(`❌ Investment failed: ${error.message || 'Please try again.'}`)
    }
  }

  const handleCreateLoanRequest = () => {
    setShowLoanModal(true)
    setLoanAmount('')
    setLoanTerm('30')
    setLoanPurpose('')
    setTransactionStatus('idle')
  }

  const handleLoanSubmit = async () => {
    if (!loanAmount || !loanTerm || !loanPurpose) return
    
    if (!activeAddress || !transactionSigner) {
      alert('Please connect your wallet first')
      return
    }

    setTransactionStatus('pending')
    
    try {
      // Get suggested transaction parameters
      const suggestedParams = await algodClient.getTransactionParams().do()
      
      // Create loan request transaction (payment with note containing loan details)
      const loanRequestTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: activeAddress,
        receiver: 'ALGOLEND7LOAN7CONTRACT7ADDRESS7EXAMPLE7LOANS', // Loan contract address
        amount: 1000, // Minimal transaction fee for loan request
        suggestedParams,
        note: new Uint8Array(Buffer.from(JSON.stringify({
          type: 'loan_request',
          amount: parseFloat(loanAmount),
          term: parseInt(loanTerm),
          purpose: loanPurpose,
          timestamp: Date.now()
        })))
      })

      // Sign and send transaction
      const signedTxns = await transactionSigner([loanRequestTxn], [0])
      
      const response = await algodClient.sendRawTransaction(signedTxns[0]).do()
      const txId = response.txid
      
      // Wait for confirmation
      await algosdk.waitForConfirmation(algodClient, txId, 4)
      
      // Refresh wallet balance
      await loadWalletBalance()
      
      setShowLoanModal(false)
      setLoanAmount('')
      setLoanTerm('30')
      setLoanPurpose('')
      setTransactionStatus('success')
      alert(`Loan request for ${loanAmount} ALGO created successfully!\nTransaction ID: ${txId}`)
    } catch (error: any) {
      console.error('Loan request failed:', error)
      setTransactionStatus('error')
      alert(`Loan request failed: ${error.message || 'Please try again.'}`)
    }
  }

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
          {activeAddress ? (
            <div className="wallet-connected" onClick={handleDisconnectWallet}>
              <div className="wallet-info">
              <span className="wallet-address">
                {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
              </span>
                {walletBalance !== null && (
                  <span className="wallet-balance">
                    {walletBalance.toFixed(2)} ALGO
                  </span>
                )}
              </div>
              <span className="status-indicator connected">●</span>
            </div>
          ) : demoMode ? (
            <div className="wallet-connected demo-mode">
              <div className="wallet-info">
                <span className="wallet-address">Demo Mode</span>
                <span className="wallet-balance">Explore Features</span>
              </div>
              <span className="status-indicator">●</span>
              <button 
                className="btn-secondary small"
                onClick={() => setDemoMode(false)}
              >
                Exit Demo
              </button>
            </div>
          ) : (
            <button className="btn-secondary" onClick={handleConnectWallet}>
              Connect Wallet
            </button>
          )}
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

            {/* Network Stats Panel */}
            <section className="portfolio-panel">
              <h2 className="section-title">Algorand Network Stats</h2>
              <div className="panel-content">
                <div className="chart-container">
                  <div className="chart-placeholder">
                    <h3>Network Performance</h3>
                    {loading ? (
                      <div className="loading-spinner">Loading...</div>
                    ) : networkStats ? (
                      <div className="network-stats">
                        <div className="stat-item">
                          <span className="stat-label">TPS:</span>
                          <span className="stat-value">{networkStats.tps.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Finality:</span>
                          <span className="stat-value">{networkStats.finality_seconds}s</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Block Height:</span>
                          <span className="stat-value">{networkStats.block_height.toLocaleString()}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Network Health:</span>
                          <span className={`stat-value ${networkStats.network_health.toLowerCase()}`}>{networkStats.network_health}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="error-message">
                        <p>Failed to load network stats</p>
                        <button onClick={() => window.location.reload()} className="retry-button">
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="ai-insights">
                  <h3>AI Market Intelligence</h3>
                  {loading ? (
                    <div className="loading-spinner">Loading insights...</div>
                  ) : marketInsights ? (
                    <>
                  <div className="insight-item">
                    <span className="insight-label">Market Sentiment:</span>
                        <span className={`insight-value ${marketInsights.market_sentiment.toLowerCase()}`}>{marketInsights.market_sentiment}</span>
                  </div>
                  <div className="insight-item">
                        <span className="insight-label">ALGO Price:</span>
                        <span className="insight-value">${marketInsights.market_data.algo_price.toFixed(4)}</span>
                  </div>
                  <div className="insight-item">
                        <span className="insight-label">24h Change:</span>
                        <span className={`insight-value ${marketInsights.market_data.price_change_24h >= 0 ? 'positive' : 'negative'}`}>
                          {marketInsights.market_data.price_change_24h >= 0 ? '+' : ''}{(marketInsights.market_data.price_change_24h * 100).toFixed(2)}%
                        </span>
                  </div>
                      <div className="insight-item">
                        <span className="insight-label">Recommended Actions:</span>
                        <div className="recommendations">
                          {marketInsights.recommended_actions.map((action, i) => (
                            <span key={i} className="recommendation-tag">{action}</span>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="error-message">Failed to load market insights</div>
                  )}
                </div>
              </div>
            </section>

            {/* Lending Opportunities */}
            <section className="opportunities-section">
              <h2 className="section-title">AI-Recommended Lending Opportunities</h2>
              <div className="opportunities-grid">
                {marketInsights && marketInsights.lending_opportunities ? 
                  marketInsights.lending_opportunities.map((opportunity, i) => (
                    <div key={i} className="opportunity-card">
                      <div className="opportunity-header">
                        <h3>{opportunity.type}</h3>
                        <span className={`risk-badge ${opportunity.risk.toLowerCase()}`}>{opportunity.risk} Risk</span>
                      </div>
                      <div className="opportunity-details">
                        <div className="apy-display">
                          <span className="apy-value">{opportunity.apy}%</span>
                          <span className="apy-label">APY</span>
                        </div>
                        <p className="opportunity-description">{opportunity.description}</p>
                        <button className="btn-primary small">Invest Now</button>
                      </div>
                    </div>
                  )) : 
                  lendingPools.map(pool => (
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
            <div className="dashboard-stats">
              <div className="stats-grid">
                {[
                  { label: "Total Volume", value: "$2.4M", change: "+12%" },
                  { label: "Active Pools", value: "24", change: "+3" },
                  { label: "AI Accuracy", value: "94.2%", change: "+0.8%" },
                  { label: "Users", value: "7,234", change: "+156" }
                ].map((stat, index) => (
                  <div key={index} className="stat-card">
                    <div className="stat-value">{stat.value}</div>
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-change positive">{stat.change}</div>
                  </div>
                ))}
              </div>
            </div>
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
                  <button 
                    className="btn-primary"
                    onClick={() => handleInvestClick(pool)}
                  >
                    Invest Now
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
            <div className="section-actions">
              <button 
                className="btn-primary"
                onClick={handleCreateLoanRequest}
              >
                Create Loan Request
              </button>
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
                  <button 
                    className="btn-secondary"
                    onClick={() => handleInvestClick({
                      name: `Fund ${loan.borrower}`,
                      apy: 8.5, // Default interest rate for loans
                      risk: loan.risk,
                      tvl: loan.amount / 1000,
                      term: loan.term
                    })}
                  >
                    Fund Loan
                  </button>
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
                  <div 
                    key={index} 
                    className="agent-card clickable" 
                    onClick={() => handleAgentClick(agent.name)}
                  >
                    <div className="agent-header">
                      <h3>{agent.name}</h3>
                      <span className={`status-badge ${agent.status.toLowerCase()}`}>{agent.status}</span>
                    </div>
                    <div className="agent-performance">
                      <div className="performance-circle">
                        <span className="performance-value">{agent.performance}%</span>
                      </div>
                      <p className="agent-description">{agent.description}</p>
                    </div>
                    <div className="agent-actions">
                      <button className="btn-secondary small">View Details</button>
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

      {/* AI Agent Modal */}
      {selectedAgent && (
        <div className="modal-overlay" onClick={closeAgentModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedAgent} AI Agent</h2>
              <button className="modal-close" onClick={closeAgentModal}>×</button>
            </div>
            
            {demoLoading ? (
              <div className="loading-state">Loading AI agent demo...</div>
            ) : agentDemo ? (
              <div className="modal-body">
                <div className="agent-capabilities">
                  <h3>AI Capabilities</h3>
                  <ul>
                    {agentDemo.capabilities?.map((capability: string, index: number) => (
                      <li key={index}>{capability}</li>
                    ))}
                  </ul>
                </div>

                {agentDemo.liveDemo && (
                  <div className="live-demo-section">
                    <h3>Live Market Analysis</h3>
                    <div className="demo-insights">
                      <div className="insight-item">
                        <span>Market Sentiment:</span>
                        <span className={`sentiment ${agentDemo.liveDemo.sentiment?.toLowerCase()}`}>
                          {agentDemo.liveDemo.sentiment}
                        </span>
                      </div>
                      <div className="insight-item">
                        <span>Fear & Greed Index:</span>
                        <span className="highlight">{agentDemo.liveDemo.fearGreedIndex}/100</span>
                      </div>
                      <div className="insight-item">
                        <span>Price Prediction:</span>
                        <span className="highlight">{agentDemo.liveDemo.pricePrediction}</span>
                      </div>
                    </div>
                  </div>
                )}

                {agentDemo.sampleAnalysis && (
                  <div className="sample-analysis">
                    <h3>Sample Risk Analysis</h3>
                    <div className="analysis-result">
                      <div className="score-display">
                        <span className="score-label">Credit Score</span>
                        <span className="score-value">{agentDemo.sampleAnalysis.creditScore}</span>
                      </div>
                      <div className="risk-level">
                        Risk Level: <span className={`risk ${agentDemo.sampleAnalysis.riskLevel.toLowerCase()}`}>
                          {agentDemo.sampleAnalysis.riskLevel}
                        </span>
                      </div>
                      <div className="risk-factors">
                        <h4>Risk Factors:</h4>
                        <ul>
                          {agentDemo.sampleAnalysis.factors?.map((factor: string, index: number) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {agentDemo.sampleOptimization && (
                  <div className="optimization-demo">
                    <h3>Portfolio Optimization</h3>
                    <div className="portfolio-comparison">
                      <div className="current-portfolio">
                        <h4>Current Portfolio</h4>
                        <div className="portfolio-value">
                          Total: ${agentDemo.sampleOptimization.currentPortfolio.totalValue.toLocaleString()}
                        </div>
                        {agentDemo.sampleOptimization.currentPortfolio.allocation?.map((item: any, index: number) => (
                          <div key={index} className="allocation-item">
                            <span>{item.pool}</span>
                            <span>${item.amount.toLocaleString()} ({item.apy}% APY)</span>
                          </div>
                        ))}
                      </div>
                      <div className="optimized-portfolio">
                        <h4>AI Optimized</h4>
                        <div className="expected-return">
                          Expected Return: {agentDemo.sampleOptimization.optimizedPortfolio.expectedReturn}%
                        </div>
                        {agentDemo.sampleOptimization.optimizedPortfolio.allocation?.map((item: any, index: number) => (
                          <div key={index} className="allocation-item">
                            <span>{item.pool}</span>
                            <span>${item.amount.toLocaleString()} ({item.apy}% APY)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="agent-actions">
                  <h3>Try AI Actions</h3>
                  <div className="action-buttons">
                    {agentDemo.actions?.map((action: string, index: number) => (
                      <button
                        key={index}
                        className="action-btn"
                        onClick={() => runAgentAction(action)}
                        disabled={demoLoading}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}

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

      {/* Investment Modal */}
      {showInvestModal && selectedPool && (
        <div className="modal-overlay" onClick={() => setShowInvestModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Invest in {selectedPool.name}</h2>
              <button className="modal-close" onClick={() => setShowInvestModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="investment-details">
                <div className="pool-info">
                  <div className="info-row">
                    <span>Pool APY:</span>
                    <span className="highlight">{selectedPool.apy}%</span>
                  </div>
                  <div className="info-row">
                    <span>Risk Level:</span>
                    <span className={`risk ${selectedPool.risk?.toLowerCase()}`}>{selectedPool.risk}</span>
                  </div>
                  <div className="info-row">
                    <span>Term:</span>
                    <span>{selectedPool.term}</span>
                  </div>
                </div>
                
                <div className="investment-form">
                  <label>Investment Amount (ALGO)</label>
                  <input
                    type="number"
                    placeholder="Enter amount to invest"
                    value={investAmount}
                    onChange={(e) => setInvestAmount(e.target.value)}
                    className="amount-input"
                  />
                  
                  {investAmount && (
                    <div className="investment-preview">
                      <div className="preview-row">
                        <span>Investment:</span>
                        <span>{investAmount} ALGO</span>
                      </div>
                      <div className="preview-row">
                        <span>Expected Annual Return:</span>
                        <span className="highlight">
                          {(parseFloat(investAmount) * selectedPool.apy / 100).toFixed(2)} ALGO
                        </span>
                      </div>
                      <div className="preview-row">
                        <span>Total After 1 Year:</span>
                        <span className="highlight">
                          {(parseFloat(investAmount) * (1 + selectedPool.apy / 100)).toFixed(2)} ALGO
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="wallet-status">
                  {activeAddress ? (
                    <div className="connected">
                      <span>✓ Wallet Connected: {activeAddress.slice(0, 8)}...{activeAddress.slice(-8)}</span>
                    </div>
                  ) : (
                    <div className="not-connected">
                      <span>⚠️ Please connect your wallet to invest</span>
                    </div>
                  )}
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setShowInvestModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleInvestSubmit}
                    disabled={!investAmount || !activeAddress || transactionStatus === 'pending'}
                  >
                    {transactionStatus === 'pending' ? 'Processing...' : 
                     transactionStatus === 'success' ? 'Success!' : 'Invest Now'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loan Request Modal */}
      {showLoanModal && (
        <div className="modal-overlay" onClick={() => setShowLoanModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Loan Request</h2>
              <button className="modal-close" onClick={() => setShowLoanModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="loan-form">
                <div className="form-group">
                  <label>Loan Amount (ALGO)</label>
                  <input
                    type="number"
                    placeholder="Enter loan amount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    className="amount-input"
                  />
                </div>
                
                <div className="form-group">
                  <label>Loan Term</label>
                  <select 
                    value={loanTerm}
                    onChange={(e) => setLoanTerm(e.target.value)}
                    className="term-select"
                  >
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="180">6 months</option>
                    <option value="365">1 year</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Purpose</label>
                  <textarea
                    placeholder="Describe the purpose of your loan..."
                    value={loanPurpose}
                    onChange={(e) => setLoanPurpose(e.target.value)}
                    className="purpose-input"
                    rows={3}
                  />
                </div>
                
                {loanAmount && (
                  <div className="loan-preview">
                    <div className="ai-analysis">
                      <h4>AI Risk Analysis</h4>
                      <div className="analysis-item">
                        <span>Estimated Interest Rate:</span>
                        <span className="highlight">8.5% APY</span>
                      </div>
                      <div className="analysis-item">
                        <span>Credit Score Required:</span>
                        <span className="highlight">700+</span>
                      </div>
                      <div className="analysis-item">
                        <span>Collateral Ratio:</span>
                        <span className="highlight">150%</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="wallet-status">
                  {activeAddress ? (
                    <div className="connected">
                      <span>✓ Wallet Connected: {activeAddress.slice(0, 8)}...{activeAddress.slice(-8)}</span>
                    </div>
                  ) : (
                    <div className="not-connected">
                      <span>⚠️ Please connect your wallet to create loan request</span>
                    </div>
                  )}
                </div>
                
                <div className="modal-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setShowLoanModal(false)}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={handleLoanSubmit}
                    disabled={!loanAmount || !loanPurpose || !activeAddress || transactionStatus === 'pending'}
                  >
                    {transactionStatus === 'pending' ? 'Creating...' : 
                     transactionStatus === 'success' ? 'Created!' : 'Create Loan Request'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Wallet Connection Modal */}
      {showWalletModal && (
        <div className="modal-overlay" onClick={() => setShowWalletModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Connect Your Wallet</h2>
              <button className="modal-close" onClick={() => setShowWalletModal(false)}>×</button>
            </div>
            
            <div className="modal-body">
              <div className="wallet-options">
                <p className="wallet-description">
                  Choose your preferred Algorand wallet to connect to AlgoLend AI
                </p>
                
                <div className="wallet-grid">
                  {wallets.length > 0 ? (
                    wallets.map((wallet) => {
                      const isWalletInstalled = wallet.isActive
                      const isConnected = wallet.isConnected
                      
                      return (
                        <div
                          key={wallet.id}
                          className={`wallet-option ${!isWalletInstalled ? 'disabled' : ''} ${isConnected ? 'connected' : ''}`}
                          onClick={() => isWalletInstalled && !isConnected && handleWalletConnect(wallet.id)}
                        >
                          <div className="wallet-icon">
                            <img src={wallet.metadata.icon} alt={wallet.metadata.name} />
                          </div>
                          <div className="wallet-info">
                            <h3>{wallet.metadata.name}</h3>
                            <p>
                              {isConnected 
                                ? `Connected to ${wallet.metadata.name}` 
                                : `Connect with ${wallet.metadata.name}`
                              }
                            </p>
                            {!isWalletInstalled && (
                              <span className="wallet-status">Extension Not Installed</span>
                            )}
                            {isWalletInstalled && !isConnected && (
                              <span className="wallet-status">Click to Connect</span>
                            )}
                            {isConnected && (
                              <span className="wallet-status connected">✓ Connected</span>
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="no-wallets-message">
                      <div className="no-wallets-icon">🔌</div>
                      <h3>No Wallets Detected</h3>
                      <p>Please install an Algorand wallet extension to continue:</p>
                      <div className="wallet-install-links">
                        <a href="https://chrome.google.com/webstore/detail/defly-algorand-wallet/jdkjdkjdkjdkjdkjdkjdkj" target="_blank" rel="noopener noreferrer" className="wallet-link">
                          <div className="wallet-link-icon">🦋</div>
                          <span>Defly Extension</span>
                          <small>Chrome Web Store</small>
                        </a>
                        <a href="https://chrome.google.com/webstore/detail/exodus-web3-wallet/aholpfdialjgjfhomihkjbmgjidlcdno" target="_blank" rel="noopener noreferrer" className="wallet-link">
                          <div className="wallet-link-icon">🚀</div>
                          <span>Exodus Extension</span>
                          <small>Chrome Web Store</small>
                        </a>
                        <a href="https://perawallet.app/" target="_blank" rel="noopener noreferrer" className="wallet-link">
                          <div className="wallet-link-icon">📱</div>
                          <span>Pera Wallet</span>
                          <small>Mobile App + WalletConnect</small>
                        </a>
                      </div>
                      <div className="demo-mode-option">
                        <p>Or try the demo mode to explore features:</p>
                        <button 
                          className="btn-primary"
                          onClick={() => {
                            setDemoMode(true)
                            setShowWalletModal(false)
                          }}
                        >
                          🚀 Try Demo Mode
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="wallet-security">
                  <div className="security-item">
                    <span className="security-icon">🔒</span>
                    <span>Your wallet keys never leave your device</span>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">🛡️</span>
                    <span>All transactions are signed locally</span>
                  </div>
                  <div className="security-item">
                    <span className="security-icon">✅</span>
                    <span>Powered by Algorand's secure blockchain</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
