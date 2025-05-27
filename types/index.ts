// types/index.ts - VERSÃO COM EMPRESA/TENANT

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  plate: string;
  // NOVOS CAMPOS PARA MULTITENANCY
  companyName?: string;    // Nome da empresa
  companyCnpj?: string;    // CNPJ da empresa
  tenantId?: number;       // ID do tenant (para backend)
}

export interface Company {
  id: number;
  name: string;
  cnpj: string;
  logo?: string;
  isActive: boolean;
  settings?: CompanySettings;
  createdAt: string;
}

export interface CompanySettings {
  allowedVehicleTypes: string[];
  maxDeliveriesPerRoute: number;
  workingHours: {
    start: string;
    end: string;
  };
  paymentMethods: PaymentMethod[];
  notifications: {
    newRoute: boolean;
    deliveryUpdates: boolean;
    payments: boolean;
  };
}

export type RouteStatus = 'pendente' | 'ativo' | 'finalizado' | 'cancelado';
export type DeliveryStatus = 'pendente' | 'em_andamento' | 'entregue' | 'problema';
export type PaymentMethod = 'Dinheiro' | 'PIX' | 'Cartão' | 'Débito';

export interface Delivery {
  id: number;
  customerName: string;
  address: string;
  phone: string;
  value: number;
  status: DeliveryStatus;
  items: string[];
  notes?: string;
  paymentMethod: PaymentMethod;
  driverNotes?: string;
  // NOVOS CAMPOS
  customerId?: number;     // ID do cliente no sistema
  deliveredAt?: string;    // Timestamp da entrega
  estimatedTime?: number;  // Tempo estimado em minutos
}

export interface Route {
  id: number;
  date: string;
  status: RouteStatus;
  totalValue: number;
  deliveries: Delivery[];
  // NOVOS CAMPOS
  driverId?: number;       // ID do motorista
  companyId?: number;      // ID da empresa
  createdAt?: string;      // Timestamp de criação
  estimatedDuration?: number; // Duração estimada em minutos
}

export interface LoginCredentials {
  email: string;
  password: string;
  cnpj: string;           // NOVO CAMPO OBRIGATÓRIO
}

export interface ApiResponse<T> {
  data: T | null;
  success: boolean;
  message?: string;
}

// NOVOS TIPOS PARA MULTITENANCY

export interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
  email?: string;
  notes?: string;
  companyId: number;      // Isolamento por empresa
  createdAt: string;
}

export interface Evidence {
  id: number;
  deliveryId: number;
  type: 'photo' | 'signature' | 'document';
  url: string;
  description?: string;
  createdAt: string;
}

export interface NotificationSettings {
  newRoutes: boolean;
  deliveryReminders: boolean;
  paymentUpdates: boolean;
  systemMessages: boolean;
}

export interface EarningsData {
  totalMonth: number;
  totalPaid: number;
  totalPending: number;
  deliveriesCount: number;
  // NOVOS CAMPOS
  averagePerDelivery: number;
  companyName: string;
  period: {
    start: string;
    end: string;
  };
}

export interface UpdateDeliveryData {
  status?: DeliveryStatus;
  driverNotes?: string;
  deliveredAt?: string;
  evidence?: {
    type: 'photo' | 'signature';
    base64: string;
    description?: string;
  }[];
}

// VALIDAÇÃO DE CNPJ
export interface CNPJValidation {
  isValid: boolean;
  formatted: string;
  company?: {
    name: string;
    status: string;
    address: string;
  };
}

// WEBHOOK PARA INTEGRAÇÃO
export interface WebhookPayload {
  event: 'route.created' | 'delivery.updated' | 'payment.confirmed';
  data: any;
  companyId: number;
  timestamp: string;
}