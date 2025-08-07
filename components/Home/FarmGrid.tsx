'use client'

import { useState } from 'react'
import { useGameState } from '@/lib/game'
import { CROPS } from '@/types'

export function FarmGrid() {
  const { gameState, plantCrop, waterPlot, harvestCrop } = useGameState()
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null)
  const [showSeedSelector, setShowSeedSelector] = useState(false)

  const handlePlotClick = (plotId: string) => {
    const plot = gameState.farm.find(p => p.id === plotId)
    if (!plot) return

    if (plot.crop) {
      // If there's a crop, try to harvest it
      if (plot.crop.currentGrowth >= plot.crop.growthTime && !plot.crop.isHarvested) {
        harvestCrop(plotId)
      } else if (!plot.isWatered) {
        // Water the crop if it's not watered
        waterPlot(plotId)
      }
    } else {
      // If no crop, show seed selector
      setSelectedPlotId(plotId)
      setShowSeedSelector(true)
    }
  }

  const handleSeedSelect = (cropType: keyof typeof CROPS) => {
    if (selectedPlotId) {
      plantCrop(selectedPlotId, cropType)
      setSelectedPlotId(null)
      setShowSeedSelector(false)
    }
  }

  const getGrowthStage = (crop: any) => {
    const progress = crop.currentGrowth / crop.growthTime
    if (progress < 0.25) return '🌱'
    if (progress < 0.5) return '🌿'
    if (progress < 0.75) return '🌾'
    if (progress < 1) return crop.emoji
    return crop.emoji
  }

  const getPlotColor = (plot: any) => {
    if (plot.crop) {
      const progress = plot.crop.currentGrowth / plot.crop.growthTime
      if (progress >= 1) return 'bg-yellow-200 border-yellow-400'
      if (progress >= 0.75) return 'bg-green-200 border-green-400'
      if (progress >= 0.5) return 'bg-blue-200 border-blue-400'
      if (progress >= 0.25) return 'bg-gray-200 border-gray-400'
      return 'bg-brown-200 border-brown-400'
    }
    return plot.isWatered ? 'bg-blue-100 border-blue-300' : 'bg-brown-100 border-brown-300'
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🌾 Your Farm</h2>
        <div className="text-sm text-gray-600">
          {gameState.weather} • Day {gameState.day}
        </div>
      </div>

      {/* Farm Grid */}
      <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
        {gameState.farm.map((plot) => (
          <button
            key={plot.id}
            onClick={() => handlePlotClick(plot.id)}
            className={`
              w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl
              transition-all duration-200 hover:scale-105 active:scale-95
              ${getPlotColor(plot)}
            `}
          >
            {plot.crop ? (
              <div className="text-center">
                <div>{getGrowthStage(plot.crop)}</div>
                {plot.isWatered && <div className="text-xs text-blue-600">💧</div>}
              </div>
            ) : (
              <div className="text-gray-400">⬜</div>
            )}
          </button>
        ))}
      </div>

      {/* Seed Selector Modal */}
      {showSeedSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Select Seeds</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CROPS).map(([key, crop]) => {
                const seedItem = gameState.player.inventory.find(
                  item => item.id === `${key}-seed`
                )
                const canPlant = seedItem && seedItem.quantity > 0

                return (
                  <button
                    key={key}
                    onClick={() => canPlant && handleSeedSelect(key as keyof typeof CROPS)}
                    disabled={!canPlant}
                    className={`
                      p-3 rounded-lg border-2 text-center transition-all
                      ${canPlant 
                        ? 'border-green-300 hover:border-green-500 hover:bg-green-50' 
                        : 'border-gray-200 bg-gray-50 text-gray-400'
                      }
                    `}
                  >
                    <div className="text-2xl mb-1">{crop.emoji}</div>
                    <div className="text-sm font-medium">{crop.name}</div>
                    <div className="text-xs text-gray-500">
                      {seedItem ? `${seedItem.quantity} left` : 'No seeds'}
                    </div>
                  </button>
                )
              })}
            </div>
            <button
              onClick={() => setShowSeedSelector(false)}
              className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center">
        <p>💧 Water crops to help them grow faster</p>
        <p>🌾 Harvest when crops are fully grown</p>
        <p>🌱 Plant seeds in empty plots</p>
      </div>
    </div>
  )
} 