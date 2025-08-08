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
      <div className="flex space-x-1 bg-white/70 backdrop-blur rounded-lg p-1 shadow-sm border border-gray-200">
        {([
          { key: 'farm', label: '🌾 Farm' },
          { key: 'stats', label: '👤 Stats' },
          { key: 'achievements', label: '🏆 Achievements' },
          { key: 'social', label: '📱 Social' },
          { key: 'buy', label: '💰 Buy' },
        ] as const).map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all duration-150 ${
              activeTab === key
                ? 'bg-green-50 text-green-700 shadow'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1">
        <div className="bg-white/80 backdrop-blur rounded-xl shadow-sm border border-gray-200 p-4">
          {activeTab === 'farm' && <FarmGrid />}
          {activeTab === 'stats' && <PlayerStats />}
          {activeTab === 'achievements' && <Achievements />}
          {activeTab === 'social' && <FarmingSocial />}
          {activeTab === 'buy' && <BuyCoins />}
        </div>
      </div>
    </div>
  )
}
