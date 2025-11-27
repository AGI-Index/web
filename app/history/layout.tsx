import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'History',
  description: 'View the historical progress of AGI development. Track how AI capabilities have evolved over time.',
  openGraph: {
    title: 'History | AGI Index',
    description: 'View the historical progress of AGI development. Track how AI capabilities have evolved over time.',
  },
}

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
