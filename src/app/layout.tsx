import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Providers from './providers';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'AI Studio - Create Stunning AI Images',
  description: 'Transform your ideas into stunning visuals with state-of-the-art AI. Text to image, image remix, and more powered by Flux.1',
  keywords: 'AI image generator, text to image, image remix, Flux.1, AI art',
  openGraph: {
    title: 'AI Studio - Create Stunning AI Images',
    description: 'Transform your ideas into stunning visuals with state-of-the-art AI.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
