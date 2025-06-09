// app/config/apiConfig.ts
import {
  DEV_BASE_URL_PRIMARY,
  DEV_BASE_URL_SECONDARY,
  PROD_BASE_URL,
  API_TIMEOUT,
  PROD_API_TIMEOUT
} from '@env';

const isDevelopment = __DEV__; // __DEV__ é uma variável global no React Native/Expo

// Você pode adicionar uma lógica para escolher entre a URL primária e secundária aqui,
// por exemplo, baseada em outra variável de ambiente ou um teste de ping.
// Para este exemplo, vamos assumir que você tem uma forma de decidir qual usar
// ou que quer tentar a primária primeiro.
const developmentBaseUrl = DEV_BASE_URL_PRIMARY; // Ou adicione sua lógica de escolha aqui

const API_CONFIG = {
  development: {
    baseURL: developmentBaseUrl, // Ex: DEV_BASE_URL_PRIMARY
    // Se você precisa da lógica de OR, você teria que implementá-la no seu código
    // que faz a chamada, não na definição da baseURL estática.
    // Ou você pode ter:
    // baseURLPrimary: DEV_BASE_URL_PRIMARY,
    // baseURLSecondary: DEV_BASE_URL_SECONDARY,
    timeout: parseInt(API_TIMEOUT, 10) || 10000,
  },
  production: {
    baseURL: PROD_BASE_URL,
    timeout: parseInt(PROD_API_TIMEOUT, 10) || 15000,
  }
};

export const currentApiConfig = isDevelopment ? API_CONFIG.development : API_CONFIG.production;

// Se você ainda precisa da opção de ter as duas URLs de desenvolvimento disponíveis:
export const devApiUrls = {
    primary: DEV_BASE_URL_PRIMARY,
    secondary: DEV_BASE_URL_SECONDARY,
};

export default API_CONFIG;