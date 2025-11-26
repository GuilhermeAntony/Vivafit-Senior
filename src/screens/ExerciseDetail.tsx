import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { getCachedExercise, setCachedExercise, downloadAndCacheImage } from '../lib/exerciseCache';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>;

type WgerExercise = {
  id: number;
  name: string;
  description: string;
  category?: {
    id: number;
    name: string;
  };
  muscles?: Array<{
    id: number;
    name: string;
    name_en: string;
  }>;
  muscles_secondary?: Array<{
    id: number;
    name: string;
    name_en: string;
  }>;
  equipment?: Array<{
    id: number;
    name: string;
  }>;
  license_author?: string;
  variations?: number[];
};

export default function ExerciseDetail({ route, navigation }: Props) {
  const { id } = route.params || {};
  const [loading, setLoading] = useState(false);
  const [exercise, setExercise] = useState<WgerExercise | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!id) return;
      setLoading(true);
      
      const exerciseId = typeof id === 'string' ? id : String(id);
      
      try {
        // Verificar cache primeiro
        const cached = await getCachedExercise(exerciseId);
        if (cached && mounted) {
          setExercise({ 
            id: Number(cached.id), 
            name: cached.name || '', 
            description: cached.description || '' 
          });
          if (cached.imageLocal) setImageUri(cached.imageLocal);
          else if (cached.imageRemote) setImageUri(cached.imageRemote);
        }

        // Buscar dados frescos da API WGER v2
        const headers = {
          'Accept': 'application/json',
          'Accept-Language': 'pt-BR,pt'
        };
        
        const res = await fetch(`https://wger.de/api/v2/exerciseinfo/${exerciseId}/`, { headers });
        if (!res.ok) throw new Error('Exercício não encontrado');
        
        const data = await res.json();
        if (mounted) {
          setExercise({
            id: data.id,
            name: data.name,
            description: data.description,
            category: data.category,
            muscles: data.muscles,
            muscles_secondary: data.muscles_secondary,
            equipment: data.equipment,
            variations: data.variations
          });
        }

        // Buscar imagens do exercício
        const imgRes = await fetch(`https://wger.de/api/v2/exerciseimage/?exercise=${exerciseId}`, { headers });
        let remoteImage: string | null = null;
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData?.results?.length > 0) {
            remoteImage = imgData.results[0].image;
          }
        }

        // Download e cache da imagem localmente
        let localUri: string | null = null;
        if (remoteImage) {
          localUri = await downloadAndCacheImage(exerciseId, remoteImage) as string | null;
        }

        // Salvar no cache
        await setCachedExercise(exerciseId, { 
          name: data.name, 
          description: data.description, 
          imageRemote: remoteImage ?? undefined, 
          imageLocal: (localUri ?? remoteImage) ?? undefined 
        });
        
        if (mounted) {
          if (localUri) setImageUri(localUri);
          else if (remoteImage) setImageUri(remoteImage);
        }
      } catch (e) {
        console.error('Erro ao carregar exercício WGER:', e);
        // Fallback: usar dados dos params se disponível
        const p = route.params as any;
        if (p?.exercise && mounted) {
          setExercise({ 
            id: p.exercise.id || 0, 
            name: p.exercise.name || 'Exercício', 
            description: p.exercise.description || '' 
          });
          if (p.exercise.imageUrl) setImageUri(p.exercise.imageUrl);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [id]);

  const start = () => {
    if (!exercise) return Alert.alert('Atenção', 'Dados do exercício indisponíveis.');
    navigation.navigate('Workout', { 
      exercise: { 
        id: exercise.id, 
        name: exercise.name, 
        description: exercise.description, 
        duration: 2 
      } 
    } as any);
  };

  if (loading) return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',backgroundColor:'#fff'}}>
      <ActivityIndicator size="large" color="#0ea5a3" />
      <Text style={{marginTop:12,color:'#666'}}>Carregando exercício...</Text>
    </View>
  );

  if (!exercise) return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:20}}>
      <Text style={{fontSize:16,color:'#666',textAlign:'center'}}>Exercício não encontrado</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop:16,padding:12,backgroundColor:'#0ea5a3',borderRadius:8}}>
        <Text style={{color:'#fff',fontWeight:'600'}}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, {backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'}]}>
          <Text style={{color:'#9ca3af',fontSize:12}}>Sem imagem</Text>
        </View>
      )}

      {exercise.category && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Categoria:</Text>
          <Text style={styles.infoText}>{exercise.category.name}</Text>
        </View>
      )}

      {exercise.muscles && exercise.muscles.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Músculos principais:</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4}}>
            {exercise.muscles.map((muscle) => (
              <View key={muscle.id} style={styles.tag}>
                <Text style={styles.tagText}>{muscle.name_en}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {exercise.muscles_secondary && exercise.muscles_secondary.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Músculos secundários:</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4}}>
            {exercise.muscles_secondary.map((muscle) => (
              <View key={muscle.id} style={[styles.tag, {backgroundColor:'#f3f4f6'}]}>
                <Text style={[styles.tagText, {color:'#6b7280'}]}>{muscle.name_en}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {exercise.equipment && exercise.equipment.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Equipamentos:</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4}}>
            {exercise.equipment.map((eq) => (
              <View key={eq.id} style={[styles.tag, {backgroundColor:'#fef3c7'}]}>
                <Text style={[styles.tagText, {color:'#92400e'}]}>{eq.name}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.descriptionSection}>
        <Text style={styles.infoLabel}>Descrição:</Text>
        <Text style={styles.description}>
          {exercise.description ? stripHtml(exercise.description) : 'Descrição não disponível.'}
        </Text>
      </View>

      <TouchableOpacity onPress={start} style={styles.startButton}>
        <Text style={styles.startButtonText}>Iniciar Treino</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

const styles = StyleSheet.create({
  container: { 
    padding: 16,
    paddingBottom: 32,
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    marginBottom: 16,
    color: '#1f2937'
  },
  image: { 
    width: '100%', 
    height: 220, 
    borderRadius: 12, 
    marginBottom: 20,
    backgroundColor: '#f3f4f6'
  },
  infoSection: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4
  },
  infoText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 2
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#dbeafe',
    borderRadius: 16
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1e40af'
  },
  descriptionSection: {
    marginTop: 8,
    marginBottom: 24
  },
  description: { 
    color: '#4b5563', 
    lineHeight: 22,
    fontSize: 15,
    marginTop: 8
  },
  startButton: {
    backgroundColor: '#0ea5a3',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700'
  }
});
