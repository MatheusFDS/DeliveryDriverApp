// app/(auth)/login.tsx - VERSÃO COM CNPJ
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const [cnpj, setCnpj] = useState('12.345.678/0001-90'); // CNPJ da empresa
  const [email, setEmail] = useState('joao@exemplo.com');
  const [password, setPassword] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);

  // Função para formatar CNPJ
  const formatCNPJ = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (numbers.length <= 14) {
      return numbers
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  // Função para validar CNPJ (básica)
  const isValidCNPJ = (cnpj: string): boolean => {
    const numbers = cnpj.replace(/\D/g, '');
    return numbers.length === 14;
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    setCnpj(formatted);
  };

  const handleLogin = async () => {
    if (!cnpj || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    if (!isValidCNPJ(cnpj)) {
      Alert.alert('Erro', 'CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX');
      return;
    }

    setIsLoading(true);
    try {
      // Aqui enviaria CNPJ junto com email/senha
      const success = await login(email, password, cnpj);
      if (!success) {
        Alert.alert('Erro', 'CNPJ, email ou senha incorretos');
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha no login. Verifique os dados e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>🚚</Text>
          <Text style={styles.title}>DeliveryApp</Text>
          <Text style={styles.subtitle}>Sistema para Motoristas</Text>
        </View>

        <View style={styles.formContainer}>
          {/* CAMPO CNPJ - NOVO */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🏢 CNPJ da Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder="00.000.000/0000-00"
              value={cnpj}
              onChangeText={handleCNPJChange}
              keyboardType="numeric"
              maxLength={18} // XX.XXX.XXX/XXXX-XX
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>📧 Seu Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite seu email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>🔒 Sua Senha</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite sua senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? '⏳ Validando...' : '🚀 Entrar'}
            </Text>
          </TouchableOpacity>

          {/* AJUDA MELHORADA */}
          <View style={styles.helpContainer}>
            <Text style={styles.helpText}>📋 Dados para teste:</Text>
            <Text style={styles.helpCredentials}>🏢 CNPJ: 12.345.678/0001-90</Text>
            <Text style={styles.helpCredentials}>📧 Email: joao@exemplo.com</Text>
            <Text style={styles.helpCredentials}>🔒 Senha: 123456</Text>
          </View>

          {/* INFO SOBRE CNPJ */}
          <View style={styles.infoContainer}>
            <Text style={styles.infoIcon}>ℹ️</Text>
            <Text style={styles.infoText}>
              Use o CNPJ da empresa onde você trabalha como motorista.
              Se não souber, pergunte ao seu supervisor.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2196F3',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e5e9',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  loginButton: {
    backgroundColor: '#2196F3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  loginButtonDisabled: {
    backgroundColor: '#ccc',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  helpContainer: {
    marginTop: 24,
    padding: 16,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    alignItems: 'center',
  },
  helpText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976d2',
    marginBottom: 8,
  },
  helpCredentials: {
    fontSize: 13,
    color: '#1976d2',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 2,
  },
  infoContainer: {
    flexDirection: 'row',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#856404',
    lineHeight: 16,
  },
});