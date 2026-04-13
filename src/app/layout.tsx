import './globals.css';
import { Noto_Sans_TC, Geist } from 'next/font/google';
import Header from './components/Header';
import { Toaster } from 'sonner';

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
        className={`${geistSans.variable} ${notoSansTC.variable} antialiased px-2`}
      >
        <Header />
        <main className="bg-zinc-50 min-h-screen">
          <div className="max-w-5xl mx-auto p-2 pt-5">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
