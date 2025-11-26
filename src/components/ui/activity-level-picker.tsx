/**
 * ActivityLevelPicker - Seletor visual de nível de atividade
 * Estilo barra de volume com ícones
 */

import React from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import { Text } from './text';
import { SPACING, COLORS } from '../../styles/designTokens';

interface ActivityLevelPickerProps {
  value: number; // 0, 1, ou 2
  onChange: (level: number) => void;
  size?: 'default' | 'senior';
}

const ACTIVITY_LEVELS = [
  { 
    level: 0, 
    icon: '🚶', 
    label: 'Baixo', 
    description: 'Nenhum ou até 1x na semana',
    color: '#9E9E9E' 
  },
  { 
    level: 1, 
    icon: '🏃', 
    label: 'Médio', 
    description: '2 a 3x na semana',
    color: '#FF9800' 
  },
  { 
    level: 2, 
    icon: '🏋️', 
    label: 'Alto/Atleta', 
    description: 'Acima de 4x na semana',
    color: '#4CAF50' 
  },
];

export function ActivityLevelPicker({ 
  value, 
  onChange, 
  size = 'senior' 
}: ActivityLevelPickerProps) {
  const isSenior = size === 'senior';
  const currentLevel = ACTIVITY_LEVELS[value] || ACTIVITY_LEVELS[1];

  return (
    <View style={{
      backgroundColor: '#f8f9fa',
      borderRadius: 16,
      padding: isSenior ? SPACING.lg : SPACING.md,
      borderWidth: 2,
      borderColor: COLORS.border,
    }}>
      {/* Indicador do nível atual */}
      <View style={{ 
        alignItems: 'center', 
        marginBottom: isSenior ? SPACING.lg : SPACING.md,
        backgroundColor: '#fff',
        padding: SPACING.md,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}>
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          gap: SPACING.sm 
        }}>
          <Text style={{ fontSize: isSenior ? 32 : 28 }}>
            {currentLevel.icon}
          </Text>
          <Text 
            style={{ 
              fontSize: isSenior ? 24 : 20,
              fontWeight: 'bold',
              color: currentLevel.color,
            }}
          >
            {currentLevel.label}
          </Text>
        </View>
        <Text 
          variant="caption" 
          style={{ 
            color: COLORS.mutedForeground,
            marginTop: SPACING.xs,
            textAlign: 'center',
            fontSize: isSenior ? 14 : 12,
          }}
        >
          {currentLevel.description}
        </Text>
      </View>

      {/* Barra de volume interativa */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        gap: isSenior ? 16 : 12,
        paddingHorizontal: SPACING.md,
        minHeight: isSenior ? 120 : 100,
      }}>
        {ACTIVITY_LEVELS.map((level, idx) => {
          const isCurrent = value === level.level;
          const barHeight = isSenior 
            ? 60 + (idx * 25) 
            : 50 + (idx * 20);

          return (
            <TouchableOpacity
              key={level.level}
              onPress={() => onChange(level.level)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                height: barHeight,
                maxWidth: isSenior ? 90 : 70,
                backgroundColor: isCurrent ? level.color : '#e0e0e0',
                borderRadius: 12,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: isCurrent ? 4 : 2,
                borderColor: isCurrent ? '#fff' : 'transparent',
                shadowColor: isCurrent ? level.color : '#000',
                shadowOffset: { width: 0, height: isCurrent ? 4 : 2 },
                shadowOpacity: isCurrent ? 0.4 : 0.1,
                shadowRadius: isCurrent ? 8 : 3,
                elevation: isCurrent ? 10 : 2,
              }}
            >
              <Text style={{ 
                fontSize: isSenior ? 32 : 26,
                opacity: isCurrent ? 1 : 0.4,
              }}>
                {level.icon}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Labels abaixo das barras */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: SPACING.md,
        paddingHorizontal: SPACING.sm,
      }}>
        {ACTIVITY_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.level}
            onPress={() => onChange(level.level)}
            style={{ 
              flex: 1, 
              alignItems: 'center',
              paddingVertical: SPACING.xs,
            }}
          >
            <Text 
              style={{
                color: value === level.level ? level.color : COLORS.mutedForeground,
                fontWeight: value === level.level ? 'bold' : 'normal',
                fontSize: isSenior ? 14 : 12,
              }}
            >
              {level.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

export default ActivityLevelPicker;
