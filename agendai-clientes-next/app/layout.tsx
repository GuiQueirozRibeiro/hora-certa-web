import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "../src/components/layout/Header";
import Navigation from "../src/components/layout/Navigation";
import { DataCacheProvider } from "../src/contexts/DataCacheContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agendai - Agendamentos",
  description: "Sistema de agendamentos para barbearias",
  icons: {
    icon: '/Ativo 2.svg',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#26272B] min-h-screen`}
      >
        <DataCacheProvider>
          <Header />
          <Navigation />
          {children}
        </DataCacheProvider>
      </body>
    </html>
  );
}
