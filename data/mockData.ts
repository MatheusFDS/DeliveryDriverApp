// data/mockData.ts
import { Route, User } from '../types';

export const MOCK_USER: User = {
  id: 1,
  name: 'João Silva',
  email: 'joao@exemplo.com',
  phone: '(11) 99999-9999',
  vehicle: 'Honda CG 160',
  plate: 'ABC-1234'
};

export const MOCK_ROUTES: Route[] = [
  {
    id: 1,
    date: '2024-05-26',
    status: 'ativo',
    totalValue: 120.50,
    deliveries: [
      {
        id: 1,
        customerName: 'Restaurant do Zé',
        address: 'Rua das Flores, 123 - Centro',
        phone: '(11) 1111-1111',
        value: 45.30,
        status: 'pendente',
        items: ['Pizza Margherita', 'Refrigerante 2L'],
        notes: 'Entregar no balcão',
        paymentMethod: 'Dinheiro'
      },
      {
        id: 2,
        customerName: 'Padaria Central',
        address: 'Av. Principal, 456 - Vila Nova',
        phone: '(11) 2222-2222',
        value: 32.20,
        status: 'pendente',
        items: ['Pães diversos', 'Doces'],
        notes: 'Tocar campainha',
        paymentMethod: 'PIX'
      },
      {
        id: 3,
        customerName: 'Mercado Bom Preço',
        address: 'Rua do Comércio, 789 - Jardim',
        phone: '(11) 3333-3333',
        value: 43.00,
        status: 'pendente',
        items: ['Produtos diversos'],
        notes: 'Entrada pelos fundos',
        paymentMethod: 'Cartão'
      }
    ]
  },
  {
    id: 2,
    date: '2024-05-25',
    status: 'finalizado',
    totalValue: 89.75,
    deliveries: [
      {
        id: 4,
        customerName: 'Farmácia Popular',
        address: 'Rua da Saúde, 321 - Centro',
        phone: '(11) 4444-4444',
        value: 89.75,
        status: 'entregue',
        items: ['Medicamentos'],
        notes: 'Verificar receita',
        paymentMethod: 'Dinheiro'
      }
    ]
  }
];

// Função para buscar roteiro por ID
export const getRouteById = (id: number): Route | undefined => {
  return MOCK_ROUTES.find(route => route.id === id);
};

// Função para buscar entrega por ID
export const getDeliveryById = (deliveryId: number) => {
  for (const route of MOCK_ROUTES) {
    const delivery = route.deliveries.find(d => d.id === deliveryId);
    if (delivery) {
      return { delivery, route };
    }
  }
  return null;
};

// Função para obter roteiro ativo
export const getActiveRoute = (): Route | undefined => {
  return MOCK_ROUTES.find(route => route.status === 'ativo');
};