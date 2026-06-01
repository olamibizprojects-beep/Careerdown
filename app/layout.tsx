import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: {
    default: 'CareerDown — Career Stories, Advice & Community',
    template: '%s | CareerDown',
  },
  description: 'Share your career struggles, wins, and advice. A community for professionals navigating layoffs, job searches, salary negotiations, and work-life balance.',
  keywords: ['career advice', 'job search', 'layoffs', 'salary negotiation', 'work life balance', 'tech careers'],
  openGraph: {
    type: 'website',
    siteName: 'CareerDown',
    title: 'CareerDown — Career Stories, Advice & Community',
    description: 'Share your career struggles, wins, and advice.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@careerdown',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} h-full antialiased dark`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var theme = localStorage.getItem('theme');
            if (theme === 'light') { document.documentElement.classList.remove('dark'); }
            else { document.documentElement.classList.add('dark'); }
          })();
        ` }} />
      </head>
      <body className="min-h-full bg-slate-950 text-slate-100">
        <SessionProvider>{children}</SessionProvider>
        {process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_ADSENSE_PUBLISHER_ID}`}
            crossOrigin="anonymous"
            strategy="lazyOnload"
          />
        )}
      </body>
    </html>
  );
}
