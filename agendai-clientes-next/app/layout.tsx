import type { Metadata } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import "./globals.css";
import Header from "../src/components-globais/layout/Header";
import Navigation from "../src/components-globais/layout/Navigation";
import { DataCacheProvider } from "../src/contexts/DataCacheContext";
import { GeolocationProvider } from "../src/contexts/GeolocationContext";
import { LocationManager } from "../src/components-globais/shared/LocationManager";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agendai",
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
        className={` ${poppins.variable} ${geistSans.variable} ${geistMono.variable} antialiased bg-[#26272B] min-h-screen`}
      >
        <GeolocationProvider>
          <DataCacheProvider>
            <Header />
            <Navigation />
            <LocationManager />
            {children}
          </DataCacheProvider>
        </GeolocationProvider>
      </body>
    </html>
  );
}
