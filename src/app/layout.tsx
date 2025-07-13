import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers, GlobalStylesProvider } from "./providers";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { PageTracker } from "@/components/analytics/PageTracker";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { DynamicHead } from "@/components/seo/DynamicHead";
import { PreloadProvider, PreloadMonitor } from "@/components/optimization/PreloadProvider";
import { PreloadStrategy, RoutePreloader } from "@/components/optimization/PreloadStrategy";
import { generateMetadata as generateSEOMetadata } from "@/lib/seo-metadata";
import { HOME_SEO } from "@/lib/seo-config";
import { SEOChecker } from "@/components/seo/SEOChecker";
import { ProgressBar } from "@/components/common/ProgressBar";
import "./globals.css";
import "../styles/nprogress.css";

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
        {/* 字体预加载 - 关键性能优化 */}
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
        />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        
        {/* 关键资源预加载 */}
        <link rel="preload" href="/og-default.jpg" as="image" />
        <link rel="preload" href="/favicon.ico" as="image" />
        
        {/* DNS 预解析 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//www.google-analytics.com" />
        
        {/* 主题和图标 */}
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
            <PreloadStrategy>
              <GlobalStylesProvider>
                <Suspense fallback={null}>
                  <ProgressBar />
                </Suspense>
                <DynamicHead />
                <Suspense fallback={null}>
                  <PageTracker />
                </Suspense>
                <PreloadMonitor />
                <RoutePreloader />
                <GlobalSearch />
                <SEOChecker />
                <div className="min-h-screen flex flex-col bg-background text-foreground">
                  <Header />
                  <main className="flex-1">
                    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">
                      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
                    </div>}>
                      {children}
                    </Suspense>
                  </main>
                  <Footer />
                </div>
              </GlobalStylesProvider>
            </PreloadStrategy>
          </PreloadProvider>
        </Providers>
      </body>
    </html>
  );
}
