'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { useFarmingContract } from '@/lib/useFarmingContract'

export function BuyCoins() {
  const { address, isConnected } = useAccount()
  const { player, buyCoins, isLoading } = useFarmingContract()
  const [monadAmount, setMonadAmount] = useState('1')
  const [isProcessing, setIsProcessing] = useState(false)

  // Conversion rate: 1 MONAD = 50 coins
  const MONAD_TO_COINS_RATE = 50
  const coinsToReceive = Number(monadAmount) * MONAD_TO_COINS_RATE

  const handleBuyCoins = async () => {
    if (!isConnected || !address) {
      alert('Please connect your wallet first')
      return
    }

    if (!monadAmount || Number(monadAmount) <= 0) {
      alert('Please enter a valid MONAD amount')
      return
    }

    console.log('BuyCoins component - starting transaction:', {
      isConnected,
      address,
      monadAmount,
      playerCoins: player ? Number(player.coins) : 0
    })

    setIsProcessing(true)
    
    try {
      // Call the real smart contract function
      await buyCoins(monadAmount)
      
      console.log('BuyCoins component - transaction successful')
      
      // Reset form after successful transaction
      setMonadAmount('1')
    } catch (error) {
      console.error('BuyCoins component - error:', error)
      
      let errorMessage = 'Failed to buy coins. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('insufficient funds')) {
          errorMessage = 'Insufficient MONAD balance. Please check your wallet.'
        } else if (error.message.includes('user rejected')) {
          errorMessage = 'Transaction was cancelled by user.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection.'
        } else if (error.message.includes('contract')) {
          errorMessage = 'Contract error. Please check if you have enough MONAD for gas fees.'
        } else {
          errorMessage = `Transaction failed: ${error.message}`
        }
      }
      
      alert(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  const quickAmounts = [1, 5, 10, 25]

  if (!isConnected) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-800">💰 Buy Coins</div>
          <div className="text-red-600">Connect your wallet to buy coins</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
     
      
      {/* Current Balance */}
      <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">💎 Current Balance</h3>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">💰</div>
          <div className="text-sm font-medium text-gray-800">
            {player ? Number(player.coins) : 0}
          </div>
          <div className="text-xs text-gray-600">Coins</div>
        </div>
      </div>

      {/* Conversion Rate Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💱 Exchange Rate</h4>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• 1 MONAD = {MONAD_TO_COINS_RATE} coins</p>
          <p>• Minimum purchase: 1 MONAD</p>
          <p>• Transaction fee: 0.1%</p>
        </div>
      </div>

      {/* Buy Form */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-bold mb-3 text-gray-800">🛒 Purchase Coins</h4>
        
        {/* Quick Amount Buttons */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Quick Amount (MONAD)
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickAmounts.map((amount) => (
              <button
                key={amount}
                onClick={() => setMonadAmount(amount.toString())}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  Number(monadAmount) === amount
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Amount Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Amount (MONAD)
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            value={monadAmount}
            onChange={(e) => setMonadAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            placeholder="Enter MONAD amount"
          />
        </div>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">You pay:</span>
            <span className="font-medium text-gray-800">{monadAmount} MONAD</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600">You receive:</span>
            <span className="font-medium text-green-600">{coinsToReceive} coins</span>
          </div>
          <div className="flex justify-between items-center text-sm mt-1">
            <span className="text-gray-600">Fee:</span>
            <span className="font-medium text-red-600">{(Number(monadAmount) * 0.001).toFixed(3)} MONAD</span>
          </div>
        </div>

        {/* Buy Button */}
        <button
          onClick={handleBuyCoins}
          disabled={isProcessing || isLoading || !monadAmount || Number(monadAmount) <= 0}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          {isProcessing || isLoading ? (
            <>
              <span>🔄</span>
              <span>Processing Transaction...</span>
            </>
          ) : (
            <>
              <span>💰</span>
              <span>Buy {coinsToReceive} Coins</span>
            </>
          )}
        </button>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-bold mb-3 text-gray-800">📊 Recent Transactions</h4>
        <div className="text-center text-gray-500 py-4">
          <div className="text-2xl mb-2">📋</div>
          <div>No transactions yet</div>
          <div className="text-sm">Your purchase history will appear here</div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Coins are used to buy seeds and expand your farm</li>
          <li>• You can earn coins by harvesting crops</li>
          <li>• MONAD tokens are required for gas fees on Monad network</li>
          <li>• Keep some MONAD for transaction fees</li>
          <li>• All coins are stored on-chain and persist permanently</li>
        </ul>
      </div>
    </div>
  )
} 