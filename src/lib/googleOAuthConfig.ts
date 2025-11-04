/**
 * Configuração do Google OAuth
 * 
 * INSTRUÇÕES PARA CONFIGURAÇÃO:
 * 
 * 1. Acesse: https://console.cloud.google.com/
 * 2. Crie um novo projeto ou selecione existente
 * 3. Habilite as APIs: Google+ API, Google Identity Services API
 * 4. Configure a Tela de Consentimento OAuth
 * 5. Crie credenciais OAuth 2.0:
 *    - Tipo: Aplicativo da Web
 *    - URIs de redirecionamento: com.antony13.mobile://auth
 * 6. Copie o Client ID e Cole abaixo
 * 
 * INFORMAÇÕES DO SEU PROJETO:
 * - Package Name (Android): com.antony13.Mobile
 * - Bundle ID (iOS): com.antony13.Mobile  
 * - SHA-1 Fingerprint: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
 * - Redirect URI: com.antony13.mobile://auth
 */

export const GOOGLE_OAUTH_CONFIG = {
  // TODO: Substitua pelo Client ID real do Google Cloud Console
  // Exemplo: '123456789-abcdefghijklmnop.googleusercontent.com'
  CLIENT_ID: '358050334861-b5s858c68cr4f8anlj79c6e1oi5716m8.apps.googleusercontent.com',
  
  // Configurações do redirect
  REDIRECT_SCHEME: 'com.antony13.mobile',
  REDIRECT_PATH: 'auth',
  
  // Escopos necessários
  SCOPES: ['openid', 'profile', 'email'],
  
  // Configurações adicionais
  ADDITIONAL_PARAMETERS: {
    access_type: 'offline',
    prompt: 'consent',
  }
} as const;

// Função helper para verificar se está configurado
export const isGoogleOAuthConfigured = (): boolean => {
  return !!(
    GOOGLE_OAUTH_CONFIG.CLIENT_ID && 
    GOOGLE_OAUTH_CONFIG.CLIENT_ID.includes('.googleusercontent.com') &&
    GOOGLE_OAUTH_CONFIG.CLIENT_ID.length > 50 // Client IDs válidos são longos
  );
};