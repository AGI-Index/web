import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Manifesto',
  description: 'Learn how AGI Index works. Community-driven voting to track Artificial General Intelligence progress.',
  openGraph: {
    title: 'Manifesto | AGI Index',
    description: 'Learn how AGI Index works. Community-driven voting to track Artificial General Intelligence progress.',
  },
}

export default function ManifestoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
