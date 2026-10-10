'use server'

import { headers } from 'next/headers'
import { getProduct } from '@/lib/products'
import { stripe } from '@/lib/stripe'

export async function createCollectibleCheckout(productId: string) {
  const product = getProduct(productId)
  if (!product) throw new Error('Collectible not found')

  const requestHeaders = await headers()
  const origin = requestHeaders.get('origin') ?? 'http://localhost:3000'
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price_data: { currency: 'usd', product_data: { name: product.name, description: product.description }, unit_amount: product.priceInCents }, quantity: 1 }],
    success_url: `${origin}/?checkout=success&collectible=${product.id}`,
    cancel_url: `${origin}/?checkout=cancelled`,
    metadata: { collectibleId: product.id, utility: product.utility },
  })
  if (!session.url) throw new Error('Checkout URL unavailable')
  return session.url
}
