import axiosInstance from '@/lib/axios-interceptor';
import axios from 'axios';

const API_BASE_URL = '';

export interface MenuCategory {
  id: number;
  name: string;
  displayOrder: number;
  isActive: boolean;
  storeId: number;
}

export interface MenuItem {
  id: number;
  storeId: number;
  categoryId: number;
  category?: {
    id: number;
    name: string;
    description: string | null;
    displayOrder: number;
    isActive: boolean;
  };
  name: string;
  description: string | null;
  price: string;
  discountedPrice: string | null;
  imageUrl: string | null;
  preparationTime: number | null;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isRecommended: boolean;
  stockQuantity: number | null;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OptionGroup {
  id: number;
  name: string;
  description?: string;
  isRequired: boolean;
  minSelections: number;
  maxSelections: number;
  displayOrder: number;
  storeId: number;
}

export interface OptionItem {
  id: number;
  name: string;
  price: number;
  isAvailable: boolean;
  displayOrder: number;
  groupId: number;
}

export const menuService = {
  // 메뉴 카테고리 관련 API
  getCategories: async (params?: {
    page?: number;
    limit?: number;
    isActive?: boolean;
    storeId?: number;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-categories${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getCategoryById: async (id: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-categories/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getStoreCategories: async (storeId: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-categories/store/${storeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  createCategory: async (storeId: number, data: {
    name: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/menu-categories/store/${storeId}`, data);
    return response.data;
  },

  updateCategory: async (id: number, data: Partial<MenuCategory>) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/menu-categories/${id}`, data);
    return response.data;
  },

  deleteCategory: async (id: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/menu-categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 메뉴 아이템 관련 API
  getMenuItems: async (params?: {
    page?: number;
    limit?: number;
    storeId?: number;
    categoryId?: number;
    isAvailable?: boolean;
    isPopular?: boolean;
    isNew?: boolean;
    isRecommended?: boolean;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getMenuItem: async (id: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getStoreMenuItems: async (storeId: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/store/${storeId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getCategoryMenuItems: async (categoryId: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/category/${categoryId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getPopularMenuItems: async (storeId: number, limit: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/popular/store/${storeId}?limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getNewMenuItems: async (storeId: number, limit: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/new/store/${storeId}?limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getRecommendedMenuItems: async (storeId: number, limit: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/recommended/store/${storeId}?limit=${limit}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  createMenuItem: async (storeId: number, data: FormData) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/menu-items/store/${storeId}`, data);
    return response.data;
  },

  updateMenuItem: async (id: number, data: FormData) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/menu-items/${id}`, data);
    return response.data;
  },

  deleteMenuItem: async (id: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  updateMenuStock: async (id: number, stockQuantity: number) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/menu-items/${id}/stock`, stockQuantity);
    return response.data;
  },

  // 옵션 관련 API
  getOptionGroups: async (params?: {
    page?: number;
    limit?: number;
    storeId?: number;
    isRequired?: boolean;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await axiosInstance.get(`${API_BASE_URL}/options/groups${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getOptionGroup: async (id: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/options/groups/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  createOptionGroup: async (storeId: number, data: Partial<OptionGroup>) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/options/groups/store/${storeId}`, data);
    return response.data;
  },

  updateOptionGroup: async (id: number, data: Partial<OptionGroup>) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/options/groups/${id}`, data);
    return response.data;
  },

  deleteOptionGroup: async (id: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/options/groups/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 옵션 아이템 관련 API
  getOptionItems: async (groupId: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/options/items/group/${groupId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  createOptionItem: async (groupId: number, data: Partial<OptionItem>) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/options/items/group/${groupId}`, data);
    return response.data;
  },

  updateOptionItem: async (id: number, data: Partial<OptionItem>) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/options/items/${id}`, data);
    return response.data;
  },

  deleteOptionItem: async (id: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/options/items/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 메뉴-옵션 연결 관련 API
  getMenuOptionGroups: async (menuId: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/options/menu-option-groups/menu/${menuId}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  createMenuOptionGroup: async (data: { menuId: number; groupId: number }) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/options/menu-option-groups`, data);
    return response.data;
  },

  updateMenuOptionGroup: async (id: number, data: { displayOrder?: number }) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/options/menu-option-groups/${id}`, data);
    return response.data;
  },

  deleteMenuOptionGroup: async (id: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/options/menu-option-groups/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  // 메뉴 가용성 관련 API
  getMenuAvailability: async (menuId: number, params?: {
    dayOfWeek?: string;
    isAvailable?: boolean;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/${menuId}/availability${queryString}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  createMenuAvailability: async (menuId: number, data: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }) => {
    const response = await axiosInstance.post(`${API_BASE_URL}/menu-items/${menuId}/availability`, data);
    return response.data;
  },

  deleteAllMenuAvailability: async (menuId: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/menu-items/${menuId}/availability`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  getAvailabilityById: async (id: number) => {
    const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/availability/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  updateAvailability: async (id: number, data: {
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
  }) => {
    const response = await axiosInstance.patch(`${API_BASE_URL}/menu-items/availability/${id}`, data);
    return response.data;
  },

  deleteAvailability: async (id: number) => {
    const response = await axiosInstance.delete(`${API_BASE_URL}/menu-items/availability/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },
}; 