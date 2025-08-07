'use client'

import { useFarmingContract } from '@/lib/useFarmingContract'
import { useAccount } from 'wagmi'

export function Achievements() {
  const { address, isConnected } = useAccount()
  const { player } = useFarmingContract()

  // Define achievements based on on-chain data
  const achievements = [
    {
      id: 'first-harvest',
      name: 'First Harvest',
      description: 'Harvest your first crop',
      emoji: '🌱',
      isUnlocked: player && Number(player.totalHarvests) >= 1,
      requirement: 1,
      current: player ? Number(player.totalHarvests) : 0
    },
    {
      id: 'master-farmer',
      name: 'Master Farmer',
      description: 'Harvest 100 crops',
      emoji: '👨‍🌾',
      isUnlocked: player && Number(player.totalHarvests) >= 100,
      requirement: 100,
      current: player ? Number(player.totalHarvests) : 0
    },
    {
      id: 'millionaire',
      name: 'Millionaire',
      description: 'Earn 1,000,000 coins',
      emoji: '💰',
      isUnlocked: player && Number(player.coins) >= 1000000,
      requirement: 1000000,
      current: player ? Number(player.coins) : 0
    },
    {
      id: 'golden-harvest',
      name: 'Golden Harvest',
      description: 'Harvest a legendary crop (Golden Apple)',
      emoji: '⭐',
      isUnlocked: false, // This requires crop count tracking
      requirement: 1,
      current: 0
    },
    {
      id: 'water-master',
      name: 'Water Master',
      description: 'Plant 50 crops (watering tracking simplified)',
      emoji: '💧',
      isUnlocked: player && Number(player.totalPlanted) >= 50,
      requirement: 50,
      current: player ? Number(player.totalPlanted) : 0
    },
    {
      id: 'crop-collector',
      name: 'Crop Collector',
      description: 'Harvest all crop types',
      emoji: '🌾',
      isUnlocked: false, // This requires crop count tracking
      requirement: 7,
      current: 0
    },
    {
      id: 'legendary-farmer',
      name: 'Legendary Farmer',
      description: 'Reach level 10',
      emoji: '👑',
      isUnlocked: player && Number(player.level) >= 10,
      requirement: 10,
      current: player ? Number(player.level) : 0
    },
    {
      id: 'speed-grower',
      name: 'Speed Grower',
      description: 'Harvest 10 crops (simplified)',
      emoji: '⚡',
      isUnlocked: player && Number(player.totalHarvests) >= 10,
      requirement: 10,
      current: player ? Number(player.totalHarvests) : 0
    }
  ]

  const unlockedAchievements = achievements.filter(a => a.isUnlocked)
  const lockedAchievements = achievements.filter(a => !a.isUnlocked)

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800">🏆 Achievements</h2>
      
      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-green-600">✅ Unlocked</h3>
          {unlockedAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-green-600">
                    Progress: {achievement.current} / {achievement.requirement}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-semibold text-gray-600">🔒 Locked</h3>
          {lockedAchievements.map((achievement) => (
            <div key={achievement.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-700">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Progress: {achievement.current} / {achievement.requirement}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                    <div 
                      className="bg-gray-400 h-1 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((achievement.current / achievement.requirement) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Summary */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-600">
            {unlockedAchievements.length} / {achievements.length}
          </div>
          <div className="text-sm text-blue-600">Achievements Unlocked</div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(unlockedAchievements.length / achievements.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>

      {/* Achievement Tips */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <h4 className="font-semibold text-yellow-800 mb-2">💡 Tips</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Harvest crops to earn your first achievement</li>
          <li>• Buy coins with MONAD to work towards becoming a millionaire</li>
          <li>• Keep farming to reach 100 harvests and become a master farmer</li>
          <li>• Gain experience to reach level 10 and become legendary</li>
        </ul>
      </div>
    </div>
  )
} 