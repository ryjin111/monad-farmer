import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractConfig, CropType, PlotState, contractHelpers } from './contract'
import { useState, useEffect } from 'react'
import { parseEther } from 'viem'

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

  // Write contract functions
  const { writeContract, data: hash, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  // Buy coins with MONAD
  const buyCoins = async (monadAmount: string) => {
    if (!address) {
      console.error('No wallet address available')
      return
    }
    
    console.log('Attempting to buy coins:', {
      address,
      monadAmount,
      value: parseEther(monadAmount).toString(),
      contractAddress: contractConfig.address
    })
    
    try {
      setIsLoading(true)
      const result = await writeContract({
        ...contractConfig,
        functionName: 'buyCoins',
        value: parseEther(monadAmount),
      })
      
      console.log('Buy coins transaction submitted:', result)
    } catch (error) {
      console.error('Error buying coins:', error)
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      })
      setIsLoading(false)
      throw error // Re-throw to let the UI handle it
    }
  }

  // Plant crop
  const plantCrop = async (plotId: number, cropType: CropType) => {
    if (!address) return
    
    try {
      setIsLoading(true)
      console.log('Planting crop:', { plotId, cropType, address })
      await writeContract({
        ...contractConfig,
        functionName: 'plantCrop',
        args: [BigInt(plotId), cropType],
      })
      console.log('Plant crop transaction submitted')
    } catch (error) {
      console.error('Error planting crop:', error)
      setIsLoading(false)
    }
  }

  // Water plot
  const waterPlot = async (plotId: number) => {
    if (!address) return
    
    try {
      setIsLoading(true)
      await writeContract({
        ...contractConfig,
        functionName: 'waterPlot',
        args: [BigInt(plotId)],
      })
    } catch (error) {
      console.error('Error watering plot:', error)
      setIsLoading(false)
    }
  }

  // Harvest crop
  const harvestCrop = async (plotId: number) => {
    if (!address) return
    
    try {
      setIsLoading(true)
      await writeContract({
        ...contractConfig,
        functionName: 'harvestCrop',
        args: [BigInt(plotId)],
      })
    } catch (error) {
      console.error('Error harvesting crop:', error)
      setIsLoading(false)
    }
  }

  // Buy seeds
  const buySeeds = async (cropType: CropType, amount: number) => {
    if (!address) return
    
    try {
      setIsLoading(true)
      await writeContract({
        ...contractConfig,
        functionName: 'buySeeds',
        args: [cropType, BigInt(amount)],
      })
    } catch (error) {
      console.error('Error buying seeds:', error)
      setIsLoading(false)
    }
  }

  // Load all plots for a player
  const loadPlots = async () => {
    if (!address) return

    try {
      console.log('Loading plots for address:', address)
      
      // Use API route to load plots
      const plotPromises = Array.from({ length: 25 }, (_, i) =>
        fetch(`/api/plot?address=${address}&plotId=${i}`).then(async (res) => {
          if (!res.ok) return null
          const data = await res.json()
          return data?.plot ?? null
        }).catch(() => null)
      )

      const plotResults = await Promise.all(plotPromises)
      
      // Create a properly indexed array of plots
      const plotsArray = new Array<OnChainPlot | null>(25).fill(null)
      plotResults.forEach((plot, index) => {
        if (plot) {
          plotsArray[index] = plot
        }
      })
      
      console.log('Loaded plots:', plotsArray.filter(Boolean).length)
      setPlots(plotsArray as OnChainPlot[])
    } catch (error) {
      console.error('Error loading plots:', error)
    }
  }

  // Update player data when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      console.log('Transaction successful, refreshing data...')
      refetchPlayer()
      loadPlots()
      setIsLoading(false)
    }
  }, [isSuccess, refetchPlayer, loadPlots])

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
  }, [address])

  return {
    // State
    plots,
    player,
    isLoading: isLoading || isPending || isConfirming,
    isConnected,
    address,

    // Actions
    plantCrop,
    waterPlot,
    harvestCrop,
    buySeeds,
    loadPlots,
    buyCoins,

    // Transaction status
    hash,
    isPending,
    isConfirming,
    isSuccess,
  }
} 