import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ServiceFlow",
  description: "Business management platform for service companies"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
