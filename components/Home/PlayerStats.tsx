'use client'

import { useState } from 'react'
import { useFarmingContract } from '@/lib/useFarmingContract'
import { CropType, contractHelpers } from '@/lib/contract'
import { CROPS } from '@/types'

export function PlayerStats() {
  const { player, buySeeds, isLoading } = useFarmingContract()
  const [showShop, setShowShop] = useState(false)
  const [showInventory, setShowInventory] = useState(false)

  const handleBuySeeds = (cropType: CropType) => {
    buySeeds(cropType, 1)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold">👤 Player Stats</div>
          <div className="text-gray-600">Loading player data...</div>
        </div>
      </div>
    )
  }

  if (!player) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold">👤 Player Stats</div>
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
            <h3 className="font-bold text-lg">Monad Farmer</h3>
            <p className="text-sm text-gray-600">On-chain player</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-600">💰</div>
            <div className="text-sm font-medium">{Number(player.coins)}</div>
            <div className="text-xs text-gray-500">Coins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">⭐</div>
            <div className="text-sm font-medium">{Number(player.level)}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">📈</div>
            <div className="text-sm font-medium">{Number(player.experience)}</div>
            <div className="text-xs text-gray-500">XP</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-center mt-3">
          <div>
            <div className="text-lg font-bold text-purple-600">🌾</div>
            <div className="text-sm font-medium">{Number(player.totalHarvests)}</div>
            <div className="text-xs text-gray-500">Total Harvests</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">🌱</div>
            <div className="text-sm font-medium">{Number(player.totalPlanted)}</div>
            <div className="text-xs text-gray-500">Total Planted</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2">
        <button
          onClick={() => setShowShop(true)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          🛒 Shop
        </button>
        <button
          onClick={() => setShowInventory(true)}
          className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors"
        >
          📦 Inventory
        </button>
      </div>

      {/* Quick Stats Preview */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-bold mb-2">Quick Stats</h4>
        <div className="grid grid-cols-4 gap-2">
          <div className="text-center">
            <div className="text-2xl">🍅</div>
            <div className="text-xs">Tomatoes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🥕</div>
            <div className="text-xs">Carrots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🥔</div>
            <div className="text-xs">Potatoes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl">🌽</div>
            <div className="text-xs">Corn</div>
          </div>
        </div>
      </div>

      {/* Shop Modal */}
      {showShop && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">🛒 Seed Shop</h3>
              <button
                onClick={() => setShowShop(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3">
              {Object.entries(CROPS).map(([key, crop]) => {
                const cropType = CropType[key.toUpperCase() as keyof typeof CropType]
                const canBuy = player && Number(player.coins) >= crop.buyPrice
                
                return (
                  <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="text-2xl">{crop.emoji}</div>
                      <div>
                        <div className="font-medium">{crop.name}</div>
                        <div className="text-xs text-gray-500">
                          Grows in {crop.growthTime}min • Sells for {crop.sellPrice}💰
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleBuySeeds(cropType)}
                      disabled={!canBuy}
                      className={`
                        px-3 py-1 rounded text-sm font-medium transition-colors
                        ${canBuy
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }
                      `}
                    >
                      {crop.buyPrice}💰
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

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