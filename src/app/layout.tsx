import type { Metadata } from "next";
import { Providers, GlobalStylesProvider } from "./providers";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { PageTracker } from "@/components/analytics/PageTracker";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import { DynamicHead } from "@/components/seo/DynamicHead";
import "./globals.css";

// Use default metadata - will be dynamically updated by i18n system
export const metadata: Metadata = {
  title: 'South Pole - Climate Solutions',
  description: 'Leading climate solutions provider helping organizations achieve carbon neutrality.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Basic structured data (will be enhanced by i18n in the future)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "South Pole",
    "url": "https://southpole.com"
  };
  
  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "South Pole",
    "url": "https://southpole.com"
  };

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
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
      </head>
      <body className="font-sans antialiased">
        <Providers defaultTheme="light">
          <GlobalStylesProvider>
            <DynamicHead />
            <PageTracker />
            <GlobalSearch />
            <div className="min-h-screen flex flex-col bg-background text-foreground">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
          </GlobalStylesProvider>
        </Providers>
      </body>
    </html>
  );
}
