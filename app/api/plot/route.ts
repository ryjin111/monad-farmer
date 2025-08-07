import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { monadTestnet } from 'wagmi/chains'
import { FARMING_GAME_ABI, FARMING_GAME_ADDRESS } from '@/lib/contract'

const client = createPublicClient({
  chain: monadTestnet,
  transport: http(),
})

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')
  const plotId = searchParams.get('plotId')

  if (!address || !plotId) {
    return NextResponse.json({ error: 'Missing address or plotId' }, { status: 400 })
  }

  try {
    const plotData = await client.readContract({
      address: FARMING_GAME_ADDRESS as `0x${string}`,
      abi: FARMING_GAME_ABI,
      functionName: 'getPlot',
      args: [address as `0x${string}`, BigInt(plotId)],
    })

    if (!plotData) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    const [cropType, state, plantedAt, lastWatered, growthTime, isWatered, isReady] = plotData

    return NextResponse.json({
      plot: {
        cropType: Number(cropType),
        state: Number(state),
        plantedAt,
        lastWatered,
        growthTime,
        isWatered,
        isReady,
      }
    })
  } catch (error) {
    console.error('Error fetching plot data:', error)
    return NextResponse.json({ error: 'Failed to fetch plot data' }, { status: 500 })
  }
} 