'use client'

import { useState, useEffect, useCallback } from 'react'
import { useFrame } from '@/components/farcaster-provider'
import type { 
  GameState, 
  Player, 
  FarmPlot, 
  Crop, 
  InventoryItem, 
  Achievement
} from '@/types'
import { CROPS, TOOLS, ACHIEVEMENTS } from '@/types'

// Initialize a 5x5 farm grid
const createInitialFarm = (): FarmPlot[] => {
  const plots: FarmPlot[] = []
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      plots.push({
        id: `${x}-${y}`,
        x,
        y,
        crop: null,
        isWatered: false,
        isFertilized: false
      })
    }
  }
  return plots
}

// Initialize player with starting inventory
const createInitialPlayer = (username: string, displayName: string, pfpUrl: string): Player => {
  return {
    id: username,
    username,
    displayName,
    pfpUrl,
    coins: 100, // Starting coins
    experience: 0,
    level: 1,
    inventory: [
      { id: 'tomato-seed', name: 'Tomato Seeds', quantity: 5, emoji: '🍅', type: 'seed' },
      { id: 'carrot-seed', name: 'Carrot Seeds', quantity: 3, emoji: '🥕', type: 'seed' },
      { id: 'watering-can', name: 'Watering Can', quantity: 1, emoji: '🚿', type: 'tool' }
    ],
    lastWatered: 0,
    lastFertilized: 0,
    achievements: []
  }
}

