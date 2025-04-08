'use client';

import { useState, useEffect } from 'react';
import { HiX, HiUpload } from 'react-icons/hi';
import Image from 'next/image';
import type { MenuItem, MenuCategory } from '../services/menuService';
import { Tab } from '@headlessui/react';
import OptionManagement from './OptionManagement';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => Promise<void>;
  categories: MenuCategory[];
  initialData: MenuItem | null;
}

export default function MenuModal({ isOpen, onClose, onSubmit, categories, initialData }: MenuModalProps) {
  console.log('MenuModal categories:', categories);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountedPrice: '',
    categoryId: '',
    preparationTime: '',
    isPopular: false,
    isNew: false,
    isRecommended: false,
    stockQuantity: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = ['기본 정보', '옵션 관리'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        price: String(initialData.price),
        discountedPrice: initialData.discountedPrice ? String(initialData.discountedPrice) : '',
        categoryId: String(initialData.categoryId),
        preparationTime: initialData.preparationTime ? String(initialData.preparationTime) : '',
        isPopular: initialData.isPopular,
        isNew: initialData.isNew,
        isRecommended: initialData.isRecommended,
        stockQuantity: initialData.stockQuantity ? String(initialData.stockQuantity) : '',
      });
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    } else {
      resetForm();
    }
  }, [initialData]);

  useEffect(() => {
    console.log('MenuModal categories updated:', categories);
  }, [categories]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountedPrice: '',
      categoryId: '',
      preparationTime: '',
      isPopular: false,
      isNew: false,
      isRecommended: false,
      stockQuantity: '',
    });
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSubmit = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== '') {
          formDataToSubmit.append(key, value.toString());
        }
      });
      
      if (imageFile) {
        formDataToSubmit.append('image', imageFile);
      }

      await onSubmit(formDataToSubmit);
      resetForm();
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {initialData ? '메뉴 수정' : '새 메뉴 등록'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <HiX size={20} />
          </button>
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-6">
            {tabs.map((tab) => (
              <Tab
                key={tab}
                className={({ selected }) =>
                  `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                  ${
                    selected
                      ? 'bg-white text-[#FF7355] shadow'
                      : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-900'
                  }`
                }
              >
                {tab}
              </Tab>
            ))}
          </Tab.List>
          <Tab.Panels>
            {/* 기본 정보 탭 */}
            <Tab.Panel>
              <form id="menuForm" onSubmit={handleSubmit} className="space-y-6">
                {/* 이미지 업로드 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    메뉴 이미지
                  </label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    {imagePreview ? (
                      <div className="relative w-full h-48">
                        <Image
                          src={imagePreview}
                          alt="Preview"
                          fill
                          className="object-contain"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <HiUpload size={24} className="text-gray-400" />
                        <span className="text-sm text-gray-500 mt-2">
                          이미지를 선택하거나 드래그하세요
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                      id="menuImage"
                    />
                    <label
                      htmlFor="menuImage"
                      className="mt-4 inline-block px-4 py-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200"
                    >
                      이미지 선택
                    </label>
                  </div>
                </div>

                {/* 기본 정보 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      메뉴명 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      가격 *
                    </label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      할인 가격
                    </label>
                    <input
                      type="number"
                      value={formData.discountedPrice}
                      onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리 * (총 {categories?.length || 0}개)
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                      required
                    >
                      <option value="">카테고리 선택</option>
                      {categories?.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      준비 시간 (분)
                    </label>
                    <input
                      type="number"
                      value={formData.preparationTime}
                      onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      메뉴 설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      재고 수량
                    </label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                    />
                  </div>

                  {/* 메뉴 상태 */}
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isPopular}
                        onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                        className="rounded text-[#FF7355] focus:ring-[#FF7355]"
                      />
                      <span className="text-sm">인기</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isNew}
                        onChange={(e) => setFormData({ ...formData, isNew: e.target.checked })}
                        className="rounded text-[#FF7355] focus:ring-[#FF7355]"
                      />
                      <span className="text-sm">신메뉴</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isRecommended}
                        onChange={(e) => setFormData({ ...formData, isRecommended: e.target.checked })}
                        className="rounded text-[#FF7355] focus:ring-[#FF7355]"
                      />
                      <span className="text-sm">추천</span>
                    </label>
                  </div>
                </div>
              </form>
            </Tab.Panel>

            {/* 옵션 관리 탭 */}
            <Tab.Panel>
              {initialData ? (
                <OptionManagement
                  storeId={Number(initialData.storeId)}
                  menuId={initialData.id}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  메뉴를 먼저 저장해주세요
                </div>
              )}
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>

        {/* 하단 버튼 */}
        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            취소
          </button>
          <button
            type="submit"
            form="menuForm"
            disabled={isSubmitting}
            className="px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF8365] disabled:opacity-50"
          >
            {isSubmitting ? '처리중...' : initialData ? '수정' : '등록'}
          </button>
        </div>
      </div>
    </div>
  );
} 