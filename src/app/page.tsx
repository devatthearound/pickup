import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-12 text-center">
        <span className="block text-gray-900">Welcome to</span>
        <span className="block text-coral-500 mt-2">Pickup</span>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full px-4">
        {/* 고객용 카드 */}
        <a href="/customer" className="group">
          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-200 hover:shadow-xl hover:scale-105">
            <div className="aspect-square rounded-xl bg-coral-50 flex items-center justify-center mb-6">
              <svg className="w-24 h-24 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">고객 모드</h2>
            <p className="text-gray-600">
              빠르고 편리한 픽업 주문으로 맛있는 음식을 기다림 없이 만나보세요.
            </p>
          </div>
        </a>

        {/* 사장님용 카드 */}
        <a href="/store" className="group">
          <div className="bg-white rounded-2xl shadow-lg p-8 transition-all duration-200 hover:shadow-xl hover:scale-105">
            <div className="aspect-square rounded-xl bg-coral-50 flex items-center justify-center mb-6">
              <svg className="w-24 h-24 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">사장님 모드</h2>
            <p className="text-gray-600">
              효율적인 주문 관리와 매장 운영을 도와드립니다.
            </p>
          </div>
        </a>
      </div>

      {/* 슈퍼관리자 접근 버튼 */}
      <div className="mt-8">
        <a href="/admin/customer-service" className="group">
          <div className="bg-white rounded-xl shadow p-4 transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-coral-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-coral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900">슈퍼관리자 모드</span>
              <span className="text-xs text-gray-500 ml-2">(본사 전용)</span>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
