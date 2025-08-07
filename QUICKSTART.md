# 🚀 Quick Start Guide - Monad Farming Simulator

Get your farming simulator running locally in minutes!

## ⚡ Quick Setup

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Create Environment File
```bash
# Create .env.local file
echo "NEXT_PUBLIC_URL=http://localhost:3000" > .env.local
```

### 3. Start Development Server
```bash
pnpm dev
```

### 4. Open in Browser
Navigate to `http://localhost:3000`

## 🧪 Testing with Farcaster

### Option 1: Local Testing with Cloudflared

1. **Install cloudflared:**
   ```bash
   # macOS
   brew install cloudflared
   
   # Windows
   # Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
   ```

2. **Expose local server:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Update environment:**
   ```bash
   # Update .env.local with the cloudflared URL
   NEXT_PUBLIC_URL=https://your-tunnel-url.trycloudflare.com
   ```

4. **Test in Farcaster:**
   - Go to [Farcaster Embed Tool](https://warpcast.com/~/developers/mini-apps/embed)
   - Enter your cloudflared URL
   - Test the mini app!

### Option 2: Deploy to Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add farming simulator"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repo
   - Set `NEXT_PUBLIC_URL` environment variable
   - Deploy!

3. **Test in Farcaster:**
   - Use your Vercel URL in the Farcaster Embed Tool

## 🎮 How to Play

1. **Plant Crops:** Click empty plots to plant seeds
2. **Water Crops:** Click planted crops to water them
3. **Harvest:** Click fully grown crops to harvest
4. **Sell Crops:** Visit the shop to sell for coins
5. **Buy Seeds:** Purchase new seeds to expand
6. **Share Progress:** Use social features to share on Farcaster

## 🌾 Available Crops

| Crop | Growth Time | Buy Price | Sell Price |
|------|-------------|-----------|------------|
| 🥕 Carrot | 20 min | 5💰 | 15💰 |
| 🍅 Tomato | 30 min | 10💰 | 25💰 |
| 🥔 Potato | 40 min | 12💰 | 30💰 |
| 🌽 Corn | 45 min | 15💰 | 35💰 |
| 🌾 Wheat | 60 min | 20💰 | 50💰 |
| 🍓 Strawberry | 90 min | 30💰 | 80💰 |
| 🫐 Blueberry | 120 min | 45💰 | 120💰 |
| 🍎 Golden Apple | 300 min | 200💰 | 500💰 |

## 🏆 Achievements

- 🌱 **First Harvest:** Harvest your first crop
- 👨‍🌾 **Master Farmer:** Harvest 100 crops
- 💰 **Millionaire:** Earn 1000 coins
- 🌟 **Golden Harvest:** Harvest a legendary crop

## 🐛 Troubleshooting

### App not loading?
- Check `NEXT_PUBLIC_URL` in `.env.local`
- Ensure development server is running
- Check browser console for errors

### Farcaster features not working?
- Test in actual Farcaster app (not just browser)
- Verify cloudflared tunnel is active
- Check network connectivity

### Game state not saving?
- Check browser localStorage is enabled
- Try refreshing the page
- Clear browser cache if needed

## 📱 Features to Test

- [ ] Farm grid interaction
- [ ] Planting seeds
- [ ] Watering crops
- [ ] Harvesting crops
- [ ] Shop functionality
- [ ] Inventory management
- [ ] Achievement unlocking
- [ ] Social sharing
- [ ] Tab navigation
- [ ] Game state persistence

## 🎉 Success!

Your farming simulator is now running! Start planting, harvesting, and sharing your progress with the Farcaster community!

---

**Happy Farming! 🌾🚜** 