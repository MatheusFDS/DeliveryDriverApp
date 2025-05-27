// app/(tabs)/profile.tsx - VERSÃO COMPLETA COM EMPRESA
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    newRoutes: true,
    deliveryReminders: true,
    paymentUpdates: true,
    systemMessages: false,
  });

  const handleLogout = () => {
    Alert.alert(
      'Sair do App',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: logout
        }
      ]
    );
  };

  const updateNotificationSetting = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }));
    // Aqui você salvaria as configurações no backend
  };

  const openSupport = () => {
    Alert.alert(
      'Suporte',
      'Como gostaria de entrar em contato?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'WhatsApp',
          onPress: () => Linking.openURL('https://wa.me/5511999999999')
        },
        {
          text: 'Email',
          onPress: () => Linking.openURL('mailto:suporte@deliveryapp.com')
        }
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Card do Usuário */}
        <View style={styles.userCard}>
          <View style={styles.userAvatar}>
            <Text style={styles.userAvatarText}>
              {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
            </Text>
          </View>
          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.userPhone}>{user.phone}</Text>
          </View>

          <View style={styles.vehicleInfo}>
            <Text style={styles.vehicleTitle}>🚗 Informações do Veículo</Text>
            <Text style={styles.vehicleDetail}>{user.vehicle}</Text>
            <Text style={styles.vehiclePlate}>Placa: {user.plate}</Text>
          </View>
        </View>

        {/* NOVA SEÇÃO - Informações da Empresa */}
        {user.companyName && (
          <View style={styles.companyCard}>
            <Text style={styles.sectionTitle}>🏢 Empresa</Text>
            
            <View style={styles.companyInfo}>
              <View style={styles.companyHeader}>
                <Text style={styles.companyName}>
                  {user.companyName || 'Express Delivery Ltda'}
                </Text>
                <View style={styles.verifiedBadge}>
                  <Text style={styles.verifiedText}>✅ Verificada</Text>
                </View>
              </View>
              
              <Text style={styles.companyCnpj}>
                CNPJ: {user.companyCnpj || '12.345.678/0001-90'}
              </Text>
              
              <View style={styles.companyStats}>
                <View style={styles.companyStatItem}>
                  <Text style={styles.companyStatValue}>847</Text>
                  <Text style={styles.companyStatLabel}>Motoristas Ativos</Text>
                </View>
                
                <View style={styles.companyStatItem}>
                  <Text style={styles.companyStatValue}>12.4k</Text>
                  <Text style={styles.companyStatLabel}>Entregas/Mês</Text>
                </View>

                <View style={styles.companyStatItem}>
                  <Text style={styles.companyStatValue}>4.9⭐</Text>
                  <Text style={styles.companyStatLabel}>Avaliação</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Estatísticas Rápidas do Motorista */}
        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>📊 Seus Números</Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>⭐</Text>
              <Text style={styles.statValue}>4.8</Text>
              <Text style={styles.statLabel}>Avaliação</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>📦</Text>
              <Text style={styles.statValue}>127</Text>
              <Text style={styles.statLabel}>Entregas</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>✅</Text>
              <Text style={styles.statValue}>96%</Text>
              <Text style={styles.statLabel}>Taxa Sucesso</Text>
            </View>
            
            <View style={styles.statCard}>
              <Text style={styles.statIcon}>💰</Text>
              <Text style={styles.statValue}>R$ 2.1k</Text>
              <Text style={styles.statLabel}>Este Mês</Text>
            </View>
          </View>
        </View>

        {/* Configurações de Notificação */}
        <View style={styles.notificationsSection}>
          <Text style={styles.sectionTitle}>🔔 Notificações</Text>
          
          <View style={styles.settingsList}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Novos Roteiros</Text>
                <Text style={styles.settingDescription}>
                  Receber notificação quando um novo roteiro for atribuído
                </Text>
              </View>
              <Switch
                value={notifications.newRoutes}
                onValueChange={(value) => updateNotificationSetting('newRoutes', value)}
                trackColor={{ false: '#e1e5e9', true: '#81c784' }}
                thumbColor={notifications.newRoutes ? '#4CAF50' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Lembretes de Entrega</Text>
                <Text style={styles.settingDescription}>
                  Lembretes sobre entregas pendentes
                </Text>
              </View>
              <Switch
                value={notifications.deliveryReminders}
                onValueChange={(value) => updateNotificationSetting('deliveryReminders', value)}
                trackColor={{ false: '#e1e5e9', true: '#81c784' }}
                thumbColor={notifications.deliveryReminders ? '#4CAF50' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Atualizações de Pagamento</Text>
                <Text style={styles.settingDescription}>
                  Notificações sobre confirmação de pagamentos
                </Text>
              </View>
              <Switch
                value={notifications.paymentUpdates}
                onValueChange={(value) => updateNotificationSetting('paymentUpdates', value)}
                trackColor={{ false: '#e1e5e9', true: '#81c784' }}
                thumbColor={notifications.paymentUpdates ? '#4CAF50' : '#f4f3f4'}
              />
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingLabel}>Mensagens do Sistema</Text>
                <Text style={styles.settingDescription}>
                  Notificações gerais do sistema
                </Text>
              </View>
              <Switch
                value={notifications.systemMessages}
                onValueChange={(value) => updateNotificationSetting('systemMessages', value)}
                trackColor={{ false: '#e1e5e9', true: '#81c784' }}
                thumbColor={notifications.systemMessages ? '#4CAF50' : '#f4f3f4'}
              />
            </View>
          </View>
        </View>

        {/* Menu de Ações */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>⚙️ Configurações</Text>
          
          <View style={styles.actionsList}>
            <TouchableOpacity style={styles.actionItem} onPress={openSupport}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>🎧</Text>
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Suporte</Text>
                <Text style={styles.actionDescription}>
                  Entre em contato conosco
                </Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📝</Text>
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Editar Perfil</Text>
                <Text style={styles.actionDescription}>
                  Alterar dados pessoais e veículo
                </Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>💳</Text>
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Dados Bancários</Text>
                <Text style={styles.actionDescription}>
                  Configurar conta para recebimentos
                </Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>📊</Text>
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Relatórios</Text>
                <Text style={styles.actionDescription}>
                  Visualizar relatórios detalhados
                </Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionItem}>
              <View style={styles.actionIcon}>
                <Text style={styles.actionIconText}>🏢</Text>
              </View>
              <View style={styles.actionInfo}>
                <Text style={styles.actionLabel}>Sobre a Empresa</Text>
                <Text style={styles.actionDescription}>
                  Informações e políticas da empresa
                </Text>
              </View>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informações do App */}
        <View style={styles.appInfoSection}>
          <Text style={styles.sectionTitle}>📱 Informações do App</Text>
          
          <View style={styles.infoList}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Versão do App</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>

            <TouchableOpacity style={styles.infoItem}>
              <Text style={styles.infoLabel}>Política de Privacidade</Text>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.infoItem}>
              <Text style={styles.infoLabel}>Termos de Uso</Text>
              <Text style={styles.actionChevron}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Botão de Logout */}
        <View style={styles.logoutSection}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>🚪 Sair do App</Text>
          </TouchableOpacity>
        </View>

        {/* Badge de Status */}
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>✅ Motorista Verificado</Text>
          <Text style={styles.statusSubtext}>
            Sua conta está ativa e verificada
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  userCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userAvatarText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  userInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userPhone: {
    fontSize: 14,
    color: '#2196F3',
  },
  vehicleInfo: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
    width: '100%',
  },
  vehicleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    marginBottom: 8,
  },
  vehicleDetail: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 14,
    color: '#666',
  },
  
  // NOVOS ESTILOS PARA A EMPRESA
  companyCard: {
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
  companyInfo: {
    marginTop: 8,
  },
  companyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginRight: 12,
  },
  verifiedBadge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    color: '#2e7d32',
    fontWeight: '600',
  },
  companyCnpj: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  companyStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e1e5e9',
  },
  companyStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  companyStatValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 4,
  },
  companyStatLabel: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    lineHeight: 14,
  },

  // ESTILOS EXISTENTES
  quickStats: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  notificationsSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  settingsList: {
    gap: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  actionsSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  actionsList: {
    gap: 16,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  actionIconText: {
    fontSize: 18,
  },
  actionInfo: {
    flex: 1,
  },
  actionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 12,
    color: '#666',
  },
  actionChevron: {
    fontSize: 18,
    color: '#ccc',
    fontWeight: 'bold',
  },
  appInfoSection: {
    backgroundColor: 'white',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
  },
  infoList: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    fontSize: 12,
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  logoutSection: {
    margin: 16,
    marginTop: 0,
  },
  logoutButton: {
    backgroundColor: '#f44336',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: '#e8f5e8',
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 4,
  },
  statusSubtext: {
    fontSize: 12,
    color: '#4CAF50',
    textAlign: 'center',
  },
});