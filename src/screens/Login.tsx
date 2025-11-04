import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import Button from '../components/ui/button';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { googleAuth } from '../lib/googleAuth';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Verificar autenticação apenas se Supabase estiver configurado
    if (!isSupabaseConfigured()) {
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        navigation.replace('Home');
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        navigation.replace('Home');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigation]);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const success = await googleAuth.signInWithGoogle();
      if (success) {
        navigation.replace('Home');
      }
    } catch (err: any) {
      Alert.alert('Erro no login', err.message || 'Erro ao entrar com Google');
    } finally {
      setLoading(false);
    }
  };

  const signInAnonymously = async () => {
    try {
      setLoading(true);
      const success = await googleAuth.signInAnonymously();
      if (success) {
        navigation.replace('Home');
      }
    } catch (err: any) {
      Alert.alert('Erro no login', err.message || 'Erro ao entrar como visitante');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:16}}>
      <Text style={{fontSize:24,fontWeight:'700',marginBottom:8}}>FitSênior</Text>
      <Text style={{marginBottom:16,color:'#666'}}>Atividade física para a terceira idade</Text>

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={{width:'100%'}}>
          <Button onPress={signInWithGoogle}>Continuar com Google</Button>
          <View style={{height:12}} />
          <Button onPress={signInAnonymously}>Entrar como Visitante</Button>
        </View>
      )}
    </View>
  );
}
