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
        className={`${geistSans.variable} ${notoSansTC.variable} antialiased p-x-2`}
      >
        <Header />
        <main>
          <div className="max-w-5xl m-auto p-2">{children}</div>
        </main>
        <Toaster />
      </body>
    </html>
  );
}
