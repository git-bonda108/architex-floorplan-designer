import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';

const inter = Inter({ subsets: ['latin'] });

export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'ArchitectPro - Professional Floor Plan Generator',
  description: 'Create professional 2 BHK and 3 BHK floor plans with real-time preview, customizable specifications, and export to PDF, SVG, PNG formats.',
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
  },
  openGraph: {
    title: 'ArchitectPro - Professional Floor Plan Generator',
    description: 'Create professional 2 BHK and 3 BHK floor plans with real-time preview, customizable specifications, and export to PDF, SVG, PNG formats.',
    url: siteUrl,
    siteName: 'ArchitectPro',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ArchitectPro - Professional Floor Plan Generator',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ArchitectPro - Professional Floor Plan Generator',
    description: 'Create professional 2 BHK and 3 BHK floor plans with real-time preview, customizable specifications, and export to PDF, SVG, PNG formats.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js"></script>
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
