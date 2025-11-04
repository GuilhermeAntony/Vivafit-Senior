import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Screen } from '../components/ui/screen';
import { Header } from '../components/ui/header';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Text } from '../components/ui/text';
import { SPACING, COLORS } from '../styles/designTokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const menuItems = [
  { key: 'iniciar', label: 'INICIAR', route: 'Workout' as keyof RootStackParamList, variant: 'default' as const },
  { key: 'perfil', label: 'PERFIL', route: 'Profile' as keyof RootStackParamList, variant: 'secondary' as const },
  { key: 'exercicios', label: 'EXERCÍCIOS', route: 'Exercises' as keyof RootStackParamList, variant: 'secondary' as const },
  { key: 'progresso', label: 'PROGRESSO', route: 'Progress' as keyof RootStackParamList, variant: 'secondary' as const },
  { key: 'planos', label: 'PLANOS', route: 'Plans' as keyof RootStackParamList, variant: 'secondary' as const },
  { key: 'Opcoes', label: 'OPÇÕES', route: 'Settings' as keyof RootStackParamList, variant: 'secondary' as const },
];

export default function Dashboard({ navigation }: Props) {
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>('Visitante');

  useEffect(() => {
    let mounted = true;
    const check = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const displayName = session.user.user_metadata?.name || 
                               session.user.user_metadata?.display_name || 
                               session.user.email?.split('@')[0] || 
                               'Usuário';
            setUserName(displayName);
          } else {
            console.log(' Usuário não autenticado, continuando em modo offline');
          }
        } else {
          console.log(' Supabase não configurado, usando modo offline');
        }
      } catch (err) {
        console.log(' Erro ao verificar autenticação, continuando em modo offline');
      } finally {
        if (mounted) setLoading(false);
      }
    };

    check();
    return () => { mounted = false; };
  }, [navigation]);

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
            Carregando...
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scrollable>
      <Header 
        title="Dashboard" 
        showBackButton={false}
      />
      
      {/* Welcome Card */}
      <Card variant="senior" style={{ marginBottom: SPACING.xl }}>
        <CardContent style={{ alignItems: 'center', paddingVertical: SPACING.xl }}>
          <Text variant="heading-2" style={{ marginBottom: SPACING.sm }}>
            Bem-vindo, {userName}!
          </Text>
          <Text variant="body" color="mutedForeground">
            VivaFit Seniors
          </Text>
        </CardContent>
      </Card>

      {/* Menu Grid */}
      <View style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: SPACING.xl,
      }}>
        {menuItems.map((item, index) => (
          <View 
            key={item.key} 
            style={{
              width: '48%',
              marginBottom: SPACING.lg,
            }}
          >
            <Button
              size="senior"
              variant={item.variant}
              onPress={() => navigation.navigate(item.route)}
              style={{
                minHeight: 80,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {item.label}
            </Button>
          </View>
        ))}
      </View>

      {/* Quick Stats or Additional Info */}
      <Card style={{ marginTop: SPACING.lg }}>
        <CardContent>
          <Text variant="subtitle" style={{ marginBottom: SPACING.md }}>
            Dica do Dia
          </Text>
          <Text variant="body" color="mutedForeground">
            Lembre-se de se manter hidratado durante os exercícios. 
            Beba água antes, durante e após as atividades físicas.
          </Text>
        </CardContent>
      </Card>
    </Screen>
  );
}
