// contexts/AuthContext.tsx - VERSÃO COM CNPJ
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { User } from '../types';
import { MOCK_USER } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, cnpj: string) => Promise<boolean>; // MODIFICADO
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// MOCK DE EMPRESAS PARA TESTE
const MOCK_COMPANIES = [
  {
    cnpj: '12.345.678/0001-90',
    name: 'Express Delivery Ltda',
    users: [
      {
        ...MOCK_USER,
        companyName: 'Express Delivery Ltda',
        companyCnpj: '12.345.678/0001-90',
      }
    ]
  },
  {
    cnpj: '98.765.432/0001-10',
    name: 'Rápido Transportes S.A.',
    users: [
      {
        id: 2,
        name: 'Maria Santos',
        email: 'maria@exemplo.com',
        phone: '(11) 88888-8888',
        vehicle: 'Yamaha Fazer 250',
        plate: 'XYZ-5678',
        companyName: 'Rápido Transportes S.A.',
        companyCnpj: '98.765.432/0001-10',
      }
    ]
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkStoredUser();
  }, []);

  const checkStoredUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/login');
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      router.replace('/(auth)/login');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string, cnpj: string): Promise<boolean> => {
    try {
      // Remove formatação do CNPJ para busca
      const cleanCnpj = cnpj.replace(/\D/g, '');
      const formattedCnpj = cnpj;

      // Busca empresa pelo CNPJ
      const company = MOCK_COMPANIES.find(c => 
        c.cnpj.replace(/\D/g, '') === cleanCnpj
      );

      if (!company) {
        console.log('Empresa não encontrada para CNPJ:', formattedCnpj);
        return false;
      }

      // Busca usuário dentro da empresa
      const foundUser = company.users.find(u => 
        u.email === email && password === '123456' // Mock password check
      );

      if (!foundUser) {
        console.log('Usuário não encontrado ou senha incorreta');
        return false;
      }

      // Salva dados do usuário com informações da empresa
      const userWithCompany = {
        ...foundUser,
        companyName: company.name,
        companyCnpj: company.cnpj,
      };

      await AsyncStorage.setItem('user', JSON.stringify(userWithCompany));
      setUser(userWithCompany);
      router.replace('/(tabs)');
      return true;

    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Erro no logout:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};