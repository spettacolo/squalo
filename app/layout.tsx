import type { Metadata } from "next";
import { Geist_Mono, Varela_Round } from "next/font/google";
import "./globals.css";

// Use Varela Round as the main sans font but keep the same CSS variable
const varela = Varela_Round({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: "400"
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Squalo",
  description: "Welcome to my portfolio!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${varela.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
