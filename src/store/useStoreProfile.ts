import { create } from 'zustand';

interface StoreProfileState {
  imageUrl: string | null;
  setImageUrl: (url: string | null) => void;
}

export const useStoreProfile = create<StoreProfileState>((set: any) => ({
  imageUrl: null,
  setImageUrl: (url: string | null) => set({ imageUrl: url }),
})); 