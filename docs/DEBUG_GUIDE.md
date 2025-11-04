# 🐛 Guia de Debug e Logs - VivaFit Seniors

## Como Ver Logs de Erro no App

### Método 1: Visualizador de Logs Integrado (MAIS FÁCIL)

Implementamos um sistema de logs que você pode acessar **direto no app instalado**:

1. **Abra o app** no seu celular
2. **Vá para Configurações** (Settings)
3. **Toque em "🐛 Ver Logs de Debug"**
4. **Veja todos os logs** com filtros por tipo (Error, Warning, Info)
5. **Exporte os logs** usando o botão "Exportar" para compartilhar

#### Recursos do Visualizador:
- ✅ **Filtros por tipo**: All, Error, Warn, Info
- ✅ **Timestamp**: Data e hora de cada log
- ✅ **Cores por gravidade**: Vermelho (erro), Laranja (aviso), Azul (info)
- ✅ **Export**: Compartilhe logs via WhatsApp, email, etc
- ✅ **Limpar logs**: Botão para limpar histórico
- ✅ **Atualizar**: Recarrega logs em tempo real

### Método 2: ADB Logcat (Para Desenvolvedores)

Para ver logs em tempo real no terminal:

```bash
# 1. Conecte o celular via USB com Depuração USB ativada

# 2. Verifique se o dispositivo está conectado
adb devices

# 3. Ver todos os logs do app
adb logcat | grep -E "ReactNativeJS|Expo|VivaFit|Error|Exception"

# 4. Ver apenas erros de JavaScript
adb logcat *:S ReactNativeJS:V

# 5. Limpar logs e começar fresh
adb logcat -c && adb logcat
```

### Método 3: Chrome DevTools (Durante Desenvolvimento)

Se você estiver rodando o app em modo desenvolvimento:

```bash
# 1. Inicie o Metro Bundler
npm start

# 2. No celular, abra o app e sacuda o dispositivo
# 3. Toque em "Debug" no menu
# 4. Abra chrome://inspect no Chrome
# 5. Clique em "inspect" no seu dispositivo
```

## Como Adicionar Logs Personalizados

Use o logger em qualquer parte do código:

```typescript
import { logger } from '../lib/logger';

// Log de informação
logger.info('Usuário fez login', { userId: '123' });

// Log de aviso
logger.warn('Cache quase cheio', { size: '90%' });

// Log de erro
logger.error('Falha ao carregar exercícios', { 
  error: error.message,
  stack: error.stack 
});

// Log de debug (desenvolvimento)
logger.debug('Estado do componente', { state: componentState });
```

## Logs Automáticos

O sistema captura automaticamente:
- ✅ **Erros no console** (console.error)
- ✅ **Avisos no console** (console.warn)
- ✅ **Inicialização do app**
- ✅ **Navegação entre telas** (se configurado)
- ✅ **Erros de rede**
- ✅ **Falhas de autenticação**

## Estrutura dos Logs

Cada log contém:

```json
{
  "timestamp": "2025-10-18T10:30:45.123Z",
  "level": "error",
  "message": "Falha ao carregar dados",
  "data": {
    "error": "Network request failed",
    "url": "/api/exercises"
  }
}
```

## Limites e Performance

- **Máximo de logs armazenados**: 100 (últimos)
- **Storage usado**: AsyncStorage do React Native
- **Impacto na performance**: Mínimo
- **Expiração**: Logs persistem até serem limpos manualmente

## Troubleshooting

### "Não consigo ver os logs"
- Verifique se você atualizou o app com a nova versão
- Tente limpar o cache do app
- Reinstale o APK mais recente

### "Logs não estão sendo salvos"
- Verifique as permissões do app
- Limpe o storage do app e tente novamente
- Verifique se há espaço disponível no dispositivo

### "Como compartilhar logs com a equipe?"
1. Abra a tela de Debug Logs
2. Toque em "Exportar"
3. Escolha WhatsApp, Email, ou salve em arquivo
4. Envie para a equipe de desenvolvimento

## Builds para Debug

### Build Preview (Recomendado)
```bash
eas build --platform android --profile preview
```
- ✅ APK standalone com logs integrados
- ✅ Não precisa de Metro Bundler
- ✅ Fácil de distribuir

### Build Development
```bash
eas build --platform android --profile development
```
- Precisa do Expo Dev Client
- Requer Metro Bundler rodando
- Melhor para desenvolvimento ativo

### Build Production
```bash
eas build --platform android --profile production
```
- APK otimizado para publicação
- Logs ainda funcionam mas com menos verbose
- Use para testes finais

## Próximos Passos

Para logging ainda mais robusto, considere integrar:

1. **Sentry** - Crash reporting profissional
   ```bash
   npx expo install @sentry/react-native
   ```

2. **Firebase Crashlytics** - Analytics e crash reporting
   ```bash
   npx expo install @react-native-firebase/crashlytics
   ```

3. **Remote Logging** - Enviar logs para servidor
   - Configure endpoint no Supabase
   - Envie logs críticos automaticamente

## Comandos Úteis

```bash
# Ver último build
eas build:list

# Ver detalhes de um build específico
eas build:view [BUILD_ID]

# Baixar logs de um build
eas build:logs [BUILD_ID]

# Limpar cache do Metro
npm start -- --clear

# Reinstalar dependências
rm -rf node_modules && npm install
```

## Suporte

Se encontrar problemas:
1. ✅ Verifique os logs no app (Settings > Debug Logs)
2. ✅ Exporte e compartilhe os logs
3. ✅ Inclua informações do dispositivo (modelo, versão do Android)
4. ✅ Descreva os passos para reproduzir o erro
