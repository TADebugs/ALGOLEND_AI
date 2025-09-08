import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { getAlgodConfigFromViteEnvironment, getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { AlgorandClient } from '@algorandfoundation/algokit-utils'

interface AppCallsInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const AppCalls = ({ openModal, setModalState }: AppCallsInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [contractInput, setContractInput] = useState<string>('')
  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const indexerConfig = getIndexerConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({
    algodConfig,
    indexerConfig,
  })
  algorand.setDefaultSigner(transactionSigner)

  const sendAppCall = async () => {
    setLoading(true)

    try {
      if (!activeAddress) {
        enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
        setLoading(false)
        return
      }

      // Simulate a smart contract call for demo purposes
      // In a real implementation, this would interact with actual smart contracts
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate processing time
      
      enqueueSnackbar('Smart contract call simulated successfully!', { variant: 'success' })
      enqueueSnackbar('This is a demo - no actual contract was called', { variant: 'info' })
      
    } catch (error) {
      enqueueSnackbar(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`, { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setModalState(false)
  }

  return (
    <div className={`modal-overlay ${openModal ? 'active' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Smart Contract Calls</h2>
          <button className="close-button" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          <div className="form-group">
            <label htmlFor="contractInput">Contract Input (Demo)</label>
            <input
              id="contractInput"
              type="text"
              value={contractInput}
              onChange={(e) => setContractInput(e.target.value)}
              placeholder="Enter contract input..."
              className="form-input"
            />
          </div>
          
          <div className="demo-notice">
            <h3>🚀 Demo Mode</h3>
            <p>This is a demonstration of smart contract interaction capabilities. In a production environment, this would connect to actual Algorand smart contracts.</p>
            <ul>
              <li>✅ Wallet connection ready</li>
              <li>✅ Transaction signing ready</li>
              <li>✅ Algorand client configured</li>
              <li>✅ Smart contract integration ready</li>
            </ul>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className="button is-light" 
            onClick={handleClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="button is-primary" 
            onClick={sendAppCall}
            disabled={loading || !activeAddress}
          >
            {loading ? 'Processing...' : 'Simulate Contract Call'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AppCalls