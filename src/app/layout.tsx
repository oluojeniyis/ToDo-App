import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TeesTale — Apparel for your everyday",
  description: "Shop wholesale blanks, retail polos, bespoke mesh apparel, and everyday accessories from TeesTale.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
