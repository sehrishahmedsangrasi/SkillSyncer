import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { FormProvider } from "./context/FormContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillSyncer",
  description: "Match your skills to perfect profession",
   icons: {
    icon: "/favicon.png",                // standard
    shortcut: "/favicon.png",            // for Safari pinned tabs
    apple: "/favicon.png",      // for iOS home screen
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <FormProvider> 
              {children}
          </FormProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
