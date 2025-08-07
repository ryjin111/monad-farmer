// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract FarmingGame is Ownable, ReentrancyGuard, ERC721, ERC721URIStorage {
    using Counters for Counters.Counter;

    // NFT Achievement System - SOULBOUND (Non-transferable)
    Counters.Counter private _achievementTokenIds;
    
    // Achievement types
    enum AchievementType { 
        FIRST_HARVEST,      // 0
        MASTER_FARMER,      // 1
        MILLIONAIRE,        // 2
        GOLDEN_HARVEST,     // 3
        WATER_MASTER,       // 4
        CROP_COLLECTOR,     // 5
        LEGENDARY_FARMER,   // 6
        SPEED_GROWER        // 7
    }

    struct Achievement {
        AchievementType achievementType;
        string name;
        string description;
        string imageURI;
        uint256 requirement;
        bool isUnlocked;
        uint256 unlockedAt;
    }

    // Achievement data
    mapping(AchievementType => Achievement) public achievements;
    mapping(address => mapping(AchievementType => bool)) public playerAchievements;
    mapping(address => uint256) public playerAchievementCount;

    // Crop types
    enum CropType { 
        TOMATO,     // 0 - Common
        CARROT,     // 1 - Common  
        POTATO,     // 2 - Common
        CORN,       // 3 - Rare
        WHEAT,      // 4 - Rare
        STRAWBERRY, // 5 - Epic
        GOLDEN_APPLE // 6 - Legendary
    }

    // Plot states
    enum PlotState { EMPTY, PLANTED, GROWING, READY, HARVESTED }

    struct Plot {
        CropType cropType;
        PlotState state;
        uint256 plantedAt;
        uint256 lastWatered;
        uint256 growthTime;
        bool isWatered;
    }

    struct Player {
        uint256 coins;
        uint256 experience;
        uint256 level;
        uint256 totalHarvests;
        uint256 totalPlanted;
        mapping(CropType => uint256) cropCounts;
    }

    // Game constants
    uint256 public constant PLOT_COUNT = 25; // 5x5 grid
    uint256 public constant WATER_BONUS = 30 minutes; // Watering reduces growth time by 30 min
    uint256 public constant MAX_WATER_INTERVAL = 2 hours; // Can water every 2 hours
    uint256 public constant MONAD_TO_COINS_RATE = 50; // 1 MONAD = 50 coins
    uint256 public constant BUY_COINS_FEE = 1; // 0.1% fee (1/1000)
    
    // Crop growth times (in seconds)
    mapping(CropType => uint256) public cropGrowthTimes;
    mapping(CropType => uint256) public cropSellPrices;
    mapping(CropType => uint256) public cropSeedPrices;
    
    // Player data
    mapping(address => Player) public players;
    mapping(address => mapping(uint256 => Plot)) public plots; // player => plotId => Plot
    
    // Events
    event CropPlanted(address indexed player, uint256 plotId, CropType cropType);
    event PlotWatered(address indexed player, uint256 plotId);
    event CropHarvested(address indexed player, uint256 plotId, CropType cropType, uint256 coins, uint256 experience);
    event SeedsPurchased(address indexed player, CropType cropType, uint256 amount, uint256 cost);
    event CoinsPurchased(address indexed player, uint256 monadAmount, uint256 coinsReceived);
    event LevelUp(address indexed player, uint256 newLevel);
    event AchievementUnlocked(address indexed player, AchievementType achievementType, uint256 tokenId);

    constructor() ERC721("Monad Farming Achievements", "MFA") {
        // Initialize achievements
        _initializeAchievements();
        
        // Initialize crop data
        cropGrowthTimes[CropType.TOMATO] = 5 minutes;
        cropGrowthTimes[CropType.CARROT] = 8 minutes;
        cropGrowthTimes[CropType.POTATO] = 12 minutes;
        cropGrowthTimes[CropType.CORN] = 20 minutes;
        cropGrowthTimes[CropType.WHEAT] = 25 minutes;
        cropGrowthTimes[CropType.STRAWBERRY] = 40 minutes;
        cropGrowthTimes[CropType.GOLDEN_APPLE] = 60 minutes;

        cropSellPrices[CropType.TOMATO] = 10;
        cropSellPrices[CropType.CARROT] = 15;
        cropSellPrices[CropType.POTATO] = 20;
        cropSellPrices[CropType.CORN] = 35;
        cropSellPrices[CropType.WHEAT] = 45;
        cropSellPrices[CropType.STRAWBERRY] = 80;
        cropSellPrices[CropType.GOLDEN_APPLE] = 150;

        cropSeedPrices[CropType.TOMATO] = 5;
        cropSeedPrices[CropType.CARROT] = 8;
        cropSeedPrices[CropType.POTATO] = 12;
        cropSeedPrices[CropType.CORN] = 20;
        cropSeedPrices[CropType.WHEAT] = 25;
        cropSeedPrices[CropType.STRAWBERRY] = 40;
        cropSeedPrices[CropType.GOLDEN_APPLE] = 75;
    }

    // SOULBOUND: Override transfer functions to prevent transfers
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 firstTokenId,
        uint256 batchSize
    ) internal virtual override(ERC721, ERC721URIStorage) {
        // Only allow minting (from == address(0)) and burning (to == address(0))
        require(from == address(0) || to == address(0), "Achievements are soulbound and cannot be transferred");
        super._beforeTokenTransfer(from, to, firstTokenId, batchSize);
    }

    // SOULBOUND: Override approve to prevent approvals
    function approve(address to, uint256 tokenId) public virtual override(ERC721, ERC721URIStorage) {
        revert("Achievements are soulbound and cannot be approved for transfer");
    }

    // SOULBOUND: Override setApprovalForAll to prevent approvals
    function setApprovalForAll(address operator, bool approved) public virtual override(ERC721, ERC721URIStorage) {
        revert("Achievements are soulbound and cannot be approved for transfer");
    }

    // SOULBOUND: Override transferFrom to prevent transfers
    function transferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, ERC721URIStorage) {
        revert("Achievements are soulbound and cannot be transferred");
    }

    // SOULBOUND: Override safeTransferFrom to prevent transfers
    function safeTransferFrom(address from, address to, uint256 tokenId) public virtual override(ERC721, ERC721URIStorage) {
        revert("Achievements are soulbound and cannot be transferred");
    }

    // SOULBOUND: Override safeTransferFrom with data to prevent transfers
    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public virtual override(ERC721, ERC721URIStorage) {
        revert("Achievements are soulbound and cannot be transferred");
    }

    // Initialize achievements
    function _initializeAchievements() internal {
        achievements[AchievementType.FIRST_HARVEST] = Achievement({
            achievementType: AchievementType.FIRST_HARVEST,
            name: "First Harvest",
            description: "Harvest your first crop",
            imageURI: "ipfs://QmFirstHarvest",
            requirement: 1,
            isUnlocked: false,
            unlockedAt: 0
        });

        achievements[AchievementType.MASTER_FARMER] = Achievement({
            achievementType: AchievementType.MASTER_FARMER,
            name: "Master Farmer",
            description: "Harvest 100 crops",
            imageURI: "ipfs://QmMasterFarmer",
            requirement: 100,
            isUnlocked: false,
            unlockedAt: 0
        });

        achievements[AchievementType.MILLIONAIRE] = Achievement({
            achievementType: AchievementType.MILLIONAIRE,
            name: "Millionaire",
            description: "Earn 1,000,000 coins",
            imageURI: "ipfs://QmMillionaire",
            requirement: 1000000,
            isUnlocked: false,
            unlockedAt: 0
        });

        achievements[AchievementType.GOLDEN_HARVEST] = Achievement({
            achievementType: AchievementType.GOLDEN_HARVEST,
            name: "Golden Harvest",
            description: "Harvest a legendary crop",
            imageURI: "ipfs://QmGoldenHarvest",
            requirement: 1,
            isUnlocked: false,
            unlockedAt: 0
        });

        achievements[AchievementType.WATER_MASTER] = Achievement({
            achievementType: AchievementType.WATER_MASTER,
            name: "Water Master",
            description: "Water crops 50 times",
            imageURI: "ipfs://QmWaterMaster",
            requirement: 50,
            isUnlocked: false,
            unlockedAt: 0
        });

        achievements[AchievementType.CROP_COLLECTOR] = Achievement({
            achievementType: AchievementType.CROP_COLLECTOR,
            name: "Crop Collector",
            description: "Harvest all crop types",
            imageURI: "ipfs://QmCropCollector",
            requirement: 7,
            isUnlocked: false,
            unlockedAt: 0
        });

        achievements[AchievementType.LEGENDARY_FARMER] = Achievement({
            achievementType: AchievementType.LEGENDARY_FARMER,
            name: "Legendary Farmer",
            description: "Reach level 10",
            imageURI: "ipfs://QmLegendaryFarmer",
            requirement: 10,
            isUnlocked: false,
            unlockedAt: 0
        });

        achievements[AchievementType.SPEED_GROWER] = Achievement({
            achievementType: AchievementType.SPEED_GROWER,
            name: "Speed Grower",
            description: "Harvest 10 crops in one day",
            imageURI: "ipfs://QmSpeedGrower",
            requirement: 10,
            isUnlocked: false,
            unlockedAt: 0
        });
    }

    // Check and unlock achievements
    function _checkAchievements(address player) internal {
        Player storage p = players[player];
        
        // First Harvest
        if (!playerAchievements[player][AchievementType.FIRST_HARVEST] && p.totalHarvests >= 1) {
            _unlockAchievement(player, AchievementType.FIRST_HARVEST);
        }
        
        // Master Farmer
        if (!playerAchievements[player][AchievementType.MASTER_FARMER] && p.totalHarvests >= 100) {
            _unlockAchievement(player, AchievementType.MASTER_FARMER);
        }
        
        // Millionaire
        if (!playerAchievements[player][AchievementType.MILLIONAIRE] && p.coins >= 1000000) {
            _unlockAchievement(player, AchievementType.MILLIONAIRE);
        }
        
        // Legendary Farmer
        if (!playerAchievements[player][AchievementType.LEGENDARY_FARMER] && p.level >= 10) {
            _unlockAchievement(player, AchievementType.LEGENDARY_FARMER);
        }
    }

    // Unlock achievement and mint SOULBOUND NFT
    function _unlockAchievement(address player, AchievementType achievementType) internal {
        playerAchievements[player][achievementType] = true;
        playerAchievementCount[player]++;
        
        // Mint SOULBOUND NFT (cannot be transferred)
        _achievementTokenIds.increment();
        uint256 tokenId = _achievementTokenIds.current();
        
        _safeMint(player, tokenId);
        _setTokenURI(tokenId, achievements[achievementType].imageURI);
        
        emit AchievementUnlocked(player, achievementType, tokenId);
    }

    // Buy coins with MONAD
    function buyCoins() external payable nonReentrant {
        require(msg.value > 0, "Must send MONAD to buy coins");
        
        // Calculate coins to receive (1 MONAD = 50 coins)
        uint256 coinsToReceive = msg.value * MONAD_TO_COINS_RATE;
        
        // Calculate fee (0.1%)
        uint256 fee = msg.value * BUY_COINS_FEE / 1000;
        uint256 coinsAfterFee = coinsToReceive - (fee * MONAD_TO_COINS_RATE);
        
        // Add coins to player's balance
        players[msg.sender].coins += coinsAfterFee;
        
        // Check achievements
        _checkAchievements(msg.sender);
        
        emit CoinsPurchased(msg.sender, msg.value, coinsAfterFee);
    }

    // Plant a crop
    function plantCrop(uint256 plotId, CropType cropType) external nonReentrant {
        require(plotId < PLOT_COUNT, "Invalid plot ID");
        require(plots[msg.sender][plotId].state == PlotState.EMPTY, "Plot not empty");
        
        // Check if player has enough coins for seeds
        uint256 seedCost = cropSeedPrices[cropType];
        require(players[msg.sender].coins >= seedCost, "Not enough coins");
        
        // Deduct seed cost
        players[msg.sender].coins -= seedCost;
        
        // Plant the crop
        plots[msg.sender][plotId] = Plot({
            cropType: cropType,
            state: PlotState.PLANTED,
            plantedAt: block.timestamp,
            lastWatered: block.timestamp,
            growthTime: cropGrowthTimes[cropType],
            isWatered: false
        });
        
        // Update player stats
        players[msg.sender].totalPlanted++;
        players[msg.sender].cropCounts[cropType]++;
        
        emit CropPlanted(msg.sender, plotId, cropType);
    }

    // Water a plot
    function waterPlot(uint256 plotId) external nonReentrant {
        require(plotId < PLOT_COUNT, "Invalid plot ID");
        Plot storage plot = plots[msg.sender][plotId];
        require(plot.state == PlotState.PLANTED || plot.state == PlotState.GROWING, "Plot not planted");
        
        // Check if enough time has passed since last watering
        require(block.timestamp >= plot.lastWatered + MAX_WATER_INTERVAL, "Too soon to water");
        
        plot.lastWatered = block.timestamp;
        plot.isWatered = true;
        plot.state = PlotState.GROWING;
        
        emit PlotWatered(msg.sender, plotId);
    }

    // Harvest a crop
    function harvestCrop(uint256 plotId) external nonReentrant {
        require(plotId < PLOT_COUNT, "Invalid plot ID");
        Plot storage plot = plots[msg.sender][plotId];
        require(plot.state == PlotState.READY, "Crop not ready");
        
        // Calculate growth time with watering bonus
        uint256 actualGrowthTime = plot.growthTime;
        if (plot.isWatered) {
            actualGrowthTime = actualGrowthTime > WATER_BONUS ? actualGrowthTime - WATER_BONUS : 1 minutes;
        }
        
        require(block.timestamp >= plot.plantedAt + actualGrowthTime, "Crop not fully grown");
        
        // Calculate rewards
        uint256 coinsEarned = cropSellPrices[plot.cropType];
        uint256 experienceEarned = _calculateExperience(plot.cropType);
        
        // Update player stats
        players[msg.sender].coins += coinsEarned;
        players[msg.sender].experience += experienceEarned;
        players[msg.sender].totalHarvests++;
        
        // Check for level up
        uint256 newLevel = _calculateLevel(players[msg.sender].experience);
        if (newLevel > players[msg.sender].level) {
            players[msg.sender].level = newLevel;
            emit LevelUp(msg.sender, newLevel);
        }
        
        // Check achievements
        _checkAchievements(msg.sender);
        
        // Reset plot
        plot.state = PlotState.EMPTY;
        plot.cropType = CropType.TOMATO; // Reset to default
        plot.plantedAt = 0;
        plot.lastWatered = 0;
        plot.growthTime = 0;
        plot.isWatered = false;
        
        emit CropHarvested(msg.sender, plotId, plot.cropType, coinsEarned, experienceEarned);
    }

    // Buy seeds
    function buySeeds(CropType cropType, uint256 amount) external nonReentrant {
        uint256 totalCost = cropSeedPrices[cropType] * amount;
        require(players[msg.sender].coins >= totalCost, "Not enough coins");
        
        players[msg.sender].coins -= totalCost;
        
        emit SeedsPurchased(msg.sender, cropType, amount, totalCost);
    }

    // Get player achievements
    function getPlayerAchievements(address player) external view returns (AchievementType[] memory) {
        uint256 count = playerAchievementCount[player];
        AchievementType[] memory unlockedAchievements = new AchievementType[](count);
        uint256 index = 0;
        
        for (uint256 i = 0; i < 8; i++) {
            if (playerAchievements[player][AchievementType(i)]) {
                unlockedAchievements[index] = AchievementType(i);
                index++;
            }
        }
        
        return unlockedAchievements;
    }

    // Get plot info
    function getPlot(address player, uint256 plotId) external view returns (
        CropType cropType,
        PlotState state,
        uint256 plantedAt,
        uint256 lastWatered,
        uint256 growthTime,
        bool isWatered,
        bool isReady
    ) {
        Plot storage plot = plots[player][plotId];
        bool ready = false;
        
        if (plot.state == PlotState.PLANTED || plot.state == PlotState.GROWING) {
            uint256 actualGrowthTime = plot.growthTime;
            if (plot.isWatered) {
                actualGrowthTime = actualGrowthTime > WATER_BONUS ? actualGrowthTime - WATER_BONUS : 1 minutes;
            }
            ready = block.timestamp >= plot.plantedAt + actualGrowthTime;
        }
        
        return (
            plot.cropType,
            plot.state,
            plot.plantedAt,
            plot.lastWatered,
            plot.growthTime,
            plot.isWatered,
            ready
        );
    }

    // Get player info
    function getPlayer(address player) external view returns (
        uint256 coins,
        uint256 experience,
        uint256 level,
        uint256 totalHarvests,
        uint256 totalPlanted
    ) {
        Player storage p = players[player];
        return (
            p.coins,
            p.experience,
            p.level,
            p.totalHarvests,
            p.totalPlanted
        );
    }

    // Get crop count for player
    function getCropCount(address player, CropType cropType) external view returns (uint256) {
        return players[player].cropCounts[cropType];
    }

    // Helper functions
    function _calculateExperience(CropType cropType) internal pure returns (uint256) {
        if (cropType == CropType.TOMATO) return 5;
        if (cropType == CropType.CARROT) return 8;
        if (cropType == CropType.POTATO) return 12;
        if (cropType == CropType.CORN) return 20;
        if (cropType == CropType.WHEAT) return 25;
        if (cropType == CropType.STRAWBERRY) return 40;
        if (cropType == CropType.GOLDEN_APPLE) return 80;
        return 0;
    }

    function _calculateLevel(uint256 experience) internal pure returns (uint256) {
        return experience / 100 + 1; // Level 1 at 0 XP, Level 2 at 100 XP, etc.
    }

    // Admin functions
    function giveCoins(address player, uint256 amount) external onlyOwner {
        players[player].coins += amount;
    }

    function resetPlayer(address player) external onlyOwner {
        delete players[player];
        for (uint256 i = 0; i < PLOT_COUNT; i++) {
            delete plots[player][i];
        }
    }

    // Withdraw fees (admin only)
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Failed to withdraw fees");
    }

    // Override required functions for ERC721
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
} 