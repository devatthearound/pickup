'use client'
// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAxios } from '@/hooks/useAxios';
import { AxiosError } from 'axios';
import { getCookie } from '@/lib/useCookie';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  // 필요한 사용자 정보
}

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  fetchUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const axios = useAxios();

  const fetchUser = async () => {
    try {
      const response = await axios.get(`/init`);
      setUser(response.data.data);
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 401) {
        setUser(null);
        setIsAuthenticated(false);
      } else if (error instanceof AxiosError && error.response && error.response.status === 403) {
        setUser(null);
        setIsAuthenticated(false);
      } else {
        console.error('Error fetching user:', error);
        setUser(null);
        setIsAuthenticated(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    fetchUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
};