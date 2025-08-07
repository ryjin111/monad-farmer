import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { contractConfig, CropType, PlotState, contractHelpers } from './contract'
import { useState, useEffect } from 'react'

export interface OnChainPlot {
  cropType: CropType
  state: PlotState
  plantedAt: bigint
  lastWatered: bigint
  growthTime: bigint
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

  // Plant crop
  const plantCrop = async (plotId: number, cropType: CropType) => {
    if (!address) return
    
    try {
      setIsLoading(true)
      await writeContract({
        ...contractConfig,
        functionName: 'plantCrop',
        args: [BigInt(plotId), cropType],
      })
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
      const plotPromises = Array.from({ length: 25 }, (_, i) =>
        fetch(`/api/plot?address=${address}&plotId=${i}`)
          .then(res => res.json())
          .then(data => data.plot)
      )

      const plotResults = await Promise.all(plotPromises)
      const validPlots = plotResults.filter(Boolean) as OnChainPlot[]
      setPlots(validPlots)
    } catch (error) {
      console.error('Error loading plots:', error)
    }
  }

  // Get individual plot
  const getPlot = (plotId: number) => {
    const { data } = useReadContract({
      ...contractConfig,
      functionName: 'getPlot',
      args: [address!, BigInt(plotId)],
      query: {
        enabled: !!address,
        refetchInterval: 5000,
      },
    })
    return data
  }

  // Get crop count for player
  const getCropCount = (cropType: CropType) => {
    const { data } = useReadContract({
      ...contractConfig,
      functionName: 'getCropCount',
      args: [address!, cropType],
      query: {
        enabled: !!address,
        refetchInterval: 5000,
      },
    })
    return data
  }

  // Get crop prices
  const getCropSeedPrice = (cropType: CropType) => {
    const { data } = useReadContract({
      ...contractConfig,
      functionName: 'cropSeedPrices',
      args: [cropType],
    })
    return data
  }

  const getCropSellPrice = (cropType: CropType) => {
    const { data } = useReadContract({
      ...contractConfig,
      functionName: 'cropSellPrices',
      args: [cropType],
    })
    return data
  }

  // Update player data when transaction succeeds
  useEffect(() => {
    if (isSuccess) {
      refetchPlayer()
      loadPlots()
      setIsLoading(false)
    }
  }, [isSuccess, refetchPlayer])

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
    getPlot,
    getCropCount,
    getCropSeedPrice,
    getCropSellPrice,
    refetchPlayer,

    // Transaction status
    hash,
    isPending,
    isConfirming,
    isSuccess,
  }
}

// Helper hook for individual plot data
export function usePlot(plotId: number) {
  const { address } = useAccount()
  
  const { data: plotData, isLoading, refetch } = useReadContract({
    ...contractConfig,
    functionName: 'getPlot',
    args: [address!, BigInt(plotId)],
    query: {
      enabled: !!address,
      refetchInterval: 5000,
    },
  })

  return {
    plot: plotData,
    isLoading,
    refetch,
  }
}

// Helper hook for crop prices
export function useCropPrices() {
  const [prices, setPrices] = useState<{
    seedPrices: Record<CropType, bigint>
    sellPrices: Record<CropType, bigint>
  }>({
    seedPrices: {} as Record<CropType, bigint>,
    sellPrices: {} as Record<CropType, bigint>,
  })

  useEffect(() => {
    const loadPrices = async () => {
      const cropTypes = Object.values(CropType).filter(v => typeof v === 'number') as CropType[]
      
      const seedPricePromises = cropTypes.map(cropType =>
        useReadContract({
          ...contractConfig,
          functionName: 'cropSeedPrices',
          args: [cropType],
        })
      )

      const sellPricePromises = cropTypes.map(cropType =>
        useReadContract({
          ...contractConfig,
          functionName: 'cropSellPrices',
          args: [cropType],
        })
      )

      try {
        const seedResults = await Promise.all(seedPricePromises.map(p => p.data))
        const sellResults = await Promise.all(sellPricePromises.map(p => p.data))

        const seedPrices: Record<CropType, bigint> = {} as Record<CropType, bigint>
        const sellPrices: Record<CropType, bigint> = {} as Record<CropType, bigint>

        cropTypes.forEach((cropType, index) => {
          if (seedResults[index]) seedPrices[cropType] = seedResults[index]!
          if (sellResults[index]) sellPrices[cropType] = sellResults[index]!
        })

        setPrices({ seedPrices, sellPrices })
      } catch (error) {
        console.error('Error loading crop prices:', error)
      }
    }

    loadPrices()
  }, [])

  return prices
} 