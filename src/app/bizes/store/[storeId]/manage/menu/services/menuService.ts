import { useAxios } from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
const API_BASE_URL = '';

export interface MenuCategory {
  id: number;
  name: string;
  displayOrder: number;
  isActive: boolean;
  storeId: number;
}

export type MenuItem = {
  id: number;
  storeId: number;
  categoryId?: number;
  name: string;
  description?: string;
  price: number;
  discountedPrice?: number;
  preparationTime?: number;
  isAvailable: boolean;
  isPopular: boolean;
  isNew: boolean;
  isRecommended: boolean;
  stockQuantity?: number;
  displayOrder: number;
  imageUrl?: string;
  updatedAt?: string;
  createdAt?: string;
  category?: {
    id: number;
    name: string;
  };
  categories?: {
    id: number;
    name: string;
  }[];
  menuItemCategories?: {
    id: number;
    displayOrder: number;
    category: {
      id: number;
      name: string;
    };
  }[];
};

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

export const useMenuService = () => {
  const axiosInstance = useAxios();
  const router = useRouter();

  return {
    // 메뉴 카테고리 관련 API
    getCategories: async (params?: {
      page?: number;
      limit?: number;
      isActive?: boolean;
      storeId?: number;
    }) => {
      try {
        const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-categories${queryString}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    getCategoryById: async (id: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-categories/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    getStoreCategories: async (storeId: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-categories/store/${storeId}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    createCategory: async (storeId: number, data: {
      name: string;
      displayOrder?: number;
      isActive?: boolean;
    }) => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/menu-categories/store/${storeId}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    updateCategory: async (id: number, data: Partial<MenuCategory>) => {
      try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/menu-categories/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    deleteCategory: async (id: number) => {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/menu-categories/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
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
      try {
        const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items${queryString}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    getMenuItem: async (id: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    getStoreMenuItems: async (storeId: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/store/${storeId}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    getCategoryMenuItems: async (categoryId: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/category/${categoryId}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    getPopularMenuItems: async (storeId: number, limit: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/popular/store/${storeId}?limit=${limit}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    getNewMenuItems: async (storeId: number, limit: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/new/store/${storeId}?limit=${limit}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    getRecommendedMenuItems: async (storeId: number, limit: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/recommended/store/${storeId}?limit=${limit}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    createMenuItem: async (storeId: number, data: FormData) => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/menu-items/store/${storeId}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    updateMenuItem: async (id: number, data: FormData) => {
      try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/menu-items/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    deleteMenuItem: async (id: number) => {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/menu-items/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    updateMenuStock: async (id: number, stockQuantity: number) => {
      try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/menu-items/${id}/stock`, stockQuantity);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    // 옵션 관련 API
    getOptionGroups: async (params?: {
      page?: number;
      limit?: number;
      storeId?: number;
      isRequired?: boolean;
    }) => {
      try {
        const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
        const response = await axiosInstance.get(`${API_BASE_URL}/options/groups${queryString}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    getOptionGroup: async (id: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/options/groups/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    createOptionGroup: async (storeId: number, data: Partial<OptionGroup>) => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/options/groups/store/${storeId}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    updateOptionGroup: async (id: number, data: Partial<OptionGroup>) => {
      try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/options/groups/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    deleteOptionGroup: async (id: number) => {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/options/groups/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    // 옵션 아이템 관련 API
    getOptionItems: async (groupId: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/options/items/group/${groupId}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    createOptionItem: async (groupId: number, data: Partial<OptionItem>) => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/options/items/group/${groupId}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    updateOptionItem: async (id: number, data: Partial<OptionItem>) => {
      try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/options/items/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    deleteOptionItem: async (id: number) => {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/options/items/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    // 메뉴-옵션 연결 관련 API
    getMenuOptionGroups: async (menuId: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/options/menu-option-groups/menu/${menuId}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    createMenuOptionGroup: async (data: { menuId: number; groupId: number }) => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/options/menu-option-groups`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    updateMenuOptionGroup: async (id: number, data: { displayOrder?: number }) => {
      try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/options/menu-option-groups/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
    deleteMenuOptionGroup: async (id: number) => {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/options/menu-option-groups/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },

    // 메뉴 가용성 관련 API
    getMenuAvailability: async (menuId: number, params?: {
      dayOfWeek?: string;
      isAvailable?: boolean;
    }) => {
      const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : '';
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/${menuId}/availability${queryString}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
      }
      }
    },

    createMenuAvailability: async (menuId: number, data: {
      dayOfWeek: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }) => {
      try {
        const response = await axiosInstance.post(`${API_BASE_URL}/menu-items/${menuId}/availability`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
      }
      }
    },

    deleteAllMenuAvailability: async (menuId: number) => {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/menu-items/${menuId}/availability`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
      }
      }
    },

    getAvailabilityById: async (id: number) => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/menu-items/availability/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
      }
      }
    },

    updateAvailability: async (id: number, data: {
      startTime?: string;
      endTime?: string;
      isAvailable?: boolean;
    }) => {
      try {
        const response = await axiosInstance.patch(`${API_BASE_URL}/menu-items/availability/${id}`, data);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
      }
      }
    },

    deleteAvailability: async (id: number) => {
      try {
        const response = await axiosInstance.delete(`${API_BASE_URL}/menu-items/availability/${id}`);
        return response.data;
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 401) {
          router.push('/bizes/login');
          return;
        }
      }
    },
  };
}; 