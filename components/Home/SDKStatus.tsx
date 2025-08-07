'use client'

import { useFrame } from '@/components/farcaster-provider'

export function SDKStatus() {
  const { isLoading, isSDKLoaded, context, actions } = useFrame()

  return (
    <div className="bg-gray-100 p-4 rounded-lg mb-4">
      <h3 className="font-bold mb-2">🔧 SDK Status</h3>
      <div className="text-sm space-y-1">
        <div>Loading: {isLoading ? '🔄 Yes' : '✅ No'}</div>
        <div>SDK Loaded: {isSDKLoaded ? '✅ Yes' : '❌ No'}</div>
        <div>Context: {context ? '✅ Available' : '❌ Not Available'}</div>
        <div>Actions: {actions ? '✅ Available' : '❌ Not Available'}</div>
        {context?.user && (
          <div>User: @{context.user.username} ({context.user.displayName})</div>
        )}
      </div>
    </div>
  )
} 