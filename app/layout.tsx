import { Montserrat, Poppins } from "next/font/google";
import "./globals.css";

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

export const metadata = {
  title: "MBCLAB Portal",
  description: "Sistem Manajemen Praktikum dan CBT MBCLAB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${montserrat.variable} ${poppins.variable}`}>
      <body className="bg-white text-grey-900 font-primary antialiased">
        {children}
      </body>
    </html>
  );
}
