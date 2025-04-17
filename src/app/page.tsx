import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-[#FF7355]">

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            동네 가게를 위한<br />
            간편한 픽업 예약 시스템
          </h1>
          <p className="text-xl md:text-2xl mb-8">
            픽업해 - 스토어 관리 서비스
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link 
              href="/bizes"
              className="bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
            >
              시작하기
            </Link>
            <Link 
              href="/"
              className="border-2 border-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition"
            >
              더 알아보기
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            픽업해 주요 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "재고 소진율 90% ↑",
                description: "예약 시스템으로 당일 재고를 효율적으로 관리하세요.",
                icon: "📱"
              },
              {
                title: "전화 응대 시간 절약",
                description: "전화 응대 없이 자동화된 예약 시스템을 이용하세요.",
                icon: "📊"
              },
              {
                title: "단골 고객 관리",
                description: "정기 예약 고객을 위한 특별한 관리 기능을 제공합니다.",
                icon: "🍽️"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            지금 바로 시작하세요
          </h2>
          <p className="text-xl mb-8">
            픽업해와 함께 스토어 관리를 더욱 효율적으로 만들어보세요
          </p>
          <Link
            href="/bizes"
            className="inline-block bg-white text-black px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition"
          >
            무료로 시작하기
          </Link>
        </div>
      </section>
    </div>
  );
}
