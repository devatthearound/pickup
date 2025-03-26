import Link from 'next/link';

export default function CustomerHome() {
  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 검색 바 */}
      <div className="p-4 bg-white">
        <div className="relative">
          <input
            type="text"
            className="w-full px-4 py-2 pl-10 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-coral-500 focus:border-transparent"
            placeholder="가게명, 메뉴 검색"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="flex space-x-2">
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">전체</button>
          <button className="px-3 py-1 text-sm font-medium text-coral-500 bg-coral-50 rounded-full">베이커리</button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-full">디저트</button>
        </div>
      </div>

      {/* 매장 목록 */}
      <div className="flex-1 p-4 space-y-4">
        <Link href="/customer/store/1" className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">달콤한 베이커리</h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <span>⭐️ 4.8</span>
                  <span>•</span>
                  <span>베이커리</span>
                  <span>•</span>
                  <span>1.2km</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">07:00 - 20:00</p>
                <p className="text-coral-500 text-sm mt-2">지금 주문 가능</p>
              </div>
              <span className="text-2xl">🍞</span>
            </div>
          </div>
        </Link>

        <Link href="/customer/store/2" className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-bold">별빛 디저트</h2>
                <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                  <span>⭐️ 4.5</span>
                  <span>•</span>
                  <span>디저트</span>
                  <span>•</span>
                  <span>0.8km</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">10:00 - 22:00</p>
                <p className="text-coral-500 text-sm mt-2">지금 주문 가능</p>
              </div>
              <span className="text-2xl">🍰</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
} 