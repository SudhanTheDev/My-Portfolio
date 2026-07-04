import './gloabls.css';
import { Navbar } from '@/components/navbar';
import { InteractiveBackground } from '@/components/interactive-background';
import { CustomCursor } from '@/components/custom-cursor';
import { ScrollProgress } from '@/components/scroll-progress';
import { ThemeProvider } from './theme-provider';
import { Playfair_Display, Inter, Space_Mono, Orbitron } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '700'],
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-brand',
  weight: ['500', '600', '700', '800'],
  display: 'swap',
});

export const metadata = {
  title: 'Sudhan Bhattarai - Developer & Designer',
  description: 'Full-stack developer specializing in Flutter, Web Development, and AI. Building beautiful digital experiences.',
  keywords: 'Developer, Designer, Flutter, React, Next.js, Web Development',
  author: 'Sudhan Bhattarai',
};

const themeScript = `
  (function () {
    try {
      var theme = localStorage.getItem('theme');
      if (theme === 'light') {
        document.documentElement.classList.add('light-mode');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${spaceMono.variable} ${orbitron.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-foreground antialiased transition-colors duration-500 relative">
        <ThemeProvider>
          <InteractiveBackground />
          <CustomCursor />
          <ScrollProgress />
          <Navbar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
