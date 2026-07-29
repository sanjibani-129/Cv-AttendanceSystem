import type { Metadata } from "next";
import "./globals.css";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Nexus — Attendance AI",
  description: "Face recognition attendance for the Build Club makerspace.",
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230a0d0b'/%3E%3Ccircle cx='16' cy='16' r='9' fill='none' stroke='%2339ff8a' stroke-width='2'/%3E%3Ccircle cx='16' cy='16' r='3' fill='%2339ff8a'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}