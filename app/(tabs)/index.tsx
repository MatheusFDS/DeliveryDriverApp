// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { MOCK_ROUTES, getActiveRoute } from '../../data/mockData';
import { Route, RouteStatus } from '../../types';

export default function RoutesScreen() {
  const [routes, setRoutes] = useState<Route[]>(MOCK_ROUTES);
  const [activeRoute, setActiveRoute] = useState<Route | undefined>(undefined);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = () => {
    setRoutes(MOCK_ROUTES);
    setActiveRoute(getActiveRoute());
  };

  const onRefresh = () => {
    setRefreshing(true);
    // Simula um delay de refresh
    setTimeout(() => {
      loadRoutes();
      setRefreshing(false);
    }, 1000);
  };

  const navigateToRoute = (routeId: number) => {
    router.push(`/route/${routeId}`);
  };

  const getStatusColor = (status: RouteStatus): string => {
    switch (status) {
      case 'ativo': return '#4CAF50';
      case 'finalizado': return '#9E9E9E';
      case 'cancelado': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getStatusText = (status: RouteStatus): string => {
    switch (status) {
      case 'ativo': return 'ATIVO';
      case 'finalizado': return 'FINALIZADO';
      case 'cancelado': return 'CANCELADO';
      case 'pendente': return 'PENDENTE';
      default: {
        const _exhaustiveCheck: never = status;
        return 'DESCONHECIDO';
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Roteiro Ativo em Destaque */}
        {activeRoute && (
          <View style={styles.activeSection}>
            <Text style={styles.sectionTitle}>🚛 Roteiro Ativo</Text>
            <TouchableOpacity
              style={styles.activeRouteCard}
              onPress={() => navigateToRoute(activeRoute.id)}
            >
              <View style={styles.activeRouteHeader}>
                <Text style={styles.activeRouteTitle}>
                  Roteiro {activeRoute.date}
                </Text>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activeRoute.status) }]}>
                  <Text style={styles.statusText}>
                    {getStatusText(activeRoute.status)}
                  </Text>
                </View>
              </View>
              
              <View style={styles.activeRouteDetails}>
                <Text style={styles.activeRouteValue}>
                  💰 R$ {activeRoute.totalValue.toFixed(2)}
                </Text>
                <Text style={styles.activeRouteDeliveries}>
                  📦 {activeRoute.deliveries.length} entregas
                </Text>
              </View>

              <View style={styles.continueButtonContainer}>
                <Text style={styles.continueButtonText}>
                  👆 Toque para continuar o roteiro
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Lista de Todos os Roteiros */}
        <View style={styles.allRoutesSection}>
          <Text style={styles.sectionTitle}>📋 Todos os Roteiros</Text>
          
          {routes.map((route) => (
            <TouchableOpacity
              key={route.id}
              style={[
                styles.routeCard,
                route.status === 'ativo' && styles.activeRouteCardBorder
              ]}
              onPress={() => navigateToRoute(route.id)}
            >
              <View style={styles.routeHeader}>
                <View>
                  <Text style={styles.routeDate}>📅 {route.date}</Text>
                  <Text style={styles.routeValue}>
                    💰 R$ {route.totalValue.toFixed(2)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(route.status) }]}>
                  <Text style={styles.statusText}>
                    {getStatusText(route.status)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.deliveryCount}>
                📦 {route.deliveries.length} entregas
              </Text>
              
              {route.status === 'ativo' && (
                <Text style={styles.activeIndicator}>
                  🔥 Roteiro em andamento
                </Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Mensagem se não houver roteiros */}
        {routes.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateEmoji}>📭</Text>
            <Text style={styles.emptyStateTitle}>Nenhum roteiro encontrado</Text>
            <Text style={styles.emptyStateSubtitle}>
              Novos roteiros aparecerão aqui quando disponíveis
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  activeSection: {
    padding: 16,
  },
  allRoutesSection: {
    padding: 16,
    paddingTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  activeRouteCard: {
    backgroundColor: '#e3f2fd',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#2196F3',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeRouteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activeRouteTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  activeRouteDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  activeRouteValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
  activeRouteDeliveries: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  continueButtonContainer: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    color: '#1976d2',
    fontWeight: '600',
    fontSize: 14,
  },
  routeCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeRouteCardBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  routeDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  routeValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  deliveryCount: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  activeIndicator: {
    fontSize: 12,
    color: '#ff9800',
    fontWeight: '600',
    fontStyle: 'italic',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 60,
  },
  emptyStateEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});