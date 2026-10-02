import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TeesTale — Apparel for your everyday",
  description: "Shop wholesale blanks, retail polos, bespoke mesh apparel, and everyday accessories from TeesTale.",
};

export default function TeesTaleLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
