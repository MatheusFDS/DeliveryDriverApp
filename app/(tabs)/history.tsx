// app/(tabs)/history.tsx
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
import { MOCK_ROUTES } from '../../data/mockData';
import { Route } from '../../types';

export default function HistoryScreen() {
  const [completedRoutes, setCompletedRoutes] = useState<Route[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState(0);

  useEffect(() => {
    loadHistoryData();
  }, []);

  const loadHistoryData = () => {
    // Filtra apenas roteiros finalizados
    const completed = MOCK_ROUTES.filter(route => route.status === 'finalizado');
    setCompletedRoutes(completed);
    
    // Calcula ganhos
    const total = completed.reduce((sum, route) => sum + route.totalValue, 0);
    setTotalEarnings(total);
    
    // Simula ganhos do mês atual (apenas roteiros deste mês)
    setMonthlyEarnings(total); // Para demonstração, considerando tudo como deste mês
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      loadHistoryData();
      setRefreshing(false);
    }, 1000);
  };

  const navigateToRoute = (routeId: number) => {
    router.push(`/route/${routeId}`);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return days[date.getDay()];
  };

  const getTotalDeliveries = (): number => {
    return completedRoutes.reduce((sum, route) => sum + route.deliveries.length, 0);
  };

  const getSuccessfulDeliveries = (): number => {
    return completedRoutes.reduce((sum, route) => 
      sum + route.deliveries.filter(d => d.status === 'entregue').length, 0
    );
  };

  const getSuccessRate = (): number => {
    const total = getTotalDeliveries();
    const successful = getSuccessfulDeliveries();
    return total > 0 ? Math.round((successful / total) * 100) : 0;
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Card de Ganhos Principais */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsTitle}>💰 Ganhos do Mês</Text>
          <Text style={styles.earningsValue}>
            R$ {monthlyEarnings.toFixed(2)}
          </Text>
          
          <View style={styles.earningsDetails}>
            <View style={styles.earningsItem}>
              <Text style={styles.earningsLabel}>✅ Confirmado</Text>
              <Text style={styles.earningsAmount}>
                R$ {monthlyEarnings.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.earningsItem}>
              <Text style={styles.earningsLabel}>⏳ Pendente</Text>
              <Text style={styles.earningsAmount}>R$ 0,00</Text>
            </View>
          </View>
          
          <Text style={styles.deliveriesCount}>
            📦 {getTotalDeliveries()} entregas realizadas
          </Text>
        </View>

        {/* Estatísticas Rápidas */}
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>📊 Suas Estatísticas</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{completedRoutes.length}</Text>
              <Text style={styles.statLabel}>Roteiros</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{getTotalDeliveries()}</Text>
              <Text style={styles.statLabel}>Entregas</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#4CAF50' }]}>
                {getSuccessRate()}%
              </Text>
              <Text style={styles.statLabel}>Sucesso</Text>
            </View>
            
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#2196F3' }]}>
                R$ {getTotalDeliveries() > 0 ? (totalEarnings / getTotalDeliveries()).toFixed(0) : '0'}
              </Text>
              <Text style={styles.statLabel}>Média/Entrega</Text>
            </View>
          </View>
        </View>

        {/* Histórico de Roteiros */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>
            📋 Roteiros Finalizados ({completedRoutes.length})
          </Text>
          
          {completedRoutes.length > 0 ? (
            completedRoutes.map((route) => (
              <TouchableOpacity
                key={route.id}
                style={styles.historyCard}
                onPress={() => navigateToRoute(route.id)}
              >
                <View style={styles.historyHeader}>
                  <View style={styles.historyDateContainer}>
                    <Text style={styles.historyDate}>
                      📅 {formatDate(route.date)}
                    </Text>
                    <Text style={styles.historyDayOfWeek}>
                      {getDayOfWeek(route.date)}
                    </Text>
                  </View>
                  
                  <View style={styles.historyValue}>
                    <Text style={styles.historyValueText}>
                      R$ {route.totalValue.toFixed(2)}
                    </Text>
                    <Text style={styles.historyStatus}>💚 Pago</Text>
                  </View>
                </View>
                
                <View style={styles.historyDetails}>
                  <Text style={styles.historyDeliveries}>
                    📦 {route.deliveries.length} entregas
                  </Text>
                  
                  <Text style={styles.historySuccess}>
                    ✅ {route.deliveries.filter(d => d.status === 'entregue').length} sucessos
                  </Text>
                </View>

                {/* Preview das entregas */}
                <View style={styles.deliveriesPreview}>
                  <Text style={styles.deliveriesPreviewTitle}>Clientes:</Text>
                  {route.deliveries.slice(0, 3).map((delivery, index) => (
                    <Text key={delivery.id} style={styles.deliveryPreviewText}>
                      • {delivery.customerName}
                    </Text>
                  ))}
                  {route.deliveries.length > 3 && (
                    <Text style={styles.moreDeliveries}>
                      +{route.deliveries.length - 3} mais...
                    </Text>
                  )}
                </View>

                <View style={styles.viewRouteHint}>
                  <Text style={styles.viewRouteHintText}>
                    👆 Toque para ver detalhes do roteiro
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateEmoji}>📭</Text>
              <Text style={styles.emptyStateTitle}>
                Nenhum roteiro finalizado
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                Roteiros concluídos aparecerão aqui
              </Text>
            </View>
          )}
        </View>

        {/* Resumo de Performance */}
        <View style={styles.performanceCard}>
          <Text style={styles.performanceTitle}>📈 Performance</Text>
          
          <View style={styles.performanceContent}>
            <View style={styles.performanceItem}>
              <Text style={styles.performanceEmoji}>🎯</Text>
              <View style={styles.performanceTextContainer}>
                <Text style={styles.performanceLabel}>Taxa de Sucesso</Text>
                <Text style={styles.performanceValue}>{getSuccessRate()}%</Text>
              </View>
              <Text style={[styles.performanceIndicator, { color: '#4CAF50' }]}>
                Excelente!
              </Text>
            </View>
            
            <View style={styles.performanceItem}>
              <Text style={styles.performanceEmoji}>⚡</Text>
              <View style={styles.performanceTextContainer}>
                <Text style={styles.performanceLabel}>Entregas por Roteiro</Text>
                <Text style={styles.performanceValue}>
                  {completedRoutes.length > 0 ? 
                    Math.round(getTotalDeliveries() / completedRoutes.length) : 0
                  }
                </Text>
              </View>
              <Text style={[styles.performanceIndicator, { color: '#2196F3' }]}>
                Ótimo!
              </Text>
            </View>
            
            <View style={styles.performanceItem}>
              <Text style={styles.performanceEmoji}>💪</Text>
              <View style={styles.performanceTextContainer}>
                <Text style={styles.performanceLabel}>Total de Roteiros</Text>
                <Text style={styles.performanceValue}>{completedRoutes.length}</Text>
              </View>
              <Text style={[styles.performanceIndicator, { color: '#ff9800' }]}>
                Continue assim!
              </Text>
            </View>
          </View>
        </View>
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
  earningsCard: {
    backgroundColor: '#4CAF50',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  earningsTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  earningsValue: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  earningsDetails: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 12,
  },
  earningsItem: {
    alignItems: 'center',
  },
  earningsLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    marginBottom: 4,
  },
  earningsAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveriesCount: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  statsCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 16,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  historySection: {
    margin: 16,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyDateContainer: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  historyDayOfWeek: {
    fontSize: 12,
    color: '#666',
  },
  historyValue: {
    alignItems: 'flex-end',
  },
  historyValueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  historyStatus: {
    fontSize: 12,
    color: '#4CAF50',
  },
  historyDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  historyDeliveries: {
    fontSize: 14,
    color: '#666',
  },
  historySuccess: {
    fontSize: 14,
    color: '#4CAF50',
  },
  deliveriesPreview: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  deliveriesPreviewTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  deliveryPreviewText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  moreDeliveries: {
    fontSize: 12,
    color: '#2196F3',
    fontStyle: 'italic',
  },
  viewRouteHint: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 6,
    borderRadius: 4,
    alignItems: 'center',
  },
  viewRouteHintText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
  },
  performanceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  performanceContent: {
    gap: 12,
  },
  performanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  performanceEmoji: {
    fontSize: 20,
    marginRight: 12,
  },
  performanceTextContainer: {
    flex: 1,
  },
  performanceLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  performanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  performanceIndicator: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});