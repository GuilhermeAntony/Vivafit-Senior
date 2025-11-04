import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const extra = (Constants as any).manifest?.extra || (Constants as any).expoConfig?.extra || {};

const SUPABASE_URL = extra?.supabase?.url || process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const SUPABASE_ANON_KEY = extra?.supabase?.anonKey || process.env.SUPABASE_ANON_KEY || 'placeholder-key';

// Log das configurações para debug (sem mostrar a chave completa)
console.log('🔧 Supabase Config:', {
	url: SUPABASE_URL,
	hasKey: SUPABASE_ANON_KEY && SUPABASE_ANON_KEY.length > 20,
	keyPrefix: SUPABASE_ANON_KEY?.substring(0, 20) + '...'
});

// Função para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
	return SUPABASE_URL && 
		   SUPABASE_ANON_KEY && 
		   !SUPABASE_URL.includes('placeholder') && 
		   !SUPABASE_URL.includes('your-supabase-url') && 
		   !SUPABASE_ANON_KEY.includes('placeholder') && 
		   !SUPABASE_ANON_KEY.includes('your-anon-key') &&
		   SUPABASE_URL.startsWith('https://') &&
		   SUPABASE_URL.includes('.supabase.co');
};

if (!isSupabaseConfigured()) {
	console.warn(
		'  Supabase não está configurado corretamente. Usando valores placeholder para desenvolvimento.'
	);
} else {
	console.log(' Supabase configurado corretamente!');
}

// Criar cliente com AsyncStorage para persistência de sessão
export const supabase = isSupabaseConfigured() 
	? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
		auth: {
			storage: AsyncStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: false,
		},
		db: {
			schema: 'public' // Schema padrão do PostgreSQL
		}
	})
	: createClient('https://placeholder.supabase.co', 'placeholder-key'); // Cliente dummy para evitar erros
