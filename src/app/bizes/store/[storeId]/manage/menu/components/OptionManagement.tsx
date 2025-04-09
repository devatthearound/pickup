'use client';

import { useState, useEffect } from 'react';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi';
import { menuService, OptionGroup, OptionItem } from '../services/menuService';
import { toast } from 'react-hot-toast';
import OptionGroupModal from './OptionGroupModal';
import OptionItemModal from './OptionItemModal';

interface OptionManagementProps {
  storeId: number;
  menuId: number;
}

export default function OptionManagement({ storeId, menuId }: OptionManagementProps) {
  const [optionGroups, setOptionGroups] = useState<OptionGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<OptionGroup | null>(null);
  const [optionItems, setOptionItems] = useState<OptionItem[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<OptionGroup | null>(null);
  const [editingItem, setEditingItem] = useState<OptionItem | null>(null);

  // 옵션 그룹 목록 로드
  const loadOptionGroups = async () => {
    try {
      const response = await menuService.getMenuOptionGroups(menuId);
      setOptionGroups(response.data);
      if (response.data.length > 0 && !selectedGroup) {
        setSelectedGroup(response.data[0]);
      }
    } catch (error:unknown) {
      toast.error('옵션 그룹 목록을 불러오는데 실패했습니다.');
    }
  };

  // 옵션 아이템 목록 로드
  const loadOptionItems = async (groupId: number) => {
    try {
      const response = await menuService.getOptionItems(groupId);
      setOptionItems(response.data);
    } catch (error:unknown) {
      toast.error('옵션 항목 목록을 불러오는데 실패했습니다.');
    }
  };

  // 옵션 그룹 생성/수정
  const handleGroupSubmit = async (data: Partial<OptionGroup>) => {
    try {
      if (editingGroup) {
        await menuService.updateOptionGroup(editingGroup.id, data);
        toast.success('옵션 그룹이 수정되었습니다.');
      } else {
        await menuService.createOptionGroup(storeId, data);
        toast.success('옵션 그룹이 생성되었습니다.');
      }
      setIsGroupModalOpen(false);
      setEditingGroup(null);
      loadOptionGroups();
    } catch (error:unknown) {
      toast.error('옵션 그룹 저장에 실패했습니다.');
    }
  };

  // 옵션 그룹 삭제
  const handleDeleteGroup = async (groupId: number) => {
    if (!confirm('이 옵션 그룹을 삭제하시겠습니까?')) return;
    try {
      await menuService.deleteOptionGroup(groupId);
      toast.success('옵션 그룹이 삭제되었습니다.');
      loadOptionGroups();
      if (selectedGroup?.id === groupId) {
        setSelectedGroup(null);
        setOptionItems([]);
      }
    } catch (error:unknown) {
      toast.error('옵션 그룹 삭제에 실패했습니다.');
    }
  };

  // 옵션 아이템 생성/수정
  const handleItemSubmit = async (data: Partial<OptionItem>) => {
    if (!selectedGroup) return;
    try {
      if (editingItem) {
        await menuService.updateOptionItem(editingItem.id, data);
        toast.success('옵션 항목이 수정되었습니다.');
      } else {
        await menuService.createOptionItem(selectedGroup.id, data);
        toast.success('옵션 항목이 생성되었습니다.');
      }
      setIsItemModalOpen(false);
      setEditingItem(null);
      loadOptionItems(selectedGroup.id);
    } catch (error:unknown) {
      toast.error('옵션 항목 저장에 실패했습니다.');
    }
  };

  // 옵션 아이템 삭제
  const handleDeleteItem = async (itemId: number) => {
    if (!confirm('이 옵션 항목을 삭제하시겠습니까?')) return;
    try {
      await menuService.deleteOptionItem(itemId);
      toast.success('옵션 항목이 삭제되었습니다.');
      if (selectedGroup) {
        loadOptionItems(selectedGroup.id);
      }
    } catch (error:unknown) {
      toast.error('옵션 항목 삭제에 실패했습니다.');
    }
  };

  useEffect(() => {
    loadOptionGroups();
  }, []);

  useEffect(() => {
    if (selectedGroup) {
      loadOptionItems(selectedGroup.id);
    }
  }, [selectedGroup]);

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">옵션 관리</h2>
        <button
          onClick={() => setIsGroupModalOpen(true)}
          className="flex items-center px-4 py-2 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF8365]"
        >
          <HiPlus className="mr-2" />
          옵션 그룹 추가
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* 옵션 그룹 목록 */}
        <div className="col-span-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium mb-4">옵션 그룹</h3>
            <ul className="space-y-2">
              {optionGroups.map((group) => (
                <li
                  key={group.id}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer ${
                    selectedGroup?.id === group.id ? 'bg-[#FF7355] text-white' : 'bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => setSelectedGroup(group)}
                >
                  <div>
                    <div className="font-medium">{group.name}</div>
                    <div className="text-sm opacity-80">
                      {group.isRequired ? '필수' : '선택'} ({group.minSelections}-{group.maxSelections}개)
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingGroup(group);
                        setIsGroupModalOpen(true);
                      }}
                      className={`p-1 rounded ${
                        selectedGroup?.id === group.id ? 'hover:bg-[#FF8365]' : 'hover:bg-gray-100'
                      }`}
                    >
                      <HiPencil size={16} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteGroup(group.id);
                      }}
                      className={`p-1 rounded ${
                        selectedGroup?.id === group.id ? 'hover:bg-[#FF8365]' : 'hover:bg-gray-100'
                      }`}
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 옵션 아이템 목록 */}
        <div className="col-span-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">
                {selectedGroup ? `${selectedGroup.name} 옵션 항목` : '옵션 항목'}
              </h3>
              {selectedGroup && (
                <button
                  onClick={() => setIsItemModalOpen(true)}
                  className="flex items-center px-3 py-1.5 bg-[#FF7355] text-white rounded-lg hover:bg-[#FF8365]"
                >
                  <HiPlus className="mr-1" />
                  옵션 추가
                </button>
              )}
            </div>
            {selectedGroup ? (
              <div className="space-y-2">
                {optionItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 bg-white rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">
                        +{item.price.toLocaleString()}원
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setIsItemModalOpen(true);
                        }}
                        className="p-1.5 hover:bg-gray-100 rounded"
                      >
                        <HiPencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 hover:bg-gray-100 rounded text-red-500"
                      >
                        <HiTrash size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                옵션 그룹을 선택해주세요
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 모달 */}
      <OptionGroupModal
        isOpen={isGroupModalOpen}
        onClose={() => {
          setIsGroupModalOpen(false);
          setEditingGroup(null);
        }}
        onSubmit={handleGroupSubmit}
        initialData={editingGroup}
      />

      <OptionItemModal
        isOpen={isItemModalOpen}
        onClose={() => {
          setIsItemModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleItemSubmit}
        initialData={editingItem}
      />
    </div>
  );
} 