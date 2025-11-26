import React, { useMemo, useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator, Alert } from 'react-native';
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

type WgerExercise = {
  id: number;
  name: string;
  description: string;
  category: {
    id: number;
    name: string;
  };
  muscles: Array<{ id: number; name: string; name_en: string; }>;
  equipment: Array<{ id: number; name: string; }>;
  images: Array<{ id: number; image: string; }>;
};

export default function Exercises({ navigation }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [selectedSource, setSelectedSource] = useState<'local'|'wger'>('local');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended'|'duration'|'difficulty'>('recommended');
  const [wgerExercises, setWgerExercises] = useState<WgerExercise[]>([]);
  const [loadingWger, setLoadingWger] = useState(false);
  const [wgerPage, setWgerPage] = useState(1);
  const [hasMoreWger, setHasMoreWger] = useState(true);

  // Carregar exercícios do WGER
  useEffect(() => {
    if (selectedSource === 'wger' && wgerExercises.length === 0) {
      loadWgerExercises();
    }
  }, [selectedSource]);

  const loadWgerExercises = async (page = 1) => {
    if (loadingWger) return;
    setLoadingWger(true);
    try {
      const headers = {
        'Accept': 'application/json',
        'Accept-Language': 'pt-BR,pt'
      };
      
      const response = await fetch(
        `https://wger.de/api/v2/exerciseinfo/?limit=20&offset=${(page - 1) * 20}&language=2`, 
        { headers }
      );
      
      if (!response.ok) throw new Error('Erro ao carregar exercícios');
      
      const data = await response.json();
      
      if (page === 1) {
        setWgerExercises(data.results || []);
      } else {
        setWgerExercises(prev => [...prev, ...(data.results || [])]);
      }
      
      setHasMoreWger(!!data.next);
      setWgerPage(page);
    } catch (error) {
      console.error('Erro ao carregar WGER:', error);
      Alert.alert('Erro', 'Não foi possível carregar exercícios do WGER');
    } finally {
      setLoadingWger(false);
    }
  };

  const filtered = useMemo(() => {
    if (selectedSource === 'wger') {
      // Filtrar exercícios do WGER
      let list = wgerExercises.slice();
      if (query.trim()) {
        const q = query.toLowerCase();
        list = list.filter(e => 
          e.name.toLowerCase().includes(q) || 
          e.description.toLowerCase().includes(q)
        );
      }
      return list;
    } else {
      // Exercícios locais
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
    }
  }, [selectedCategory, selectedSource, query, sortBy, wgerExercises]);

  const getDifficultyColor = (difficulty: string): string => {
    return DIFFICULTY_COLORS[difficulty as keyof typeof DIFFICULTY_COLORS] || '#6b7280';
  };

  const getCategoryColor = (category: string): string => {
    return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6b7280';
  };

  const startExercise = (exercise: Exercise | WgerExercise) => {
    if (selectedSource === 'wger') {
      // Navegar para detalhes do exercício WGER
      navigation.navigate('ExerciseDetail', { id: String((exercise as WgerExercise).id) });
    } else {
      // Exercício local - ir direto para workout
      navigation.navigate('Workout', { exercise: exercise as Exercise });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  function ExerciseImage({ imageUrl, wgerImages }: { imageUrl?: any; wgerImages?: Array<{image: string}> }) {
    // Para exercícios locais: imageUrl é um require()
    // Para exercícios WGER: wgerImages é array de URLs
    if (wgerImages && wgerImages.length > 0) {
      return (
        <Image
          source={{ uri: wgerImages[0].image }}
          style={{ width: 84, height: 84, borderRadius: 8, backgroundColor: '#f3f4f6' }}
          resizeMode="cover"
        />
      );
    }
    
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
        {/* Seletor de fonte de exercícios */}
        <Card variant="senior">
          <CardContent>
            <View style={{ gap: SPACING.sm }}>
              <Text variant="subtitle">Fonte dos exercícios:</Text>
              <View style={{ flexDirection: 'row', gap: SPACING.sm }}>
                <TouchableOpacity 
                  onPress={() => setSelectedSource('local')} 
                  style={{ 
                    padding: SPACING.md, 
                    borderRadius: 8, 
                    backgroundColor: selectedSource === 'local' ? COLORS.primary : COLORS.muted,
                    flex: 1,
                    alignItems: 'center'
                  }}
                >
                  <Text variant="body" style={{ color: selectedSource === 'local' ? COLORS.primaryForeground : COLORS.foreground, fontWeight: '600' }}>
                    Locais ({PREDEFINED_EXERCISES.length})
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => setSelectedSource('wger')} 
                  style={{ 
                    padding: SPACING.md, 
                    borderRadius: 8, 
                    backgroundColor: selectedSource === 'wger' ? COLORS.primary : COLORS.muted,
                    flex: 1,
                    alignItems: 'center'
                  }}
                >
                  <Text variant="body" style={{ color: selectedSource === 'wger' ? COLORS.primaryForeground : COLORS.foreground, fontWeight: '600' }}>
                    WGER API {loadingWger && <ActivityIndicator size="small" color={selectedSource === 'wger' ? '#fff' : COLORS.primary} />}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </CardContent>
        </Card>

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
              
              {selectedSource === 'local' && (
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
              )}
            </View>
          </CardContent>
        </Card>
        
        {/* Filtro de categorias - apenas para exercícios locais */}
        {selectedSource === 'local' && (
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
        )}

        {/* Lista de exercícios */}
        <View style={{ gap: SPACING.md }}>
          {selectedSource === 'local' ? (
            // Exercícios locais
            filtered.map((exercise: any) => (
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
          ) : (
            // Exercícios WGER
            <>
              {filtered.map((exercise: any) => (
                <Card key={exercise.id} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
                  <CardHeader style={{ paddingBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                      <ExerciseImage wgerImages={exercise.images} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#1f2937' }}>
                          {exercise.name}
                        </Text>
                        {exercise.category && (
                          <View style={{ marginTop: 6 }}>
                            <View style={{
                              backgroundColor: '#dbeafe',
                              paddingHorizontal: 8,
                              paddingVertical: 4,
                              borderRadius: 12,
                              alignSelf: 'flex-start'
                            }}>
                              <Text style={{ color: '#1e40af', fontSize: 12, fontWeight: '600' }}>
                                {exercise.category.name}
                              </Text>
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </CardHeader>

                  <CardContent style={{ gap: 16, paddingTop: 8 }}>
                    <Text style={{ fontSize: 15, color: '#6b7280', lineHeight: 22 }} numberOfLines={3}>
                      {exercise.description.replace(/<[^>]+>/g, '').substring(0, 150)}...
                    </Text>

                    {exercise.muscles && exercise.muscles.length > 0 && (
                      <View style={{ gap: 6 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Músculos:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                          {exercise.muscles.slice(0, 3).map((muscle: any) => (
                            <View
                              key={muscle.id}
                              style={{
                                backgroundColor: '#fef3c7',
                                borderRadius: 12,
                                paddingHorizontal: 8,
                                paddingVertical: 4
                              }}
                            >
                              <Text style={{ fontSize: 11, color: '#92400e', fontWeight: '600' }}>
                                {muscle.name_en}
                              </Text>
                            </View>
                          ))}
                          {exercise.muscles.length > 3 && (
                            <Text style={{ fontSize: 11, color: '#6b7280', alignSelf: 'center' }}>
                              +{exercise.muscles.length - 3}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}

                    {exercise.equipment && exercise.equipment.length > 0 && (
                      <View style={{ gap: 6 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#374151' }}>Equipamentos:</Text>
                        <Text style={{ fontSize: 13, color: '#6b7280' }}>
                          {exercise.equipment.map((eq: any) => eq.name).join(', ')}
                        </Text>
                      </View>
                    )}

                    <TouchableOpacity
                      onPress={() => startExercise(exercise)}
                      style={{
                        backgroundColor: '#0ea5a3',
                        borderRadius: 8,
                        padding: 14,
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700' }}>
                        Ver Detalhes
                      </Text>
                    </TouchableOpacity>
                  </CardContent>
                </Card>
              ))}
              
              {loadingWger && (
                <View style={{ padding: 20, alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#0ea5a3" />
                  <Text style={{ marginTop: 8, color: '#6b7280' }}>Carregando mais exercícios...</Text>
                </View>
              )}
              
              {!loadingWger && hasMoreWger && filtered.length > 0 && (
                <Button 
                  onPress={() => loadWgerExercises(wgerPage + 1)}
                  variant="outline"
                  size="senior"
                >
                  Carregar Mais
                </Button>
              )}
            </>
          )}
        </View>
      </View>
    </Screen>
  );
}
