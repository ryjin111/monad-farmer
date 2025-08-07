'use client'

import { useGameState } from '@/lib/game'
import { useFrame } from '@/components/farcaster-provider'

export function FarmingSocial() {
  const { gameState } = useGameState()
  const { actions } = useFrame()

  const handleShareProgress = async () => {
    const crops = gameState.player.inventory.filter(item => item.type === 'crop')
    const totalCrops = crops.reduce((sum, crop) => sum + crop.quantity, 0)
    
    const message = `🌾 Farming Simulator Progress! 🌾

💰 Coins: ${gameState.player.coins}
⭐ Level: ${gameState.player.level}
📈 Experience: ${gameState.player.experience}
🌱 Total Crops Harvested: ${totalCrops}
🏆 Achievements: ${gameState.player.achievements.length}

Just harvested some fresh crops in the Monad Farming Simulator! 🚜

#FarmingSimulator #Monad #Farcaster`

    try {
      await actions?.composeCast({
        text: message,
        embeds: []
      })
    } catch (error) {
      console.error('Failed to compose cast:', error)
    }
  }

  const handleShareAchievement = async (achievement: any) => {
    const message = `🏆 Achievement Unlocked! 🏆

${achievement.emoji} ${achievement.name}
${achievement.description}

Just unlocked this achievement in the Monad Farming Simulator! 🚜

#FarmingSimulator #Monad #Farcaster #Achievement`

    try {
      await actions?.composeCast({
        text: message,
        embeds: []
      })
    } catch (error) {
      console.error('Failed to compose cast:', error)
    }
  }

  const handleShareHarvest = async (cropName: string, cropEmoji: string) => {
    const message = `🌾 Fresh Harvest! 🌾

Just harvested ${cropEmoji} ${cropName} from my farm!

💰 Current Balance: ${gameState.player.coins}
⭐ Level: ${gameState.player.level}

Growing the best crops in the Monad Farming Simulator! 🚜

#FarmingSimulator #Monad #Farcaster #Harvest`

    try {
      await actions?.composeCast({
        text: message,
        embeds: []
      })
    } catch (error) {
      console.error('Failed to compose cast:', error)
    }
  }

  const getFarmStatus = () => {
    const plantedPlots = gameState.farm.filter(plot => plot.crop).length
    const readyToHarvest = gameState.farm.filter(
      plot => plot.crop && plot.crop.currentGrowth >= plot.crop.growthTime && !plot.crop.isHarvested
    ).length
    const wateredPlots = gameState.farm.filter(plot => plot.isWatered).length

    return { plantedPlots, readyToHarvest, wateredPlots }
  }

  const farmStatus = getFarmStatus()

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">📱 Social Features</h2>
      
      {/* Farm Status */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
        <h3 className="font-semibold mb-3 text-gray-800">🌾 Farm Status</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl">🌱</div>
            <div className="text-sm font-medium text-gray-800">{farmStatus.plantedPlots}</div>
            <div className="text-xs text-gray-600">Planted</div>
          </div>
          <div>
            <div className="text-2xl">🌾</div>
            <div className="text-sm font-medium text-gray-800">{farmStatus.readyToHarvest}</div>
            <div className="text-xs text-gray-600">Ready</div>
          </div>
          <div>
            <div className="text-2xl">💧</div>
            <div className="text-sm font-medium text-gray-800">{farmStatus.wateredPlots}</div>
            <div className="text-xs text-gray-600">Watered</div>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="space-y-2">
        <button
          onClick={handleShareProgress}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
        >
          <span>📊</span>
          <span>Share Progress</span>
        </button>

        {/* Share Latest Achievement */}
        {gameState.player.achievements.length > 0 && (
          <button
            onClick={() => handleShareAchievement(gameState.player.achievements[gameState.player.achievements.length - 1])}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>🏆</span>
            <span>Share Latest Achievement</span>
          </button>
        )}

        {/* Share Latest Harvest */}
        {gameState.player.inventory.filter(item => item.type === 'crop').length > 0 && (
          <button
            onClick={() => {
              const latestCrop = gameState.player.inventory.filter(item => item.type === 'crop')[0]
              handleShareHarvest(latestCrop.name, latestCrop.emoji)
            }}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
          >
            <span>🌾</span>
            <span>Share Latest Harvest</span>
          </button>
        )}
      </div>

      {/* Social Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <h4 className="font-semibold text-blue-800 mb-2">💬 Social Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Share your progress to show off your farming skills</li>
          <li>• Celebrate achievements with your Farcaster friends</li>
          <li>• Share harvests to inspire other farmers</li>
          <li>• Use hashtags to connect with the farming community</li>
        </ul>
      </div>

      {/* Community Stats */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <h4 className="font-semibold text-gray-800 mb-2">👥 Community</h4>
        <div className="text-sm text-gray-600">
          <p>Join the Monad Farming Simulator community!</p>
          <p className="mt-1">Share your progress, compare achievements, and help other farmers grow their virtual farms.</p>
        </div>
      </div>

      {/* Quick Share Preview */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-bold mb-3 text-gray-800">📤 Quick Share</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg">📊</div>
            <div className="text-xs text-gray-700">Progress</div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg">🏆</div>
            <div className="text-xs text-gray-700">Achievements</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-lg">🌾</div>
            <div className="text-xs text-gray-700">Harvests</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-lg">👥</div>
            <div className="text-xs text-gray-700">Community</div>
          </div>
        </div>
      </div>
    </div>
  )
} 