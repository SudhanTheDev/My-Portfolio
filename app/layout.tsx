import './gloabls.css';
import { Navbar } from '@/components/navbar';
import { InteractiveBackground } from '@/components/interactive-background';
import { ThemeProvider } from './theme-provider';
import { Playfair_Display, Inter, Space_Mono } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
});

export const metadata = {
  title: 'Sudhan Bhattarai - Developer & Designer',
  description: 'Full-stack developer specializing in Flutter, Web Development, and AI. Building beautiful digital experiences.',
  keywords: 'Developer, Designer, Flutter, React, Next.js, Web Development',
  author: 'Sudhan Bhattarai',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${spaceMono.variable}`}>
      <body className="bg-black text-white transition-colors duration-500 relative">
        <ThemeProvider>
          <InteractiveBackground />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
