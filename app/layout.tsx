import type { Metadata } from "next";
import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/providers/query-provider";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-primary",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-secondary",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "MBC Praktikum | Laboratorium Manajemen Telkom University",
  description:
    "Portal resmi sistem informasi dan manajemen praktikum MBC Laboratory Telkom University.",
  keywords: [
    "mbc praktikum",
    "mbc laboratory",
    "telkom university",
    "praktikum mbc",
    "asisten mbc",
  ],

  appleWebApp: {
    title: "MBC Praktikum",
  },
  openGraph: {
    title: "MBC Praktikum Portal",
    description:
      "Portal resmi manajemen praktikum MBC Laboratory Telkom University.",
    url: "https://mbcpraktikum.com",
    siteName: "MBC Praktikum",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${montserrat.variable} ${poppins.variable}`}>
      <body className="min-h-screen bg-grey-200 text-grey-900 font-primary antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
