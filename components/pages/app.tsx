'use client'

import { Demo } from '@/components/Home'
import { useFrame } from '@/components/farcaster-provider'
import { SafeAreaContainer } from '@/components/safe-area-container'

export default function Home() {
  const { context, isLoading, isSDKLoaded } = useFrame()

  if (isLoading) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
          <div className="mx-auto max-w-md flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
            <h1 className="text-3xl font-bold text-center text-green-700">Loading...</h1>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        </div>
      </SafeAreaContainer>
    )
  }

  if (!isSDKLoaded) {
    return (
      <SafeAreaContainer insets={context?.client.safeAreaInsets}>
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
          <div className="mx-auto max-w-md flex min-h-screen flex-col items-center justify-center p-4 space-y-8">
            <h1 className="text-3xl font-bold text-center text-green-700">
              🌾 Monad Farming Simulator
            </h1>
            <div className="text-center space-y-4">
              <p className="text-gray-600">Loading your farm...</p>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
              <div className="space-y-2">
                <p className="text-sm text-gray-500">If loading takes too long, try refreshing</p>
              </div>
            </div>
          </div>
        </div>
      </SafeAreaContainer>
    )
  }

  return (
    <SafeAreaContainer insets={context?.client.safeAreaInsets}>
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-50">
        <div className="mx-auto max-w-md p-4">
          <Demo />
        </div>
      </div>
    </SafeAreaContainer>
  )
}
