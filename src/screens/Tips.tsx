import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Card, { CardContent, CardHeader } from '../components/ui/card';
import { PREDEFINED_TIPS } from '../lib/exerciseData';

export default function Tips() {
  const categories = Array.from(new Set(PREDEFINED_TIPS.map(t => t.category)));
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = selected ? PREDEFINED_TIPS.filter(t => t.category === selected) : PREDEFINED_TIPS;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 20, fontWeight: '700' }}>Dicas</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <TouchableOpacity
            onPress={() => setSelected(null)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              backgroundColor: selected === null ? '#0ea5a3' : 'transparent',
              borderWidth: 1,
              borderColor: '#0ea5a3',
              marginRight: 8
            }}
          >
            <Text style={{ color: selected === null ? '#fff' : '#0ea5a3', fontWeight: '600' }}>Todos</Text>
          </TouchableOpacity>

          {categories.map(cat => (
            <TouchableOpacity
              key={cat}
              onPress={() => setSelected(cat)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: selected === cat ? '#0ea5a3' : 'transparent',
                borderWidth: 1,
                borderColor: '#0ea5a3',
                marginRight: 8
              }}
            >
              <Text style={{ color: selected === cat ? '#fff' : '#0ea5a3', fontWeight: '600' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          {filtered.map(tip => (
            <Card key={tip.id} style={{ shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8 }}>
              <CardHeader>
                <Text style={{ fontSize: 18, fontWeight: '700' }}>{tip.title}</Text>
              </CardHeader>
              <CardContent>
                <Text style={{ color: '#6b7280' }}>{tip.content}</Text>
                <View style={{ marginTop: 8 }}>
                  <Text style={{ fontSize: 12, color: '#9ca3af' }}>{tip.category}</Text>
                </View>
              </CardContent>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
