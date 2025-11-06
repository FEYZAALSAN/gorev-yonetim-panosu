import type { Metadata } from "next";
import "./globals.css"; // Global stilleri tut

export const metadata: Metadata = {
  title: "TaskiFlow - Görev Panosu",
  description: "Next.js, Prisma, MongoDB, Zustand ile geliştirilmiş görev yönetim uygulaması.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body>
        {children}
      </body>
    </html>
  );
}