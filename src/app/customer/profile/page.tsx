export default function ProfilePage() {
  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* 프로필 섹션 */}
      <div className="bg-white p-4">
        <div className="flex items-center">
          <div className="w-16 h-16 bg-coral-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
            김
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-bold">김민수</h2>
            <p className="text-sm text-gray-600">010-1234-5678</p>
          </div>
        </div>
      </div>

      {/* 예약 내역 */}
      <div className="mt-4 bg-white">
        <div className="p-4 border-b">
          <h3 className="text-lg font-bold">예약 내역</h3>
        </div>
        <div className="divide-y">
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">달콤한 베이커리</h4>
                <p className="text-sm text-gray-600 mt-1">예약번호: 202503250001</p>
                <p className="text-sm text-gray-600">픽업 예정: 3/25 16:30</p>
                <p className="text-sm text-gray-600">결제 금액: 8,800원</p>
              </div>
              <div className="px-3 py-1 bg-coral-500 text-white text-sm rounded-full">
                픽업 완료
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="px-4 py-2 border border-coral-500 text-coral-500 rounded-lg text-sm">
                예약 상세
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm">
                리뷰 작성
              </button>
            </div>
          </div>

          <div className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold">별빛 디저트</h4>
                <p className="text-sm text-gray-600 mt-1">예약번호: 202503240002</p>
                <p className="text-sm text-gray-600">픽업 예정: 3/24 15:00</p>
                <p className="text-sm text-gray-600">결제 금액: 12,000원</p>
              </div>
              <div className="px-3 py-1 bg-gray-500 text-white text-sm rounded-full">
                픽업 완료
              </div>
            </div>
            <div className="mt-3 flex space-x-2">
              <button className="px-4 py-2 border border-coral-500 text-coral-500 rounded-lg text-sm">
                예약 상세
              </button>
              <button className="px-4 py-2 bg-coral-500 text-white rounded-lg text-sm">
                리뷰 작성 완료
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 설정 메뉴 */}
      <div className="mt-4 bg-white">
        <div className="divide-y">
          <button className="w-full p-4 text-left flex items-center justify-between">
            <span>알림 설정</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full p-4 text-left flex items-center justify-between">
            <span>개인정보 설정</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full p-4 text-left flex items-center justify-between">
            <span>고객센터</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full p-4 text-left flex items-center justify-between">
            <span>약관 및 정책</span>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <button className="w-full p-4 text-left text-red-500">
            로그아웃
          </button>
        </div>
      </div>

      <div className="p-4 text-center text-sm text-gray-500">
        버전 1.0.0
      </div>
    </div>
  );
} 