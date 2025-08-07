import App from '@/components/pages/app'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: 'https://monad-farmer.vercel.app/images/feed.png',
  splashImageUrl: 'https://monad-farmer.vercel.app/images/splash.png',
  splashBackgroundColor: '#f0f9ff',
  button: {
    title: '🌾 Start Farming',
    action: {
      type: 'launch_frame',
      name: 'Monad Farming Simulator',
      url: 'https://monad-farmer.vercel.app',
    },
  },
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Monad Farming Simulator',
    openGraph: {
      title: 'Monad Farming Simulator',
      description: 'Grow crops, earn coins, and share your farming progress on Farcaster!',
    },
    other: {
      'fc:frame': JSON.stringify(frame),
    },
  }
}

export default function Home() {
  return <App />
}
