// app/(tabs)/_layout.tsx - VERSÃO CORRIGIDA
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { Redirect } from 'expo-router';

export default function TabLayout() {
  const { user, isLoading } = useAuth();

  // Se ainda está carregando, não renderiza nada
  if (isLoading) {
    return null;
  }

  // Se não há usuário, redireciona para login
  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2196F3',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e1e5e9',
          paddingBottom: 8,
          paddingTop: 8,
          height: 65,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: '#2196F3',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Roteiros',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="🚚" color={color} size={size} />
          ),
          headerTitle: 'Meus Roteiros',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'Histórico',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="📊" color={color} size={size} />
          ),
          headerTitle: 'Histórico de Entregas',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <TabBarIcon name="👤" color={color} size={size} />
          ),
          headerTitle: 'Meu Perfil',
        }}
      />
    </Tabs>
  );
}

// COMPONENTE CORRIGIDO - usando Text do React Native
function TabBarIcon({ name, color, size }: { name: string; color: string; size: number }) {
  return (
    <Text 
      style={{ 
        fontSize: size, 
        color: color,
        textAlign: 'center',
      }}
    >
      {name}
    </Text>
  );
}