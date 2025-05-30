import React, {
  createContext,
  useState,
  useContext,
  useRef,
  useCallback,
} from 'react';
import {db} from '../database';
import {User} from '../database/types';

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: User) => void;
  refreshUser: (userId: number) => Promise<void>;
  logout: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: true,
  setUser: () => {},
  updateUser: () => {},
  refreshUser: async () => {},
  logout: () => {},
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isRefreshingRef = useRef<boolean>(false);

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);

    if (updatedUser.id) {
      db.updateUser(updatedUser).catch(error => {
        console.error('Error updating user:', error);
      });
    }
  };

  const refreshUser = useCallback(async (userId: number) => {
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
  }, []);

  const logout = () => {
    setUser(null);
  };

  const contextValue: UserContextType = {
    user,
    isLoading,
    setUser,
    updateUser,
    refreshUser,
    logout,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
