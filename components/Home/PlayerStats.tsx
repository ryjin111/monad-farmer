'use client'

import { useState } from 'react'
import { useFarmingContract } from '@/lib/useFarmingContract'
import { CropType, contractHelpers } from '@/lib/contract'
import { CROPS } from '@/types'

export function PlayerStats() {
  const { player, isLoading } = useFarmingContract()
  const [showInventory, setShowInventory] = useState(false)

  // MONAD to coins conversion: 1 MONAD = 50 coins
  const monadToCoins = (monadAmount: number) => monadAmount * 50
  const coinsToMonad = (coinsAmount: number) => coinsAmount / 50

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-800">👤 Player Stats</div>
          <div className="text-gray-600">Loading player data...</div>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold text-gray-800">👤 Player Stats</div>
          <div className="text-red-600">Connect your wallet to view stats</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Player Info */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-12 h-12 rounded-full border-2 border-white bg-green-500 flex items-center justify-center text-white font-bold">
            👤
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-800">Monad Farmer</h3>
            <p className="text-sm text-gray-600">On-chain player</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-600">💰</div>
            <div className="text-sm font-medium text-gray-800">{Number(player.coins)}</div>
            <div className="text-xs text-gray-500">Coins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">⭐</div>
            <div className="text-sm font-medium text-gray-800">{Number(player.level)}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">📈</div>
            <div className="text-sm font-medium text-gray-800">{Number(player.experience)}</div>
            <div className="text-xs text-gray-500">XP</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center mt-3">
          <div>
            <div className="text-lg font-bold text-purple-600">🌾</div>
            <div className="text-sm font-medium text-gray-800">{Number(player.totalHarvests)}</div>
            <div className="text-xs text-gray-500">Total Harvests</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">🌱</div>
            <div className="text-sm font-medium text-gray-800">{Number(player.totalPlanted)}</div>
            <div className="text-xs text-gray-500">Total Planted</div>
          </div>
        </div>
      </div>

      {/* MONAD Conversion Info */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
        <h4 className="font-bold text-gray-800 mb-2">💎 MONAD Conversion</h4>
        <div className="text-sm text-gray-700 space-y-1">
          <p>• 1 MONAD = 50 coins</p>
          <p>• Your {Number(player.coins)} coins = {coinsToMonad(Number(player.coins)).toFixed(2)} MONAD</p>
          <p>• Need 50 coins to buy 1 MONAD</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowInventory(true)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          📦 Inventory
        </button>
      </div>
      
      {/* Info Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">💡</span>
          <span className="text-sm text-blue-700">
            <strong>Tip:</strong> Buy seeds directly from your farm by clicking on empty plots!
          </span>
        </div>
      </div>

      {/* Quick Stats Preview */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-bold mb-2 text-gray-800">Quick Stats</h4>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-2xl">🍅</div>
            <div className="text-xs text-gray-700">Tomatoes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🥕</div>
            <div className="text-xs text-gray-700">Carrots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🥔</div>
            <div className="text-xs text-gray-700">Potatoes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🌽</div>
            <div className="text-xs text-gray-700">Corn</div>
          </div>
        </div>
      </div>



      {/* Inventory Modal */}
      {showInventory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">📦 Inventory</h3>
              <button
                onClick={() => setShowInventory(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="text-center text-gray-500 py-8">
              <div className="text-4xl mb-2">🌾</div>
              <div>Your harvested crops are stored on-chain!</div>
              <div className="text-sm mt-2">Check your farm to see what you've grown.</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 