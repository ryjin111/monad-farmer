# 🌾 Monad Farming Simulator

A **fully on-chain** farming simulator mini app for Farcaster, built on Monad! Every action - planting, watering, harvesting - is a blockchain transaction. Grow crops, earn coins, unlock achievements, and share your farming progress with the community.

## ⛓️ On-Chain Features

### 🔗 Smart Contract Integration
- **FarmingGame Contract**: All game logic is stored on Monad testnet
- **Real Transactions**: Every plant, water, and harvest action is a blockchain transaction
- **Persistent State**: Your farm progress is permanently stored on-chain
- **Gas Optimization**: Efficient contract design for minimal transaction costs

### 🎮 Blockchain Game Mechanics
- **Plot Ownership**: Each player owns 25 plots (5x5 grid) on-chain
- **Crop Growth**: Growth timers are managed by smart contract
- **Watering System**: Watering reduces growth time and is tracked on-chain
- **Economy**: Coins and experience are stored as contract state
- **Achievements**: Progress tracking through on-chain events

## 🚀 Features

### 🌱 Farming Mechanics
- **5x5 Farm Grid**: Plant and manage crops in a beautiful grid layout
- **8 Different Crops**: From common tomatoes to legendary golden apples
- **Growth System**: Real-time crop growth with visual progress indicators
- **Watering System**: Water your crops to help them grow faster
- **Harvesting**: Collect fully grown crops for coins and experience

### 💰 Economy System
- **Coin System**: Earn coins by selling harvested crops
- **Seed Shop**: Buy new seeds to expand your farming operations
- **Inventory Management**: Keep track of your crops, seeds, and tools
- **Experience & Levels**: Gain experience and level up as you farm

### 🏆 Achievements
- **Progressive Achievements**: Unlock achievements as you progress
- **First Harvest**: Celebrate your first successful harvest
- **Master Farmer**: Reach 100 harvests to become a farming expert
- **Millionaire**: Earn 1000 coins to achieve financial success
- **Golden Harvest**: Harvest legendary crops for special recognition

### 📱 Social Features
- **Farcaster Integration**: Share your farming progress directly to Farcaster
- **Progress Sharing**: Post your current stats and achievements
- **Harvest Celebrations**: Share your latest harvests with the community
- **Achievement Announcements**: Let friends know when you unlock achievements

### 🎮 Game Mechanics
- **Real-time Growth**: Crops grow in real-time, even when you're away
- **Persistent Progress**: Your farm progress is saved locally
- **Multiple Crops**: Different crops have different growth times and values
- **Rarity System**: Common, rare, and legendary crops with varying rewards

## 🎯 How to Play

1. **Connect Wallet**: Connect your wallet to Monad testnet
2. **Get Testnet MONAD**: Get testnet tokens from the faucet for gas fees
3. **Start Farming**: Click on empty plots to plant seeds (on-chain transaction)
4. **Water Crops**: Click on planted crops to water them (on-chain transaction)
5. **Harvest**: Click on fully grown crops to harvest them (on-chain transaction)
6. **Sell Crops**: Visit the shop to sell your harvested crops
7. **Buy Seeds**: Purchase new seeds to expand your farm (on-chain transaction)
8. **Share Progress**: Use social features to share your achievements

## 🔗 Smart Contract Deployment

Before playing, you need to deploy the FarmingGame contract to Monad testnet:

1. **Navigate to contracts folder**: `cd hardhat-contracts`
2. **Follow the deployment guide**: See `hardhat-contracts/README.md` for detailed instructions
3. **Update contract address**: Set the deployed contract address in `lib/contract.ts`
4. **Test the integration**: Verify all on-chain functions work correctly

## 🌾 Available Crops

| Crop | Growth Time | Buy Price | Sell Price | Rarity |
|------|-------------|-----------|------------|---------|
| 🥕 Carrot | 20 min | 5💰 | 15💰 | Common |
| 🍅 Tomato | 30 min | 10💰 | 25💰 | Common |
| 🥔 Potato | 40 min | 12💰 | 30💰 | Common |
| 🌽 Corn | 45 min | 15💰 | 35💰 | Common |
| 🌾 Wheat | 60 min | 20💰 | 50💰 | Common |
| 🍓 Strawberry | 90 min | 30💰 | 80💰 | Rare |
| 🫐 Blueberry | 120 min | 45💰 | 120💰 | Rare |
| 🍎 Golden Apple | 300 min | 200💰 | 500💰 | Legendary |

## 🏆 Achievements

- **🌱 First Harvest**: Harvest your first crop
- **👨‍🌾 Master Farmer**: Harvest 100 crops
- **💰 Millionaire**: Earn 1000 coins
- **🌟 Golden Harvest**: Harvest a legendary crop

## 🛠️ Technical Details

### Built With
- **Next.js 14**: React framework for the frontend
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Modern styling
- **Farcaster SDK**: Social integration
- **Monad**: Blockchain infrastructure
- **Hardhat**: Smart contract development and deployment
- **Solidity**: Smart contract language

### Architecture
- **Smart Contract**: All game logic stored on Monad testnet
- **Blockchain State**: Game progress permanently stored on-chain
- **Real-time Updates**: Automatic crop growth simulation with on-chain verification
- **Responsive Design**: Works on mobile and desktop
- **Gas Optimization**: Efficient contract design for minimal transaction costs

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd monad-farming-simulator
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Add your `NEXT_PUBLIC_URL` to the `.env.local` file.

4. **Run the development server**
   ```bash
   pnpm dev
   ```

5. **Open in Farcaster**
   - Use the Farcaster embed tool to test your mini app
   - Or deploy to a hosting service and share the URL

## 🎮 Game Tips

- **Start Small**: Begin with carrots and tomatoes for quick returns
- **Water Regularly**: Watered crops grow faster
- **Diversify**: Plant different crops to maximize your farm's potential
- **Save for Rare Crops**: Legendary crops take longer but give better rewards
- **Share Progress**: Use social features to connect with other farmers

## 🌟 Future Features

- **Multiplayer**: Visit other players' farms
- **Seasons**: Different crops available in different seasons
- **Tools**: Advanced farming tools for better yields
- **Animals**: Raise farm animals for additional income
- **Decorations**: Customize your farm with decorations
- **Trading**: Trade crops with other players

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## 📄 License

This project is licensed under the MIT License.

---

**Happy Farming! 🌾🚜**

*Built with ❤️ for the Farcaster and Monad communities*
