import type { Metadata } from "next";
import { Providers, GlobalStylesProvider } from "./providers";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { PageTracker } from "@/components/analytics/PageTracker";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { DynamicHead } from "@/components/seo/DynamicHead";
import { PreloadProvider, PreloadMonitor } from "@/components/optimization/PreloadProvider";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo-metadata";
import { HOME_SEO } from "@/lib/seo-config";
import { SEOChecker } from "@/components/seo/SEOChecker";
import "./globals.css";

// Enhanced metadata with proper SEO configuration
export const metadata: Metadata = generateSEOMetadata(HOME_SEO);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#002145" />
        <meta name="msapplication-TileColor" content="#002145" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
      </head>
      <body className="font-sans antialiased">
        <Providers defaultTheme="light">
          <PreloadProvider>
            <GlobalStylesProvider>
              <DynamicHead />
              <PageTracker />
              <PreloadMonitor />
              <GlobalSearch />
              <SEOChecker />
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">
                  {children}
                </main>
                <Footer />
              </div>
            </GlobalStylesProvider>
          </PreloadProvider>
        </Providers>
      </body>
    </html>
  );
}
