// services/api.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Route, Delivery, LoginCredentials } from '../types';

// Configurações da API
const API_CONFIG = {
  baseURL: __DEV__ ? 'http://localhost:3000' : 'https://api.deliveryapp.com',
  timeout: 10000,
};

class ApiService {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  // Gerenciamento de Token
  private async getAuthToken(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem('auth_token');
    } catch (error) {
      console.error('Erro ao buscar token:', error);
      return null;
    }
  }

  private async setAuthToken(token: string): Promise<void> {
    try {
      await AsyncStorage.setItem('auth_token', token);
    } catch (error) {
      console.error('Erro ao salvar token:', error);
    }
  }

  private async removeAuthToken(): Promise<void> {
    try {
      await AsyncStorage.removeItem('auth_token');
    } catch (error) {
      console.error('Erro ao remover token:', error);
    }
  }

  // Método base para requisições
  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<{ data: T; success: boolean; message?: string }> {
    try {
      const token = await this.getAuthToken();
      
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, config);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error);
      
      return {
        data: null as any,
        success: false,
        message: error instanceof Error ? error.message : 'Erro desconhecido',
      };
    }
  }

  // AUTENTICAÇÃO
  async login(credentials: LoginCredentials): Promise<{ 
    data: { user: User; token: string } | null; 
    success: boolean; 
    message?: string;
  }> {
    const response = await this.request<{ user: User; access_token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data.access_token) {
      await this.setAuthToken(response.data.access_token);
      return {
        data: {
          user: response.data.user,
          token: response.data.access_token,
        },
        success: true,
      };
    }

    return response as any;
  }

  async logout(): Promise<void> {
    try {
      // Opcional: notificar o backend sobre o logout
      await this.request('/auth/logout', { method: 'POST' });
    } catch (error) {
      console.warn('Erro ao fazer logout no servidor:', error);
    } finally {
      await this.removeAuthToken();
    }
  }

  async getProfile(): Promise<{ data: User | null; success: boolean; message?: string }> {
    return this.request<User>('/auth/profile');
  }

  // ROTEIROS
  async getRoutes(): Promise<{ data: Route[] | null; success: boolean; message?: string }> {
    return this.request<Route[]>('/routes');
  }

  async getRouteDetails(routeId: number): Promise<{ data: Route | null; success: boolean; message?: string }> {
    return this.request<Route>(`/routes/${routeId}`);
  }

  async startRoute(routeId: number): Promise<{ data: Route | null; success: boolean; message?: string }> {
    return this.request<Route>(`/routes/${routeId}/start`, {
      method: 'PUT',
    });
  }

  async finishRoute(routeId: number): Promise<{ data: Route | null; success: boolean; message?: string }> {
    return this.request<Route>(`/routes/${routeId}/finish`, {
      method: 'PUT',
    });
  }

  // ENTREGAS
  async getDeliveryDetails(deliveryId: number): Promise<{ data: Delivery | null; success: boolean; message?: string }> {
    return this.request<Delivery>(`/deliveries/${deliveryId}`);
  }

  async updateDelivery(
    deliveryId: number, 
    data: { status?: string; driverNotes?: string }
  ): Promise<{ data: Delivery | null; success: boolean; message?: string }> {
    return this.request<Delivery>(`/deliveries/${deliveryId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async uploadEvidence(
    deliveryId: number,
    file: {
      uri: string;
      name: string;
      type: string;
    },
    evidenceType: string,
    description?: string
  ): Promise<{ data: { url: string } | null; success: boolean; message?: string }> {
    try {
      const formData = new FormData();
      
      formData.append('file', {
        uri: file.uri,
        name: file.name,
        type: file.type,
      } as any);
      
      formData.append('type', evidenceType);
      if (description) {
        formData.append('description', description);
      }

      const token = await this.getAuthToken();
      
      const response = await fetch(`${this.baseURL}/deliveries/${deliveryId}/evidence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        data,
        success: true,
      };
    } catch (error) {
      console.error('Upload Error:', error);
      return {
        data: null,
        success: false,
        message: error instanceof Error ? error.message : 'Falha no upload',
      };
    }
  }

  // HISTÓRICO E GANHOS
  async getHistory(period?: 'week' | 'month' | 'all'): Promise<{ data: Route[] | null; success: boolean; message?: string }> {
    const query = period ? `?period=${period}` : '';
    return this.request<Route[]>(`/history${query}`);
  }

  async getEarnings(): Promise<{ data: any | null; success: boolean; message?: string }> {
    return this.request<any>('/earnings');
  }

  // NOTIFICAÇÕES
  async registerPushToken(token: string): Promise<{ data: any | null; success: boolean; message?: string }> {
    return this.request<any>('/notifications/register', {
      method: 'POST',
      body: JSON.stringify({ pushToken: token }),
    });
  }

  async updateNotificationSettings(settings: any): Promise<{ data: any | null; success: boolean; message?: string }> {
    return this.request<any>('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // UTILITÁRIOS
  async checkConnection(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch {
      return false;
    }
  }

  // MODO OFFLINE - Salvar dados localmente
  async saveOfflineData(key: string, data: any): Promise<void> {
    try {
      const offlineKey = `offline_${key}`;
      await AsyncStorage.setItem(offlineKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.error('Erro ao salvar dados offline:', error);
    }
  }

  async getOfflineData<T>(key: string): Promise<T | null> {
    try {
      const offlineKey = `offline_${key}`;
      const stored = await AsyncStorage.getItem(offlineKey);
      
      if (stored) {
        const { data, timestamp } = JSON.parse(stored);
        
        // Dados válidos por 24 horas
        const isValid = Date.now() - timestamp < 24 * 60 * 60 * 1000;
        
        if (isValid) {
          return data;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Erro ao buscar dados offline:', error);
      return null;
    }
  }
}

// Instância singleton
export const api = new ApiService();

// Hook personalizado para usar com React
export const useApi = () => {
  return {
    login: api.login.bind(api),
    logout: api.logout.bind(api),
    getRoutes: api.getRoutes.bind(api),
    getRouteDetails: api.getRouteDetails.bind(api),
    updateDelivery: api.updateDelivery.bind(api),
    uploadEvidence: api.uploadEvidence.bind(api),
    getHistory: api.getHistory.bind(api),
    getEarnings: api.getEarnings.bind(api),
    checkConnection: api.checkConnection.bind(api),
  };
};

export default api;