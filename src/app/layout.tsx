// app/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";
import Script from "next/script";

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
  description:
    "Technical blog by Álvaro Alonso, focused on software engineer, programming, and reflections on life as a developer.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();
  const host = (await headers()).get("host") || "";
  const isProduction = host === "alvaral.dev" || host === "www.alvaral.dev";
  return (
    <html lang={locale}>
      <head>
        {isProduction && (
          <Script
            async
            defer
            data-website-id="c4ffcecb-6f68-4580-be22-3e3787bc34bd"
            src="https://analytics.alvaral.dev/script.js"
          />
        )}
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <Header />
          <main className="pt-16">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
