import algosdk from 'algosdk'

export interface LendingPoolContract {
  appId: number
  appAddress: string
  name: string
  totalDeposits: number
  totalBorrowed: number
  interestRate: number
  utilizationRate: number
}

export interface UserPosition {
  deposits: number
  borrowed: number
  collateral: number
  healthFactor: number
}

export class SmartContractService {
  private algodClient: algosdk.Algodv2

  constructor(algodClient: algosdk.Algodv2) {
    this.algodClient = algodClient
  }

  /**
   * Deploy a new lending pool contract
   */
  async deployLendingPool(
    creator: string,
    transactionSigner: any,
    poolName: string,
    interestRate: number
  ): Promise<LendingPoolContract> {
    try {
      // Get suggested transaction parameters
      const suggestedParams = await this.algodClient.getTransactionParams().do()

      // Create the application creation transaction
      const appCreateTxn = algosdk.makeApplicationCreateTxnFromObject({
        sender: creator,
        suggestedParams,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        approvalProgram: await this.getLendingPoolApprovalProgram(),
        clearProgram: await this.getLendingPoolClearProgram(),
        numLocalInts: 3, // userDeposits, userBorrowed, lastUpdateTime
        numLocalByteSlices: 0,
        numGlobalInts: 4, // totalDeposits, totalBorrowed, interestRate, utilizationRate
        numGlobalByteSlices: 1, // poolOwner
        appArgs: [
          algosdk.encodeUint64(interestRate),
          new TextEncoder().encode(poolName)
        ],
        note: new Uint8Array(Buffer.from(`Deploy ${poolName} lending pool`))
      })

      // Sign and send transaction
      const signedTxns = await transactionSigner([appCreateTxn], [0])
      const response = await this.algodClient.sendRawTransaction(signedTxns[0]).do()
      
      // Wait for confirmation
      const confirmedTxn = await algosdk.waitForConfirmation(this.algodClient, response.txid, 4)
      const appId = Number(confirmedTxn.applicationIndex)
      const appAddress = algosdk.getApplicationAddress(appId)

      return {
        appId,
        appAddress: appAddress.toString(),
        name: poolName,
        totalDeposits: 0,
        totalBorrowed: 0,
        interestRate,
        utilizationRate: 0
      }
    } catch (error) {
      console.error('Failed to deploy lending pool:', error)
      throw error
    }
  }

  /**
   * Deposit ALGO into a lending pool
   */
  async depositToPool(
    userAddress: string,
    transactionSigner: any,
    poolAppId: number,
    amount: number
  ): Promise<string> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do()
      const appAddress = algosdk.getApplicationAddress(poolAppId)

