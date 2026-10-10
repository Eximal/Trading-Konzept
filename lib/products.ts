export interface Product {
  id: string
  name: string
  description: string
  priceInCents: number
  image: string
  utility: string
}

export const PRODUCTS: Product[] = [
  { id: 'gang-banana-origin', name: 'Gang Banana Origin', description: 'A digital collectible for the original Gang Banana story.', priceInCents: 1900, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-7FF2DD6B-2qMtg2sDiy5W9Tyr3DwzS6scdRD4da.jpeg', utility: 'Origin profile badge + ecosystem gallery access' },
  { id: 'cloud-miner-pickaxe', name: 'Cloud Miner Pickaxe', description: 'A mining-themed digital collectible from the CloudMiner OS universe.', priceInCents: 2900, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-AE6DDDF6-LWJCs3GBSKQqclpr5I6A4lr0A1PGKz.jpeg', utility: 'Miner OS cosmetic badge + testnet role marker' },
  { id: 'veg-shark-guardian', name: 'Veg Shark Guardian', description: 'A community guardian collectible featuring Bruce “The Veg” Shark.', priceInCents: 4900, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-B3F1307A-wZydwSWog3BRUiVc7Nnz55kDM8er65.jpeg', utility: 'Community profile badge + governance identity flair' },
  { id: 'bad-banana-riot', name: 'Bad Banana Riot', description: 'A limited digital collectible from the darker Gang Banana chapter.', priceInCents: 3900, image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Image-10316FF5-4koPU2F1PtymiJfZHrwMcigYEPHqeJ.jpeg', utility: 'Lore archive access + seasonal profile frame' },
]

export function getProduct(productId: string) {
  return PRODUCTS.find((product) => product.id === productId)
}

export function formatProductPrice(priceInCents: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(priceInCents / 100)
}

export const PRODUCT_IMAGE_SOURCES = PRODUCTS.map(({ id, image }) => ({ id, image }))

// These products are digital collectibles with utility; onchain NFT minting is a separate audited release.
