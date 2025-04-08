'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { HiPlus, HiPencil, HiTrash, HiOutlineExclamationCircle } from 'react-icons/hi';
import { menuService } from './services/menuService';
import { toast } from 'react-hot-toast';
import CategoryModal from './components/CategoryModal';
import MenuModal from './components/MenuModal'
import DeleteConfirmDialog from './components/DeleteConfirmDialog';
import type { MenuItem, MenuCategory } from './services/menuService';

export default function MenuManagePage() {
  const { storeId } = useParams();
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  
  // 모달 상태
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  
  // 삭제 다이얼로그 상태
  const [deleteDialogConfig, setDeleteDialogConfig] = useState<{
    isOpen: boolean;
    type: 'category' | 'menu';
    id: number | null;
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'menu',
    id: null,
    title: '',
    message: '',
  });

  // 카테고리 목록 로드
  const loadCategories = async () => {
    try {
      const response = await menuService.getStoreCategories(Number(storeId));
      console.log('카테고리 응답:', response);
      if (response.success && Array.isArray(response.data)) {
        setCategories(response.data);
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('카테고리 로드 에러:', error);
      toast.error('카테고리 목록을 불러오는데 실패했습니다.');
      setCategories([]);
    }
  };

  // 메뉴 목록 로드
  const loadMenuItems = async () => {
    try {
      setIsLoading(true);
      const params: any = {
        storeId: Number(storeId),
      };

      if (selectedCategory !== 'all') {
        params.categoryId = Number(selectedCategory);
      }

      if (filterStatus !== 'all') {
        params.isAvailable = filterStatus === 'available';
      }

      const response = await menuService.getMenuItems(params);
      console.log('메뉴 응답:', response);
      const items = response.data.data.map((item: any) => ({
        ...item,
        isAvailable: item.isAvailable === true,
      }));
      setMenuItems(items);
    } catch (error) {
      console.error('메뉴 로드 에러:', error);
      toast.error('메뉴 목록을 불러오는데 실패했습니다.');
      setMenuItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 카테고리 추가/수정
  const handleCategorySubmit = async (data: { name: string; displayOrder?: number }) => {
    try {
      if (editingCategory) {
        await menuService.updateCategory(editingCategory.id, data);
        toast.success('카테고리가 수정되었습니다.');
      } else {
        await menuService.createCategory(Number(storeId), data);
        toast.success('카테고리가 추가되었습니다.');
      }
      setIsCategoryModalOpen(false);
      setEditingCategory(null);
      loadCategories();
    } catch (error) {
      toast.error('카테고리 저장에 실패했습니다.');
    }
  };

  // 카테고리 삭제
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      await menuService.deleteCategory(categoryId);
      toast.success('카테고리가 삭제되었습니다.');
      loadCategories();
      if (selectedCategory === String(categoryId)) {
        setSelectedCategory('all');
      }
    } catch (error) {
      toast.error('카테고리 삭제에 실패했습니다.');
    }
  };

  // 메뉴 추가/수정
  const handleMenuSubmit = async (formData: FormData) => {
    try {
      if (editingMenuItem) {
        await menuService.updateMenuItem(editingMenuItem.id, formData);
        toast.success('메뉴가 수정되었습니다.');
      } else {
        await menuService.createMenuItem(Number(storeId), formData);
        toast.success('메뉴가 추가되었습니다.');
      }
      setIsMenuModalOpen(false);
      setEditingMenuItem(null);
      loadMenuItems();
    } catch (error) {
      toast.error('메뉴 저장에 실패했습니다.');
    }
  };

  // 메뉴 삭제
  const handleDeleteMenu = async (menuId: number) => {
    try {
      await menuService.deleteMenuItem(menuId);
      toast.success('메뉴가 삭제되었습니다.');
      loadMenuItems();
    } catch (error) {
      toast.error('메뉴 삭제에 실패했습니다.');
    }
  };

  // 삭제 다이얼로그 열기
  const openDeleteDialog = (type: 'category' | 'menu', id: number, name: string) => {
    setDeleteDialogConfig({
      isOpen: true,
      type,
      id,
      title: `${type === 'category' ? '카테고리' : '메뉴'} 삭제`,
      message: `"${name}"${type === 'category' ? ' 카테고리' : ''}를 삭제하시겠습니까?`,
    });
  };

  // 삭제 확인
  const handleDeleteConfirm = async () => {
    if (!deleteDialogConfig.id) return;
    
    if (deleteDialogConfig.type === 'category') {
      await handleDeleteCategory(deleteDialogConfig.id);
    } else {
      await handleDeleteMenu(deleteDialogConfig.id);
    }
  };

  // 모달 상태가 변경될 때마다 카테고리 로드
  useEffect(() => {
    if (isMenuModalOpen) {
      loadCategories();
    }
  }, [isMenuModalOpen]);

  // 초기 데이터 로드
  useEffect(() => {
    loadCategories();
  }, []);

  // 필터 변경시 메뉴 목록 새로고침
  useEffect(() => {
    loadMenuItems();
  }, [selectedCategory, filterStatus, sortBy, searchQuery]);

  return (
    <div className="p-6">
      {/* 상단 헤더 */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">메뉴 관리</h1>
          <p className="text-gray-600 mt-1">메뉴와 카테고리를 관리할 수 있습니다.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setIsCategoryModalOpen(true)}
            className="flex items-center px-4 py-2 text-gray-700 bg-white border rounded-lg hover:bg-gray-50"
          >
            <HiPlus className="mr-2" />
            카테고리 추가
          </button>
          <button
            onClick={() => setIsMenuModalOpen(true)}
            className="flex items-center px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF8365]"
          >
            <HiPlus className="mr-2" />
            새 메뉴 등록
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 mt-6">
        {/* 좌측 카테고리 패널 */}
        <div className="col-span-3">
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-semibold text-gray-900 mb-4">카테고리</h2>
            <ul className="space-y-1">
              <li 
                className={`px-4 py-2 rounded-lg cursor-pointer ${
                  selectedCategory === 'all' ? 'bg-[#FF7355] text-white' : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedCategory('all')}
              >
                전체 메뉴
              </li>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer ${
                    selectedCategory === String(category.id) ? 'bg-[#FF7355] text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  <span
                    className="flex-1"
                    onClick={() => setSelectedCategory(String(category.id))}
                  >
                    {category.name}
                  </span>
                  <div className="flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingCategory(category);
                        setIsCategoryModalOpen(true);
                      }}
                      className="p-1 rounded hover:bg-white/20"
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        openDeleteDialog('category', category.id, category.name);
                      }}
                      className="p-1 rounded hover:bg-white/20"
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 우측 메뉴 목록 */}
        <div className="col-span-9">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#FF7355] mx-auto"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {menuItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm p-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <HiOutlineExclamationCircle size={24} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{item.description || '-'}</p>
                          <div className="mt-2 space-y-1 text-sm">
                            <div>
                              <span className="text-[#FF7355] font-medium">
                                {Math.floor(Number(item.price)).toLocaleString()}원
                              </span>
                              {item.discountedPrice && (
                                <span className="text-gray-400 line-through ml-2">
                                  {Math.floor(Number(item.discountedPrice)).toLocaleString()}원
                                </span>
                              )}
                            </div>
                            <div className="text-gray-600">
                              <span>카테고리: {item.category?.name || '-'}</span>
                            </div>
                            <div className="text-gray-600">
                              <span>준비시간: {item.preparationTime ? `${item.preparationTime}분` : '-'}</span>
                            </div>
                            <div className="text-gray-600">
                              <span>재고: {item.stockQuantity || '-'}</span>
                            </div>
                            <div className="text-gray-600">
                              <span>표시 순서: {item.displayOrder}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.isPopular && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded">
                              인기
                            </span>
                          )}
                          {item.isNew && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded">
                              신메뉴
                            </span>
                          )}
                          {item.isRecommended && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-600 rounded">
                              추천
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex gap-2">
                          <button 
                            onClick={async () => {
                              await loadCategories();
                              setEditingMenuItem(item);
                              setIsMenuModalOpen(true);
                            }}
                            className="p-2 text-sm border rounded-lg hover:bg-gray-50"
                          >
                            <HiPencil className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => openDeleteDialog('menu', item.id, item.name)}
                            className="p-2 text-sm border rounded-lg hover:bg-gray-50 text-red-500"
                          >
                            <HiTrash className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">
                            {new Date(item.updatedAt).toLocaleDateString()}
                          </span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="sr-only peer" 
                              checked={item.isAvailable === true}
                              onChange={async () => {
                                try {
                                  const formData = new FormData();
                                  formData.append('isAvailable', (!item.isAvailable).toString());
                                  await menuService.updateMenuItem(item.id, formData);
                                  await loadMenuItems();
                                } catch (error) {
                                  toast.error('상태 변경에 실패했습니다.');
                                }
                              }}
                            />
                            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF7355]"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 모달 및 다이얼로그 */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleCategorySubmit}
        initialData={editingCategory}
      />

      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => {
          setIsMenuModalOpen(false);
          setEditingMenuItem(null);
        }}
        onSubmit={handleMenuSubmit}
        categories={categories}
        initialData={editingMenuItem}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogConfig.isOpen}
        onClose={() => setDeleteDialogConfig(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleDeleteConfirm}
        title={deleteDialogConfig.title}
        message={deleteDialogConfig.message}
      />
    </div>
  );
} 