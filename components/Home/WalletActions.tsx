import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSwitchChain,
} from 'wagmi'

export function WalletActions() {
  const { isEthProviderAvailable, isSDKLoaded } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect, isPending: isDisconnecting } = useDisconnect()
  const { switchChain } = useSwitchChain()
  const { connect, error: connectError, isPending: isConnecting } = useConnect()

  const handleConnect = async () => {
    try {
      console.log('Attempting to connect wallet...')
      console.log('isEthProviderAvailable:', isEthProviderAvailable)
      console.log('isSDKLoaded:', isSDKLoaded)
      
      // Always try to connect with the Farcaster connector
      const connector = miniAppConnector()
      await connect({ connector })
      
      console.log('Connect call completed')
    } catch (error) {
      console.error('Wallet connection error:', error)
      throw error // Re-throw to let UI handle it
    }
  }

  const handleDisconnect = async () => {
    try {
      console.log('Attempting to disconnect wallet...')
      await disconnect()
      console.log('Disconnect call completed')
    } catch (error) {
      console.error('Wallet disconnection error:', error)
    }
  }

  if (isConnected) {
    return (
      <div className="space-y-3 bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-green-800">🌾 Wallet Connected</h3>
          <div className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
            Monad Testnet
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-sm text-green-700">
            Address: <span className="font-mono text-xs bg-white px-2 py-1 rounded border">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </p>
          <p className="text-sm text-green-700">
            Chain ID: <span className="font-mono text-xs bg-white px-2 py-1 rounded border">{chainId}</span>
            {chainId === 10143 && <span className="text-green-600 ml-2">✓ Monad Testnet</span>}
          </p>
              </div>



            <button
              type="button"
          className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg p-2 text-sm font-medium disabled:opacity-50 transition-colors"
          onClick={handleDisconnect}
          disabled={isDisconnecting}
            >
          {isDisconnecting ? '🔄 Disconnecting...' : '❌ Disconnect Wallet'}
            </button>
      </div>
    )
  }

  // Show connect button if SDK is loaded (even if ethProvider is not available)
  if (isSDKLoaded) {
    return (
      <div className="space-y-3 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-blue-800">🔗 Connect Your Wallet</h3>
        <p className="text-sm text-blue-700">
          Connect your wallet to start farming and earning coins!
        </p>
        
          <button
            type="button"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2 text-sm font-medium disabled:opacity-50 transition-colors"
          onClick={handleConnect}
          disabled={isConnecting}
          >
          {isConnecting ? '🔄 Connecting...' : '🔗 Connect Wallet'}
          </button>
        
        {connectError && (
          <div className="text-sm text-red-600 bg-red-50 p-2 rounded border">
            <p className="font-medium">Connection Error:</p>
            <p>{connectError.message}</p>
            <p className="text-xs mt-1">
              Make sure you're using the Farcaster app and have a wallet connected.
            </p>
        </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800">⏳ Loading...</h3>
      <p className="text-sm text-gray-600">
        Initializing Farcaster SDK...
      </p>
    </div>
  )
}
