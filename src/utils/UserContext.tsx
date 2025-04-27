import React, { createContext, useState, useContext, useRef } from 'react';
import { db } from '../database';
import { User } from '../database/types';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  refreshUser: (userId: number) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  refreshUser: async () => {},
  logout: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Change to false by default
  const isRefreshingRef = useRef<boolean>(false); // Track if refreshUser is already in progress

  const refreshUser = async (userId: number) => {
    // Prevent multiple concurrent refreshUser calls
    if (isRefreshingRef.current) {
      return;
    }

    try {
      isRefreshingRef.current = true;
      setIsLoading(true);

      const userData = await db.getUserById(userId);
      if (userData) {
        setUser(userData as User);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setIsLoading(false);
      isRefreshingRef.current = false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  const contextValue: UserContextType = {
    user,
    isLoading,
    setUser,
    refreshUser,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