      // Create payment transaction to the pool
      const paymentTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: userAddress,
        receiver: appAddress,
        amount: Math.floor(amount * 1000000), // Convert ALGO to microALGOs
        suggestedParams,
        note: new Uint8Array(Buffer.from('Deposit to lending pool'))
      })

      // Create application call transaction
      const appCallTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: userAddress,
        appIndex: poolAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [new TextEncoder().encode('deposit')],
        suggestedParams,
        note: new Uint8Array(Buffer.from('Deposit call'))
      })

      // Group transactions
      const txnGroup = [paymentTxn, appCallTxn]
      algosdk.assignGroupID(txnGroup)

      // Sign and send
      const signedTxns = await transactionSigner(txnGroup, [0, 1])
      const response = await this.algodClient.sendRawTransaction(signedTxns).do()
      
      await algosdk.waitForConfirmation(this.algodClient, response.txid, 4)
      return response.txid
    } catch (error) {
      console.error('Failed to deposit to pool:', error)
      throw error
    }
  }

  /**
   * Borrow ALGO from a lending pool
   */
  async borrowFromPool(
    userAddress: string,
    transactionSigner: any,
    poolAppId: number,
    borrowAmount: number,
    collateralAmount: number
  ): Promise<string> {
    try {
      const suggestedParams = await this.algodClient.getTransactionParams().do()
      const appAddress = algosdk.getApplicationAddress(poolAppId)

      // Create collateral payment transaction
      const collateralTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        sender: userAddress,
        receiver: appAddress,
        amount: Math.floor(collateralAmount * 1000000),
        suggestedParams,
        note: new Uint8Array(Buffer.from('Collateral for borrow'))
      })

      // Create borrow application call
      const borrowTxn = algosdk.makeApplicationCallTxnFromObject({
        sender: userAddress,
        appIndex: poolAppId,
        onComplete: algosdk.OnApplicationComplete.NoOpOC,
        appArgs: [
          new TextEncoder().encode('borrow'),
          algosdk.encodeUint64(Math.floor(borrowAmount * 1000000))
        ],
        suggestedParams,
        note: new Uint8Array(Buffer.from('Borrow from pool'))
      })

      // Group transactions
      const txnGroup = [collateralTxn, borrowTxn]
      algosdk.assignGroupID(txnGroup)

      const signedTxns = await transactionSigner(txnGroup, [0, 1])
      const response = await this.algodClient.sendRawTransaction(signedTxns).do()
      
      await algosdk.waitForConfirmation(this.algodClient, response.txid, 4)
      return response.txid
    } catch (error) {
      console.error('Failed to borrow from pool:', error)
      throw error
    }
  }

  /**
   * Get lending pool information
   */
  async getPoolInfo(poolAppId: number): Promise<LendingPoolContract | null> {
    try {
      const appInfo = await this.algodClient.getApplicationByID(poolAppId).do()
      const globalState = appInfo.params.globalState
      
      const parseGlobalState = (state: any[]) => {
        const result: any = {}
        state.forEach((item) => {
          const key = Buffer.from(item.key, 'base64').toString()
          const value = item.value.type === 1 
            ? Buffer.from(item.value.bytes, 'base64').toString()
            : item.value.uint
          result[key] = value
        })
        return result
      }

      const state = parseGlobalState(globalState || [])
      const appAddress = algosdk.getApplicationAddress(poolAppId)

      return {
        appId: poolAppId,
        appAddress: appAddress.toString(),
        name: state.poolName || `Pool ${poolAppId}`,
        totalDeposits: (state.totalDeposits || 0) / 1000000,
        totalBorrowed: (state.totalBorrowed || 0) / 1000000,
        interestRate: state.interestRate || 0,
        utilizationRate: state.utilizationRate || 0
      }
    } catch (error) {
      console.error('Failed to get pool info:', error)
      return null
    }
  }

  /**
   * Get user position in a lending pool
   */
  async getUserPosition(userAddress: string, poolAppId: number): Promise<UserPosition | null> {
    try {
      const accountInfo = await this.algodClient.accountApplicationInformation(userAddress, poolAppId).do()
      const localState = accountInfo.appLocalState?.keyValue || []
      
      const parseLocalState = (state: any[]) => {
        const result: any = {}
        state.forEach((item) => {
          const key = Buffer.from(item.key, 'base64').toString()
          const value = item.value.uint || 0
          result[key] = value
        })
        return result
      }

      const state = parseLocalState(localState)
      const deposits = (state.userDeposits || 0) / 1000000
      const borrowed = (state.userBorrowed || 0) / 1000000
      const collateral = borrowed > 0 ? borrowed * 1.5 : 0 // 150% collateral ratio
      const healthFactor = borrowed > 0 ? collateral / borrowed : 0

      return {
        deposits,
        borrowed,
        collateral,
        healthFactor
      }
    } catch (error) {
      console.error('Failed to get user position:', error)
      return null
    }
  }

  /**
   * Get mock approval program (in production, this would be compiled TEAL)
   */
  private async getLendingPoolApprovalProgram(): Promise<Uint8Array> {
    // This is a placeholder - in production, you'd compile the TEAL program
    return new Uint8Array([0x06, 0x81, 0x01]) // Basic TEAL program
  }

  /**
   * Get mock clear program (in production, this would be compiled TEAL)
   */
  private async getLendingPoolClearProgram(): Promise<Uint8Array> {
    // This is a placeholder - in production, you'd compile the TEAL program
    return new Uint8Array([0x06, 0x81, 0x01]) // Basic TEAL program
  }
}

// Mock deployed contracts for demo purposes
export const MOCK_LENDING_POOLS: LendingPoolContract[] = [
  {
    appId: 123456789,
    appAddress: 'ALGOLEND7POOL7ADDRESS7EXAMPLE7INVESTMENT7POOL',
    name: 'ALGO Stable Pool',
    totalDeposits: 125000,
    totalBorrowed: 87500,
    interestRate: 450, // 4.5%
    utilizationRate: 7000 // 70%
  },
  {
    appId: 123456790,
    appAddress: 'ALGOLEND7POOL7ADDRESS7EXAMPLE7INVESTMENT7POOL2',
    name: 'High Yield Pool',
    totalDeposits: 75000,
    totalBorrowed: 45000,
    interestRate: 850, // 8.5%
    utilizationRate: 6000 // 60%
  },
  {
    appId: 123456791,
    appAddress: 'ALGOLEND7POOL7ADDRESS7EXAMPLE7INVESTMENT7POOL3',
    name: 'Conservative Pool',
    totalDeposits: 200000,
    totalBorrowed: 80000,
    interestRate: 325, // 3.25%
    utilizationRate: 4000 // 40%
  }
]
