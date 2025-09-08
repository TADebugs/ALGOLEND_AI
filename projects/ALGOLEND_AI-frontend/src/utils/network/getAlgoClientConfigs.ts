import { AlgoViteClientConfig, AlgoViteKMDConfig } from '../../interfaces/network'

export function getAlgodConfigFromViteEnvironment(): AlgoViteClientConfig {
  // Debug logging
  console.log('Environment variables:', {
    VITE_ALGOD_SERVER: import.meta.env.VITE_ALGOD_SERVER,
    VITE_ALGOD_NETWORK: import.meta.env.VITE_ALGOD_NETWORK,
    VITE_ALGOD_TOKEN: import.meta.env.VITE_ALGOD_TOKEN
  })
  
  const server = import.meta.env.VITE_ALGOD_SERVER || 'https://testnet-api.algonode.cloud'
  const network = import.meta.env.VITE_ALGOD_NETWORK || 'testnet'
  
  console.log('Using config:', { server, network })
  
  return {
    server,
    port: import.meta.env.VITE_ALGOD_PORT,
    token: import.meta.env.VITE_ALGOD_TOKEN || '',
    network,
  }
}

export function getIndexerConfigFromViteEnvironment(): AlgoViteClientConfig {
  const server = import.meta.env.VITE_INDEXER_SERVER || 'https://testnet-idx.algonode.cloud'
  const network = import.meta.env.VITE_ALGOD_NETWORK || 'testnet'
  
  return {
    server,
    port: import.meta.env.VITE_INDEXER_PORT,
    token: import.meta.env.VITE_INDEXER_TOKEN || '',
    network,
  }
}

export function getKmdConfigFromViteEnvironment(): AlgoViteKMDConfig {
  if (!import.meta.env.VITE_KMD_SERVER) {
    throw new Error('Attempt to get default kmd configuration without specifying VITE_KMD_SERVER in the environment variables')
  }

  return {
    server: import.meta.env.VITE_KMD_SERVER,
    port: import.meta.env.VITE_KMD_PORT,
    token: import.meta.env.VITE_KMD_TOKEN,
    wallet: import.meta.env.VITE_KMD_WALLET,
    password: import.meta.env.VITE_KMD_PASSWORD,
  }
}
