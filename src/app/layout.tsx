import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WES Associates - Study Abroad Consultancy",
  description:
    "WES Associates helps students apply abroad with expert counselling, scholarships, visa guidance, and appointment-based support.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"  data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
