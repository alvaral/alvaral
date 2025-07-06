// app/layout.tsx
import type { Metadata } from "next";
import  { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLocale, getMessages } from "next-intl/server";
import Script from 'next/script';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "alvaral",
  description: "Technical blog by Álvaro Alonso, focused on software engineer, programming, and reflections on life as a developer.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <head>
        <Script
          async
          defer
          data-website-id="748703d0-709c-4105-adfd-66625c8d2139"
          src="https://umami-alvaral.onrender.com/script.js"
        />
      </head>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-16">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
