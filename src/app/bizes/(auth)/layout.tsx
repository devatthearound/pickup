'use client';

import { useRouter } from 'next/navigation';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  return (
    <>
        {/* 모바일에서만 보이는 헤더 */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white md:hidden">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <h1 className="text-xl font-bold">홈</h1>
              </div>
            </div>
        </header>
        {/* 모바일에서만 상단 여백 적용 */}
        <main className="min-h-screen md:pt-0 pt-14">
            {children}
        </main>
    </>
  );
}
