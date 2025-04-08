import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

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
    const response = await fetch(`${API_BASE_URL}/menu-categories${queryString}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getCategoryById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-categories/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getStoreCategories: async (storeId: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-categories/store/${storeId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createCategory: async (storeId: number, data: {
    name: string;
    displayOrder?: number;
    isActive?: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/menu-categories/store/${storeId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateCategory: async (id: number, data: Partial<MenuCategory>) => {
    const response = await fetch(`${API_BASE_URL}/menu-categories/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteCategory: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-categories/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
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
    const response = await fetch(`${API_BASE_URL}/menu-items${queryString}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getMenuItem: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getStoreMenuItems: async (storeId: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/store/${storeId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getCategoryMenuItems: async (categoryId: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/category/${categoryId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getPopularMenuItems: async (storeId: number, limit: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/popular/store/${storeId}?limit=${limit}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getNewMenuItems: async (storeId: number, limit: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/new/store/${storeId}?limit=${limit}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getRecommendedMenuItems: async (storeId: number, limit: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/recommended/store/${storeId}?limit=${limit}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createMenuItem: async (storeId: number, data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/store/${storeId}`, {
      method: 'POST',
      credentials: 'include',
      body: data, // FormData는 자동으로 Content-Type을 설정
    });
    return response.json();
  },

  updateMenuItem: async (id: number, data: FormData) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body: data, // FormData는 자동으로 Content-Type을 설정
    });
    return response.json();
  },

  deleteMenuItem: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  updateMenuStock: async (id: number, stockQuantity: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/${id}/stock`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ stockQuantity }),
    });
    return response.json();
  },

  // 옵션 관련 API
  getOptionGroups: async (params?: {
    page?: number;
    limit?: number;
    storeId?: number;
    isRequired?: boolean;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/options/groups${queryString}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getOptionGroup: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/options/groups/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createOptionGroup: async (storeId: number, data: Partial<OptionGroup>) => {
    const response = await fetch(`${API_BASE_URL}/options/groups/store/${storeId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateOptionGroup: async (id: number, data: Partial<OptionGroup>) => {
    const response = await fetch(`${API_BASE_URL}/options/groups/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteOptionGroup: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/options/groups/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // 옵션 아이템 관련 API
  getOptionItems: async (groupId: number) => {
    const response = await fetch(`${API_BASE_URL}/options/items/group/${groupId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createOptionItem: async (groupId: number, data: Partial<OptionItem>) => {
    const response = await fetch(`${API_BASE_URL}/options/items/group/${groupId}`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateOptionItem: async (id: number, data: Partial<OptionItem>) => {
    const response = await fetch(`${API_BASE_URL}/options/items/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteOptionItem: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/options/items/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // 메뉴-옵션 연결 관련 API
  getMenuOptionGroups: async (menuId: number) => {
    const response = await fetch(`${API_BASE_URL}/options/menu-option-groups/menu/${menuId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createMenuOptionGroup: async (data: { menuId: number; groupId: number }) => {
    const response = await fetch(`${API_BASE_URL}/options/menu-option-groups`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  updateMenuOptionGroup: async (id: number, data: { displayOrder?: number }) => {
    const response = await fetch(`${API_BASE_URL}/options/menu-option-groups/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteMenuOptionGroup: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/options/menu-option-groups/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  // 메뉴 가용성 관련 API
  getMenuAvailability: async (menuId: number, params?: {
    dayOfWeek?: string;
    isAvailable?: boolean;
  }) => {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
    const response = await fetch(`${API_BASE_URL}/menu-items/${menuId}/availability${queryString}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  createMenuAvailability: async (menuId: number, data: {
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/${menuId}/availability`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteAllMenuAvailability: async (menuId: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/${menuId}/availability`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  getAvailabilityById: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/availability/${id}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },

  updateAvailability: async (id: number, data: {
    startTime?: string;
    endTime?: string;
    isAvailable?: boolean;
  }) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/availability/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  deleteAvailability: async (id: number) => {
    const response = await fetch(`${API_BASE_URL}/menu-items/availability/${id}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  },
}; 