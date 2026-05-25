import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Operations Platform",
  description: "Business management platform for service companies"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body><script dangerouslySetInnerHTML={{ __html: "try{if(localStorage.getItem('operations-platform.theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}" }} />{children}</body>
    </html>
  );
}

