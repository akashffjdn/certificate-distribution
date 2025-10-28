import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (idCard: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    role: 'staff',
    id_card_no: 'ST001',
    name: 'Dr. Priya Sharma',
    dept: 'Computer Science',
    email: 'priya.sharma@college.edu',
    phone: '+91 9876543210',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    role: 'student',
    id_card_no: 'CS2101',
    reg_no: '21CS001',
    name: 'Arjun Patel',
    dept: 'Computer Science',
    program: 'B.Tech Computer Science',
    year: 3,
    email: 'arjun.patel@student.college.edu',
    phone: '+91 9876543211',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    role: 'student',
    id_card_no: 'EC2102',
    reg_no: '21EC015',
    name: 'Sneha Reddy',
    dept: 'Electronics',
    program: 'B.Tech Electronics',
    year: 3,
    email: 'sneha.reddy@student.college.edu',
    phone: '+91 9876543212',
    status: 'active',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('college_cert_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({ user, isLoading: false, error: null });
      } catch (error) {
        localStorage.removeItem('college_cert_user');
        setAuthState({ user: null, isLoading: false, error: null });
      }
    } else {
      setAuthState({ user: null, isLoading: false, error: null });
    }
  }, []);

  const login = async (idCard: string, password: string): Promise<void> => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user by ID card
      const user = mockUsers.find(u => u.id_card_no === idCard);
      
      if (!user) {
        throw new Error('ID or password incorrect.');
      }
      
      // In real implementation, verify password hash
      if (password !== 'password') {
        throw new Error('ID or password incorrect.');
      }
      
      localStorage.setItem('college_cert_user', JSON.stringify(user));
      setAuthState({ user, isLoading: false, error: null });
    } catch (error) {
      setAuthState({ 
        user: null, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('college_cert_user');
    setAuthState({ user: null, isLoading: false, error: null });
  };

  const updateUser = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates };
      localStorage.setItem('college_cert_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
    }
  };

  const value = {
    ...authState,
    login,
    logout,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}