export function useGameState() {
  const { context, actions } = useFrame()
  
  // Ensure SDK is ready when game loads
  useEffect(() => {
    if (actions) {
      actions.ready().catch(err => {
        console.error('Failed to call actions.ready():', err)
      })
    }
  }, [actions])
  const [gameState, setGameState] = useState<GameState>(() => {
    // Initialize game state from localStorage or create new
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('farming-simulator-state')
      if (saved) {
        return JSON.parse(saved)
      }
    }
    
    return {
      player: createInitialPlayer(
        context?.user.username || 'farmer',
        context?.user.displayName || 'Farmer',
        context?.user.pfpUrl || ''
      ),
      farm: createInitialFarm(),
      currentTime: Date.now(),
      weather: 'sunny',
      season: 'spring',
      day: 1
    }
  })

  // Save game state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('farming-simulator-state', JSON.stringify(gameState))
    }
  }, [gameState])

  // Update player info when context changes
  useEffect(() => {
    if (context?.user) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          username: context.user.username || 'farmer',
          displayName: context.user.displayName || 'Farmer',
          pfpUrl: context.user.pfpUrl || ''
        }
      }))
    }
  }, [context?.user])

  // Game time progression
  useEffect(() => {
    const interval = setInterval(() => {
      setGameState(prev => {
        const newTime = Date.now()
        const timeDiff = newTime - prev.currentTime
        
        // Update crop growth
        const updatedFarm = prev.farm.map(plot => {
          if (plot.crop && !plot.crop.isHarvested) {
            const growthProgress = Math.min(
              plot.crop.currentGrowth + (timeDiff / (1000 * 60)), // Convert to minutes
              plot.crop.growthTime
            )
            
            return {
              ...plot,
              crop: {
                ...plot.crop,
                currentGrowth: growthProgress
              }
            }
          }
          return plot
        })

        return {
          ...prev,
          currentTime: newTime,
          farm: updatedFarm
        }
      })
    }, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  // Game actions
  const plantCrop = useCallback((plotId: string, cropType: keyof typeof CROPS) => {
    setGameState(prev => {
      const plot = prev.farm.find(p => p.id === plotId)
      if (!plot || plot.crop) return prev

      const cropTemplate = CROPS[cropType]
      const newCrop: Crop = {
        id: `${cropType}-${Date.now()}`,
        name: cropTemplate.name,
        growthTime: cropTemplate.growthTime,
        currentGrowth: 0,
        plantedAt: Date.now(),
        isWatered: false,
        isHarvested: false,
        sellPrice: cropTemplate.sellPrice,
        buyPrice: cropTemplate.buyPrice,
        emoji: cropTemplate.emoji,
        rarity: cropTemplate.rarity
      }

      // Remove seed from inventory
      const seedId = `${cropType}-seed`
      const updatedInventory = prev.player.inventory.map(item => 
        item.id === seedId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
      )

      return {
        ...prev,
        farm: prev.farm.map(p => 
          p.id === plotId ? { ...p, crop: newCrop } : p
        ),
        player: {
          ...prev.player,
          inventory: updatedInventory
        }
      }
    })
  }, [])

  const waterPlot = useCallback((plotId: string) => {
    setGameState(prev => {
      const plot = prev.farm.find(p => p.id === plotId)
      if (!plot) return prev

      return {
        ...prev,
        farm: prev.farm.map(p => 
          p.id === plotId ? { ...p, isWatered: true } : p
        ),
        player: {
          ...prev.player,
          lastWatered: Date.now()
        }
      }
    })
  }, [])

  const harvestCrop = useCallback((plotId: string) => {
    setGameState(prev => {
      const plot = prev.farm.find(p => p.id === plotId)
      if (!plot?.crop || plot.crop.isHarvested || plot.crop.currentGrowth < plot.crop.growthTime) {
        return prev
      }

      // Add crop to inventory
      const cropItem: InventoryItem = {
        id: `${plot.crop.name.toLowerCase()}-crop`,
        name: plot.crop.name,
        quantity: 1,
        emoji: plot.crop.emoji,
        type: 'crop'
      }

      const existingItem = prev.player.inventory.find(item => item.id === cropItem.id)
      const updatedInventory = existingItem 
        ? prev.player.inventory.map(item => 
            item.id === cropItem.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...prev.player.inventory, cropItem]

      // Add coins and experience
      const coinsEarned = plot.crop.sellPrice
      const expEarned = plot.crop.rarity === 'legendary' ? 50 : 
                      plot.crop.rarity === 'epic' ? 25 : 
                      plot.crop.rarity === 'rare' ? 15 : 10

      // Check for achievements
      const newAchievements = [...prev.player.achievements]
      if (prev.player.achievements.length === 0) {
        newAchievements.push({
          ...ACHIEVEMENTS.firstHarvest,
          unlockedAt: Date.now(),
          isUnlocked: true
        })
      }

      return {
        ...prev,
        farm: prev.farm.map(p => 
          p.id === plotId ? { ...p, crop: null, isWatered: false, isFertilized: false } : p
        ),
        player: {
          ...prev.player,
          coins: prev.player.coins + coinsEarned,
          experience: prev.player.experience + expEarned,
          level: Math.floor((prev.player.experience + expEarned) / 100) + 1,
          inventory: updatedInventory,
          achievements: newAchievements
        }
      }
    })
  }, [])

  const sellCrop = useCallback((cropId: string) => {
    setGameState(prev => {
      const cropItem = prev.player.inventory.find(item => item.id === cropId && item.type === 'crop')
      if (!cropItem) return prev

      const cropTemplate = Object.values(CROPS).find(crop => crop.name === cropItem.name)
      if (!cropTemplate) return prev

      const coinsEarned = cropTemplate.sellPrice * cropItem.quantity

      return {
        ...prev,
        player: {
          ...prev.player,
          coins: prev.player.coins + coinsEarned,
          inventory: prev.player.inventory.filter(item => item.id !== cropId)
        }
      }
    })
  }, [])

  const buySeeds = useCallback((cropType: keyof typeof CROPS, quantity: number = 1) => {
    setGameState(prev => {
      const cropTemplate = CROPS[cropType]
      const totalCost = cropTemplate.buyPrice * quantity

      if (prev.player.coins < totalCost) return prev

      const seedId = `${cropType}-seed`
      const existingSeed = prev.player.inventory.find(item => item.id === seedId)
      
      const updatedInventory = existingSeed
        ? prev.player.inventory.map(item => 
            item.id === seedId ? { ...item, quantity: item.quantity + quantity } : item
          )
                 : [...prev.player.inventory, {
             id: seedId,
             name: `${cropTemplate.name} Seeds`,
             quantity,
             emoji: cropTemplate.emoji,
             type: 'seed' as const
           }]

      return {
        ...prev,
        player: {
          ...prev.player,
          coins: prev.player.coins - totalCost,
          inventory: updatedInventory
        }
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    const newState: GameState = {
      player: createInitialPlayer(
        context?.user.username || 'farmer',
        context?.user.displayName || 'Farmer',
        context?.user.pfpUrl || ''
      ),
      farm: createInitialFarm(),
      currentTime: Date.now(),
      weather: 'sunny',
      season: 'spring',
      day: 1
    }
    setGameState(newState)
  }, [context?.user])

  return {
    gameState,
    plantCrop,
    waterPlot,
    harvestCrop,
    sellCrop,
    buySeeds,
    resetGame
  }
} 