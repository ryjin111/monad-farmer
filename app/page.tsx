import App from '@/components/pages/app'
import { APP_URL } from '@/lib/constants'
import type { Metadata } from 'next'

const frame = {
  version: 'next',
  imageUrl: 'https://blake-describes-bill-ul.trycloudflare.com/images/feed.png',
  button: {
    title: '🌾 Start Farming',
    action: {
      type: 'launch_frame',
      name: 'Monad Farming Simulator',
      url: 'https://blake-describes-bill-ul.trycloudflare.com',
      splashImageUrl: 'https://blake-describes-bill-ul.trycloudflare.com/images/splash.png',
      splashBackgroundColor: '#f0f9ff',
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
