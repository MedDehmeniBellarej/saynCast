import Providers from '@/components/layout/providers';
import { Toaster } from '@/components/ui/toaster';
import '@uploadthing/react/styles.css';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { Inter } from 'next/font/google';
import './globals.css';
import { SessionProvider } from '@/context/SessionContext';  // Import custom SessionProvider

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'huber+suhner',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="icons/logo.svg" />
      </head>
      <body className={`${inter.className} overflow-hidden`}>
        <NextTopLoader />
        <SessionProvider>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
