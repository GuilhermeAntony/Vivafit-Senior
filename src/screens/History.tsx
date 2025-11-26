import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'History'>;
type Completed = { id?: string; date: string; steps?: number; exercise?: string | null };

export default function History({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Completed[]>([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        let finalItems: Completed[] = [];
        
        // Primeiro tentar carregar do local
        const localData = await AsyncStorage.getItem('completedWorkouts');
        const local = localData ? JSON.parse(localData) : [];
        finalItems = (local || []).reverse();
        if (mounted) setItems(finalItems);
        
        // Se Supabase estiver configurado, tentar buscar dados da nuvem
        if (isSupabaseConfigured()) {
          try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (user) {
              const { data, error } = await supabase
                .from('completed_workouts')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .limit(500);
              
              if (!error && data && mounted) {
                // Mapear dados do Supabase para formato esperado
                finalItems = data.map(item => ({
                  id: item.id,
                  date: item.date,
                  steps: item.steps || 0,
                  exercise: item.exercise_name || item.exercise || null
                }));
                setItems(finalItems);
                console.log(`✅ ${data.length} treinos carregados do Supabase no histórico`);
              } else if (error) {
                console.log('⚠️ Erro ao buscar histórico do Supabase:', error.message);
              }
            } else {
              console.log('ℹ️ Usuário não autenticado, usando dados locais no histórico');
            }
          } catch (supabaseErr) {
            console.log('⚠️ Erro ao conectar com Supabase no histórico, usando dados locais');
          }
        }
      } catch (err) {
        // fallback to local
        try {
          const localData = await AsyncStorage.getItem('completedWorkouts');
          const local = localData ? JSON.parse(localData) : [];
          if (mounted) setItems((local || []).reverse());
        } catch (e) {
          console.error('Erro ao carregar dados locais:', e);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <View style={styles.loading}><ActivityIndicator size="large" /></View>
  );

  if (items.length === 0) return (
    <View style={styles.container}><Text style={styles.title}>Histórico</Text><Text>Sem registros de treino.</Text></View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Histórico</Text>
      <FlatList data={items} keyExtractor={(i, idx) => i.id ?? String(idx)} renderItem={({ item }) => (
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{item.date}</Text>
          <Text>{(item.steps ?? 0)} passos</Text>
          {item.exercise ? <Text>Exercício: {item.exercise}</Text> : null}
        </View>
      )} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: { padding: 12, borderRadius: 8, backgroundColor: '#f3f3f3', marginBottom: 8 },
  itemTitle: { fontWeight: '600' }
});
