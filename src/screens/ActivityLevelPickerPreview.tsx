/**
 * Preview do ActivityLevelPicker
 * Exemplo de uso em diferentes contextos
 */

import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { ActivityLevelPicker } from '../components/ui/activity-level-picker';
import { Text } from '../components/ui/text';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Screen } from '../components/ui/screen';
import { SPACING } from '../styles/designTokens';

export default function ActivityLevelPickerPreview() {
  const [level1, setLevel1] = useState(0);
  const [level2, setLevel2] = useState(1);
  const [level3, setLevel3] = useState(2);

  return (
    <Screen scrollable>
      <View style={{ padding: SPACING.lg, gap: SPACING.xl }}>
        <Text variant="heading-1" style={{ textAlign: 'center' }}>
          🎚️ Activity Level Picker
        </Text>

        {/* Exemplo 1: Baixo */}
        <Card>
          <CardHeader>
            <Text variant="heading-3">Exemplo 1: Nível Baixo</Text>
          </CardHeader>
          <CardContent>
            <ActivityLevelPicker 
              value={level1}
              onChange={setLevel1}
              size="senior"
            />
            <Text style={{ marginTop: SPACING.md, textAlign: 'center', color: '#666' }}>
              Valor atual: {level1}
            </Text>
          </CardContent>
        </Card>

        {/* Exemplo 2: Médio */}
        <Card>
          <CardHeader>
            <Text variant="heading-3">Exemplo 2: Nível Médio</Text>
          </CardHeader>
          <CardContent>
            <ActivityLevelPicker 
              value={level2}
              onChange={setLevel2}
              size="senior"
            />
            <Text style={{ marginTop: SPACING.md, textAlign: 'center', color: '#666' }}>
              Valor atual: {level2}
            </Text>
          </CardContent>
        </Card>

        {/* Exemplo 3: Alto */}
        <Card>
          <CardHeader>
            <Text variant="heading-3">Exemplo 3: Nível Alto/Atleta</Text>
          </CardHeader>
          <CardContent>
            <ActivityLevelPicker 
              value={level3}
              onChange={setLevel3}
              size="senior"
            />
            <Text style={{ marginTop: SPACING.md, textAlign: 'center', color: '#666' }}>
              Valor atual: {level3}
            </Text>
          </CardContent>
        </Card>

        {/* Comparação de tamanhos */}
        <Card>
          <CardHeader>
            <Text variant="heading-3">Comparação: Default vs Senior</Text>
          </CardHeader>
          <CardContent style={{ gap: SPACING.lg }}>
            <View>
              <Text variant="subtitle" style={{ marginBottom: SPACING.sm }}>
                Tamanho Default
              </Text>
              <ActivityLevelPicker 
                value={1}
                onChange={() => {}}
                size="default"
              />
            </View>

            <View>
              <Text variant="subtitle" style={{ marginBottom: SPACING.sm }}>
                Tamanho Senior (Recomendado)
              </Text>
              <ActivityLevelPicker 
                value={1}
                onChange={() => {}}
                size="senior"
              />
            </View>
          </CardContent>
        </Card>

        {/* Informações de uso */}
        <Card>
          <CardHeader>
            <Text variant="heading-3">ℹComo Usar</Text>
          </CardHeader>
          <CardContent>
            <Text variant="body" style={{ lineHeight: 24 }}>
              {`import { ActivityLevelPicker } from '../components/ui/activity-level-picker';

const [activityLevel, setActivityLevel] = useState(1);

<ActivityLevelPicker 
  value={activityLevel}
  onChange={setActivityLevel}
  size="senior"
/>`}
            </Text>
          </CardContent>
        </Card>

        {/* Níveis */}
        <Card>
          <CardHeader>
            <Text variant="heading-3"> Níveis Disponíveis</Text>
          </CardHeader>
          <CardContent style={{ gap: SPACING.md }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Text style={{ fontSize: 28 }}>🚶</Text>
              <View>
                <Text variant="subtitle">0 - Baixo</Text>
                <Text variant="caption" style={{ color: '#666' }}>
                  Nenhum ou até 1x na semana
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Text style={{ fontSize: 28 }}>🏃</Text>
              <View>
                <Text variant="subtitle">1 - Médio</Text>
                <Text variant="caption" style={{ color: '#666' }}>
                  2 a 3x na semana
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: SPACING.sm }}>
              <Text style={{ fontSize: 28 }}>🏋️</Text>
              <View>
                <Text variant="subtitle">2 - Alto/Atleta</Text>
                <Text variant="caption" style={{ color: '#666' }}>
                  Acima de 4x na semana
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>
    </Screen>
  );
}
