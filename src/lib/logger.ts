/**
 * Logger utility para debug em produção
 * Logs são salvos e podem ser exportados
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const LOG_KEY = 'app_logs';
const MAX_LOGS = 100;

export interface LogEntry {
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];

  async init() {
    try {
      const stored = await AsyncStorage.getItem(LOG_KEY);
      if (stored) {
        this.logs = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  }

  private async saveLogs() {
    try {
      // Manter apenas os últimos MAX_LOGS
      if (this.logs.length > MAX_LOGS) {
        this.logs = this.logs.slice(-MAX_LOGS);
      }
      await AsyncStorage.setItem(LOG_KEY, JSON.stringify(this.logs));
    } catch (error) {
      console.error('Failed to save logs:', error);
    }
  }

  private log(level: LogEntry['level'], message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };

    this.logs.push(entry);
    this.saveLogs();

    // Também loga no console
    const consoleMethod = level === 'error' ? console.error : level === 'warn' ? console.warn : console.log;
    consoleMethod(`[${level.toUpperCase()}] ${message}`, data || '');
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  async getLogs(): Promise<LogEntry[]> {
    return this.logs;
  }

  async clearLogs() {
    this.logs = [];
    await AsyncStorage.removeItem(LOG_KEY);
  }

  async exportLogs(): Promise<string> {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();

// Inicializar ao importar
logger.init();
