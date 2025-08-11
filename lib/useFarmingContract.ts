'use client'

import { useAccount, useReadContract, useWriteContract } from 'wagmi'
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

export function useFarmingContract() {
  const { address, isConnected } = useAccount()
  const [plots, setPlots] = useState<OnChainPlot[]>([])
  const [player, setPlayer] = useState<OnChainPlayer | null>(null)
  const [isLoading, setIsLoading] = useState(false)

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

  // Buy coins with MONAD
  const buyCoins = async (monadAmount: string) => {
    if (!address) {
      console.error('No wallet address available')
      return
    }

    try {
      setIsLoading(true)
      const txHash = await writeContractAsync({
        ...contractConfig,
        chainId: contractConfig.chainId,
        functionName: 'buyCoins',
        value: parseEther(monadAmount),
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error buying coins:', error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  // Plant crop
  const plantCrop = async (plotId: number, cropType: CropType) => {
    if (!address) return

    try {
      setIsLoading(true)
      const txHash = await writeContractAsync({
        ...contractConfig,
        chainId: contractConfig.chainId,
        functionName: 'plantCrop',
        args: [BigInt(plotId), cropType],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error planting crop:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Water plot
  const waterPlot = async (plotId: number) => {
    if (!address) return

    try {
      setIsLoading(true)
      const txHash = await writeContractAsync({
        ...contractConfig,
        chainId: contractConfig.chainId,
        functionName: 'waterPlot',
        args: [BigInt(plotId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error watering plot:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Harvest crop
  const harvestCrop = async (plotId: number) => {
    if (!address) return

    try {
      setIsLoading(true)
      const txHash = await writeContractAsync({
        ...contractConfig,
        chainId: contractConfig.chainId,
        functionName: 'harvestCrop',
        args: [BigInt(plotId)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error harvesting crop:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Buy seeds
  const buySeeds = async (cropType: CropType, amount: number) => {
    if (!address) return

    try {
      setIsLoading(true)
      const txHash = await writeContractAsync({
        ...contractConfig,
        chainId: contractConfig.chainId,
        functionName: 'buySeeds',
        args: [cropType, BigInt(amount)],
      })

      await waitForTransactionReceipt(wagmiConfig, { hash: txHash })
      await Promise.all([refetchPlayer(), loadPlots()])
    } catch (error) {
      console.error('Error buying seeds:', error)
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
    isLoading,
    isConnected,
    address,

    // Actions
    plantCrop,
    waterPlot,
    harvestCrop,
    buySeeds,
    loadPlots,
    buyCoins,
  }
} 