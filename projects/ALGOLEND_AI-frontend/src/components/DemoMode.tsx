import React, { useState, useEffect } from 'react'

interface DemoStep {
  id: string
  title: string
  description: string
  action: string
  highlight: string
  duration: number
}

const DemoMode: React.FC = () => {
  const [isDemoActive, setIsDemoActive] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(false)
  const [highlightedElement, setHighlightedElement] = useState<string | null>(null)

  const demoSteps: DemoStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to AlgoLend AI',
      description: 'Experience the future of AI-powered DeFi lending on Algorand',
      action: 'Click "Start Demo" to begin the guided tour',
      highlight: 'demo-start-button',
      duration: 3000
    },
    {
      id: 'wallet-connection',
      title: 'Connect Your Algorand Wallet',
      description: 'Securely connect your Pera, Defly, or Exodus wallet to get started',
      action: 'Click "Connect Wallet" to connect your Algorand wallet',
      highlight: 'connect-wallet-button',
      duration: 4000
    },
    {
      id: 'dashboard-overview',
      title: 'AI-Powered Dashboard',
      description: 'View your portfolio metrics, AI insights, and real-time updates',
      action: 'Explore your personalized dashboard with live data',
      highlight: 'dashboard-metrics',
      duration: 5000
    },
    {
      id: 'lending-pools',
      title: 'Smart Lending Pools',
      description: 'Discover AI-optimized lending pools with risk analysis',
      action: 'Browse available pools with APY and risk ratings',
      highlight: 'lending-pools-section',
      duration: 4000
    },
    {
      id: 'ai-analysis',
      title: 'AI Risk Analysis',
      description: 'Get instant credit scoring and risk assessment',
      action: 'Enter an address to see AI-powered analysis',
      highlight: 'ai-analysis-section',
      duration: 6000
    },
    {
      id: 'transactions',
      title: 'Seamless Transactions',
      description: 'Execute lending and borrowing with one click',
      action: 'Experience instant transaction processing',
      highlight: 'transaction-buttons',
      duration: 4000
    },
    {
      id: 'transparency',
      title: 'Full Transparency',
      description: 'View live network stats and AI decision processes',
      action: 'Monitor real-time Algorand network data',
      highlight: 'transparency-panel',
      duration: 4000
    },
    {
      id: 'conclusion',
      title: 'Ready to Lend?',
      description: 'You\'re now ready to experience AI-driven DeFi lending!',
      action: 'Start your lending journey with AlgoLend AI',
      highlight: 'get-started-button',
      duration: 3000
    }
  ]

  useEffect(() => {
    let timeout: NodeJS.Timeout

    if (isAutoPlaying && isDemoActive) {
      timeout = setTimeout(() => {
        if (currentStep < demoSteps.length - 1) {
          setCurrentStep(currentStep + 1)
        } else {
          setIsAutoPlaying(false)
          setIsDemoActive(false)
          setCurrentStep(0)
        }
      }, demoSteps[currentStep].duration)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isAutoPlaying, isDemoActive, currentStep, demoSteps])

  const startDemo = () => {
    setIsDemoActive(true)
    setCurrentStep(0)
    setIsAutoPlaying(true)
  }

  const stopDemo = () => {
    setIsDemoActive(false)
    setIsAutoPlaying(false)
    setCurrentStep(0)
    setHighlightedElement(null)
  }

  const nextStep = () => {
    if (currentStep < demoSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      stopDemo()
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying)
  }

  const currentStepData = demoSteps[currentStep]

  return (
    <div className="demo-mode">
      {/* Demo Controls */}
      <div className="demo-controls">
        <div className="demo-header">
          <h2>🎬 Demo Mode</h2>
          <p>Guided walkthrough for hackathon judges</p>
        </div>
        
        <div className="demo-buttons">
          {!isDemoActive ? (
            <button 
              className="btn-primary large demo-start-button" 
              onClick={startDemo}
              id="demo-start-button"
            >
              🚀 Start Demo
            </button>
          ) : (
            <div className="demo-control-panel">
              <button className="btn-secondary" onClick={prevStep} disabled={currentStep === 0}>
                ← Previous
              </button>
              <button className="btn-primary" onClick={nextStep}>
                {currentStep === demoSteps.length - 1 ? 'Finish' : 'Next →'}
              </button>
              <button 
                className={`btn-secondary ${isAutoPlaying ? 'active' : ''}`}
                onClick={toggleAutoPlay}
              >
                {isAutoPlaying ? '⏸️ Pause' : '▶️ Auto Play'}
              </button>
              <button className="btn-secondary" onClick={stopDemo}>
                ⏹️ Stop
              </button>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {isDemoActive && (
          <div className="demo-progress">
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${((currentStep + 1) / demoSteps.length) * 100}%` }}
              ></div>
            </div>
            <span className="progress-text">
              Step {currentStep + 1} of {demoSteps.length}
            </span>
          </div>
        )}
      </div>

      {/* Demo Overlay */}
      {isDemoActive && (
        <div className="demo-overlay">
          <div className="demo-highlight" id={currentStepData.highlight}>
            <div className="highlight-ring"></div>
          </div>
          
          <div className="demo-tooltip">
            <div className="tooltip-content">
              <h3>{currentStepData.title}</h3>
              <p>{currentStepData.description}</p>
              <div className="tooltip-action">
                <span className="action-text">{currentStepData.action}</span>
              </div>
            </div>
            <div className="tooltip-arrow"></div>
          </div>
        </div>
      )}

      {/* Demo Features Showcase */}
      <div className="demo-features">
        <h3>🎯 Key Features to Highlight</h3>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h4>3 AI Agents</h4>
            <p>Market Oracle, Risk Analyzer, and Yield Optimizer working together</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h4>Real-time Data</h4>
            <p>Live Algorand network stats and AI analysis updates</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h4>Secure & Transparent</h4>
            <p>Full transparency with on-chain verification</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h4>Mobile Ready</h4>
            <p>Responsive design for all devices</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🌍</div>
            <h4>Global Access</h4>
            <p>No banking restrictions, accessible worldwide</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💎</div>
            <h4>Algorand Native</h4>
            <p>Built specifically for the Algorand ecosystem</p>
          </div>
        </div>
      </div>

      {/* Demo Statistics */}
      <div className="demo-stats">
        <h3>📊 Demo Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">3</span>
            <span className="stat-label">AI Agents</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98.7%</span>
            <span className="stat-label">AI Accuracy</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">4.5s</span>
            <span className="stat-label">Finality Time</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">$0.001</span>
            <span className="stat-label">Transaction Fee</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Carbon Neutral</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">24/7</span>
            <span className="stat-label">AI Monitoring</span>
          </div>
        </div>
      </div>

      {/* Technical Highlights */}
      <div className="technical-highlights">
        <h3>⚙️ Technical Highlights</h3>
        <div className="highlights-grid">
          <div className="highlight-item">
            <h4>Frontend</h4>
            <ul>
              <li>React + TypeScript</li>
              <li>Real-time WebSocket updates</li>
              <li>Responsive glassmorphism UI</li>
              <li>Algorand wallet integration</li>
            </ul>
          </div>
          <div className="highlight-item">
            <h4>Backend</h4>
            <ul>
              <li>FastAPI + Python</li>
              <li>AI/ML analysis engines</li>
              <li>Real-time Algorand data</li>
              <li>RESTful API architecture</li>
            </ul>
          </div>
          <div className="highlight-item">
            <h4>Blockchain</h4>
            <ul>
              <li>Algorand TestNet integration</li>
              <li>Smart contract ready</li>
              <li>Transaction management</li>
              <li>On-chain transparency</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoMode

