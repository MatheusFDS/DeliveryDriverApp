// app/route/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { getRouteById } from '../../data/mockData';
import { Route, Delivery, DeliveryStatus } from '../../types';

export default function RouteDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [route, setRoute] = useState<Route | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);

  useEffect(() => {
    if (id) {
      const foundRoute = getRouteById(parseInt(id));
      if (foundRoute) {
        setRoute(foundRoute);
        setDeliveries(foundRoute.deliveries);
      }
    }
  }, [id]);

  const openMapsNavigation = () => {
    if (deliveries.length > 0) {
      const firstPendingDelivery = deliveries.find(d => d.status === 'pendente') || deliveries[0];
      const address = encodeURIComponent(firstPendingDelivery.address);
      const url = `https://maps.google.com/maps?daddr=${address}`;
      
      Linking.canOpenURL(url).then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Erro', 'Não foi possível abrir o mapa');
        }
      });
    }
  };

  const navigateToDelivery = (deliveryId: number) => {
    router.push(`/delivery/${deliveryId}`);
  };

  const getStatusIcon = (status: DeliveryStatus): string => {
    switch (status) {
      case 'entregue': return '✅';
      case 'em_andamento': return '🚚';
      case 'problema': return '❌';
      default: return '⏳';
    }
  };

  const getCompletedCount = (): number => {
    return deliveries.filter(d => d.status === 'entregue').length;
  };

  const getProgressPercentage = (): number => {
    if (deliveries.length === 0) return 0;
    return Math.round((getCompletedCount() / deliveries.length) * 100);
  };

  if (!route) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando roteiro...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header do Roteiro */}
        <View style={styles.routeHeader}>
          <View style={styles.routeInfo}>
            <Text style={styles.routeTitle}>📅 Roteiro {route.date}</Text>
            <Text style={styles.routeValue}>💰 Total: R$ {route.totalValue.toFixed(2)}</Text>
            
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                📦 Progresso: {getCompletedCount()}/{deliveries.length} entregas
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} 
                />
              </View>
              <Text style={styles.progressPercentage}>{getProgressPercentage()}%</Text>
            </View>
          </View>

          {/* Botão de Navegação */}
          <TouchableOpacity style={styles.navigationButton} onPress={openMapsNavigation}>
            <Text style={styles.navigationButtonText}>🗺️ Abrir no Maps</Text>
          </TouchableOpacity>
        </View>

        {/* Lista de Entregas */}
        <View style={styles.deliveriesSection}>
          <Text style={styles.sectionTitle}>📋 Entregas ({deliveries.length})</Text>
          
          {deliveries.map((delivery, index) => (
            <TouchableOpacity
              key={delivery.id}
              style={[
                styles.deliveryCard,
                delivery.status === 'entregue' && styles.deliveryCardCompleted,
                delivery.status === 'problema' && styles.deliveryCardProblem,
              ]}
              onPress={() => navigateToDelivery(delivery.id)}
            >
              <View style={styles.deliveryHeader}>
                <View style={styles.deliveryNumber}>
                  <Text style={styles.deliveryNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.deliveryStatus}>
                  {getStatusIcon(delivery.status)}
                </Text>
              </View>
              
              <View style={styles.deliveryContent}>
                <Text style={styles.customerName}>{delivery.customerName}</Text>
                <Text style={styles.address}>📍 {delivery.address}</Text>
                <Text style={styles.phone}>📞 {delivery.phone}</Text>
                
                <View style={styles.deliveryFooter}>
                  <Text style={styles.deliveryValue}>💰 R$ {delivery.value.toFixed(2)}</Text>
                  <Text style={styles.paymentMethod}>💳 {delivery.paymentMethod}</Text>
                </View>
                
                {delivery.notes && (
                  <Text style={styles.notes}>📝 {delivery.notes}</Text>
                )}

                {/* Items Preview */}
                <View style={styles.itemsPreview}>
                  <Text style={styles.itemsTitle}>Itens:</Text>
                  {delivery.items.slice(0, 2).map((item, idx) => (
                    <Text key={idx} style={styles.itemText}>• {item}</Text>
                  ))}
                  {delivery.items.length > 2 && (
                    <Text style={styles.moreItems}>
                      +{delivery.items.length - 2} item(s)
                    </Text>
                  )}
                </View>
              </View>

              <View style={styles.actionHint}>
                <Text style={styles.actionHintText}>
                  👆 Toque para {delivery.status === 'pendente' ? 'iniciar' : 'ver detalhes da'} entrega
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ações do Roteiro */}
        {route.status === 'ativo' && (
          <View style={styles.routeActions}>
            <TouchableOpacity style={styles.finishRouteButton}>
              <Text style={styles.finishRouteButtonText}>
                ✅ Finalizar Roteiro
              </Text>
            </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  routeHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e5e9',
  },
  routeInfo: {
    marginBottom: 16,
  },
  routeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  routeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 16,
  },
  progressContainer: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e1e5e9',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
  navigationButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  navigationButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  deliveriesSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  deliveryCard: {
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
  deliveryCardCompleted: {
    backgroundColor: '#f1f8e9',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  deliveryCardProblem: {
    backgroundColor: '#ffebee',
    borderLeftWidth: 4,
    borderLeftColor: '#f44336',
  },
  deliveryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  deliveryNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deliveryNumberText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deliveryStatus: {
    fontSize: 24,
  },
  deliveryContent: {
    marginBottom: 12,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  phone: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 8,
  },
  deliveryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  deliveryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
  },
  notes: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  itemsPreview: {
    backgroundColor: '#f8f9fa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  itemsTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 4,
  },
  itemText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  moreItems: {
    fontSize: 12,
    color: '#2196F3',
    fontStyle: 'italic',
  },
  actionHint: {
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionHintText: {
    fontSize: 12,
    color: '#1976d2',
    fontWeight: '600',
  },
  routeActions: {
    padding: 16,
    paddingBottom: 32,
  },
  finishRouteButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishRouteButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});