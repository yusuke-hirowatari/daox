import type { Metadata } from "next";
import { Hanken_Grotesk, Noto_Sans_JP } from "next/font/google";
import "./globals.css";

const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const notoJP = Noto_Sans_JP({
  subsets: ["latin"],
  variable: "--font-noto-jp",
  display: "swap",
  weight: ["300", "400", "500", "700"],
});

export const metadata: Metadata = {
  title: "DAOX — 地域コミュニティDAO",
  description: "地域商店街向けコミュニティ + トークン + タスク + クーポン交換アプリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${hanken.variable} ${notoJP.variable} h-full`}
    >
      <body className="h-full antialiased">{children}</body>
    </html>
  );
}
