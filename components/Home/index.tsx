'use client'

import { useState } from 'react'
import { FarmGrid } from '@/components/Home/FarmGrid'
import { PlayerStats } from '@/components/Home/PlayerStats'
import { Achievements } from '@/components/Home/Achievements'
import { FarmingSocial } from '@/components/Home/FarmingSocial'
import { WalletActions } from '@/components/Home/WalletActions'
import { BuyCoins } from '@/components/Home/BuyCoins'

export function Demo() {
  const [activeTab, setActiveTab] = useState<'farm' | 'stats' | 'achievements' | 'social' | 'buy'>('farm')

  return (
    <div className="flex min-h-screen flex-col p-4 space-y-4">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-green-600">
          🌾 Monad Farming Simulator
        </h1>
        <p className="text-gray-600">Grow crops, earn coins, and share your progress!</p>
      </div>

      {/* Wallet Connection */}
      <WalletActions />

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('farm')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'farm' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🌾 Farm
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'stats' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          👤 Stats
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'achievements' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          🏆 Achievements
        </button>
        <button
          onClick={() => setActiveTab('social')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'social' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          📱 Social
        </button>
        <button
          onClick={() => setActiveTab('buy')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'buy' 
              ? 'bg-white text-green-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          💰 Buy
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        {activeTab === 'farm' && <FarmGrid />}
        {activeTab === 'stats' && <PlayerStats />}
        {activeTab === 'achievements' && <Achievements />}
        {activeTab === 'social' && <FarmingSocial />}
        {activeTab === 'buy' && <BuyCoins />}
      </div>
    </div>
  )
}
