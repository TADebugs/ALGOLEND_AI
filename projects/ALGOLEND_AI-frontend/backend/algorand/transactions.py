"""
Transaction Helper
Handles Algorand transaction creation and management
"""

import asyncio
import aiohttp
import json
from datetime import datetime
from typing import Dict, List, Any, Optional
import base64

class TransactionHelper:
    def __init__(self):
        self.testnet_algod_url = "https://testnet-api.algonode.cloud"
        self.mainnet_algod_url = "https://mainnet-api.algonode.cloud"
        self.current_network = "testnet"
        self.algod_url = self.testnet_algod_url
        
        self.headers = {
            "Content-Type": "application/json",
            "User-Agent": "AlgoLend-AI/1.0"
        }
    
    async def create_payment_transaction(self, sender: str, receiver: str, amount_microalgos: int, 
                                      note: str = "", fee: int = 1000) -> Optional[Dict[str, Any]]:
        """Create a payment transaction"""
        try:
            # Get suggested parameters
            suggested_params = await self._get_suggested_params()
            if not suggested_params:
                return None
            
            # Create transaction object
            transaction = {
                "from": sender,
                "to": receiver,
                "amount": amount_microalgos,
                "fee": fee,
                "firstRound": suggested_params["firstRound"],
                "lastRound": suggested_params["lastRound"],
                "genesisID": suggested_params["genesisID"],
                "genesisHash": suggested_params["genesisHash"],
                "note": base64.b64encode(note.encode()).decode() if note else "",
                "type": "pay"
            }
            
            return transaction
            
        except Exception as e:
            print(f"Error creating payment transaction: {e}")
            return None
    
    async def create_asset_transfer_transaction(self, sender: str, receiver: str, asset_id: int,
                                             amount: int, note: str = "", fee: int = 1000) -> Optional[Dict[str, Any]]:
        """Create an asset transfer transaction"""
        try:
            suggested_params = await self._get_suggested_params()
            if not suggested_params:
                return None
            
            transaction = {
                "from": sender,
                "to": receiver,
                "assetIndex": asset_id,
                "amount": amount,
                "fee": fee,
                "firstRound": suggested_params["firstRound"],
                "lastRound": suggested_params["lastRound"],
                "genesisID": suggested_params["genesisID"],
                "genesisHash": suggested_params["genesisHash"],
                "note": base64.b64encode(note.encode()).decode() if note else "",
                "type": "axfer"
            }
            
            return transaction
            
        except Exception as e:
            print(f"Error creating asset transfer transaction: {e}")
            return None
    
    async def create_application_call_transaction(self, sender: str, app_id: int, 
                                                app_args: List[str] = None, 
                                                accounts: List[str] = None,
                                                assets: List[int] = None,
                                                note: str = "", fee: int = 1000) -> Optional[Dict[str, Any]]:
        """Create an application call transaction"""
        try:
            suggested_params = await self._get_suggested_params()
            if not suggested_params:
                return None
            
            transaction = {
                "from": sender,
                "appIndex": app_id,
                "appArgs": app_args or [],
                "accounts": accounts or [],
                "foreignAssets": assets or [],
                "fee": fee,
                "firstRound": suggested_params["firstRound"],
                "lastRound": suggested_params["lastRound"],
                "genesisID": suggested_params["genesisID"],
                "genesisHash": suggested_params["genesisHash"],
                "note": base64.b64encode(note.encode()).decode() if note else "",
                "type": "appl"
            }
            
            return transaction
            
        except Exception as e:
            print(f"Error creating application call transaction: {e}")
            return None
    
    async def submit_transaction(self, signed_transaction: str) -> Optional[Dict[str, Any]]:
        """Submit a signed transaction to the network"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.algod_url}/v2/transactions"
                data = signed_transaction
                
                async with session.post(url, headers=self.headers, data=data) as response:
                    if response.status == 200:
                        result = await response.json()
                        return {
                            "txid": result.get("txid", ""),
                            "confirmed": False,
                            "status": "pending"
                        }
                    else:
                        error_text = await response.text()
                        return {
                            "error": f"Transaction submission failed: {response.status}",
                            "details": error_text
                        }
        except Exception as e:
            return {
                "error": f"Transaction submission error: {str(e)}"
            }
    
    async def wait_for_confirmation(self, txid: str, timeout: int = 30) -> Optional[Dict[str, Any]]:
        """Wait for transaction confirmation"""
        try:
            start_time = datetime.now()
            
            while (datetime.now() - start_time).seconds < timeout:
                async with aiohttp.ClientSession() as session:
                    url = f"{self.algod_url}/v2/transactions/{txid}"
                    async with session.get(url, headers=self.headers) as response:
                        if response.status == 200:
                            tx_data = await response.json()
                            if tx_data.get("confirmed-round"):
                                return {
                                    "txid": txid,
                                    "confirmed": True,
                                    "confirmed_round": tx_data.get("confirmed-round"),
                                    "status": "confirmed"
                                }
                        elif response.status == 404:
                            # Transaction not found yet, continue waiting
                            await asyncio.sleep(1)
                            continue
                        else:
                            return {
                                "txid": txid,
                                "confirmed": False,
                                "status": "error",
                                "error": f"HTTP {response.status}"
                            }
                
                await asyncio.sleep(1)
            
            return {
                "txid": txid,
                "confirmed": False,
                "status": "timeout"
            }
            
        except Exception as e:
            return {
                "txid": txid,
                "confirmed": False,
                "status": "error",
                "error": str(e)
            }
    
    async def get_transaction_status(self, txid: str) -> Optional[Dict[str, Any]]:
        """Get current status of a transaction"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.algod_url}/v2/transactions/{txid}"
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        tx_data = await response.json()
                        return {
                            "txid": txid,
                            "confirmed": bool(tx_data.get("confirmed-round")),
                            "confirmed_round": tx_data.get("confirmed-round"),
                            "status": "confirmed" if tx_data.get("confirmed-round") else "pending"
                        }
                    elif response.status == 404:
                        return {
                            "txid": txid,
                            "confirmed": False,
                            "status": "not_found"
                        }
                    else:
                        return {
                            "txid": txid,
                            "confirmed": False,
                            "status": "error",
                            "error": f"HTTP {response.status}"
                        }
        except Exception as e:
            return {
                "txid": txid,
                "confirmed": False,
                "status": "error",
                "error": str(e)
            }
    
    async def _get_suggested_params(self) -> Optional[Dict[str, Any]]:
        """Get suggested transaction parameters"""
        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.algod_url}/v2/transactions/params"
                async with session.get(url, headers=self.headers) as response:
                    if response.status == 200:
                        return await response.json()
                    else:
                        return None
        except Exception as e:
            print(f"Error getting suggested params: {e}")
            return None
    
    async def create_lending_pool_transaction(self, sender: str, pool_id: str, 
                                            amount: int, action: str) -> Optional[Dict[str, Any]]:
        """Create a transaction for lending pool interaction"""
        try:
            # This would integrate with actual lending pool smart contracts
            # For now, create a mock transaction structure
            
            note = f"AlgoLend Pool {action}: {pool_id}"
            
            if action == "deposit":
                return await self.create_payment_transaction(
                    sender=sender,
                    receiver="POOL_CONTRACT_ADDRESS",  # Would be actual contract address
                    amount_microalgos=amount,
                    note=note
                )
            elif action == "withdraw":
                return await self.create_application_call_transaction(
                    sender=sender,
                    app_id=123,  # Would be actual app ID
                    app_args=[action, str(amount)],
                    note=note
                )
            else:
                return None
                
        except Exception as e:
            print(f"Error creating lending pool transaction: {e}")
            return None
    
    async def create_loan_request_transaction(self, sender: str, amount: int, 
                                            term_days: int, collateral_amount: int) -> Optional[Dict[str, Any]]:
        """Create a transaction for loan request"""
        try:
            note = f"Loan Request: {amount} ALGO for {term_days} days, Collateral: {collateral_amount} ALGO"
            
            return await self.create_application_call_transaction(
                sender=sender,
                app_id=456,  # Would be actual loan contract app ID
                app_args=["request_loan", str(amount), str(term_days), str(collateral_amount)],
                note=note
            )
            
        except Exception as e:
            print(f"Error creating loan request transaction: {e}")
            return None
    
    def switch_network(self, network: str):
        """Switch between testnet and mainnet"""
        if network == "mainnet":
            self.current_network = "mainnet"
            self.algod_url = self.mainnet_algod_url
        else:
            self.current_network = "testnet"
            self.algod_url = self.testnet_algod_url
    
    async def get_transaction_fee_estimate(self, transaction_type: str = "payment") -> int:
        """Get estimated transaction fee"""
        try:
            suggested_params = await self._get_suggested_params()
            if suggested_params:
                return suggested_params.get("fee", 1000)
            else:
                # Default fees
                fees = {
                    "payment": 1000,
                    "asset_transfer": 1000,
                    "app_call": 1000,
                    "app_optin": 1000
                }
                return fees.get(transaction_type, 1000)
        except Exception as e:
            print(f"Error getting fee estimate: {e}")
            return 1000

