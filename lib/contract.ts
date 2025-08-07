import { parseEther, formatEther } from 'viem'
import { monadTestnet } from 'wagmi/chains'

// Contract ABI for FarmingGame
export const FARMING_GAME_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum FarmingGame.CropType",
        "name": "cropType",
        "type": "uint8"
      }
    ],
    "name": "CropPlanted",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "enum FarmingGame.CropType",
        "name": "cropType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "coins",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "experience",
        "type": "uint256"
      }
    ],
    "name": "CropHarvested",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newLevel",
        "type": "uint256"
      }
    ],
    "name": "LevelUp",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "enum FarmingGame.CropType",
        "name": "cropType",
        "type": "uint8"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "cost",
        "type": "uint256"
      }
    ],
    "name": "SeedsPurchased",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "monadAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "coinsReceived",
        "type": "uint256"
      }
    ],
    "name": "CoinsPurchased",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      },
      {
        "internalType": "enum FarmingGame.CropType",
        "name": "cropType",
        "type": "uint8"
      }
    ],
    "name": "plantCrop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      }
    ],
    "name": "waterPlot",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      }
    ],
    "name": "harvestCrop",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "enum FarmingGame.CropType",
        "name": "cropType",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "buySeeds",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyCoins",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "plotId",
        "type": "uint256"
      }
    ],
    "name": "getPlot",
    "outputs": [
      {
        "internalType": "enum FarmingGame.CropType",
        "name": "cropType",
        "type": "uint8"
      },
      {
        "internalType": "enum FarmingGame.PlotState",
        "name": "state",
        "type": "uint8"
      },
      {
        "internalType": "uint256",
        "name": "plantedAt",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "lastWatered",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "growthTime",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isWatered",
        "type": "bool"
      },
      {
        "internalType": "bool",
        "name": "isReady",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      }
    ],
    "name": "getPlayer",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "coins",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "experience",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "level",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalHarvests",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "totalPlanted",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "internalType": "enum FarmingGame.CropType",
        "name": "cropType",
        "type": "uint8"
      }
    ],
    "name": "getCropCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const

// Contract address (deployed to Monad testnet)
export const FARMING_GAME_ADDRESS = '0x59db61af8500A5df9BD65Aad9611AbAcef261669'

// Crop types enum
export enum CropType {
  TOMATO = 0,
  CARROT = 1,
  POTATO = 2,
  CORN = 3,
  WHEAT = 4,
  STRAWBERRY = 5,
  GOLDEN_APPLE = 6
}

// Plot states enum
export enum PlotState {
  EMPTY = 0,
  PLANTED = 1,
  GROWING = 2,
  READY = 3,
  HARVESTED = 4
}

// Contract configuration
export const contractConfig = {
  address: FARMING_GAME_ADDRESS as `0x${string}`,
  abi: FARMING_GAME_ABI,
  chainId: monadTestnet.id,
}

// Helper functions for contract interaction
export const contractHelpers = {
  // Convert crop type to string
  cropTypeToString: (cropType: CropType): string => {
    switch (cropType) {
      case CropType.TOMATO: return 'Tomato'
      case CropType.CARROT: return 'Carrot'
      case CropType.POTATO: return 'Potato'
      case CropType.CORN: return 'Corn'
      case CropType.WHEAT: return 'Wheat'
      case CropType.STRAWBERRY: return 'Strawberry'
      case CropType.GOLDEN_APPLE: return 'Golden Apple'
      default: return 'Unknown'
    }
  },

  // Convert plot state to string
  plotStateToString: (state: PlotState): string => {
    switch (state) {
      case PlotState.EMPTY: return 'Empty'
      case PlotState.PLANTED: return 'Planted'
      case PlotState.GROWING: return 'Growing'
      case PlotState.READY: return 'Ready'
      case PlotState.HARVESTED: return 'Harvested'
      default: return 'Unknown'
    }
  },

  // Get crop emoji
  getCropEmoji: (cropType: CropType): string => {
    switch (cropType) {
      case CropType.TOMATO: return '🍅'
      case CropType.CARROT: return '🥕'
      case CropType.POTATO: return '🥔'
      case CropType.CORN: return '🌽'
      case CropType.WHEAT: return '🌾'
      case CropType.STRAWBERRY: return '🍓'
      case CropType.GOLDEN_APPLE: return '🍎'
      default: return '🌱'
    }
  },

  // Get crop rarity
  getCropRarity: (cropType: CropType): string => {
    switch (cropType) {
      case CropType.TOMATO:
      case CropType.CARROT:
      case CropType.POTATO:
        return 'common'
      case CropType.CORN:
      case CropType.WHEAT:
        return 'rare'
      case CropType.STRAWBERRY:
        return 'epic'
      case CropType.GOLDEN_APPLE:
        return 'legendary'
      default:
        return 'common'
    }
  }
} 