import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { PREDEFINED_EXERCISES } from '../lib/exerciseData';

type Props = NativeStackScreenProps<RootStackParamList, 'ExerciseDetail'>;

export default function ExerciseDetail({ route, navigation }: Props) {
  const { id } = route.params || {};
  
  const exercise = PREDEFINED_EXERCISES.find(ex => ex.id === id);

  if (!exercise) return (
    <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:20}}>
      <Text style={{fontSize:16,color:'#666',textAlign:'center'}}>Exercício não encontrado</Text>
      <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop:16,padding:12,backgroundColor:'#0ea5a3',borderRadius:8}}>
        <Text style={{color:'#fff',fontWeight:'600'}}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );

  const start = () => {
    navigation.navigate('Workout', { exercise });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{exercise.name}</Text>
      
      {exercise.imageUrl ? (
        <Image source={exercise.imageUrl as any} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, {backgroundColor:'#f3f4f6',alignItems:'center',justifyContent:'center'}]}>
          <Text style={{color:'#9ca3af',fontSize:12}}>Sem imagem</Text>
        </View>
      )}

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Categoria:</Text>
        <Text style={styles.infoText}>{exercise.category}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Dificuldade:</Text>
        <Text style={styles.infoText}>{exercise.difficulty}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoLabel}>Duração:</Text>
        <Text style={styles.infoText}>{exercise.duration} minutos</Text>
      </View>

      {exercise.benefits && exercise.benefits.length > 0 && (
        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Benefícios:</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',gap:8,marginTop:4}}>
            {exercise.benefits.map((benefit, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>{benefit}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <View style={styles.descriptionSection}>
        <Text style={styles.infoLabel}>Descrição:</Text>
        <Text style={styles.description}>
          {exercise.description || 'Descrição não disponível.'}
        </Text>
      </View>

      <TouchableOpacity onPress={start} style={styles.startButton}>
        <Text style={styles.startButtonText}>Iniciar Treino</Text>
      </TouchableOpacity>
    </ScrollView>
  );
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
