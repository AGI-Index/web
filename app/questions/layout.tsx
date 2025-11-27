import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questions',
  description: 'Browse and vote on AGI milestone questions. Track which AI capabilities have been achieved.',
  openGraph: {
    title: 'AGI Questions | AGI Index',
    description: 'Browse and vote on AGI milestone questions. Track which AI capabilities have been achieved.',
  },
}

export default function QuestionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
