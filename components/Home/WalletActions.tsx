import { useFrame } from '@/components/farcaster-provider'
import { farcasterMiniApp as miniAppConnector } from '@farcaster/miniapp-wagmi-connector'
import { parseEther } from 'viem'
import { monadTestnet } from 'wagmi/chains'
import {
  useAccount,
  useConnect,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
} from 'wagmi'

export function WalletActions() {
  const { isEthProviderAvailable, isSDKLoaded } = useFrame()
  const { isConnected, address, chainId } = useAccount()
  const { disconnect } = useDisconnect()
  const { data: hash, sendTransaction } = useSendTransaction()
  const { switchChain } = useSwitchChain()
  const { connect, error: connectError, isPending: isConnecting } = useConnect()

  async function sendTransactionHandler() {
    sendTransaction({
      to: '0x7f748f154B6D180D35fA12460C7E4C631e28A9d7',
      value: parseEther('1'),
    })
  }

  const handleConnect = async () => {
    try {
      console.log('Attempting to connect wallet...')
      console.log('isEthProviderAvailable:', isEthProviderAvailable)
      console.log('isSDKLoaded:', isSDKLoaded)
      
      const connector = miniAppConnector()
      console.log('Connector created:', connector)
      
      await connect({ connector })
      console.log('Connect call completed')
    } catch (error) {
      console.error('Wallet connection error:', error)
    }
  }

  if (isConnected) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
        <div className="flex flex-row space-x-4 justify-start items-start">
          <div className="flex flex-col space-y-4 justify-start">
            <p className="text-sm text-left">
              Connected to wallet:{' '}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {address}
              </span>
            </p>
            <p className="text-sm text-left">
              Chain Id:{' '}
              <span className="bg-white font-mono text-black rounded-md p-[4px]">
                {chainId}
              </span>
            </p>
            {chainId === monadTestnet.id ? (
              <div className="flex flex-col space-y-2 border border-[#333] p-4 rounded-md">
                <h2 className="text-lg font-semibold text-left">
                  Send Transaction Example
                </h2>
                <button
                  type="button"
                  className="bg-white text-black rounded-md p-2 text-sm"
                  onClick={sendTransactionHandler}
                >
                  Send Transaction
                </button>
                {hash && (
                  <button
                    type="button"
                    className="bg-white text-black rounded-md p-2 text-sm"
                    onClick={() =>
                      window.open(
                        `https://testnet.monadexplorer.com/tx/${hash}`,
                        '_blank',
                      )
                    }
                  >
                    View Transaction
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                className="bg-white text-black rounded-md p-2 text-sm"
                onClick={() => switchChain({ chainId: monadTestnet.id })}
              >
                Switch to Monad Testnet
              </button>
            )}

            <button
              type="button"
              className="bg-white text-black rounded-md p-2 text-sm"
              onClick={() => disconnect()}
            >
              Disconnect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Show connect button if SDK is loaded (even if ethProvider is not available)
  if (isSDKLoaded) {
    return (
      <div className="space-y-4 border border-[#333] rounded-md p-4">
        <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
        <div className="flex flex-row space-x-4 justify-start items-start">
          <div className="flex flex-col space-y-4 justify-start w-full">
            <button
              type="button"
              className="bg-white text-black w-full rounded-md p-2 text-sm disabled:opacity-50"
              onClick={handleConnect}
              disabled={isConnecting}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </button>
            {connectError && (
              <p className="text-sm text-red-500 text-left">
                Connection error: {connectError.message}
              </p>
            )}
            <p className="text-sm text-gray-500 text-left">
              SDK Status: {isSDKLoaded ? 'Loaded' : 'Loading...'} | 
              Eth Provider: {isEthProviderAvailable ? 'Available' : 'Not Available'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 border border-[#333] rounded-md p-4">
      <h2 className="text-xl font-bold text-left">sdk.wallet.ethProvider</h2>
      <div className="flex flex-row space-x-4 justify-start items-start">
        <p className="text-sm text-left">Loading Farcaster SDK...</p>
      </div>
    </div>
  )
}
