import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "alvaral",
  description:
    "Technical blog by Álvaro Alonso, focused on software engineer, programming, and reflections on life as a developer.",
};

// El layout debe ser una función síncrona y SIN llamadas await/server
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Idioma por defecto (puedes cambiar en client con JS si quieres)
  return (
    <html lang="en">
      <head>
        {
          // && (
          //   <Script
          //     async
          //     defer
          //     data-website-id="748703d0-709c-4105-adfd-66625c8d2139"
          //     src="https://umami-alvaral.onrender.com/script.js"
          //   />
          // )
        }
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
