# 🚀 Deployment Guide

This guide covers deploying both the frontend mini-app and the smart contracts.

## 📁 Project Structure

```
Monad/
├── app/                    # Next.js frontend
├── components/            # React components
├── lib/                   # Frontend utilities
├── hardhat-contracts/     # Smart contracts (separate folder)
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   └── README.md          # Contract documentation
└── README.md              # Main project documentation
```

## 🎯 Frontend Deployment (Vercel)

### 1. Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically

3. **Set Environment Variables**
   ```bash
   NEXT_PUBLIC_URL=https://your-app.vercel.app
   ```

### 2. Configure Farcaster Redirect

Update `vercel.json` with your Farcaster hosted manifest URL:

```json
{
  "redirects": [
    {
      "source": "/.well-known/farcaster.json",
      "destination": "https://api.farcaster.xyz/miniapps/hosted-manifest/YOUR_MANIFEST_ID",
      "permanent": false
    }
  ]
}
```

## ⛓️ Smart Contract Deployment

### 1. Navigate to Contracts Folder

```bash
cd hardhat-contracts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment

```bash
# Create .env file
echo "PRIVATE_KEY=your_private_key_here" > .env
```

### 4. Deploy Contract

```bash
npm run deploy
```

### 5. Update Contract Address

Copy the deployed address and update `lib/contract.ts` in the main project:

```typescript
export const FARMING_GAME_ADDRESS = '0x...' // Your deployed address
```

## 🔗 Integration Testing

### 1. Test Smart Contract

```bash
cd hardhat-contracts
npm run console

# In console:
> const contract = await ethers.getContractAt("FarmingGame", "CONTRACT_ADDRESS")
> await contract.plantCrop(0, 0) // Test planting
```

### 2. Test Frontend Integration

1. **Visit your deployed app**
2. **Connect wallet to Monad testnet**
3. **Try planting, watering, and harvesting**
4. **Verify transactions on Monad explorer**

## 🌐 Testing with Farcaster

### 1. Local Testing

```bash
# Start development server
yarn dev

# Expose with cloudflared
cloudflared tunnel --url http://localhost:3000
```

### 2. Farcaster Embed Tool

1. Go to [Farcaster Embed Tool](https://warpcast.com/~/developers/mini-apps/embed)
2. Enter your app URL
3. Test all functionality

## 📊 Monitoring

### Frontend
- **Vercel Analytics**: Monitor app performance
- **Error Tracking**: Check Vercel logs for issues

### Smart Contracts
- **Monad Explorer**: Monitor transactions
- **Contract Events**: Track game activity
- **Gas Usage**: Optimize for cost efficiency

## 🚨 Troubleshooting

### Frontend Issues
1. **Build Failures**: Check TypeScript errors
2. **Environment Variables**: Verify all required vars are set
3. **Farcaster Integration**: Test with embed tool

### Contract Issues
1. **Deployment Fails**: Check RPC endpoint and gas
2. **Transaction Errors**: Verify wallet has testnet MONAD
3. **Contract Verification**: Use Hardhat verify plugin

### Integration Issues
1. **Contract Address**: Ensure correct address in frontend
2. **Network Mismatch**: Verify wallet is on Monad testnet
3. **RPC Issues**: Check Monad testnet status

## 🔄 Update Process

### Frontend Updates
1. Make changes
2. Push to GitHub
3. Vercel auto-deploys

### Contract Updates
1. Update contract code
2. Deploy new version
3. Update address in frontend
4. Test integration

## 📚 Resources

- [Monad Documentation](https://docs.monad.xyz/)
- [Vercel Documentation](https://vercel.com/docs)
- [Farcaster Mini-Apps](https://docs.farcaster.xyz/developers/mini-apps)
- [Hardhat Documentation](https://hardhat.org/docs)

---

**Need Help?** Check the individual README files in each folder! 