'use client'

import React, { useState, useEffect } from 'react'
import { useFarmingContract } from '../../lib/useFarmingContract'

export function MiningDashboard() {
  const { 
    player, 
    miningStats,
    startMining,
    buyUpgrade,
    isLoading,
    isMining,
    isConnected,
    address
  } = useFarmingContract()
  
  const [localCoins, setLocalCoins] = useState<bigint>(BigInt(0))
  const [animateCoins, setAnimateCoins] = useState(false)

  // Update local coins when player data changes
  useEffect(() => {
    if (player?.coins) {
      setLocalCoins(player.coins)
      setAnimateCoins(true)
      setTimeout(() => setAnimateCoins(false), 500)
    }
  }, [player?.coins])

  const formatNumber = (num: bigint) => {
    const numStr = num.toString()
    if (numStr.length > 9) {
      return `${numStr.slice(0, -9)}.${numStr.slice(-9, -6)}B`
    } else if (numStr.length > 6) {
      return `${numStr.slice(0, -6)}.${numStr.slice(-6, -3)}M`
    } else if (numStr.length > 3) {
      return `${numStr.slice(0, -3)}.${numStr.slice(-3, -1)}K`
    }
    return numStr
  }

  const handleMining = async () => {
    try {
      await startMining()
    } catch (error: any) {
      const msg = error?.message || 'Mining failed. Please try again.'
      alert(msg)
    }
  }

  const handleUpgrade = async (type: 'speed' | 'power') => {
    try {
      await buyUpgrade(type)
    } catch (error: any) {
      const msg = error?.message || 'Upgrade failed. Please try again.'
      alert(msg)
    }
  }

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
        <div className="text-6xl">⛏️</div>
        <h1 className="text-3xl font-bold text-center">Comnad Miner</h1>
        <p className="text-gray-600 text-center">Connect your wallet to start mining</p>
        <div className="text-sm text-gray-500">
          Mine until you make it
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-md mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold">Comnad Miner</h1>
        <p className="text-sm text-gray-600">Mine until you make it</p>
      </div>

      {/* Coin Balance */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-xl p-6 text-center text-white shadow-lg">
        <div className="text-sm opacity-90 mb-2">Your Balance</div>
        <div className={`text-4xl font-bold transition-all duration-500 ${animateCoins ? 'scale-110' : 'scale-100'}`}>
          {formatNumber(localCoins)} $COMN
        </div>
        <div className="text-xs opacity-75 mt-2">
          has already been mined.
        </div>
      </div>

      {/* Mining Stats */}
      {miningStats && (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">⚡</div>
            <div className="text-sm text-gray-600">Mining Rate</div>
            <div className="font-bold">{formatNumber(miningStats.miningRate)}/min</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-sm text-gray-600">Level</div>
            <div className="font-bold">{miningStats.upgradeLevel.toString()}</div>
          </div>
        </div>
      )}

      {/* Mining Button */}
      <div className="text-center">
        <button
          onClick={handleMining}
          disabled={isLoading || isMining}
          className={`
            w-32 h-32 rounded-full text-4xl font-bold transition-all duration-200 shadow-lg
            ${isMining 
              ? 'bg-gradient-to-r from-green-400 to-green-600 animate-pulse' 
              : 'bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 active:scale-95'
            }
            text-white disabled:opacity-50
          `}
        >
          {isMining ? '⚡' : '⛏️'}
        </button>
        <div className="mt-3 text-sm text-gray-600">
          {isMining ? 'Mining...' : 'Tap to Mine'}
        </div>
      </div>

      {/* Upgrades */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-center">Upgrades</h3>
        
        <div className="grid grid-cols-1 gap-3">
          {/* Speed Upgrade */}
          <div className="bg-white border-2 border-blue-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">🚀</div>
              <div>
                <div className="font-medium">Speed Boost</div>
                <div className="text-sm text-gray-600">+50% mining speed</div>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade('speed')}
              disabled={isLoading || !player || Number(player.coins) < 100}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              100 $COMN
            </button>
          </div>

          {/* Power Upgrade */}
          <div className="bg-white border-2 border-purple-200 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">💎</div>
              <div>
                <div className="font-medium">Power Drill</div>
                <div className="text-sm text-gray-600">+100% mining power</div>
              </div>
            </div>
            <button
              onClick={() => handleUpgrade('power')}
              disabled={isLoading || !player || Number(player.coins) < 250}
              className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-300 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              250 $COMN
            </button>
          </div>
        </div>
      </div>

      {/* Stats Footer */}
      <div className="text-center text-xs text-gray-500 space-y-1">
        <div>Total Mined: {miningStats ? formatNumber(miningStats.totalMined) : '0'} $COMN</div>
        <div>Address: {address?.slice(0, 6)}...{address?.slice(-4)}</div>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <div className="text-sm">Processing transaction...</div>
          </div>
        </div>
      )}
    </div>
  )
} 