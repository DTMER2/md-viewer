import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cloze Study Viewer",
  description: "??? を押すと解答を見られる学習ページ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
