import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation';
import Card, { CardContent, CardHeader } from '../components/ui/card';
import Progress from '../components/ui/progress';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  convertExerciseToWorkout,
  getWorkoutByActivityLevel,
  WorkoutStep
} from '../lib/exerciseData';

type Props = NativeStackScreenProps<RootStackParamList, 'Workout'>;

export default function Workout({ route, navigation }: Props) {
  const [isFinalizing, setIsFinalizing] = useState(false);
  const exercise = route.params?.exercise;

  const [workoutSteps, setWorkoutSteps] = useState<WorkoutStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0); // segundos
  const [isActive, setIsActive] = useState(false);
  const [isResting, setIsResting] = useState(false);
  const [workoutComplete, setWorkoutComplete] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Inicializa steps com base no exercício passado ou no perfil do usuário
  useEffect(() => {
    const initialize = async () => {
      let steps: WorkoutStep[] = [];
      if (exercise) {
        steps = convertExerciseToWorkout(exercise);
      } else {
        try {
          const userProfile = await AsyncStorage.getItem('userProfile');
          const profile = userProfile ? JSON.parse(userProfile) : { activityLevel: 1 };
          steps = getWorkoutByActivityLevel(profile.activityLevel ?? 1);
        } catch (err) {
          console.error('Erro ao ler perfil, usando padrão:', err);
          steps = getWorkoutByActivityLevel(1);
        }
      }

      setWorkoutSteps(steps);
      setCurrentStepIndex(0);
      setIsResting(false);
      setIsActive(false);
      setWorkoutComplete(false);
      setTimeRemaining(steps[0]?.duration || 0);
    };

    initialize();
  }, [exercise]);

  // Timer effect: conta regressiva e transições entre steps/rest
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    intervalRef.current = setInterval(() => {
      setTimeRemaining((t) => t - 1);
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  // Observa quando o tempo chega a zero para transições
  useEffect(() => {
    if (timeRemaining > 0) return;

    // se já está em descanso, terminar descanso e avançar
    if (isResting) {
      setIsResting(false);
      if (currentStepIndex < workoutSteps.length - 1) {
        const next = currentStepIndex + 1;
        setCurrentStepIndex(next);
        setTimeRemaining(workoutSteps[next].duration);
        setIsActive(true);
      } else {
        // sem próximos passos
        setWorkoutComplete(true);
        setIsActive(false);
      }
      return;
    }

    // se não está em descanso, terminou a parte principal do step
    const current = workoutSteps[currentStepIndex];
    if (!current) return;

    if (current.restDuration && currentStepIndex < workoutSteps.length - 1) {
      setIsResting(true);
      setTimeRemaining(current.restDuration);
      setIsActive(true);
    } else if (currentStepIndex < workoutSteps.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      setTimeRemaining(workoutSteps[next].duration);
      setIsActive(true);
    } else {
      setWorkoutComplete(true);
      setIsActive(false);
    }
  }, [timeRemaining, isResting, currentStepIndex, workoutSteps]);

  const togglePlayPause = () => {
    if (workoutComplete) return;
    setIsActive((s) => !s);
  };

  const skipToNext = () => {
    if (currentStepIndex < workoutSteps.length - 1) {
      const next = currentStepIndex + 1;
      setCurrentStepIndex(next);
      setIsResting(false);
      setTimeRemaining(workoutSteps[next].duration);
      setIsActive(true);
    } else {
      // completar
      finishAndSave();
    }
  };

  const resetWorkout = () => {
    setIsActive(false);
    setIsResting(false);
    setCurrentStepIndex(0);
    setTimeRemaining(workoutSteps[0]?.duration || 0);
    setWorkoutComplete(false);
  };

  const finishAndSave = async () => {
    setIsFinalizing(true);
    // Bloqueio de 1 minuto entre finalizações
    const lastFinish = await AsyncStorage.getItem('lastWorkoutFinish');
    const now = Date.now();
    if (lastFinish && now - parseInt(lastFinish, 10) < 60000) {
      Alert.alert('Aguarde', 'Você só pode finalizar um treino a cada 1 minuto.');
      setIsFinalizing(false);
      return;
    }
  await AsyncStorage.setItem('lastWorkoutFinish', now.toString());
  setIsFinalizing(false);
    try {
      const today = new Date().toISOString().split('T')[0];
      const exerciseName = exercise?.name || 'Treino Personalizado';
      
      // Salvar localmente primeiro (garantia de backup)
      const completedWorkouts = await AsyncStorage.getItem('completedWorkouts');
      const workouts = completedWorkouts ? JSON.parse(completedWorkouts) : [];
      const newWorkout = {
        date: today,
        steps: workoutSteps.length,
        exerciseName: exerciseName,
        duration_seconds: workoutSteps.reduce((sum, step) => sum + step.duration, 0)
      };
      workouts.push(newWorkout);
      await AsyncStorage.setItem('completedWorkouts', JSON.stringify(workouts));

      // Tentar salvar no Supabase se estiver configurado
      if (isSupabaseConfigured()) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          
          if (user) {
            const { error } = await supabase.from('completed_workouts').insert({
              user_id: user.id,
              date: today,
              steps: workoutSteps.length,
              exercise: exerciseName,
              exercise_name: exerciseName,
              duration_seconds: newWorkout.duration_seconds,
              metadata: {
                workoutSteps: workoutSteps.length,
                completedAt: new Date().toISOString()
              }
            });

            if (error) {
              console.error('❌ Erro ao salvar no Supabase:', error);
              // Não falhar o fluxo, dados estão salvos localmente
            } else {
              console.log('✅ Treino salvo no Supabase com sucesso!');
            }
          } else {
            console.log('⚠️ Usuário não autenticado, salvando apenas localmente');
          }
        } catch (supabaseErr) {
          console.error('⚠️ Erro ao conectar com Supabase:', supabaseErr);
          // Continuar mesmo com erro, dados estão salvos localmente
        }
      } else {
        console.log('ℹ️ Supabase não configurado, salvando apenas localmente');
      }

      setWorkoutComplete(true);
      setIsActive(false);

      Alert.alert('Parabéns! 🎉', 'Treino completado com sucesso!', [
        { text: 'Ver Progresso', onPress: () => navigation.navigate('Progress') },
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (err) {
      console.error('Erro ao salvar treino:', err);
      Alert.alert('Erro', 'Não foi possível salvar o progresso do treino.');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentStep = workoutSteps[currentStepIndex];
  const overallProgress = workoutSteps.length
    ? ((currentStepIndex + (currentStep ? (currentStep.duration - timeRemaining) / currentStep.duration : 0)) / workoutSteps.length) * 100
    : 0;

  if (workoutComplete) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
            <Text style={{ fontSize: 24 }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '600', marginLeft: 16 }}>Treino</Text>
        </View>

        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 }}>
          <Card style={{ width: '100%', maxWidth: 420, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
            <CardContent style={{ padding: 24, alignItems: 'center', gap: 16 }}>
              <Text style={{ fontSize: 64 }}>✅</Text>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#10b981' }}>Parabéns!</Text>
              <Text style={{ color: '#6b7280', textAlign: 'center' }}>Você completou o treino.</Text>

              <TouchableOpacity
                onPress={() => {
                  finishAndSave();
                }}
                style={{ backgroundColor: '#0ea5a3', padding: 12, borderRadius: 8, width: '100%', alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>Ver Progresso</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetWorkout}
                style={{ borderColor: '#0ea5a3', borderWidth: 1, padding: 12, borderRadius: 8, width: '100%', alignItems: 'center' }}
              >
                <Text style={{ color: '#0ea5a3', fontWeight: '700' }}>Repetir Treino</Text>
              </TouchableOpacity>
            </CardContent>
          </Card>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 8 }}>
          <Text style={{ fontSize: 24 }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '600', marginLeft: 16 }}>Treino</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 24 }}>
        <Card style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
          <CardContent style={{ paddingTop: 16, gap: 12 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: '#6b7280' }}>Passo {currentStepIndex + 1} de {workoutSteps.length}</Text>
            </View>
            <Progress value={overallProgress} />
          </CardContent>
        </Card>

        <Card style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
          <CardHeader>
            <Text style={{ fontSize: 22, fontWeight: '700', color: '#0ea5a3', textAlign: 'center' }}>{isResting ? 'Descanso' : currentStep?.name}</Text>
          </CardHeader>

          <CardContent style={{ gap: 20, alignItems: 'center' }}>
            <Text style={{ fontSize: 56, fontWeight: '700', color: '#0ea5a3' }}>{formatTime(timeRemaining)}</Text>

            <Text style={{ color: '#6b7280', textAlign: 'center' }}>{isResting ? 'Aproveite esse breve descanso.' : currentStep?.instruction}</Text>

            <View style={{ flexDirection: 'row', gap: 12, width: '100%' }}>
              <TouchableOpacity
                onPress={togglePlayPause}
                style={{ flex: 1, backgroundColor: isActive ? '#f59e0b' : '#10b981', padding: 12, borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ color: '#fff', fontWeight: '700' }}>{isActive ? 'Pausar' : 'Iniciar'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={skipToNext}
                style={{ flex: 1, borderWidth: 1, borderColor: '#6b7280', padding: 12, borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ color: '#6b7280', fontWeight: '700' }}>Pular</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetWorkout}
                style={{ flex: 1, borderWidth: 1, borderColor: '#6b7280', padding: 12, borderRadius: 8, alignItems: 'center' }}
              >
                <Text style={{ color: '#6b7280', fontWeight: '700' }}>Reiniciar</Text>
              </TouchableOpacity>
            </View>
          </CardContent>
        </Card>

        {!isResting && workoutSteps[currentStepIndex + 1] && (
          <Card style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
            <CardContent style={{ paddingTop: 12, alignItems: 'center' }}>
              <Text style={{ color: '#6b7280' }}>Próximo:</Text>
              <Text style={{ fontWeight: '700', color: '#0ea5a3' }}>{workoutSteps[currentStepIndex + 1].name}</Text>
            </CardContent>
          </Card>
        )}

        <TouchableOpacity
          onPress={finishAndSave}
          style={{ backgroundColor: '#0ea5a3', borderRadius: 8, padding: 12, alignItems: 'center', opacity: isFinalizing ? 0.5 : 1 }}
          disabled={isFinalizing}
        >
          <Text style={{ color: '#fff', fontWeight: '700' }}>Finalizar Treino</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
