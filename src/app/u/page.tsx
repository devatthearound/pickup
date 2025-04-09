'use client';

import Link from 'next/link';

import { useStoreProfile } from '@/store/useStoreProfile';
import StoreProfileImage from '@/components/StoreProfileImage';

// const stores = [
//   {
//     id: 1,
//     name: '도넛캠프',
//     category: '도넛, 커피, 음료',
//     rating: 4.8,
//     reviewCount: 162,
//     address: '서울시 마포구 연남로 123길 34',
//     image: '/images/donutcamp-logo.jpg',
//     isOpen: true,
//     minOrderTime: 30
//   }
// ];

export default function HomePage() {
  const { imageUrl } = useStoreProfile();

  return (
    <div className="flex flex-col min-h-full bg-gray-50 max-w-md mx-auto pb-20">
      {/* 로고 및 소개 */}
      <div className="bg-white w-full px-4 py-12 text-center">
        <div className="flex justify-center mb-6">
          <StoreProfileImage
            name="PICKUP"
            imageUrl={imageUrl || undefined}
            size="lg"
          />
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
        {/* <div className="bg-white rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">입점 매장</h2>
          <div className="space-y-4">
            {stores.map(store => (
              <Link 
                key={store.id}
                href={`/customer/store/${store.id}`}
                className="block w-full p-4 bg-gray-50 rounded-xl flex items-center gap-4 hover:bg-gray-100"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                  <StoreProfileImage
                    name={store.name}
                    imageUrl={store.image || undefined}
                    size="md"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{store.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {store.rating}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{store.category}</p>
                  <p className="text-sm text-gray-500 mt-1">{store.address}</p>
                </div>
              </Link>
            ))}
          </div>
        </div> */}
      </div>

      {/* 입점 시작하기 버튼 */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 bg-white border-t">
        <Link
          href="/bizes"
          className="block w-full bg-[#FF7355] text-white px-8 py-4 rounded-lg font-medium hover:bg-[#FF6344] transition-colors text-center"
        >
          입점 시작하기
        </Link>
      </div>
    </div>
  );
} 