'use client';

import { useAxios } from '@/hooks/useAxios';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface Store {
  id: string;
  name: string;
  english_name: string;
  category: string;
  address: string;
  logo_image: string;
  is_active: boolean;
  is_verified: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: Store[];
}

export default function StoreMainPage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const axiosInstance = useAxios();

  useEffect(() => {
    fetchStores();
  }, []);

  useEffect(() => {
    // 가게가 하나만 있는 경우 자동으로 해당 가게의 관리 페이지로 이동
    if (stores.length > 0) {
      router.push(`/bizes/store/${stores[0].id}/manage/orders`);
    }
  }, [stores, router]);

  const fetchStores = async () => {
    try {
      console.log('스토어 목록 요청 시작');
      const response = await axiosInstance.get('/stores/owner/my-stores');
      console.log('스토어 목록 응답:', response.status);

      const result: ApiResponse = await response.data;
      
      if (response.status !== 200) {
        setError('스토어 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
        return;
      }

      setStores(result.data);
      console.log('스토어 목록 설정 완료:', result.data.length);
    } catch (error) {
      console.error('스토어 정보 조회 실패:', error);
      const axiosError = error as { response?: { status?: number } };
      if (axiosError.response?.status === 401) {
        setError('로그인이 필요합니다. 다시 로그인해주세요.');
      } else if (axiosError.response?.status === 403) {
        setError('접근 권한이 없습니다. 관리자에게 문의해주세요.');
      } else if (axiosError.response?.status === 404) {
        setError('요청하신 정보를 찾을 수 없습니다.');
      } else if (axiosError.response?.status === 500) {
        setError('서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      } else {
        setError('스토어 정보를 불러오는 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto mt-20 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-6xl mb-4">⚠️</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              오류가 발생했습니다
            </h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => fetchStores()}
              className="w-full py-3 px-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
            >
              다시 시도하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (stores.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-md mx-auto mt-20 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="text-6xl mb-4">🏪</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              아직 등록된 스토어가 없습니다
            </h1>
            <p className="text-gray-600 mb-8">
              지금 바로 스토어를 등록하고 관리를 시작해보세요!
            </p>
            <button
              onClick={() => router.push('/bizes/store/add')}
              className="w-full py-3 px-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
            >
              스토어 등록하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return(
    // 페이지 이동 중
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF7355]"></div>
    </div>
  )
  // 스토어가 여러 개인 경우 목록 표시
  // return (
  //   <div className="min-h-screen bg-gray-50">
  //     {/* 헤더 */}
  //     <div className="bg-[#FF7355] px-4 py-6">
  //       <div className="max-w-md mx-auto">
  //         <h1 className="text-white text-xl font-medium">내 스토어 관리</h1>
  //         <p className="text-white/80 text-sm mt-1">
  //           등록된 스토어를 관리할 수 있습니다
  //         </p>
  //       </div>
  //     </div>

  //     {/* 스토어 목록 */}
  //     <div className="max-w-md mx-auto p-4">
  //       <div className="space-y-4">
  //         {stores.map((store) => (
  //           <div
  //             key={store.id}
  //             className="bg-white rounded-lg shadow-sm overflow-hidden"
  //           >
  //             <div className="p-4">
  //               <div className="flex items-center gap-4">
  //                 {store.logo_image ? (
  //                   <Image
  //                     src={store.logo_image}
  //                     alt={store.name}
  //                     className="w-16 h-16 rounded-lg object-cover"
  //                   />
  //                 ) : (
  //                   <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
  //                     <span className="text-2xl">🏪</span>
  //                   </div>
  //                 )}
  //                 <div className="flex-1">
  //                   <h2 className="text-lg font-medium text-gray-900">
  //                     {store.name}
  //                   </h2>
  //                   <p className="text-sm text-gray-500">{store.english_name}</p>
  //                   <p className="text-sm text-gray-500 mt-1">{store.address}</p>
  //                 </div>
  //               </div>

  //               <div className="mt-4 flex items-center gap-2">
  //                 {store.is_verified && (
  //                   <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
  //                     인증완료
  //                   </span>
  //                 )}
  //                 <span
  //                   className={`px-2 py-1 text-xs rounded-full ${
  //                     store.is_active
  //                       ? 'bg-green-50 text-green-700'
  //                       : 'bg-gray-50 text-gray-700'
  //                   }`}
  //                 >
  //                   {store.is_active ? '영업중' : '영업종료'}
  //                 </span>
  //               </div>

  //               <button
  //                 onClick={() => router.push(`/bizes/store/${store.id}/manage/orders`)}
  //                 className="mt-4 w-full py-2 px-4 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
  //               >
  //                 스토어 관리하기
  //               </button>
  //             </div>
  //           </div>
  //         ))}
  //       </div>

  //       {/* 새 스토어 등록 버튼 */}
  //       <button
  //         onClick={() => router.push('/bizes/store/add')}
  //         className="mt-6 w-full py-3 px-4 bg-white border-2 border-[#FF7355] text-[#FF7355] rounded-lg font-medium hover:bg-[#FF7355] hover:text-white transition-colors"
  //       >
  //         + 새 스토어 등록하기
  //       </button>
  //     </div>
  //   </div>
  // );
} 