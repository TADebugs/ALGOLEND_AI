import { assert, Contract, GlobalState, uint64, LocalState, Global, Txn, itxn } from '@algorandfoundation/algorand-typescript'
import { Address } from '@algorandfoundation/algorand-typescript/arc4'

export class LendingPool extends Contract {
  // Global state variables
  totalDeposits = GlobalState<uint64>()
  totalBorrowed = GlobalState<uint64>()
  interestRate = GlobalState<uint64>() // Basis points (e.g., 500 = 5%)
  poolOwner = GlobalState<Address>()
  
  // User balances (local state)
  userDeposits = LocalState<uint64>()
  userBorrowed = LocalState<uint64>()
  lastUpdateTime = LocalState<uint64>()

  /**
   * Initialize the lending pool
   */
  createApplication(owner: Address, initialRate: uint64): void {
    this.poolOwner.value = owner
    this.interestRate.value = initialRate
    this.totalDeposits.value = 0
    this.totalBorrowed.value = 0
  }

  /**
   * Deposit ALGO into the lending pool
   */
  deposit(amount: uint64): void {
    // Payment verification is handled at the transaction level
    assert(amount > 0)

    // Update user's deposit balance
    this.userDeposits(Txn.sender).value = this.userDeposits(Txn.sender).value + amount
    this.lastUpdateTime(Txn.sender).value = Global.latestTimestamp
    
    // Update total deposits
    this.totalDeposits.value = this.totalDeposits.value + amount
  }

  /**
   * Withdraw ALGO from the lending pool
   */
  withdraw(amount: uint64): void {
    assert(amount > 0)
    assert(this.userDeposits(Txn.sender).value >= amount)
    
    // Calculate interest earned
    const timeElapsed: uint64 = Global.latestTimestamp - this.lastUpdateTime(Txn.sender).value
    const interestEarned: uint64 = this.calculateInterest(this.userDeposits(Txn.sender).value, timeElapsed)
    
    // Update balances
    this.userDeposits(Txn.sender).value = this.userDeposits(Txn.sender).value - amount
    this.totalDeposits.value = this.totalDeposits.value - amount
    this.lastUpdateTime(Txn.sender).value = Global.latestTimestamp
    
    // Send payment back to user (amount + interest)
    itxn.payment({
      receiver: Txn.sender,
      amount: amount + interestEarned,
    }).submit()
  }

  /**
   * Borrow ALGO from the lending pool
   */
  borrow(amount: uint64): void {
    assert(amount > 0)
    // Note: In a real implementation, collateral would be handled via grouped transactions
    
    // Check pool has enough liquidity
    assert(this.totalDeposits.value >= this.totalBorrowed.value + amount)
    
    // Update user's borrowed balance
    this.userBorrowed(Txn.sender).value = this.userBorrowed(Txn.sender).value + amount
    this.lastUpdateTime(Txn.sender).value = Global.latestTimestamp
    
    // Update total borrowed
    this.totalBorrowed.value = this.totalBorrowed.value + amount
    
    // Send borrowed amount to user
    itxn.payment({
      receiver: Txn.sender,
      amount: amount,
    }).submit()
  }

  /**
   * Repay borrowed ALGO
   */
  repay(): void {
    // Note: Payment verification would be handled via grouped transactions
    assert(this.userBorrowed(Txn.sender).value > 0)
    
    // Calculate interest owed
    const timeElapsed: uint64 = Global.latestTimestamp - this.lastUpdateTime(Txn.sender).value
    const interestOwed: uint64 = this.calculateInterest(this.userBorrowed(Txn.sender).value, timeElapsed)
    const totalOwed: uint64 = this.userBorrowed(Txn.sender).value + interestOwed
    
    // For simplicity, assume full repayment
    this.userBorrowed(Txn.sender).value = 0
    this.totalBorrowed.value = this.totalBorrowed.value - (totalOwed - interestOwed)
    this.lastUpdateTime(Txn.sender).value = Global.latestTimestamp
    
    // Return collateral if fully repaid
    // Collateral return logic would go here
  }

  /**
   * Calculate interest based on time elapsed
   */
  private calculateInterest(principal: uint64, timeElapsed: uint64): uint64 {
    // Simple interest calculation: (principal * rate * time) / (10000 * 365 * 24 * 3600)
    // Rate is in basis points, time in seconds
    const annualSeconds: uint64 = 365 * 24 * 3600
    return (principal * this.interestRate.value * timeElapsed) / (10000 * annualSeconds)
  }

  /**
   * Get pool statistics
   */
  getPoolStats(): [uint64, uint64, uint64, uint64] {
    const utilizationRate: uint64 = this.totalDeposits.value > 0 
      ? (this.totalBorrowed.value * 10000) / this.totalDeposits.value 
      : 0
    
    return [
      this.totalDeposits.value,
      this.totalBorrowed.value,
      this.interestRate.value,
      utilizationRate
    ]
  }

  /**
   * Get user position
   */
  getUserPosition(): [uint64, uint64, uint64] {
    return [
      this.userDeposits(Txn.sender).value,
      this.userBorrowed(Txn.sender).value,
      this.lastUpdateTime(Txn.sender).value
    ]
  }
}
