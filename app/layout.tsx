import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavbarWrapper from "./components/NavbarWrapper";
import { AppToaster } from "./components/appToast";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Consistent Guru",
  description: "Your daily consistency partner",
  icons: {
    icon: "/icon.png",       // Browser tab-ku
    apple: "/icon.png",      // iPhone/iPad app icon-ku
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body

        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
          <Providers>
               <NavbarWrapper />
                <AppToaster  /> 
        {children}
        </Providers>
      </body>
    </html>
  );
}
