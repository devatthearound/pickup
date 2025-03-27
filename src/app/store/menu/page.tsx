'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
}

export default function MenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newMenuItem, setNewMenuItem] = useState<MenuItem>({
    id: '',
    name: '',
    price: 0,
    description: '',
  });

  const addMenuItem = () => {
    if (newMenuItem.name && newMenuItem.price) {
      setMenuItems([...menuItems, { ...newMenuItem, id: Date.now().toString() }]);
      setNewMenuItem({ id: '', name: '', price: 0, description: '' });
    }
  };

  const handleSave = () => {
    console.log({ menuItems });
    router.push('/store');
  };

  return (
    <div className="min-h-screen">
      {/* 헤더 */}
      <div className="bg-white py-4 px-6 flex items-center justify-between shadow-sm">
        <h1 className="text-xl font-medium">도넛캠프 - 메뉴 관리</h1>
      </div>

      {/* 메뉴 관리 */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">새로운 메뉴 추가</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">메뉴 이름</label>
              <input
                type="text"
                value={newMenuItem.name}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                placeholder="메뉴 이름을 입력하세요"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
              <input
                type="number"
                value={newMenuItem.price || ''}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, price: Number(e.target.value) })}
                placeholder="가격을 입력하세요"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
              <input
                type="text"
                value={newMenuItem.description}
                onChange={(e) => setNewMenuItem({ ...newMenuItem, description: e.target.value })}
                placeholder="메뉴 설명을 입력하세요"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
              />
            </div>
            <button
              onClick={addMenuItem}
              className="w-full py-2 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
            >
              메뉴 추가
            </button>
          </div>
        </div>

        {/* 메뉴 목록 */}
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">메뉴 목록</h2>
          <div className="space-y-4">
            {menuItems.length === 0 ? (
              <div className="text-center py-8 text-gray-500 bg-white rounded-lg shadow-sm">
                등록된 메뉴가 없습니다.
              </div>
            ) : (
              menuItems.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{item.name}</h3>
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    </div>
                    <div className="text-[#FF7355] font-medium">
                      {item.price.toLocaleString()}원
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <button
                      onClick={() => {
                        const updatedItems = menuItems.filter(menuItem => menuItem.id !== item.id);
                        setMenuItems(updatedItems);
                      }}
                      className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 저장 버튼 */}
      <div className="fixed bottom-0 left-0 lg:left-64 right-0 p-4 bg-white border-t">
        <button
          onClick={handleSave}
          className="w-full py-3 bg-[#FF7355] text-white rounded-lg font-medium hover:bg-[#FF6344] transition-colors"
        >
          저장하기
        </button>
      </div>
    </div>
  );
} 