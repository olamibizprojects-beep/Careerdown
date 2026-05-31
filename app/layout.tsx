import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CareerDown — Career Community",
  description: "The career community platform for advice, discussions, and connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased dark`}>
      <body className="min-h-full bg-slate-950 text-slate-100">
        <Header />
        <main className="mx-auto w-full max-w-7xl px-4 sm:px-6">{children}</main>
      </body>
    </html>
  );
}
