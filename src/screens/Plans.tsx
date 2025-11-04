import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Plans'>;

const DUMMY = [
  { id: '1', title: 'Plano Iniciante', description: 'Exercícios suaves 3x por semana. Ideal para começar.' },
  { id: '2', title: 'Plano Avançado', description: 'Sessões mais longas e foco em mobilidade e força.' }
];

export default function Plans({ navigation }: Props) {
  const [selected, setSelected] = useState<any | null>(null);
  const [subscribed, setSubscribed] = useState<any | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const v = await AsyncStorage.getItem('subscribedPlan');
        if (v) setSubscribed(JSON.parse(v));
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  const open = (p: any) => setSelected(p);

  const subscribe = async (p: any) => {
    try {
      await AsyncStorage.setItem('subscribedPlan', JSON.stringify(p));
      setSubscribed(p);
      setSelected(null);
      Alert.alert('Assinado', `Você assinou: ${p.title}`);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível assinar o plano.');
    }
  };

  const clearSubscription = async () => {
    await AsyncStorage.removeItem('subscribedPlan');
    setSubscribed(null);
    Alert.alert('Cancelado', 'Assinatura removida.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Planos</Text>

      {subscribed ? (
        <View style={styles.current}>
          <Text style={{fontWeight:'700'}}>Seu plano atual</Text>
          <Text>{subscribed.title}</Text>
          <Button title="Remover" onPress={clearSubscription} />
        </View>
      ) : null}

      <FlatList
        data={DUMMY}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => open(item)} style={styles.item}>
            <Text style={{fontWeight:'600'}}>{item.title}</Text>
            <Text style={{color:'#666'}} numberOfLines={2}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal visible={!!selected} animationType="slide" transparent={true}>
        <View style={styles.modalWrap}>
          <View style={styles.modal}> 
            <Text style={{fontSize:18,fontWeight:'700',marginBottom:8}}>{selected?.title}</Text>
            <Text style={{marginBottom:12}}>{selected?.description}</Text>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Button title="Fechar" onPress={() => setSelected(null)} />
              <Button title="Assinar" onPress={() => subscribe(selected)} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  item: { padding: 12, borderRadius: 8, backgroundColor: '#f3f3f3', marginBottom: 8 },
  current: { padding: 12, borderRadius: 8, backgroundColor: '#e6fffa', marginBottom: 12 },
  modalWrap: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modal: { width:'90%', backgroundColor:'#fff', padding:16, borderRadius:8 }
});
