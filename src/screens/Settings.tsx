import React, { useEffect, useState } from 'react';
import { View, Switch, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { clearExerciseCache } from '../lib/exerciseCache';
import { Screen } from '../components/ui/screen';
import { Header } from '../components/ui/header';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Text } from '../components/ui/text';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { SPACING, COLORS } from '../styles/designTokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function Settings({ navigation }: Props) {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [fontSize, setFontSize] = useState<'small'|'normal'|'large'>('normal');

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem('userProfile');
        if (v) {
          const p = JSON.parse(v);
          setName(p.name || '');
          setAge(String(p.age || ''));
        }
        const pref = await AsyncStorage.getItem('prefs');
        if (pref) {
          const pr = JSON.parse(pref);
          setNotifications(pr.notifications ?? true);
          setFontSize(pr.fontSize ?? 'normal');
        }
      } catch (e) { /* ignore */ }
    })();
  }, []);

  const saveProfile = async () => {
    try {
      const p = { name, age: Number(age || 0) };
      await AsyncStorage.setItem('userProfile', JSON.stringify(p));
      // try upsert to supabase profiles (se configurado)
      if (isSupabaseConfigured()) {
        try {
          const user = (await supabase.auth.getUser()).data?.user;
          if (user) {
            await supabase.from('profiles').upsert({ id: user.id, full_name: name, age: Number(age || 0) });
          }
        } catch (e) {
          console.log(' Erro ao salvar no Supabase, dados salvos localmente');
        }
      }
      Alert.alert('Salvo', 'Perfil salvo com sucesso.');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o perfil.');
    }
  };

  const savePrefs = async () => {
    await AsyncStorage.setItem('prefs', JSON.stringify({ notifications, fontSize }));
    Alert.alert('Preferências', 'Preferências salvas.');
  };

  const doLogout = async () => {
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (e) { 
        console.log(' Erro ao fazer logout no Supabase'); 
      }
    }
    // clear local session-ish keys
    await AsyncStorage.removeItem('userProfile');
    await AsyncStorage.removeItem('subscribedPlan');
    await AsyncStorage.removeItem('hasOnboarded');
    Alert.alert('Logout', 'Você foi desconectado.');
    navigation.replace('Login');
  };

  const clearCache = async () => {
    await clearExerciseCache();
    Alert.alert('Cache', 'Cache de exercícios limpo.');
  };

  return (
    <Screen scrollable={true}>
      <Header title="Opções" />
      
      <View style={{ gap: SPACING.lg }}>
        {/* Perfil do usuário */}
        <Card variant="senior">
          <CardHeader>
            <Text variant="heading-3">Informações Pessoais</Text>
          </CardHeader>
          <CardContent>
            <View style={{ gap: SPACING.md }}>
              <View>
                <Text variant="subtitle" style={{ marginBottom: SPACING.xs }}>Nome</Text>
                <Input 
                  value={name} 
                  onChangeText={setName} 
                  placeholder="Seu nome"
                  size="senior"
                />
              </View>
              
              <View>
                <Text variant="subtitle" style={{ marginBottom: SPACING.xs }}>Idade</Text>
                <Input 
                  value={age} 
                  onChangeText={setAge} 
                  placeholder="Sua idade"
                  keyboardType="numeric"
                  size="senior"
                />
              </View>
              
              <Button onPress={saveProfile} variant="default" size="senior">
                Salvar Perfil
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Preferências */}
        <Card variant="senior">
          <CardHeader>
            <Text variant="heading-3">Preferências</Text>
          </CardHeader>
          <CardContent>
            <View style={{ gap: SPACING.lg }}>
              {/* Notificações */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text variant="body">Notificações</Text>
                <Switch 
                  value={notifications} 
                  onValueChange={setNotifications}
                  trackColor={{ false: COLORS.muted, true: COLORS.primary }}
                  thumbColor={notifications ? COLORS.primaryForeground : COLORS.mutedForeground}
                />
              </View>

              {/* Tamanho da fonte */}
              <View>
                <Text variant="subtitle" style={{ marginBottom: SPACING.sm }}>Tamanho da fonte</Text>
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  {(['small','normal','large'] as const).map(sz => (
                    <TouchableOpacity 
                      key={sz} 
                      onPress={() => setFontSize(sz)} 
                      style={{
                        paddingVertical: SPACING.sm,
                        paddingHorizontal: SPACING.md,
                        borderRadius: 8,
                        backgroundColor: fontSize === sz ? COLORS.primary : COLORS.muted,
                        flex: 1,
                        alignItems: 'center'
                      }}
                    >
                      <Text variant="body" style={{ 
                        color: fontSize === sz ? COLORS.primaryForeground : COLORS.foreground 
                      }}>
                        {sz === 'small' ? 'Pequena' : sz === 'normal' ? 'Normal' : 'Grande'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <Button onPress={savePrefs} variant="secondary" size="senior">
                Salvar Preferências
              </Button>
            </View>
          </CardContent>
        </Card>

        {/* Ações do sistema */}
        <Card variant="senior">
          <CardHeader>
            <Text variant="heading-3">Sistema</Text>
          </CardHeader>
          <CardContent>
            <View style={{ gap: SPACING.md }}>
              <Button 
                onPress={() => navigation.navigate('DebugLogs')} 
                variant="outline" 
                size="senior"
              >
                🐛 Ver Logs de Debug
              </Button>
              
              <Button onPress={clearCache} variant="outline" size="senior">
                Limpar Cache de Exercícios
              </Button>
              
              <Button onPress={doLogout} variant="destructive" size="senior">
                Sair da Conta
              </Button>
            </View>
          </CardContent>
        </Card>
      </View>
    </Screen>
  );
}


