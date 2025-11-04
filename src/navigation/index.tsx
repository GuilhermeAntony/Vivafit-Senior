import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/Dashboard';
import LoginScreen from '../screens/Login';
import ProfileScreen from '../screens/Profile';
import ExercisesScreen from '../screens/Exercises';
import WorkoutScreen from '../screens/Workout';
import ProgressScreen from '../screens/Progress';
import OnboardingScreen from '../screens/Onboarding';
import SettingsScreen from '../screens/Settings';
import ExerciseDetailScreen from '../screens/ExerciseDetail';
import PlansScreen from '../screens/Plans';
import HistoryScreen from '../screens/History';
import { Exercise } from '../lib/exerciseData';

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: undefined;
  Exercises: undefined;
  Workout: { exercise?: Exercise } | undefined;
  Onboarding: undefined;
  Settings: undefined;
  ExerciseDetail: { id?: string } | undefined;
  Plans: undefined;
  History: undefined;
  Progress: undefined;
  Tips: undefined;
  DebugLogs: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Início' }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Exercises" component={ExercisesScreen} options={{ title: 'Exercícios' }} />
        <Stack.Screen name="Workout" component={WorkoutScreen} options={{ title: 'Treino' }} />
        <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} options={{ title: 'Detalhes do Exercício' }} />
        <Stack.Screen name="Plans" component={PlansScreen} options={{ title: 'Planos' }} />
        <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Histórico' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        <Stack.Screen name="Progress" component={ProgressScreen} options={{ title: 'Progresso' }} />
  <Stack.Screen name="Tips" component={require('../screens/Tips').default} options={{ title: 'Dicas' }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Opções' }} />
        <Stack.Screen name="DebugLogs" component={require('../screens/DebugLogs').default} options={{ title: 'Debug Logs' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
