'use client'

import { useAccount, useReadContract, useWriteContract, useChainId, useSwitchChain } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { contractConfig, CropType, PlotState } from './contract'
import { useState, useEffect, useCallback } from 'react'
import { parseEther } from 'viem'
import { config as wagmiConfig } from '@/components/wallet-provider'

export interface OnChainPlot {
  cropType: CropType
  state: PlotState
  plantedAt: number
  lastWatered: number
  growthTime: number
  isWatered: boolean
  isReady: boolean
}

export interface OnChainPlayer {
  coins: bigint
  experience: bigint
  level: bigint
  totalHarvests: bigint
  totalPlanted: bigint
}

export interface MiningStats {
  totalMined: bigint
  miningRate: bigint
  lastMined: number
  upgradeLevel: bigint
}

export function useFarmingContract() {
  const { address, isConnected } = useAccount()
  const [plots, setPlots] = useState<OnChainPlot[]>([])
  const [player, setPlayer] = useState<OnChainPlayer | null>(null)
  const [miningStats, setMiningStats] = useState<MiningStats | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isMining, setIsMining] = useState(false)

  // Chain management
  const currentChainId = useChainId()
  const { switchChainAsync } = useSwitchChain()

  const ensureCorrectChain = useCallback(async () => {
    if (currentChainId !== contractConfig.chainId) {
      try {
        await switchChainAsync({ chainId: contractConfig.chainId })
      } catch (err) {
        console.error('Failed to switch chain', err)
        throw new Error('Wrong network. Please switch to Monad Testnet in your wallet and try again.')
      }
    }
  }, [currentChainId, switchChainAsync])

  // Read contract functions
  const { data: playerData, refetch: refetchPlayer } = useReadContract({
    ...contractConfig,
    functionName: 'getPlayer',
    args: [address!],
    query: {
      enabled: !!address,
      refetchInterval: 5000, // Refetch every 5 seconds
    },
  })

  // Hook to write
  const { writeContractAsync } = useWriteContract()

  // Load all plots for a player
  const loadPlots = useCallback(async () => {
    if (!address) return

    try {
      // Use API route to load plots
      const plotPromises = Array.from({ length: 25 }, (_, i) =>
        fetch(`/api/plot?address=${address}&plotId=${i}`)
          .then(async (res) => {
            if (!res.ok) return null
            const data = await res.json()
            return data?.plot ?? null
          })
          .catch(() => null)
      )

      const plotResults = await Promise.all(plotPromises)

      // Create a properly indexed array of plots
      const plotsArray = new Array<OnChainPlot | null>(25).fill(null)
      plotResults.forEach((plot, index) => {
        if (plot) {
          plotsArray[index] = plot
        }
      })

      setPlots(plotsArray as OnChainPlot[])
    } catch (error) {
      console.error('Error loading plots:', error)
    }
  }, [address])

  // Mining function - simulates continuous mining
  const startMining = useCallback(async () => {
    if (!address || isMining) return

    try {
      setIsMining(true)
      await ensureCorrectChain()
      
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'harvestCrop', // Repurpose harvest as mining
        args: [BigInt(0)], // Use plot 0 as mining slot
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await refetchPlayer()
    } catch (error) {
      console.error('Error mining:', error)
      throw error
    } finally {
      setIsMining(false)
    }
  }, [address, isMining, ensureCorrectChain, writeContractAsync, refetchPlayer])

  // Buy mining upgrades
  const buyUpgrade = async (upgradeType: 'speed' | 'power') => {
    if (!address) return

    try {
      setIsLoading(true)
      await ensureCorrectChain()
      
      // Use buySeeds function repurposed for upgrades
      const upgradeId = upgradeType === 'speed' ? CropType.TOMATO : CropType.CARROT
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'buySeeds',
        args: [upgradeId, BigInt(1)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await refetchPlayer()
    } catch (error) {
      console.error('Error buying upgrade:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Buy coins with MONAD
  const buyCoins = async (monadAmount: string) => {
    if (!address) {
      console.error('No wallet address available')
      return
    }

    try {
      setIsLoading(true)
      await ensureCorrectChain()
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'buyCoins',
        value: parseEther(monadAmount),
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await refetchPlayer()
    } catch (error) {
      console.error('Error buying coins:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Plant crop (keep original functionality)
  const plantCrop = async (plotId: number, cropType: CropType) => {
    if (!address) return

    try {
      setIsLoading(true)
      await ensureCorrectChain()
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'plantCrop',
        args: [BigInt(plotId), cropType],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error planting crop:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Water plot
  const waterPlot = async (plotId: number) => {
    if (!address) return

    try {
      setIsLoading(true)
      await ensureCorrectChain()
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'waterPlot',
        args: [BigInt(plotId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error watering plot:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Harvest crop
  const harvestCrop = async (plotId: number) => {
    if (!address) return

    try {
      setIsLoading(true)
      await ensureCorrectChain()
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'harvestCrop',
        args: [BigInt(plotId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error harvesting crop:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Buy seeds
  const buySeeds = async (cropType: CropType, amount: number) => {
    if (!address) return

    try {
      setIsLoading(true)
      await ensureCorrectChain()
      const txHash = await writeContractAsync({
        ...contractConfig,
        functionName: 'buySeeds',
        args: [cropType, BigInt(amount)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error buying seeds:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Update player state when data changes
  useEffect(() => {
    if (playerData) {
      const [coins, experience, level, totalHarvests, totalPlanted] = playerData
      setPlayer({
        coins,
        experience,
        level,
        totalHarvests,
        totalPlanted,
      })

      // Set mining stats based on player data
      setMiningStats({
        totalMined: totalHarvests, // Repurpose harvests as total mined
        miningRate: level * BigInt(10), // Mining rate based on level
        lastMined: Date.now(),
        upgradeLevel: level,
      })
    }
  }, [playerData])

  // Load plots when address changes
  useEffect(() => {
    if (address) {
      loadPlots()
    }
  }, [address, loadPlots])

  return {
    // State
    plots,
    player,
    miningStats,
    isLoading,
    isMining,
    isConnected,
    address,

    // Mining actions
    startMining,
    buyUpgrade,

    // Original actions
    plantCrop,
    waterPlot,
    harvestCrop,
    buySeeds,
    loadPlots,
    buyCoins,
  }
} 