import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Header } from '@/components/ui/header';
import { ToastProvider } from '@/components/ui/toast';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Agents-11 Marketplace',
  description:
    'Premium AI agents and automation tools marketplace. Access battle-tested AI agents, Agent-11 technical suite, and Empire-11 business automation system.',
  keywords:
    'AI agents, automation, Agent-11, Empire-11, AI marketplace, artificial intelligence',
  authors: [{ name: 'Agents-11 Team' }],
  openGraph: {
    title: 'Agents-11 Marketplace',
    description: 'Premium AI agents and automation tools marketplace',
    url: 'https://agents-11.com',
    siteName: 'Agents-11 Marketplace',
    images: [
      {
        url: '/transparent/agents11-logo-primary-horizontal.png',
        width: 1200,
        height: 630,
        alt: 'Agents-11 Marketplace',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agents-11 Marketplace',
    description: 'Premium AI agents and automation tools marketplace',
    images: ['/transparent/agents11-logo-primary-horizontal.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      {
        url: '/transparent/agents11-logo-icon-only.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ToastProvider>
          <Header />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
