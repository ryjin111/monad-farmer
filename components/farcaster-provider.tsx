import type { Context } from '@farcaster/miniapp-sdk'
import sdk from '@farcaster/miniapp-sdk'
import { useQuery } from '@tanstack/react-query'
import { type ReactNode, createContext, useContext } from 'react'

interface FrameContextValue {
  context: Context.MiniAppContext | undefined
  isLoading: boolean
  isSDKLoaded: boolean
  isEthProviderAvailable: boolean
  actions: typeof sdk.actions | undefined
  haptics: typeof sdk.haptics | undefined
}

const FrameProviderContext = createContext<FrameContextValue | undefined>(
  undefined,
)

export function useFrame() {
  const context = useContext(FrameProviderContext)
  if (context === undefined) {
    throw new Error('useFrame must be used within a FrameProvider')
  }
  return context
}

interface FrameProviderProps {
  children: ReactNode
}

export function FrameProvider({ children }: FrameProviderProps) {
  const farcasterContextQuery = useQuery({
    queryKey: ['farcaster-context'],
    queryFn: async () => {
      try {
        console.log('Initializing Farcaster SDK...')
        
        // Always try to call ready() first
        try {
          console.log('Calling sdk.actions.ready()...')
          await sdk.actions.ready()
          console.log('SDK ready() called successfully')
        } catch (readyErr) {
          console.log('SDK ready() failed, continuing...', readyErr)
        }
        
        // Get context
        const context = await sdk.context
        console.log('SDK context loaded:', context)
        
        return { context, isReady: true }
      } catch (err) {
        console.error('SDK initialization error:', err)
        
        // Return a working context for development
        return { 
          context: {
            user: {
              username: 'farmer',
              displayName: 'Farmer',
              pfpUrl: '',
              fid: 0
            },
            client: {
              safeAreaInsets: { top: 0, bottom: 0, left: 0, right: 0 },
              clientFid: 0,
              added: false
            }
          } as Context.MiniAppContext, 
          isReady: true
        }
      }
    },
    retry: 0, // No retries to avoid infinite loading
  })

  const isReady = farcasterContextQuery.data?.isReady ?? false
  const context = farcasterContextQuery.data?.context

  console.log('FrameProvider state:', {
    isLoading: farcasterContextQuery.isPending,
    isReady,
    hasContext: Boolean(context),
    isSDKLoaded: isReady && Boolean(context)
  })

  return (
    <FrameProviderContext.Provider
      value={{
        context: context,
        actions: sdk.actions,
        haptics: sdk.haptics,
        isLoading: farcasterContextQuery.isPending,
        isSDKLoaded: isReady && Boolean(context),
        isEthProviderAvailable: Boolean(sdk.wallet.ethProvider),
      }}
    >
      {children}
    </FrameProviderContext.Provider>
  )
}
