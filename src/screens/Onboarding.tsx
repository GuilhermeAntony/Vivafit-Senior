import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const { width } = Dimensions.get('window');

const PAGES = [
  { key: '1', title: 'Bem-vindo ao VivaFit', subtitle: 'Exercícios suaves para melhorar mobilidade e bem-estar.' },
  { key: '2', title: 'Treinos guiados', subtitle: 'Rotinas curtas, tempo ajustável, descanso controlado.' },
  { key: '3', title: 'Acompanhe seu progresso', subtitle: 'Registre treinos e veja seu histórico facilmente.' }
];

export default function Onboarding({ navigation }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const v = await AsyncStorage.getItem('hasOnboarded');
        if (mounted && v === 'true') {
          navigation.replace('Login');
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [navigation]);

  const finish = async () => {
    try {
      await AsyncStorage.setItem('hasOnboarded', 'true');
    } catch (e) {
      // ignore
    }
    navigation.replace('Login');
  };

  const onNext = () => {
    if (index >= PAGES.length - 1) {
      finish();
      return;
    }
    const next = index + 1;
    setIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: true });
  };

  const onSkip = async () => {
    await finish();
  };

  const renderItem = ({ item }: any) => (
    <View style={[styles.page, { width }]}> 
      <View style={styles.illustration} />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.subtitle}>{item.subtitle}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={PAGES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={p => p.key}
        onMomentumScrollEnd={(ev) => {
          const ix = Math.round(ev.nativeEvent.contentOffset.x / width);
          setIndex(ix);
        }}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {PAGES.map((p, i) => (
            <View key={p.key} style={[styles.dot, i === index ? styles.dotActive : null]} />
          ))}
        </View>

        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={onSkip} style={styles.ghostButton}>
            <Text style={styles.ghostText}>Pular</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onNext} style={styles.primaryButton}>
            <Text style={styles.primaryText}>{index === PAGES.length - 1 ? 'Começar' : 'Próximo'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  page: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  illustration: { width: 160, height: 160, borderRadius: 16, backgroundColor: '#e6fffa', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center' },
  footer: { padding: 16 },
  dots: { flexDirection: 'row', justifyContent: 'center', marginBottom: 12 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ddd', marginHorizontal: 6 },
  dotActive: { backgroundColor: '#0ea5a3' },
  buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ghostButton: { paddingVertical: 10, paddingHorizontal: 16 },
  ghostText: { color: '#666' },
  primaryButton: { backgroundColor: '#0ea5a3', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 8 },
  primaryText: { color: '#fff', fontWeight: '600' }
});
