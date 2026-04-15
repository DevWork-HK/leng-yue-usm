import './globals.css';
import { Noto_Sans_TC, Geist } from 'next/font/google';
import Header from './components/Header';
import { Toaster } from 'sonner';
import { SpeedInsights } from '@vercel/speed-insights/next';

const geistSans = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  display: 'swap',
});

const notoSansTC = Noto_Sans_TC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-tc',
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${notoSansTC.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="bg-zinc-50 flex-1 flex">
          <div className="max-w-5xl mx-auto p-2 pt-5 flex flex-col flex-1">
            {children}
          </div>
        </main>
        <Toaster />
        <SpeedInsights />
      </body>
    </html>
  );
}
