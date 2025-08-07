export interface SafeAreaInsets {
  top?: number;
  bottom?: number;
  left?: number;
  right?: number;
}

// Game Types
export interface Crop {
  id: string;
  name: string;
  growthTime: number; // in minutes
  currentGrowth: number; // in minutes
  plantedAt: number; // timestamp
  isWatered: boolean;
  isHarvested: boolean;
  sellPrice: number;
  buyPrice: number;
  emoji: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface FarmPlot {
  id: string;
  x: number;
  y: number;
  crop: Crop | null;
  isWatered: boolean;
  isFertilized: boolean;
}

export interface Player {
  id: string;
  username: string;
  displayName: string;
  pfpUrl: string;
  coins: number;
  experience: number;
  level: number;
  inventory: InventoryItem[];
  lastWatered: number; // timestamp
  lastFertilized: number; // timestamp
  achievements: Achievement[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  emoji: string;
  type: 'seed' | 'tool' | 'crop' | 'fertilizer';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  unlockedAt: number;
  isUnlocked: boolean;
}

export interface GameState {
  player: Player;
  farm: FarmPlot[];
  currentTime: number;
  weather: 'sunny' | 'rainy' | 'cloudy';
  season: 'spring' | 'summer' | 'fall' | 'winter';
  day: number;
}

// Available Crops
export const CROPS: Record<string, Omit<Crop, 'id' | 'currentGrowth' | 'plantedAt' | 'isWatered' | 'isHarvested'>> = {
  tomato: {
    name: 'Tomato',
    growthTime: 30, // 30 minutes
    sellPrice: 25,
    buyPrice: 10,
    emoji: '🍅',
    rarity: 'common'
  },
  corn: {
    name: 'Corn',
    growthTime: 45,
    sellPrice: 35,
    buyPrice: 15,
    emoji: '🌽',
    rarity: 'common'
  },
  wheat: {
    name: 'Wheat',
    growthTime: 60,
    sellPrice: 50,
    buyPrice: 20,
    emoji: '🌾',
    rarity: 'common'
  },
  carrot: {
    name: 'Carrot',
    growthTime: 20,
    sellPrice: 15,
    buyPrice: 5,
    emoji: '🥕',
    rarity: 'common'
  },
  potato: {
    name: 'Potato',
    growthTime: 40,
    sellPrice: 30,
    buyPrice: 12,
    emoji: '🥔',
    rarity: 'common'
  },
  strawberry: {
    name: 'Strawberry',
    growthTime: 90,
    sellPrice: 80,
    buyPrice: 30,
    emoji: '🍓',
    rarity: 'rare'
  },
  blueberry: {
    name: 'Blueberry',
    growthTime: 120,
    sellPrice: 120,
    buyPrice: 45,
    emoji: '🫐',
    rarity: 'rare'
  },
  goldenApple: {
    name: 'Golden Apple',
    growthTime: 300,
    sellPrice: 500,
    buyPrice: 200,
    emoji: '🍎',
    rarity: 'legendary'
  }
};

// Tools
export const TOOLS = {
  wateringCan: { name: 'Watering Can', emoji: '🚿', price: 50 },
  fertilizer: { name: 'Fertilizer', emoji: '💩', price: 30 },
  sickle: { name: 'Sickle', emoji: '🔪', price: 100 },
  sprinkler: { name: 'Sprinkler', emoji: '💧', price: 200 }
};

// Achievements
export const ACHIEVEMENTS: Record<string, Omit<Achievement, 'unlockedAt' | 'isUnlocked'>> = {
  firstHarvest: {
    id: 'firstHarvest',
    name: 'First Harvest',
    description: 'Harvest your first crop',
    emoji: '🌱'
  },
  masterFarmer: {
    id: 'masterFarmer',
    name: 'Master Farmer',
    description: 'Harvest 100 crops',
    emoji: '👨‍🌾'
  },
  millionaire: {
    id: 'millionaire',
    name: 'Millionaire',
    description: 'Earn 1000 coins',
    emoji: '💰'
  },
  goldenHarvest: {
    id: 'goldenHarvest',
    name: 'Golden Harvest',
    description: 'Harvest a legendary crop',
    emoji: '🌟'
  }
};
