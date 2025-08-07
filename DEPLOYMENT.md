# 🚀 Deploying Your Monad Farming Simulator Mini App

This guide will walk you through deploying your farming simulator mini app to Farcaster following the official guidelines.

## 📋 Prerequisites

- Node.js 18+ installed
- A GitHub account
- A Vercel account (recommended for easy deployment)
- Farcaster account with Developer mode enabled

## 🛠️ Step 1: Prepare Your Environment

1. **Create environment file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Add your deployment URL to `.env.local`:**
   ```bash
   NEXT_PUBLIC_URL=https://your-farming-simulator.vercel.app
   ```

## 🌐 Step 2: Deploy to Vercel (Recommended)

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Monad Farming Simulator mini app"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Import your project
   - Set environment variable: `NEXT_PUBLIC_URL` = your Vercel URL
   - Deploy!

3. **Update your `.env.local`:**
   ```bash
   NEXT_PUBLIC_URL=https://your-project-name.vercel.app
   ```

## 🧪 Step 3: Test with Farcaster Embed Tool

1. **Install cloudflared (for local testing):**
   ```bash
   # macOS
   brew install cloudflared
   
   # Windows
   # Download from: https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/downloads/
   ```

2. **Expose your local server:**
   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

3. **Test in Farcaster Embed Tool:**
   - Go to [Farcaster Embed Tool](https://warpcast.com/~/developers/mini-apps/embed)
   - Enter your cloudflared URL
   - Test the mini app functionality

## 🎨 Step 4: Customize App Images

Replace the images in `public/images/` with your farming simulator branding:

- `feed.png` - Embed preview image (3:2 ratio recommended)
- `splash.png` - Splash screen icon (200x200px)
- `icon.png` - App store icon

## 📱 Step 5: Update Farcaster Configuration

Update `app/.well-known/farcaster.json/route.ts`:

```typescript
const appUrl = process.env.NEXT_PUBLIC_URL;
const farcasterConfig = {
    accountAssociation: {
        "header": "",
        "payload": "",
        "signature": ""
    },
    frame: {
        version: "1",
        name: "Monad Farming Simulator",
        iconUrl: `${appUrl}/images/icon.png`,
        homeUrl: `${appUrl}`,
        imageUrl: `${appUrl}/images/feed.png`,
        screenshotUrls: [], // Add screenshots of your app
        tags: ["monad", "farcaster", "miniapp", "farming", "game"],
        primaryCategory: "games",
        buttonTitle: "🌾 Start Farming",
        splashImageUrl: `${appUrl}/images/splash.png`,
        splashBackgroundColor: "#f0f9ff",
    }
};
```

## 🔐 Step 6: Generate Account Association

1. **Enable Developer Mode in Farcaster:**
   - Open Farcaster app
   - Go to Settings > Advanced
   - Scroll down and enable Developer mode

2. **Generate Domain Manifest:**
   - Go to Settings > Developer > Domains
   - Enter your deployment domain (e.g., `your-app.vercel.app`)
   - Click "Generate Domain Manifest"
   - Copy the generated `accountAssociation` data

3. **Update your `farcaster.json`:**
   - Replace the empty `accountAssociation` with the generated data

## 📤 Step 7: Publish Your Mini App

1. **Deploy final version:**
   ```bash
   git add .
   git commit -m "Update Farcaster configuration"
   git push origin main
   ```

2. **Verify deployment:**
   - Check your Vercel deployment is live
   - Test all functionality
   - Verify Farcaster integration works

3. **Share your Mini App:**
   - Share your app URL on Farcaster
   - Users can now discover and use your farming simulator!

## 🎯 Testing Checklist

- [ ] App loads correctly in Farcaster
- [ ] Farm grid is interactive
- [ ] Planting and harvesting works
- [ ] Shop and inventory function properly
- [ ] Achievements unlock correctly
- [ ] Social sharing works
- [ ] Game state persists
- [ ] All tabs navigate properly

## 🐛 Troubleshooting

### Common Issues:

1. **App not loading:**
   - Check `NEXT_PUBLIC_URL` is correct
   - Verify deployment is live
   - Check browser console for errors

2. **Farcaster actions not working:**
   - Ensure you're testing in Farcaster app
   - Check `useFrame` hook is properly connected
   - Verify account association is set

3. **Images not showing:**
   - Check image paths in `public/images/`
   - Verify image URLs are accessible
   - Ensure correct image dimensions

## 🎉 Success!

Your Monad Farming Simulator is now live on Farcaster! Users can:

- Discover your app through Farcaster
- Plant and harvest crops
- Earn achievements
- Share their progress
- Enjoy persistent game state

## 📈 Next Steps

- Monitor user engagement
- Gather feedback from the community
- Consider adding new features
- Optimize performance
- Add analytics

---

**Happy Farming! 🌾🚜**

*Your farming simulator is now part of the Farcaster ecosystem!* 