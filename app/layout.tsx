import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { AuthProvider } from "@/lib/auth-context";
import { I18nProvider } from "@/lib/i18n-context";
import { BadgeProvider } from "@/lib/badge-context";
import { GlobalBadgePopup } from "@/components/feature/global-badge-popup";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'AGI Index - Tracking AGI Progress',
    template: '%s | AGI Index'
  },
  description: 'Track the arrival of Artificial General Intelligence through community-driven milestones and voting.',
  keywords: ['AGI', 'Artificial General Intelligence', 'AI Progress', 'AI Milestones', 'AI Benchmark'],
  authors: [{ name: 'AGI Index' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://agiindex.org',
    siteName: 'AGI Index',
    title: 'AGI Index - Tracking AGI Progress',
    description: 'Track the arrival of Artificial General Intelligence through community-driven milestones and voting.',
    images: [{ url: '/logo.svg', width: 512, height: 512 }],
  },
  twitter: {
    card: 'summary',
    title: 'AGI Index - Tracking AGI Progress',
    description: 'Track the arrival of Artificial General Intelligence through community-driven milestones and voting.',
    images: ['/logo.svg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  metadataBase: new URL('https://agiindex.org'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "min-h-screen bg-background font-sans antialiased")}>
        <AuthProvider>
          <I18nProvider>
            <BadgeProvider>
              <div className="relative flex min-h-screen flex-col">
                <Navbar />
                <div className="flex-1">{children}</div>
                <Footer />
              </div>
              <GlobalBadgePopup />
            </BadgeProvider>
          </I18nProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
