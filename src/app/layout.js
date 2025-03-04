import ClientProvider from '@/utils/context/ClientProvider';
import { Inter, Space_Grotesk as SpaceGrotesk } from 'next/font/google';
import PropTypes from 'prop-types';

import '@/styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <head>
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" />
        <link rel="apple-touch-icon" href="/images/logo.png" />
        <meta name="theme-color" content="#7C3AED" />
      </head>
      <body className={`${inter.variable} ${spaceGrotesk.variable} background-light850_dark100 custom-scrollbar min-h-screen`}>
        <ClientProvider>
          <main className="flex flex-col pt-20">{children}</main>
        </ClientProvider>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

// You can manage the metadata, tab content and info about your app dynamically using this. It will work on every page in your app:
export const metadata = {
  title: 'DevLinks Hub - Share & Discover Developer Resources',
  description: 'DevLinks Hub - A platform to share and discover developer resources, tools, and websites for developers',
  keywords: ['developer', 'resources', 'links', 'coding', 'programming', 'web development', 'software engineering', 'tools', 'websites', 'learning'],
  authors: [{ name: 'DevLinks Hub Team' }],
  creator: 'DevLinks Hub Team',
  publisher: 'DevLinks Hub',
  openGraph: {
    title: 'DevLinks Hub - Share & Discover Developer Resources',
    description: 'A platform to share and discover developer resources, tools, and websites for developers',
    url: 'https://devlinks-hub.vercel.app',
    siteName: 'DevLinks Hub',
    images: [
      {
        url: '/images/logo.png',
        width: 800,
        height: 600,
        alt: 'DevLinks Hub Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DevLinks Hub - Share & Discover Developer Resources',
    description: 'A platform to share and discover developer resources, tools, and websites for developers',
    images: ['/images/logo.png'],
    creator: '@devlinkshub',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
