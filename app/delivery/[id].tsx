// app/delivery/[id].tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Modal,
  TextInput,
  Image,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getDeliveryById } from '../../data/mockData';
import { Delivery, Route, DeliveryStatus } from '../../types';

interface PhotoEvidence {
  id: string;
  uri: string;
  type: 'camera' | 'gallery';
  timestamp: string;
}

export default function DeliveryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [delivery, setDelivery] = useState<Delivery | null>(null);
  const [route, setRoute] = useState<Route | null>(null);
  const [status, setStatus] = useState<DeliveryStatus>('pendente');
  const [driverNotes, setDriverNotes] = useState('');
  const [photos, setPhotos] = useState<PhotoEvidence[]>([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const result = getDeliveryById(parseInt(id));
      if (result) {
        setDelivery(result.delivery);
        setRoute(result.route);
        setStatus(result.delivery.status);
        setDriverNotes(result.delivery.driverNotes || '');
      }
    }
  }, [id]);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        'Permissão Necessária',
        'Precisamos de acesso à câmera para tirar fotos das entregas.'
      );
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: PhotoEvidence = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: 'camera',
          timestamp: new Date().toISOString(),
        };
        setPhotos(prev => [...prev, newPhoto]);
        setShowImageModal(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const newPhoto: PhotoEvidence = {
          id: Date.now().toString(),
          uri: result.assets[0].uri,
          type: 'gallery',
          timestamp: new Date().toISOString(),
        };
        setPhotos(prev => [...prev, newPhoto]);
        setShowImageModal(false);
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível selecionar a foto.');
    }
  };

  const removePhoto = (photoId: string) => {
    Alert.alert(
      'Remover Foto',
      'Tem certeza que deseja remover esta foto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Remover',
          style: 'destructive',
          onPress: () => setPhotos(prev => prev.filter(p => p.id !== photoId))
        }
      ]
    );
  };

  const openMapsNavigation = () => {
    if (delivery) {
      const address = encodeURIComponent(delivery.address);
      const url = `https://maps.google.com/maps?daddr=${address}`;
      Linking.openURL(url);
    }
  };

  const callCustomer = () => {
    if (delivery) {
      const phone = delivery.phone.replace(/[^\d]/g, '');
      Linking.openURL(`tel:${phone}`);
    }
  };

  const finishDelivery = () => {
    if (status === 'pendente') {
      Alert.alert('Atenção', 'Selecione o status da entrega antes de finalizar.');
      return;
    }

    Alert.alert(
      'Finalizar Entrega',
      `Confirmar entrega como "${status === 'entregue' ? 'Entregue' : 'Problema'}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            setIsLoading(true);
            // Simula envio dos dados
            await new Promise(resolve => setTimeout(resolve, 1500));
            setIsLoading(false);
            
            Alert.alert(
              'Sucesso!',
              'Entrega finalizada com sucesso.',
              [{ text: 'OK', onPress: () => router.back() }]
            );
          }
        }
      ]
    );
  };

  if (!delivery || !route) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando entrega...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Informações do Cliente */}
        <View style={styles.customerCard}>
          <Text style={styles.customerName}>👤 {delivery.customerName}</Text>
          <Text style={styles.address}>📍 {delivery.address}</Text>
          <Text style={styles.phone}>📞 {delivery.phone}</Text>
          
          <View style={styles.deliveryInfo}>
            <Text style={styles.value}>💰 R$ {delivery.value.toFixed(2)}</Text>
            <Text style={styles.paymentMethod}>💳 {delivery.paymentMethod}</Text>
          </View>
        </View>

        {/* Ações Rápidas */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={openMapsNavigation}>
            <Text style={styles.actionButtonText}>🗺️ Navegar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={callCustomer}>
            <Text style={styles.actionButtonText}>📞 Ligar</Text>
          </TouchableOpacity>
        </View>

        {/* Itens da Entrega */}
        <View style={styles.itemsSection}>
          <Text style={styles.sectionTitle}>📦 Itens da Entrega</Text>
          <View style={styles.itemsContainer}>
            {delivery.items.map((item, index) => (
              <Text key={index} style={styles.itemText}>• {item}</Text>
            ))}
          </View>
        </View>

        {/* Observações do Cliente */}
        {delivery.notes && (
          <View style={styles.notesSection}>
            <Text style={styles.sectionTitle}>📝 Observações do Cliente</Text>
            <Text style={styles.clientNotes}>{delivery.notes}</Text>
          </View>
        )}

        {/* Status da Entrega */}
        <View style={styles.statusSection}>
          <Text style={styles.sectionTitle}>📊 Status da Entrega</Text>
          <View style={styles.statusOptions}>
            <TouchableOpacity
              style={[
                styles.statusOption,
                status === 'entregue' && styles.statusOptionActive
              ]}
              onPress={() => setStatus('entregue')}
            >
              <Text style={styles.statusIcon}>✅</Text>
              <Text style={styles.statusText}>Entregue</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.statusOption,
                status === 'problema' && styles.statusOptionActive
              ]}
              onPress={() => setStatus('problema')}
            >
              <Text style={styles.statusIcon}>❌</Text>
              <Text style={styles.statusText}>Problema</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Evidências/Fotos */}
        <View style={styles.evidenceSection}>
          <Text style={styles.sectionTitle}>📸 Evidências</Text>
          
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={() => setShowImageModal(true)}
          >
            <Text style={styles.addPhotoButtonText}>📷 Adicionar Foto</Text>
          </TouchableOpacity>

          {photos.length > 0 && (
            <View style={styles.photosGrid}>
              {photos.map((photo) => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.photoContainer}
                  onLongPress={() => removePhoto(photo.id)}
                >
                  <Image source={{ uri: photo.uri }} style={styles.photo} />
                  <Text style={styles.photoType}>
                    {photo.type === 'camera' ? '📷' : '🖼️'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Observações do Motorista */}
        <View style={styles.driverNotesSection}>
          <Text style={styles.sectionTitle}>📋 Suas Observações</Text>
          <TextInput
            style={styles.driverNotesInput}
            placeholder="Digite observações sobre a entrega..."
            multiline
            numberOfLines={4}
            value={driverNotes}
            onChangeText={setDriverNotes}
            textAlignVertical="top"
          />
        </View>

        {/* Botão Finalizar */}
        <TouchableOpacity
          style={[styles.finishButton, isLoading && styles.finishButtonDisabled]}
          onPress={finishDelivery}
          disabled={isLoading}
        >
          <Text style={styles.finishButtonText}>
            {isLoading ? '⏳ Finalizando...' : '✅ Finalizar Entrega'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para Adicionar Foto */}
      <Modal
        visible={showImageModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📸 Adicionar Evidência</Text>
            
            <TouchableOpacity style={styles.modalButton} onPress={takePhoto}>
              <Text style={styles.modalButtonText}>📷 Tirar Foto</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.modalButton} onPress={pickImageFromGallery}>
              <Text style={styles.modalButtonText}>🖼️ Escolher da Galeria</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.modalButton, styles.modalCancelButton]}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalButtonText}>❌ Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  customerCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  address: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  phone: {
    fontSize: 14,
    color: '#2196F3',
    marginBottom: 12,
  },
  deliveryInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  paymentMethod: {
    fontSize: 14,
    color: '#666',
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  itemsSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  itemsContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
  },
  itemText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  notesSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  clientNotes: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  statusSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  statusOption: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e1e5e9',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  statusOptionActive: {
    borderColor: '#4CAF50',
    backgroundColor: '#e8f5e8',
  },
  statusIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statusText: {
    fontWeight: 'bold',
    color: '#333',
  },
  evidenceSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  addPhotoButton: {
    backgroundColor: '#ff9800',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  addPhotoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  photoContainer: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  photoType: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 10,
    width: 20,
    height: 20,
    textAlign: 'center',
    fontSize: 12,
  },
  driverNotesSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 16,
    borderRadius: 12,
  },
  driverNotesInput: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    fontSize: 14,
    backgroundColor: '#f8f9fa',
  },
  finishButton: {
    backgroundColor: '#4CAF50',
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  finishButtonDisabled: {
    backgroundColor: '#ccc',
  },
  finishButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  modalButton: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  modalCancelButton: {
    backgroundColor: '#666',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});