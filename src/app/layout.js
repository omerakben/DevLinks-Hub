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
export const generateMetadata = async ({ params }) => {
  // Destructure parameters or fetch necessary data here
  const { slug } = params || {}; // Example of accessing dynamic route params

  return {
    title: `DevLinks Hub - ${slug || 'Home'}`, // Dynamically set the title using route parameters
    description: `DevLinks Hub - A platform to share and discover developer resources`, // Dynamic description
    // Add other metadata fields as needed, like keywords, open graph tags, etc.
    keywords: ['developer', 'resources', 'links', 'coding', 'programming'],
    openGraph: {
      title: `DevLinks Hub - ${slug || 'Home'}`,
      description: `DevLinks Hub - A platform to share and discover developer resources`,
      url: `https://devlinks-hub.vercel.app/${slug || ''}`,
    },
  };
};
