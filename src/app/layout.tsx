import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pickup",
  description: "Your application description",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        {children}
        {/* <header className="bg-white shadow-sm">

        </header> */}
        {/* <main className="max-w-7xl mx-auto">
          {children}
        </main> */}
        {/* <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm">
              © 2024 Pickup. All rights reserved.
            </p>
          </div>
        </footer> */}
      </body>
    </html>
  );
}
