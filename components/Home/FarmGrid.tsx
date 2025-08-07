'use client'

import { useState, useEffect } from 'react'
import { useFarmingContract } from '@/lib/useFarmingContract'
import { CropType, PlotState, contractHelpers } from '@/lib/contract'
import { CROPS } from '@/types'

export function FarmGrid() {
  const { 
    player, 
    plots, 
    plantCrop, 
    waterPlot, 
    harvestCrop, 
    isLoading,
    loadPlots
  } = useFarmingContract()
  
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null)
  const [showSeedSelector, setShowSeedSelector] = useState(false)

  // Load plots when component mounts
  useEffect(() => {
    if (loadPlots) {
      loadPlots()
    }
  }, [loadPlots])

  const handlePlotClick = (plotId: number) => {
    const plot = plots[plotId]
    if (!plot) return

    if (plot.state !== PlotState.EMPTY) {
      // If there's a crop, try to harvest it
      if (plot.state === PlotState.READY) {
        harvestCrop(plotId)
      } else if (plot.state === PlotState.PLANTED || plot.state === PlotState.GROWING) {
        // Water the crop if it's planted or growing
        waterPlot(plotId)
      }
    } else {
      // If no crop, show seed selector
      setSelectedPlotId(plotId)
      setShowSeedSelector(true)
    }
  }

  const handleSeedSelect = (cropType: CropType) => {
    if (selectedPlotId !== null) {
      plantCrop(selectedPlotId, cropType)
      setSelectedPlotId(null)
      setShowSeedSelector(false)
    }
  }

  const getGrowthStage = (plot: any) => {
    if (plot.state === PlotState.EMPTY) return '⬜'
    if (plot.state === PlotState.PLANTED) return '🌱'
    if (plot.state === PlotState.GROWING) return '🌿'
    if (plot.state === PlotState.READY) return contractHelpers.getCropEmoji(plot.cropType)
    if (plot.state === PlotState.HARVESTED) return '🌾'
    return '⬜'
  }

  const getPlotColor = (plot: any) => {
    if (plot.state === PlotState.EMPTY) {
      return 'bg-brown-100 border-brown-300'
    }
    if (plot.state === PlotState.PLANTED) {
      return 'bg-gray-200 border-gray-400'
    }
    if (plot.state === PlotState.GROWING) {
      return 'bg-blue-200 border-blue-400'
    }
    if (plot.state === PlotState.READY) {
      return 'bg-yellow-200 border-yellow-400'
    }
    if (plot.state === PlotState.HARVESTED) {
      return 'bg-green-200 border-green-400'
    }
    return 'bg-brown-100 border-brown-300'
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-xl font-bold">🌾 Your Farm</div>
          <div className="text-gray-600">Loading farm data...</div>
        </div>
      </div>
    )
  }



  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🌾 Your Farm</h2>
        <div className="text-sm text-gray-600">
          {player ? `Level ${player.level} • ${player.coins} coins` : 'Connect wallet'}
        </div>
      </div>

      {/* Farm Grid */}
      <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
        {Array.from({ length: 25 }, (_, i) => {
          const plot = plots[i]
          return (
            <button
              key={i}
              onClick={() => handlePlotClick(i)}
              className={`
                w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl
                transition-all duration-200 hover:scale-105 active:scale-95
                ${getPlotColor(plot)}
              `}
            >
              <div className="text-center">
                <div>{getGrowthStage(plot)}</div>
                {plot?.isWatered && <div className="text-xs text-blue-600">💧</div>}
              </div>
            </button>
          )
        })}
      </div>

      {/* Seed Selector Modal */}
      {showSeedSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Select Seeds</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(CROPS).map(([key, crop]) => {
                const cropType = CropType[key.toUpperCase() as keyof typeof CropType]
                const canPlant = player && player.coins >= crop.buyPrice

                return (
                  <button
                    key={key}
                    onClick={() => canPlant && handleSeedSelect(cropType)}
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
                      {crop.buyPrice} coins
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
        {!player && <p className="text-red-600">🔗 Connect your wallet to start farming!</p>}
      </div>
    </div>
  )
} 