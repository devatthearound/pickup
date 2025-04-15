import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pickup",
  description: "Pickup - 스토어 관리 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </AuthProvider>
        {/* <header className="bg-white shadow-sm">

        </header> */}
        {/* <main className="max-w-7xl mx-auto">
          {children}
        </main> */}
        <footer className="bg-gray-50 border-t">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <p className="text-center text-gray-500 text-sm">
              © 2025 디어라운드 주식회사. All rights reserved.
              사업자등록번호 573-86-01025 | 대표 조현주
              통신판매업신고번호 제2025-서울영등포-0150호
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
