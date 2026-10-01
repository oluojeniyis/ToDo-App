import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orbit — AI-assisted To-Do Dashboard",
  description: "A focused, local-first task dashboard with transparent calendar connection previews.",
};

export default function OrbitLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
