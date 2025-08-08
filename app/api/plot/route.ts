import { NextRequest, NextResponse } from 'next/server'
import { createPublicClient, http } from 'viem'
import { FARMING_GAME_ABI, FARMING_GAME_ADDRESS } from '@/lib/contract'

// Define Monad testnet configuration
const monadTestnet = {
  id: 10143,
  name: 'Monad Testnet',
  network: 'monad-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MONAD',
    symbol: 'MON',
  },
  rpcUrls: {
    default: { http: ['https://testnet-rpc.monad.xyz'] },
    public: { http: ['https://testnet-rpc.monad.xyz'] },
  },
} as const

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
    console.log(`Fetching plot data for address: ${address}, plotId: ${plotId}`)
    console.log(`Contract address: ${FARMING_GAME_ADDRESS}`)
    
    const plotData = await client.readContract({
      address: FARMING_GAME_ADDRESS as `0x${string}`,
      abi: FARMING_GAME_ABI,
      functionName: 'getPlot',
      args: [address as `0x${string}`, BigInt(plotId)],
    })

    console.log('Plot data received:', plotData)

    if (!plotData) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 })
    }

    const [cropType, state, plantedAt, lastWatered, growthTime, isWatered, isReady] = plotData as any

    const plot = {
      cropType: Number(cropType),
      state: Number(state) as any, // Convert to PlotState enum
      plantedAt: Number(plantedAt),
      lastWatered: Number(lastWatered),
      growthTime: Number(growthTime),
      isWatered: Boolean(isWatered),
      isReady: Boolean(isReady),
    }

    console.log('Processed plot data:', plot)

    return NextResponse.json({ plot })
  } catch (error) {
    console.error('Error fetching plot data:', error)
    console.error('Error details:', {
      address,
      plotId,
      contractAddress: FARMING_GAME_ADDRESS,
      errorMessage: error instanceof Error ? error.message : 'Unknown error',
      errorStack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json({ 
      error: 'Failed to fetch plot data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 