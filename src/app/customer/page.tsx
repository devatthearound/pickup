'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const stores = [
  {
    id: 1,
    name: '달콤한 베이커리',
    category: '빵, 케이크, 디저트',
    rating: 4.8,
    reviewCount: 162,
    address: '서울시 마포구 연남로 123길 34',
    image: '/images/bread.jpg',
    isOpen: true,
    minOrderTime: 30
  },
  {
    id: 2,
    name: '신선한 과일가게',
    category: '과일, 채소',
    rating: 4.9,
    reviewCount: 89,
    address: '서울시 마포구 연남로 123길 35',
    image: '/images/fruit.jpg',
    isOpen: true,
    minOrderTime: 20
  },
  {
    id: 3,
    name: '맛있는 커피',
    category: '커피, 음료',
    rating: 4.7,
    reviewCount: 234,
    address: '서울시 마포구 연남로 123길 36',
    image: '/images/coffee.jpg',
    isOpen: true,
    minOrderTime: 15
  }
];

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full bg-gray-50 max-w-md mx-auto pb-20">
      {/* 로고 및 소개 */}
      <div className="bg-white w-full px-4 py-12 text-center">
        <div className="flex justify-center mb-6">
          <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-[#FF7355]">
            <span className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">P</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">PICKUP</h1>
        <p className="text-gray-600">소상공인을 위한 픽업 예약 서비스</p>
      </div>

      {/* 서비스 소개 */}
      <div className="px-4 py-8">
        <div className="bg-white rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">PICKUP으로 시작하세요</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF7355]/10">
                <svg className="w-6 h-6 text-[#FF7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">시간 절약</h3>
                <p className="text-sm text-gray-600">미리 주문하고 정해진 시간에 픽업하세요</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF7355]/10">
                <svg className="w-6 h-6 text-[#FF7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">간편한 결제</h3>
                <p className="text-sm text-gray-600">온라인으로 미리 결제하고 편하게 픽업하세요</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 flex items-center justify-center rounded-full bg-[#FF7355]/10">
                <svg className="w-6 h-6 text-[#FF7355]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium mb-1">대기 시간 없음</h3>
                <p className="text-sm text-gray-600">줄 서지 않고 바로 픽업하세요</p>
              </div>
            </div>
          </div>
        </div>

        {/* 입점 매장 */}
        <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">입점 매장</h2>
          <div className="space-y-4">
            <button 
              onClick={() => router.push('/customer/store/1')}
              className="w-full p-4 bg-gray-50 rounded-xl flex items-center gap-4 hover:bg-gray-100"
            >
              <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                <Image
                  src="/images/donutcamp-logo.jpg"
                  alt="도넛캠프"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-medium">도넛캠프</h3>
                <p className="text-sm text-gray-600">매일 구워내는 따뜻한 도넛</p>
              </div>
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* 입점 시작하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
        <Link
          href="/store-register"
          className="block w-full bg-[#FF7355] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#FF6344] transition-colors text-center"
        >
          입점 시작하기
        </Link>
      </div>

    </div>
  );
} 