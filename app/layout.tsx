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
  title: "AGI Index",
  description: "Tracking the arrival of Artificial General Intelligence",
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
