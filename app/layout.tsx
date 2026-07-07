import './gloabls.css';
import type { CSSProperties, ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { InteractiveBackground } from '@/components/interactive-background';
import { CustomCursor } from '@/components/custom-cursor';
import { ScrollProgress } from '@/components/scroll-progress';
import { IntroLoader } from '@/components/intro-loader';
import { ThemeProvider } from './theme-provider';

export const metadata = {
  title: 'Sudhan Bhattarai - Developer & Designer',
  description: 'Full-stack developer specializing in Flutter, Web Development, and AI. Building beautiful digital experiences.',
  keywords: 'Developer, Designer, Flutter, React, Next.js, Web Development',
  author: 'Sudhan Bhattarai',
};

const themeScript = `
  (function () {
    try {
      localStorage.setItem('theme', 'light');
      document.documentElement.classList.add('light-mode');
      document.documentElement.style.colorScheme = 'light';
    } catch (e) {}
  })();
`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      style={
        {
          '--font-display': '"Segoe UI", "Trebuchet MS", "Avenir Next", system-ui, sans-serif',
          '--font-sans': '"Segoe UI", "Helvetica Neue", Arial, system-ui, sans-serif',
          '--font-brand': '"Arial Black", "Segoe UI", system-ui, sans-serif',
          '--font-mono': '"Cascadia Code", "SFMono-Regular", Consolas, "Liberation Mono", monospace',
        } as CSSProperties
      }
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="bg-background text-foreground antialiased transition-colors duration-500 relative">
        <ThemeProvider>
          <IntroLoader />
          <InteractiveBackground />
          <CustomCursor />
          <ScrollProgress />
          <div id="page-shell" className="relative min-h-screen">
            <Navbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
