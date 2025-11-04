import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator } from 'react-native';
import AppNavigator from './src/navigation';

export default function App() {
  const [error, setError] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        console.log(' VivaFit Seniors iniciando...');
        
        // Importação dinâmica do logger para evitar bloqueio
        const { logger } = await import('./src/lib/logger');
        await logger.init();
        logger.info('App iniciado', { timestamp: new Date().toISOString() });
        
        setIsReady(true);
        console.log(' App pronto!');
      } catch (err: any) {
        console.error(' Erro ao inicializar app:', err);
        setError(err.message || 'Erro ao inicializar');
        setIsReady(true); // Continua mesmo com erro
      }
    };

    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0ea5a3'}}>
        <ActivityIndicator size="large" color="white" />
        <Text style={{color: 'white', marginTop: 16}}>Carregando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20}}>
        <Text style={{color: 'red', fontSize: 18, fontWeight: 'bold'}}>Erro</Text>
        <Text style={{marginTop: 10, textAlign: 'center'}}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}
