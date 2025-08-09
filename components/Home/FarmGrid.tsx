'use client'

import { useState, useEffect } from 'react'
import { useFarmingContract } from '@/lib/useFarmingContract'
import { CropType, PlotState, contractHelpers } from '@/lib/contract'

export function FarmGrid() {
  const { 
    player, 
    plots, 
    plantCrop, 
    waterPlot, 
    harvestCrop, 
    isLoading,
    loadPlots,
    address
  } = useFarmingContract()
  
  const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null)
  const [showSeedSelector, setShowSeedSelector] = useState(false)
  const [insufficientCoinsError, setInsufficientCoinsError] = useState<string | null>(null)

  // Load plots when component mounts
  useEffect(() => {
    if (loadPlots && address) {
      loadPlots()
    }
  }, [loadPlots, address])

  const handlePlotClick = (plotId: number) => {
    const plot = plots[plotId]
    
    // If no plot data or plot is empty, show seed selector
    if (!plot || plot.state === PlotState.EMPTY) {
      setSelectedPlotId(plotId)
      setShowSeedSelector(true)
      return
    }

    // If plot is already planted or growing but not ready, show error
    if ((plot.state === PlotState.PLANTED || plot.state === PlotState.GROWING) && !plot.isReady) {
      alert(`This plot is already occupied! You can water it or wait for it to grow.`)
      return
    }

    // If there's a crop ready to harvest, harvest it
    if (plot.isReady) {
      harvestCrop(plotId)
    }
  }

  const handleSeedSelect = (cropType: CropType) => {
    if (selectedPlotId !== null) {
      // Get seed cost from smart contract values
      const seedCosts = {
        [CropType.TOMATO]: 10,
        [CropType.CARROT]: 5,
        [CropType.POTATO]: 12,
        [CropType.CORN]: 15,
        [CropType.WHEAT]: 20,
        [CropType.STRAWBERRY]: 30,
        [CropType.GOLDEN_APPLE]: 200
      }
      
      const seedCost = seedCosts[cropType] || 10
      
      if (!player) {
        setInsufficientCoinsError('Unable to get player data')
        return
      }
      
      if (Number(player.coins) < seedCost) {
        setInsufficientCoinsError(`Not enough coins! You need ${seedCost} coins to buy seeds. You have ${Number(player.coins)} coins.`)
        return
      }
      
      // Clear any previous error
      setInsufficientCoinsError(null)
      
      plantCrop(selectedPlotId, cropType)
      setSelectedPlotId(null)
      setShowSeedSelector(false)
    }
  }

  const getGrowthStage = (plot: any) => {
    if (!plot) return '⬜'
    if (plot.isReady) return contractHelpers.getCropEmoji(plot.cropType)
    if (plot.state === PlotState.EMPTY) return '⬜'
    if (plot.state === PlotState.PLANTED) return '🌱'
    if (plot.state === PlotState.GROWING) return '🌿'
    if (plot.state === PlotState.READY) return contractHelpers.getCropEmoji(plot.cropType)
    if (plot.state === PlotState.HARVESTED) return '🌾'
    return '⬜'
  }

  const getPlotColor = (plot: any) => {
    if (!plot) {
      return 'bg-brown-100 border-brown-300'
    }
    if (plot.isReady) {
      return 'bg-yellow-200 border-yellow-400'
    }
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
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
          </div>
          <div className="text-sm text-gray-500 mt-2">
            This may take a few seconds...
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🌾 Your Farm</h2>
        <div className="text-sm text-gray-600">
          {player ? `Level ${Number(player.level)} • ${Number(player.coins)} coins` : 'Connect wallet'}
        </div>
      </div>

      {/* Farm Grid */}
      <div className="grid grid-cols-5 gap-2 max-w-sm mx-auto">
        {Array.from({ length: 25 }, (_, i) => {
          const plot = plots[i] || null
          return (
            <div key={i} className="relative">
            <button
              onClick={() => handlePlotClick(i)}
                disabled={isLoading}
              className={`
                w-16 h-16 rounded-lg border-2 flex items-center justify-center text-2xl
                transition-all duration-200 hover:scale-105 active:scale-95
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                ${getPlotColor(plot)}
              `}
            >
              <div className="text-center">
                <div>{getGrowthStage(plot)}</div>
                {plot?.isWatered && <div className="text-xs text-blue-600">💧</div>}
              </div>
            </button>
              
              {/* Water Button for planted/growing crops */}
              {plot && (plot.state === PlotState.PLANTED || plot.state === PlotState.GROWING) && !plot.isReady && (
                <button
                  onClick={() => waterPlot(i)}
                  disabled={isLoading}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-full flex items-center justify-center transition-colors"
                  title="Water crop"
                >
                  💧
                </button>
              )}
              
              {/* Harvest Button for ready crops */}
              {plot && plot.isReady && (
                <button
                  onClick={() => harvestCrop(i)}
                  disabled={isLoading}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 hover:bg-yellow-600 text-white text-xs rounded-full flex items-center justify-center transition-colors"
                  title="Harvest crop"
                >
                  ✂️
                </button>
              )}
            </div>
          )
        })}
      </div>

      {/* Seed Selector Modal */}
      {showSeedSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Select Seeds</h3>
            
            {/* Error Message */}
            {insufficientCoinsError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-red-500">⚠️</span>
                  <span className="text-sm text-red-700 font-medium">{insufficientCoinsError}</span>
                </div>
                <button
                  onClick={() => setInsufficientCoinsError(null)}
                  className="mt-2 text-xs text-red-600 hover:text-red-800 underline"
                >
                  Dismiss
                </button>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: 'tomato', cropType: CropType.TOMATO, name: 'Tomato', emoji: '🍅', cost: 10 },
                { key: 'carrot', cropType: CropType.CARROT, name: 'Carrot', emoji: '🥕', cost: 5 },
                { key: 'potato', cropType: CropType.POTATO, name: 'Potato', emoji: '🥔', cost: 12 },
                { key: 'corn', cropType: CropType.CORN, name: 'Corn', emoji: '🌽', cost: 15 },
                { key: 'wheat', cropType: CropType.WHEAT, name: 'Wheat', emoji: '🌾', cost: 20 },
                { key: 'strawberry', cropType: CropType.STRAWBERRY, name: 'Strawberry', emoji: '🍓', cost: 30 },
                { key: 'goldenApple', cropType: CropType.GOLDEN_APPLE, name: 'Golden Apple', emoji: '🍎', cost: 200 }
              ].map(({ key, cropType, name, emoji, cost }) => {
                const canPlant = player && Number(player.coins) >= cost

                return (
                  <div key={key} className="relative">
                  <button
                      onClick={() => canPlant ? handleSeedSelect(cropType) : setInsufficientCoinsError(`Not enough coins! You need ${cost} coins to buy ${name} seeds. You have ${Number(player?.coins || 0)} coins.`)}
                    disabled={!canPlant}
                    className={`
                        w-full p-3 rounded-lg border-2 text-center transition-all group
                      ${canPlant 
                        ? 'border-green-300 hover:border-green-500 hover:bg-green-50' 
                          : 'border-gray-200 bg-gray-50 text-gray-400 hover:bg-red-50 hover:border-red-300 cursor-pointer'
                      }
                    `}
                  >
                      <div className="text-2xl mb-1">{emoji}</div>
                      <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-gray-500">
                        {cost} coins
                    </div>
                  </button>
                    
                    {/* Tooltip for insufficient coins */}
                    {!canPlant && (
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full bg-red-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        Need {cost} coins
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-red-500"></div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            <button
              onClick={() => {
                setShowSeedSelector(false)
                setInsufficientCoinsError(null) // Clear error when closing modal
              }}
              className="mt-4 w-full bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white py-3 px-4 rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2"
            >
              <span>❌</span>
              <span>Cancel</span>
            </button>
          </div>
        </div>
      )}

      {/* Debug Info */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 text-center mt-4 p-2 bg-gray-100 rounded">
          <p>Debug: {plots.filter(Boolean).length} plots loaded</p>
          <p>Player: {player ? `${Number(player.coins)} coins` : 'Not connected'}</p>
          <button
            onClick={() => loadPlots && loadPlots()}
            className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Refresh Plots
          </button>
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