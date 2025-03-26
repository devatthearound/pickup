export default function StoreDashboard() {
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      {/* 페이지 헤더 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl font-bold text-gray-900">대시보드</h1>
        <div className="flex items-center">
          <span className="text-gray-500">안녕하세요, 사장님!</span>
        </div>
      </div>

      {/* 오늘의 요약 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">오늘 예약</h3>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">32건</p>
          <div className="mt-4">
            <div className="text-sm text-gray-500">어제 대비 +12%</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">예상 매출</h3>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">86,000원</p>
          <div className="mt-4">
            <div className="text-sm text-green-600">전주 대비 +8.2%</div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-500">재고 소진율</h3>
          </div>
          <p className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900">93%</p>
          <div className="mt-4">
            <div className="text-sm text-gray-500">목표 달성률 116%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* 최근 예약 */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">최근 예약</h2>
              <button className="text-sm text-coral-600 hover:text-coral-700">전체보기</button>
            </div>
            <div className="space-y-4">
              {[
                {
                  name: "김민지",
                  items: "크림치즈 베이글 외 1",
                  time: "오늘 11:30",
                  status: "준비"
                },
                {
                  name: "이준호",
                  items: "딸기 생크림 케이크",
                  time: "오늘 14:00",
                  status: "준비"
                },
                {
                  name: "박서연",
                  items: "소보로빵 외 4",
                  time: "오늘 16:30",
                  status: "준비"
                },
                {
                  name: "최지우",
                  items: "초코 쿠키 외 1",
                  time: "오늘 17:45",
                  status: "준비"
                }
              ].map((order, index) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 border-b last:border-0 gap-3 sm:gap-0">
                  <div>
                    <p className="font-medium text-gray-900">{order.name}</p>
                    <p className="text-sm text-gray-500">{order.items}</p>
                    <p className="text-sm text-coral-600">픽업 예약: {order.time}</p>
                  </div>
                  <button className="w-full sm:w-auto px-4 py-2 text-sm text-white bg-coral-500 rounded-lg hover:bg-coral-600">
                    {order.status}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 재고 현황 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">재고 현황</h2>
              <button className="text-sm text-coral-600 hover:text-coral-700">재고 수정</button>
            </div>
            <div className="space-y-4">
              {[
                { name: "소보로빵", current: 6, total: 20 },
                { name: "크림치즈 베이글", current: 12, total: 30 },
                { name: "딸기 생크림 케이크", current: 2, total: 10 },
                { name: "초코 쿠키", current: 18, total: 40 },
                { name: "마들렌", current: 14, total: 30 }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 min-w-0">
                    <span className="text-sm font-medium text-gray-900 truncate">{item.name}</span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">({item.current}/{item.total})</span>
                  </div>
                  <div className="w-20 sm:w-24 h-2 bg-gray-200 rounded-full overflow-hidden flex-shrink-0 ml-2">
                    <div
                      className="h-full bg-coral-500"
                      style={{ width: `${(item.current / item.total) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 프로모션 배너 */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
        <div className="bg-green-50 rounded-lg p-4 sm:p-6 border border-green-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-green-800">신규 매장 프로모션</h3>
              <p className="mt-2 text-sm text-green-600">첫 7일 무료 체험 중 (남은 기간: 5일)</p>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
              ￦29,000으로 계속하기
            </button>
          </div>
        </div>
        <div className="bg-coral-50 rounded-lg p-4 sm:p-6 border border-coral-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-lg font-semibold text-coral-800">고객 예약 페이지</h3>
              <p className="mt-2 text-sm text-coral-600">QR코드로 간편하게 공유하세요</p>
            </div>
            <button className="w-full sm:w-auto px-4 py-2 bg-coral-500 text-white rounded-lg text-sm hover:bg-coral-600">
              QR코드 다운로드
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 