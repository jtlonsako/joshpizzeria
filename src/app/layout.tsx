import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { BASE_PATH, auth } from "@/auth";
import Navbar from "@/components/Navbar";
import { SessionProvider } from "next-auth/react";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Josh's Pizzeria",
  description: "PMS (Pizza Management Software) for Josh's Pizza Company",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider basePath={BASE_PATH} session={session}>
          <Navbar />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
