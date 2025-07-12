import type { Metadata } from "next";
import { Providers, GlobalStylesProvider } from "./providers";
import { Header } from "@/components/layouts/Header";
import { Footer } from "@/components/layouts/Footer";
import { PageTracker } from "@/components/analytics/PageTracker";
import { GlobalSearch } from "@/components/layout/GlobalSearch";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "SouthPole Official",
    template: "%s | SouthPole",
  },
  description: "Building the future with innovative climate solutions. South Pole is a leading provider of climate solutions for governments and businesses worldwide.",
  keywords: [
    "climate solutions",
    "carbon markets",
    "sustainability",
    "environmental consulting",
    "renewable energy",
    "carbon credits",
    "climate finance",
    "South Pole",
  ],
  authors: [{ name: "South Pole" }],
  creator: "South Pole",
  publisher: "South Pole",
  metadataBase: new URL("https://southpole.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://southpole.com",
    siteName: "SouthPole Official",
    title: "SouthPole Official",
    description: "Building the future with innovative climate solutions",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SouthPole Official",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SouthPole Official",
    description: "Building the future with innovative climate solutions",
    images: ["/og-image.jpg"],
    creator: "@southpole",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

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
          <GlobalStylesProvider>
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
