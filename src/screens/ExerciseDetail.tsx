import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button, Image, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { getCachedExercise, setCachedExercise, downloadAndCacheImage } from '../lib/exerciseCache';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>;

type WgerExercise = {
  id: number;
  name: string;
  description: string;
  license_author?: string;
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
      try {
        // check cache first
        const cached = await getCachedExercise(id);
        if (cached) {
          if (mounted) {
            setExercise({ id: Number(cached.id), name: cached.name || '', description: cached.description || '' });
            if (cached.imageLocal) setImageUri(cached.imageLocal);
            else if (cached.imageRemote) setImageUri(cached.imageRemote);
          }
        }

        // fetch fresh from wger
        const res = await fetch(`https://wger.de/api/v2/exercise/${id}/`);
        if (!res.ok) throw new Error('no');
        const data = await res.json();
        if (mounted) setExercise({ id: data.id, name: data.name, description: data.description });

        // try to fetch image (wger stores images under /api/v2/exerciseimage/?exercise=id)
        const imgRes = await fetch(`https://wger.de/api/v2/exerciseimage/?exercise=${id}`);
        let remoteImage: string | null = null;
        if (imgRes.ok) {
          const imgData = await imgRes.json();
          if (imgData && imgData.results && imgData.results[0]) remoteImage = imgData.results[0].image;
        }

        // download and cache image locally
        let localUri: string | null = null;
        if (remoteImage) {
          localUri = await downloadAndCacheImage(id, remoteImage) as string | null;
        }

  await setCachedExercise(id, { name: data.name, description: data.description, imageRemote: remoteImage ?? undefined, imageLocal: (localUri ?? remoteImage) ?? undefined });
        if (mounted) {
          if (localUri) setImageUri(localUri);
          else if (remoteImage) setImageUri(remoteImage);
        }
      } catch (e) {
        // fallback: use route params if present
        const p = route.params as any;
        if (p && p.exercise) {
          setExercise({ id: p.exercise.id || 0, name: p.exercise.name || 'Exercício', description: p.exercise.description || '' });
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
    navigation.navigate('Workout', { exercise: { id: exercise.id, name: exercise.name, description: exercise.description, duration: 2 } } as any);
  };

  if (loading) return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}><ActivityIndicator size="large" /></View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercise?.name ?? 'Detalhes do Exercício'}</Text>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" /> : null}
      <Text style={styles.description}>{exercise?.description ? stripHtml(exercise.description) : 'Descrição não disponível.'}</Text>
      <View style={{marginTop:12}}>
        <Button title="Iniciar" onPress={start} />
      </View>
    </ScrollView>
  );
}

function stripHtml(html: string) {
  return html.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 8 },
  image: { width: '100%', height: 220, borderRadius: 8, marginBottom: 12, backgroundColor: '#eee' },
  description: { color: '#444', lineHeight: 20 }
});
