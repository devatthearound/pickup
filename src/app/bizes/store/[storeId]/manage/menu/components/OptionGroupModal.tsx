'use client';

import { useState, useEffect } from 'react';
import { HiX } from 'react-icons/hi';
import type { OptionGroup } from '../services/menuService';

interface OptionGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<OptionGroup>) => Promise<void>;
  initialData: OptionGroup | null;
}

export default function OptionGroupModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: OptionGroupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isRequired: false,
    minSelections: 0,
    maxSelections: 1,
    displayOrder: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        isRequired: initialData.isRequired,
        minSelections: initialData.minSelections,
        maxSelections: initialData.maxSelections,
        displayOrder: initialData.displayOrder,
      });
    } else {
      resetForm();
    }
  }, [initialData]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isRequired: false,
      minSelections: 0,
      maxSelections: 1,
      displayOrder: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      resetForm();
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
            {initialData ? '옵션 그룹 수정' : '옵션 그룹 추가'}
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <HiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              그룹명 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
              placeholder="옵션 그룹명을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
              rows={2}
              placeholder="옵션 그룹에 대한 설명을 입력하세요"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRequired"
              checked={formData.isRequired}
              onChange={(e) => setFormData({ ...formData, isRequired: e.target.checked })}
              className="rounded text-[#FF7355] focus:ring-[#FF7355]"
            />
            <label htmlFor="isRequired" className="text-sm font-medium text-gray-700">
              필수 선택
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최소 선택
              </label>
              <input
                type="number"
                value={formData.minSelections}
                onChange={(e) => setFormData({ ...formData, minSelections: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                최대 선택
              </label>
              <input
                type="number"
                value={formData.maxSelections}
                onChange={(e) => setFormData({ ...formData, maxSelections: Number(e.target.value) })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF7355] focus:border-transparent"
                min="1"
              />
            </div>
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

          <div className="flex justify-end gap-3 pt-4">
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