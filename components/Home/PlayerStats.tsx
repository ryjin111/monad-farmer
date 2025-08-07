'use client'

import { useState } from 'react'
import { useGameState } from '@/lib/game'
import { CROPS } from '@/types'

export function PlayerStats() {
  const { gameState, sellCrop, buySeeds } = useGameState()
  const [showShop, setShowShop] = useState(false)
  const [showInventory, setShowInventory] = useState(false)

  const crops = gameState.player.inventory.filter(item => item.type === 'crop')
  const seeds = gameState.player.inventory.filter(item => item.type === 'seed')
  const tools = gameState.player.inventory.filter(item => item.type === 'tool')

  const handleSellCrop = (cropId: string) => {
    sellCrop(cropId)
  }

  const handleBuySeeds = (cropType: keyof typeof CROPS) => {
    buySeeds(cropType, 1)
  }

  return (
    <div className="space-y-4">
      {/* Player Info */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-3">
          <img 
            src={gameState.player.pfpUrl} 
            alt="Profile" 
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div>
            <h3 className="font-bold text-lg">{gameState.player.displayName}</h3>
            <p className="text-sm text-gray-600">@{gameState.player.username}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-yellow-600">💰</div>
            <div className="text-sm font-medium">{gameState.player.coins}</div>
            <div className="text-xs text-gray-500">Coins</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-600">⭐</div>
            <div className="text-sm font-medium">{gameState.player.level}</div>
            <div className="text-xs text-gray-500">Level</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">📈</div>
            <div className="text-sm font-medium">{gameState.player.experience}</div>
            <div className="text-xs text-gray-500">XP</div>
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

      {/* Quick Inventory Preview */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-bold mb-2">Quick View</h4>
        <div className="grid grid-cols-4 gap-2">
          {crops.slice(0, 4).map((crop) => (
            <div key={crop.id} className="text-center">
              <div className="text-2xl">{crop.emoji}</div>
              <div className="text-xs">{crop.quantity}</div>
            </div>
          ))}
          {crops.length === 0 && (
            <div className="col-span-4 text-center text-gray-400 text-sm">
              No crops harvested yet
            </div>
          )}
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
              {Object.entries(CROPS).map(([key, crop]) => (
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
                    onClick={() => handleBuySeeds(key as keyof typeof CROPS)}
                    disabled={gameState.player.coins < crop.buyPrice}
                    className={`
                      px-3 py-1 rounded text-sm font-medium transition-colors
                      ${gameState.player.coins >= crop.buyPrice
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {crop.buyPrice}💰
                  </button>
                </div>
              ))}
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
            
            {/* Crops */}
            {crops.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold mb-2">🌾 Crops</h4>
                <div className="space-y-2">
                  {crops.map((crop) => (
                    <div key={crop.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">{crop.emoji}</div>
                        <div>
                          <div className="font-medium">{crop.name}</div>
                          <div className="text-xs text-gray-500">x{crop.quantity}</div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSellCrop(crop.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                      >
                        Sell
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seeds */}
            {seeds.length > 0 && (
              <div className="mb-4">
                <h4 className="font-bold mb-2">🌱 Seeds</h4>
                <div className="space-y-2">
                  {seeds.map((seed) => (
                    <div key={seed.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">{seed.emoji}</div>
                        <div>
                          <div className="font-medium">{seed.name}</div>
                          <div className="text-xs text-gray-500">x{seed.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {tools.length > 0 && (
              <div>
                <h4 className="font-bold mb-2">🛠️ Tools</h4>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <div key={tool.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <div className="text-xl">{tool.emoji}</div>
                        <div>
                          <div className="font-medium">{tool.name}</div>
                          <div className="text-xs text-gray-500">x{tool.quantity}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {gameState.player.inventory.length === 0 && (
              <div className="text-center text-gray-500 py-8">
                Your inventory is empty
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 