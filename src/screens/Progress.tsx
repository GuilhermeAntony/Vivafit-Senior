import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, Dimensions } from 'react-native';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PREDEFINED_ACHIEVEMENTS } from '../lib/exerciseData';
import { Screen } from '../components/ui/screen';
import { Header } from '../components/ui/header';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Text } from '../components/ui/text';
import { SPACING, COLORS } from '../styles/designTokens';

type Completed = { date: string; steps: number; exercise?: string | null };

const screenWidth = Dimensions.get('window').width;

export default function Progress() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<Completed[]>([]);
  const [achievements, setAchievements] = useState(PREDEFINED_ACHIEVEMENTS);

  useEffect(() => {
    const load = async () => {
      try {
        let finalItems: Completed[] = [];
        
        // Primeiro carregar dados locais
        const localData = await AsyncStorage.getItem('completedWorkouts');
        const local = localData ? JSON.parse(localData) : [];
        finalItems = (local || []).reverse();
        setItems(finalItems);
        
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
                .limit(200);
              
              if (!error && data && data.length > 0) {
                // Usar dados do Supabase como fonte principal
                finalItems = data.map(item => ({
                  date: item.date,
                  steps: item.steps || 0,
                  exercise: item.exercise_name || item.exercise || null
                }));
                setItems(finalItems);
                console.log(`✅ ${data.length} treinos carregados do Supabase`);
              } else if (error) {
                console.log('⚠️ Erro ao buscar do Supabase, usando dados locais:', error.message);
              }
            } else {
              console.log('ℹ️ Usuário não autenticado, usando dados locais');
            }
          } catch (supabaseErr) {
            console.log('⚠️ Erro ao conectar com Supabase, usando dados locais');
          }
        }

        // Atualiza conquistas com base no total de treinos
        const total = finalItems.length;
        const updated = PREDEFINED_ACHIEVEMENTS.map(a => ({
          ...a,
          unlocked: total >= a.maxProgress,
          progress: Math.min(total, a.maxProgress)
        }));
        setAchievements(updated);
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        // Fallback para dados locais em caso de erro
        try {
          const localData = await AsyncStorage.getItem('completedWorkouts');
          const local = localData ? JSON.parse(localData) : [];
          setItems((local || []).reverse());
          const total = (local || []).length;
          const updated = PREDEFINED_ACHIEVEMENTS.map(a => ({
            ...a,
            unlocked: total >= a.maxProgress,
            progress: Math.min(total, a.maxProgress)
          }));
          setAchievements(updated);
        } catch (localErr) {
          console.error('Erro ao carregar dados locais:', localErr);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
      <ActivityIndicator size="large" color={COLORS.primary} />
    </View>
  );

  // Group by date and prepare last 7 entries
  const grouped: Record<string, number> = {};
  items.forEach(it => {
    const d = it.date;
    grouped[d] = (grouped[d] || 0) + (it.steps || 1);
  });

  const entries = Object.entries(grouped).map(([date, val]) => ({ date, val }));
  entries.sort((a, b) => a.date.localeCompare(b.date));
  const last = entries.slice(-7);
  const maxVal = Math.max(...last.map(e => e.val), 1);
  const chartHeight = 140;

  return (
    <Screen scrollable={true}>
      <Header title="Seu Progresso" />
      
      <View style={{ gap: SPACING.lg }}>
        {/* Estatísticas gerais */}
        <Card variant="senior">
          <CardHeader>
            <Text variant="heading-3">Estatísticas</Text>
          </CardHeader>
          <CardContent>
            <View style={{ gap: SPACING.md }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="body">Total de Treinos:</Text>
                <Text variant="body" style={{ fontWeight: '600', color: COLORS.primary }}>
                  {items.length}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text variant="body">Esta Semana:</Text>
                <Text variant="body" style={{ fontWeight: '600', color: COLORS.primary }}>
                  {last.reduce((sum, entry) => sum + entry.val, 0)}
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Gráfico de progresso */}
        <Card variant="senior">
          <CardHeader>
            <Text variant="heading-3">Últimos Treinos</Text>
          </CardHeader>
          <CardContent>
            <View style={{height: chartHeight, flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between', paddingHorizontal:6}}>
              {last.length === 0 ? (
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text variant="body" style={{ color: COLORS.mutedForeground }}>Sem dados</Text>
                </View>
              ) : last.map((e) => {
                const barHeight = (e.val / maxVal) * (chartHeight - 30);
                const label = e.date.split('-').slice(1).join('/');
                return (
                  <View key={e.date} style={{width: (screenWidth - 64) / Math.max(1, last.length), alignItems:'center'}}>
                    <View style={{height: barHeight, width: 22, backgroundColor: COLORS.primary, borderRadius:6, justifyContent:'flex-end', alignItems:'center'}}>
                    </View>
                    <Text variant="caption" style={{ marginTop: SPACING.xs }}>{label}</Text>
                    <Text variant="caption" style={{ color: COLORS.mutedForeground }}>{e.val}</Text>
                  </View>
                );
              })}
            </View>
          </CardContent>
        </Card>

        {/* Lista de treinos */}
        <Card variant="senior">
          <CardHeader>
            <Text variant="heading-3">Treinos Recentes</Text>
          </CardHeader>
          <CardContent>
            {items.length === 0 ? (
              <View style={{alignItems:'center',justifyContent:'center', paddingVertical: SPACING.lg}}>
                <Text variant="body" style={{ color: COLORS.mutedForeground }}>
                  Sem registros de treino ainda.
                </Text>
              </View>
            ) : (
              <View style={{ gap: SPACING.sm }}>
                {items.map((it, idx) => (
                  <View key={idx} style={{
                    backgroundColor: COLORS.card,
                    padding: SPACING.md,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: COLORS.border
                  }}>
                    <Text variant="subtitle" style={{ marginBottom: SPACING.xs }}>
                      {it.date}
                    </Text>
                    <Text variant="body" style={{ color: COLORS.mutedForeground }}>
                      {it.steps} passos
                    </Text>
                    {it.exercise && (
                      <Text variant="body" style={{ color: COLORS.primary, marginTop: SPACING.xs }}>
                        Exercício: {it.exercise}
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </CardContent>
        </Card>
      </View>
    </Screen>
  );
}
