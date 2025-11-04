import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { supabase, isSupabaseConfigured } from './supabase';
import { GOOGLE_OAUTH_CONFIG, isGoogleOAuthConfigured } from './googleOAuthConfig';
import { Alert } from 'react-native';

class GoogleAuthService {
  private isConfigured = false;
  
  constructor() {
    this.configure();
  }

  private configure() {
    if (this.isConfigured) return;
    
    try {
      GoogleSignin.configure({
        webClientId: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
        offlineAccess: true,
        scopes: [...GOOGLE_OAUTH_CONFIG.SCOPES], // Converter readonly array para array mutável
      });
      this.isConfigured = true;
      console.log('✅ Google Sign In configurado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao configurar Google Sign In:', error);
    }
  }

  async signInWithGoogle(): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      Alert.alert(
        'Configuração Necessária',
        'O Supabase precisa ser configurado para usar login com Google. Entrando como visitante...'
      );
      return this.signInAnonymously();
    }

    if (!isGoogleOAuthConfigured()) {
      Alert.alert(
        'Google OAuth não configurado',
        'Configure as credenciais do Google Cloud Console primeiro. Entrando como visitante...'
      );
      return this.signInAnonymously();
    }

    try {
      // Verificar Play Services (Android)
      await GoogleSignin.hasPlayServices();
      
      console.log('🔐 Iniciando processo de login com Google...');
      
      // Sempre fazer sign in com interação do usuário na primeira vez
      // signInSilently só funciona se o usuário já tiver feito login antes
      let userInfo = await GoogleSignin.signIn();
      
      // Debug: verificar o que veio na resposta
      console.log('📋 Resposta do Google Sign In:', JSON.stringify(userInfo, null, 2));
      
      // Verificar se o tipo é success
      if ((userInfo as any).type && (userInfo as any).type !== 'success') {
        console.error('❌ Tipo de resposta inesperado:', (userInfo as any).type);
        throw new Error('Login cancelado ou falhou. Tente novamente.');
      }
      
      // Pegar o idToken (pode estar em data.idToken ou direto em idToken)
      const idToken = (userInfo as any).data?.idToken || (userInfo as any).idToken;
      
      if (!idToken) {
        console.error('❌ userInfo recebido:', userInfo);
        throw new Error('ID Token não encontrado na resposta do Google. Verifique a configuração do SHA-1 no Google Cloud Console.');
      }

      console.log('✅ ID Token obtido do Google, autenticando com Supabase...');

      // Autenticar com Supabase usando o idToken do Google
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: idToken,
      });

      if (error) {
        console.error('❌ Erro ao autenticar com Supabase:', error);
        Alert.alert(
          'Erro no Login',
          `Não foi possível autenticar com o servidor: ${error.message}`
        );
        return false;
      }

      console.log('✅ Login com Google realizado com sucesso!');
      console.log('👤 Usuário:', data.user?.email);
      return true;
      
    } catch (error: any) {
      console.error('❌ Erro no login com Google:', error);
      
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('ℹ️ Usuário cancelou o login');
        return false;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        Alert.alert(
          'Login em Andamento',
          'Já existe um login em progresso. Aguarde.'
        );
        return false;
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert(
          'Serviços do Google não disponíveis',
          'Seu dispositivo precisa ter os Serviços do Google Play instalados e atualizados.'
        );
        return false;
      } else {
        Alert.alert(
          'Erro no Login',
          `Ocorreu um erro: ${error.message || 'Tente novamente.'}`
        );
        return false;
      }
    }
  }

  async signInAnonymously(): Promise<boolean> {
    try {
      if (!isSupabaseConfigured()) {
        // Simular login anônimo offline
        Alert.alert('Login Offline', 'Entrando em modo offline...');
        return true;
      }

      const { data, error } = await supabase.auth.signInAnonymously();
      
      if (error) {
        console.error('Erro no login anônimo:', error);
        Alert.alert('Erro', 'Não foi possível fazer login como visitante.');
        return false;
      }

      console.log(' Login anônimo realizado com sucesso');
      Alert.alert('Sucesso', 'Login realizado como visitante!');
      return true;
    } catch (error) {
      console.error('Erro inesperado no login anônimo:', error);
      Alert.alert('Erro', 'Ocorreu um erro inesperado.');
      return false;
    }
  }

  async signOut(): Promise<void> {
    try {
      // Sign out do Google
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        await GoogleSignin.signOut();
        console.log(' Sign out do Google realizado');
      }
      
      // Sign out do Supabase
      if (isSupabaseConfigured()) {
        await supabase.auth.signOut();
        console.log(' Sign out do Supabase realizado');
      }
    } catch (error) {
      console.error(' Erro ao fazer sign out:', error);
    }
  }

  async getCurrentUser() {
    try {
      const userInfo = await GoogleSignin.getCurrentUser();
      return userInfo;
    } catch (error) {
      console.error(' Erro ao obter usuário atual:', error);
      return null;
    }
  }
}

export const googleAuth = new GoogleAuthService();