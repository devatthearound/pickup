'use client';

import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import type { MenuCategory } from '../services/menuService';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; displayOrder?: number }) => Promise<void>;
  initialData: MenuCategory | null;
}

export default function CategoryModal({ isOpen, onClose, onSubmit, initialData }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    displayOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        displayOrder: initialData.displayOrder,
      });
    } else {
      setFormData({
        name: '',
        displayOrder: 0,
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', displayOrder: 0 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {initialData ? '카테고리 수정' : '카테고리 추가'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <HiX size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                카테고리명 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                placeholder="카테고리명을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                표시 순서
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                min="0"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF8365] disabled:opacity-50"
            >
              {isSubmitting ? '처리중...' : initialData ? '수정' : '추가'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 