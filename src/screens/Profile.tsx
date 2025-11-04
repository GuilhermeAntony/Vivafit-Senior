import React, { useEffect, useState } from 'react';
import { View, Alert, ActivityIndicator } from 'react-native';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Screen } from '../components/ui/screen';
import { Header } from '../components/ui/header';
import { ActivityLevelPicker } from '../components/ui/activity-level-picker';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { SPACING, COLORS } from '../styles/designTokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function Profile({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [displayName, setDisplayName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [activityLevel, setActivityLevel] = useState(1);
  const [healthLimitations, setHealthLimitations] = useState('');

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        // Primeiro, tentar carregar dados locais (AsyncStorage)
        const localData = await AsyncStorage.getItem('userProfile');
        if (localData && mounted) {
          const profile = JSON.parse(localData);
          setDisplayName(profile.displayName || '');
          setAge(profile.age?.toString() || '');
          setWeight(profile.weight?.toString() || '');
          setActivityLevel(profile.activityLevel ?? 1);
          setHealthLimitations(profile.healthLimitations || '');
          setLoading(false);
          return;
        }

        // Se não há dados locais e Supabase está configurado, tentar buscar do Supabase
        if (isSupabaseConfigured()) {
          try {
            const { data: { session } } = await supabase.auth.getSession();
            const user = session?.user;
            
            if (!user) {
              console.log('⚠️ Usuário não autenticado, usando modo offline');
              setLoading(false);
              return;
            }

            const { data, error } = await supabase.from('profiles').select('*').eq('user_id', user.id).single();
            if (error && (error as any).code !== 'PGRST116') {
              console.log('ℹ Erro ao conectar com Supabase, usando apenas armazenamento local');
              setLoading(false);
              return;
            }

            if (data && mounted) {
              setDisplayName(data.display_name || '');
              setAge(data.age?.toString() || '');
              setWeight(data.weight?.toString() || '');
              const activityMap: any = { 'sedentary': 0, 'low': 1, 'high': 2 }; // Baixo, Médio, Alto/Atleta
              setActivityLevel(activityMap[data.activity_level] ?? 1);
              setHealthLimitations(data.health_limitations || '');
            }
          } catch (err: any) {
            console.log('ℹ Erro ao acessar Supabase, usando apenas armazenamento local');
          }
        } else {
          console.log('ℹ Supabase não configurado, usando apenas armazenamento local');
        }
      } catch (err: any) {
        console.warn('Erro ao carregar perfil:', err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();

    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);

      if (!age || !weight) {
        Alert.alert('Validação', 'Preencha idade e peso');
        setSaving(false);
        return;
      }

      const activityMap = ['sedentary', 'low', 'high']; // Baixo, Médio, Alto/Atleta
      const profileData = {
        displayName: displayName,
        age: parseInt(age, 10),
        weight: parseFloat(weight),
        activityLevel: activityLevel,
        healthLimitations: healthLimitations,
      };

      // Salvar localmente sempre
      await AsyncStorage.setItem('userProfile', JSON.stringify(profileData));

      // Tentar salvar no Supabase apenas se estiver configurado
      if (isSupabaseConfigured()) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          const user = session?.user;
          
          if (user) {
            const supabaseProfileData = {
              user_id: user.id,
              display_name: displayName || user.user_metadata?.name || user.email,
              age: parseInt(age, 10),
              weight: parseFloat(weight),
              activity_level: activityMap[activityLevel] as 'sedentary' | 'low' | 'high',
              health_limitations: healthLimitations,
            };

            const { error } = await supabase.from('profiles').upsert(supabaseProfileData, { onConflict: 'user_id' });
            if (error) {
              console.log('ℹ Erro ao salvar no Supabase, dados salvos localmente');
            } else {
              console.log(' Perfil salvo no Supabase com sucesso');
            }
          } else {
            console.log('ℹ Usuário não autenticado - salvando apenas localmente');
          }
        } catch (supabaseError: any) {
          console.log('ℹ Erro ao conectar com Supabase, dados salvos localmente');
        }
      } else {
        console.log('ℹ Dados salvos apenas localmente (Supabase não configurado)');
      }

      Alert.alert('Sucesso', 'Perfil salvo com sucesso');
    } catch (err: any) {
      Alert.alert('Erro', err.message || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text variant="body" style={{ marginTop: SPACING.md }}>
            Carregando perfil...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <Header title="Perfil" />
      
      <Card variant="senior">
        <CardHeader>
          <Text variant="heading-2" style={{ textAlign: 'center' }}>
            Cadastro
          </Text>
        </CardHeader>
        
        <CardContent style={{ gap: SPACING.lg }}>
          <View>
            <Label style={{ marginBottom: SPACING.sm }}>
              <Text variant="senior-large">Nome de exibição</Text>
            </Label>
            <Input 
              size="senior"
              value={displayName} 
              onChangeText={setDisplayName} 
              placeholder="Como você gostaria de ser chamado?"
            />
          </View>

          <View>
            <Label style={{ marginBottom: SPACING.sm }}>
              <Text variant="senior-large">Idade *</Text>
            </Label>
            <Input 
              size="senior"
              value={age} 
              onChangeText={setAge} 
              keyboardType="numeric" 
              placeholder="Sua idade"
            />
          </View>

          <View>
            <Label style={{ marginBottom: SPACING.sm }}>
              <Text variant="senior-large">Peso (kg) *</Text>
            </Label>
            <Input 
              size="senior"
              value={weight} 
              onChangeText={setWeight} 
              keyboardType="numeric" 
              placeholder="Seu peso em quilogramas"
            />
          </View>

          <View>
            <Label style={{ marginBottom: SPACING.md }}>
              <Text variant="senior-large">Nível de atividade</Text>
            </Label>
            
            <ActivityLevelPicker 
              value={activityLevel}
              onChange={setActivityLevel}
              size="senior"
            />
          </View>

          <View>
            <Label style={{ marginBottom: SPACING.sm }}>
              <Text variant="senior-large">Limitações de saúde</Text>
            </Label>
            <Input 
              size="senior"
              value={healthLimitations} 
              onChangeText={setHealthLimitations} 
              placeholder="Descreva qualquer limitação médica"
              multiline
              numberOfLines={3}
              style={{ height: 80, textAlignVertical: 'top' }}
            />
          </View>

          <Button 
            size="senior"
            onPress={handleSave} 
            disabled={saving}
            style={{ marginTop: SPACING.lg }}
          >
            {saving ? 'Salvando...' : 'Salvar Perfil'}
          </Button>
        </CardContent>
      </Card>
    </Screen>
  );
}
