'use client'

import { useGameState } from '@/lib/game'
import { ACHIEVEMENTS } from '@/types'

export function Achievements() {
  const { gameState } = useGameState()

  const unlockedAchievements = gameState.player.achievements.filter(a => a.isUnlocked)
  const lockedAchievements = Object.values(ACHIEVEMENTS).filter(
    achievement => !gameState.player.achievements.find(a => a.id === achievement.id && a.isUnlocked)
  )

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
                    Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
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
            <div key={achievement.id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 opacity-60">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{achievement.emoji}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-700">{achievement.name}</div>
                  <div className="text-sm text-gray-600">{achievement.description}</div>
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
            {unlockedAchievements.length} / {Object.keys(ACHIEVEMENTS).length}
          </div>
          <div className="text-sm text-blue-600">Achievements Unlocked</div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${(unlockedAchievements.length / Object.keys(ACHIEVEMENTS).length) * 100}%` 
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
          <li>• Sell crops to earn coins and work towards becoming a millionaire</li>
          <li>• Try planting rare and legendary crops for special achievements</li>
          <li>• Keep farming to reach 100 harvests and become a master farmer</li>
        </ul>
      </div>

      {/* Quick Achievement Preview */}
      <div className="bg-white rounded-lg p-4 border">
        <h4 className="font-bold mb-3 text-gray-800">🎯 Achievement Goals</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-green-50 rounded-lg">
            <div className="text-lg">🌱</div>
            <div className="text-xs text-gray-700">First Harvest</div>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-lg">💰</div>
            <div className="text-xs text-gray-700">Millionaire</div>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded-lg">
            <div className="text-lg">👑</div>
            <div className="text-xs text-gray-700">Master Farmer</div>
          </div>
          <div className="text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-lg">⭐</div>
            <div className="text-xs text-gray-700">Legendary</div>
          </div>
        </div>
      </div>
    </div>
  )
} 