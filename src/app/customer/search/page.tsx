'use client';

import { useRouter } from 'next/navigation';

export default function SearchPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 검색 헤더 */}
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 pl-10 pr-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
            placeholder="가게명, 메뉴 검색"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#FF7355]">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex space-x-2 overflow-x-auto">
          <button className="px-3 py-1 text-sm font-medium text-[#FF7355] bg-[#FF7355]/10 rounded-full whitespace-nowrap">전체</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full whitespace-nowrap">베이커리</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full whitespace-nowrap">디저트</button>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="flex-1 p-4">
        <div className="mb-4">
          <h2 className="text-lg font-bold">검색 결과</h2>
          <p className="text-sm text-gray-600">총 3개의 매장</p>
        </div>

        <div className="space-y-4">
          {/* 매장 카드 */}
          <div 
            className="bg-white rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => router.push('/customer/store/1')}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-bold">달콤한 베이커리</h3>
                  <div className="mt-1 text-sm text-gray-600">
                    <span>⭐ 4.8 (182)</span>
                    <span className="mx-1">·</span>
                    <span>빵, 케이크, 디저트</span>
                  </div>
                  <div className="mt-1 text-sm">
                    <span className="text-gray-600">가까움: 230m</span>
                    <span className="mx-1">·</span>
                    <span className="text-gray-600">오픈시간: 07:00-20:00</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-sm text-[#FF7355]">예약 가능</span>
                  </div>
                </div>
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🍞</span>
                </div>
              </div>
            </div>
          </div>

          {/* 추가 매장 카드들... */}
        </div>
      </div>
    </div>
  );
} 