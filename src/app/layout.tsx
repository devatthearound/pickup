import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pickup - 스토어 관리 서비스",
  description: "오늘도 당신에게 일상의 행복을 배달 중, Pickup 스토어 관리 서비스",
  keywords: ["스토어 관리", "주문 관리", "매출 분석", "메뉴 관리"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthProvider>
      <ClientLayout>
        <html lang="ko">
          <body className={`${inter.className} antialiased`}>
            <main className="min-h-screen">
              {children}
            </main>
            <footer className="bg-gray-900 text-white py-12">
              <div className="max-w-6xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">Pickup</h3>
                    <p className="text-gray-400">
                      오늘도 당신에게 일상의 행복을 배달 중
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">문의하기</h3>
                    <p className="text-gray-400">
                      help@pickup.com<br />
                      02-1234-5678
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-4">회사 정보</h3>
                    <p className="text-gray-400">
                      대표: 조현주<br />
                      사업자번호: 573-86-01025<br />
                      통신판매업: 제2025-서울영등포-0150호
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
                  <p>© 2025 디어라운드 주식회사. All rights reserved.</p>
                  <p className="mt-2">서울특별시 영등포구 영등포로19길 15</p>
                </div>
              </div>
            </footer>
          </body>
        </html>
      </ClientLayout>
    </AuthProvider>
  );
}
