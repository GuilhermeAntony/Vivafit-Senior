/**
 * Tela de Debug - Mostra logs do app
 * Acesse via Settings -> Debug Logs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation';
import { logger, LogEntry } from '../lib/logger';
import { Screen } from '../components/ui/screen';

type Props = NativeStackScreenProps<RootStackParamList, 'DebugLogs'>;

export default function DebugLogs({ navigation }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info'>('all');

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const allLogs = await logger.getLogs();
      setLogs(allLogs);
    } catch (error) {
      console.error('Failed to load logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearLogs = () => {
    Alert.alert(
      'Limpar Logs',
      'Tem certeza que deseja limpar todos os logs?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Limpar',
          style: 'destructive',
          onPress: async () => {
            await logger.clearLogs();
            setLogs([]);
          },
        },
      ]
    );
  };

  const handleExportLogs = async () => {
    try {
      const logsText = await logger.exportLogs();
      await Share.share({
        message: logsText,
        title: 'VivaFit Seniors - Logs',
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível exportar os logs');
    }
  };

  const filteredLogs = logs.filter(log => 
    filter === 'all' ? true : log.level === filter
  );

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error': return '#ff4444';
      case 'warn': return '#ff9800';
      case 'info': return '#2196F3';
      case 'debug': return '#9E9E9E';
      default: return '#666';
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' } as any}>
          <ActivityIndicator size="large" color="#0ea5a3" />
          <Text style={{ marginTop: 16, color: '#666' } as any}>Carregando logs...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <View style={{ flex: 1, backgroundColor: '#fff' } as any}>
        {/* Header */}
        <View style={{ 
          padding: 16, 
          borderBottomWidth: 1, 
          borderBottomColor: '#e0e0e0',
          backgroundColor: '#f5f5f5'
        } as any}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 } as any}>
            Debug Logs
          </Text>
          <Text style={{ fontSize: 14, color: '#666' } as any}>
            Total: {logs.length} logs
          </Text>
        </View>

        {/* Filters */}
        <View style={{ 
          flexDirection: 'row', 
          padding: 8, 
          borderBottomWidth: 1, 
          borderBottomColor: '#e0e0e0' 
        } as any}>
          {(['all', 'error', 'warn', 'info'] as const).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                flex: 1,
                padding: 8,
                marginHorizontal: 4,
                borderRadius: 8,
                backgroundColor: filter === f ? '#0ea5a3' : '#f0f0f0',
              } as any}
            >
              <Text style={{
                textAlign: 'center',
                color: filter === f ? '#fff' : '#666',
                fontWeight: filter === f ? 'bold' : 'normal',
                textTransform: 'capitalize',
              } as any}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logs List */}
        <ScrollView style={{ flex: 1 } as any}>
          {filteredLogs.length === 0 ? (
            <View style={{ padding: 32, alignItems: 'center' } as any}>
              <Text style={{ color: '#999', fontSize: 16 } as any}>
                Nenhum log encontrado
              </Text>
            </View>
          ) : (
            filteredLogs.reverse().map((log, index) => (
              <View
                key={index}
                style={{
                  padding: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: '#f0f0f0',
                  backgroundColor: index % 2 === 0 ? '#fff' : '#fafafa',
                } as any}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 } as any}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: getLevelColor(log.level),
                      marginRight: 8,
                    } as any}
                  />
                  <Text style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: getLevelColor(log.level),
                    textTransform: 'uppercase',
                  } as any}>
                    {log.level}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#999', marginLeft: 'auto' } as any}>
                    {new Date(log.timestamp).toLocaleString('pt-BR')}
                  </Text>
                </View>
                <Text style={{ fontSize: 14, color: '#333', marginBottom: 4 } as any}>
                  {log.message}
                </Text>
                {log.data && (
                  <Text style={{
                    fontSize: 12,
                    color: '#666',
                    fontFamily: 'monospace',
                    backgroundColor: '#f5f5f5',
                    padding: 8,
                    borderRadius: 4,
                  } as any}>
                    {JSON.stringify(log.data, null, 2)}
                  </Text>
                )}
              </View>
            ))
          )}
        </ScrollView>

        {/* Action Buttons */}
        <View style={{
          flexDirection: 'row',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
          gap: 8,
        } as any}>
          <TouchableOpacity
            onPress={loadLogs}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#0ea5a3',
              alignItems: 'center',
            } as any}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' } as any}>
              Atualizar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleExportLogs}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#2196F3',
              alignItems: 'center',
            } as any}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' } as any}>
              Exportar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleClearLogs}
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              backgroundColor: '#ff4444',
              alignItems: 'center',
            } as any}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' } as any}>
              Limpar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
