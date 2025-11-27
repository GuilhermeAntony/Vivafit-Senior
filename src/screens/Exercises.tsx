import React, { useMemo, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Screen } from '../components/ui/screen';
import { Header } from '../components/ui/header';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Text } from '../components/ui/text';
import { Input } from '../components/ui/input';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { SPACING, COLORS } from '../styles/designTokens';
import { 
  PREDEFINED_EXERCISES, 
  EXERCISE_CATEGORIES, 
  DIFFICULTY_COLORS, 
  CATEGORY_COLORS,
  Exercise 
} from '../lib/exerciseData';

type Props = NativeStackScreenProps<RootStackParamList, 'Exercises'>;

export default function Exercises({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended'|'duration'|'difficulty'>('recommended');

  const filtered = useMemo(() => {
    let list = selectedCategory === 'Todos' 
      ? PREDEFINED_EXERCISES.slice() 
      : PREDEFINED_EXERCISES.filter(e => e.category === selectedCategory);
    
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(e => e.name.toLowerCase().includes(q) || e.description.toLowerCase().includes(q));
    }
    
    if (sortBy === 'duration') {
      list.sort((a,b) => a.duration - b.duration);
    } else if (sortBy === 'difficulty') {
      const rank: any = { 'Baixo': 0, 'Médio': 1, 'Alto': 2 };
      list.sort((a,b) => (rank[a.difficulty] || 0) - (rank[b.difficulty] || 0));
    }
    
    return list;
  }, [selectedCategory, query, sortBy]);

  const getDifficultyColor = (difficulty: string): string => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || '#6b7280';
  };

  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6b7280';
  };

  const startExercise = (exercise: Exercise) => {
    navigation.navigate('Workout', { exercise });
  };

  const handleBack = () => {
    navigation.goBack();
  };

  function ExerciseImage({ imageUrl }: { imageUrl?: any }) {
    return (
      <Image
        source={imageUrl || require('../../assets/icon.png')}
        style={{ width: 84, height: 84, borderRadius: 8, backgroundColor: '#f3f4f6' }}
        resizeMode="cover"
      />
    );
  }

  return (
    <Screen scrollable={true}>
      <Header title="Exercícios" />
      
      <View style={{ gap: SPACING.lg }}>
        {/* Busca e filtros */}
        <Card variant="senior">
          <CardContent>
            <View style={{ gap: SPACING.md }}>
              <Input
                placeholder="Buscar exercícios..."
                value={query}
                onChangeText={setQuery}
                size="senior"
              />
              
              <View>
                <Text variant="subtitle" style={{ marginBottom: SPACING.sm }}>Ordenar por:</Text>
                <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                  <TouchableOpacity 
                    onPress={() => setSortBy('recommended')} 
                    style={{ 
                      padding: SPACING.sm, 
                      borderRadius: 8, 
                      backgroundColor: sortBy === 'recommended' ? COLORS.primary : COLORS.muted,
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <Text variant="body" style={{ color: sortBy === 'recommended' ? COLORS.primaryForeground : COLORS.foreground }}>
                      Recomendados
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setSortBy('duration')} 
                    style={{ 
                      padding: SPACING.sm, 
                      borderRadius: 8, 
                      backgroundColor: sortBy === 'duration' ? COLORS.primary : COLORS.muted,
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <Text variant="body" style={{ color: sortBy === 'duration' ? COLORS.primaryForeground : COLORS.foreground }}>
                      Duração
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setSortBy('difficulty')} 
                    style={{ 
                      padding: SPACING.sm, 
                      borderRadius: 8, 
                      backgroundColor: sortBy === 'difficulty' ? COLORS.primary : COLORS.muted,
                      flex: 1,
                      alignItems: 'center'
                    }}
                  >
                    <Text variant="body" style={{ color: sortBy === 'difficulty' ? COLORS.primaryForeground : COLORS.foreground }}>
                      Dificuldade
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>
        
        {/* Filtro de categorias */}
        <Card variant="senior">
          <CardHeader>
            <Text variant="heading-3">Categorias</Text>
          </CardHeader>
          <CardContent>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false} 
              contentContainerStyle={{ paddingVertical: SPACING.xs, gap: SPACING.sm }}
            >
              {EXERCISE_CATEGORIES.map((category: string) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={{
                    backgroundColor: selectedCategory === category ? COLORS.primary : 'transparent',
                    borderColor: COLORS.primary,
                    borderWidth: 1,
                    borderRadius: 20,
                    paddingHorizontal: SPACING.md,
                    paddingVertical: SPACING.sm,
                    minWidth: 80,
                    alignItems: 'center'
                  }}
                >
                  <Text variant="body" style={{
                    color: selectedCategory === category ? COLORS.primaryForeground : COLORS.primary,
                    fontWeight: '600'
                  }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </CardContent>
        </Card>

        {/* Lista de exercícios */}
        <View style={{ gap: SPACING.md }}>
          {filtered.map((exercise: any) => (
              <Card key={exercise.id} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
                <CardHeader style={{ paddingBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                    <ExerciseImage imageUrl={exercise.imageUrl} />
                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937', flex: 1 }}>
                          {exercise.name}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <View style={{
                            backgroundColor: getDifficultyColor(exercise.difficulty),
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12
                          }}>
                            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                              {exercise.difficulty}
                            </Text>
                          </View>
                          <View style={{
                            backgroundColor: getCategoryColor(exercise.category),
                            paddingHorizontal: 8,
                            paddingVertical: 4,
                            borderRadius: 12
                          }}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                            {exercise.category}
                          </Text>
                        </View>
                      </View>
                    </View>

                    </View>
                  </View>
                </CardHeader>

                <CardContent style={{ gap: 16, paddingTop: 8 }}>
                      <Text style={{ fontSize: 18, color: '#6b7280', lineHeight: 24 }}>
                        {exercise.description}
                      </Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 16 }}>⏱️</Text>
                    <Text style={{ fontSize: 14 }}>{exercise.duration} min</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Text style={{ fontSize: 16 }}>🎯</Text>
                    <Text style={{ fontSize: 14 }}>{exercise.category}</Text>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>Benefícios:</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {exercise.benefits.map((benefit: string, index: number) => (
                      <View
                        key={index}
                        style={{
                          borderColor: '#d1d5db',
                          borderWidth: 1,
                          borderRadius: 16,
                          paddingHorizontal: 8,
                          paddingVertical: 4
                        }}
                      >
                        <Text style={{ fontSize: 12, color: '#6b7280' }}>
                          {benefit}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => startExercise(exercise)}
                    style={{
                      backgroundColor: '#0ea5a3',
                      borderRadius: 8,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Text style={{ fontSize: 16, color: '#fff', marginRight: 8 }}>▶️</Text>
                    <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                      Iniciar
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('ExerciseDetail', { id: exercise.id })}
                    style={{
                      backgroundColor: '#fff',
                      borderRadius: 8,
                      padding: 12,
                      borderWidth: 1,
                      borderColor: '#e5e7eb'
                    }}
                  >
                    <Text style={{ color: '#111' }}>Detalhes</Text>
                  </TouchableOpacity>
                </View>
              </CardContent>
            </Card>
          ))
        }
        </View>
      </View>
    </Screen>
  );
}
