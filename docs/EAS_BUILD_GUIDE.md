# 🚀 Guia de Build e Teste com EAS

## 📋 Pré-requisitos

1. **Conta Expo**
   - Crie em: https://expo.dev/signup
   - Ou faça login se já tiver

2. **EAS CLI instalado**
   ```bash
   npm install -g eas-cli
   ```

3. **Login no EAS**
   ```bash
   eas login
   ```

---

## 🔧 Configuração Inicial do EAS

### 1. Verificar se já está configurado

```bash
# Verificar eas.json
cat eas.json
```

Se não existir ou precisar reconfigurar:

```bash
eas build:configure
```

---

## 📱 Build para Android (Desenvolvimento)

### Opção 1: Build de Desenvolvimento (APK) - RECOMENDADO PARA TESTES

```bash
# Build APK para instalar direto no dispositivo
eas build --platform android --profile development

# OU com preview profile (menor que production)
eas build --platform android --profile preview
```

**Vantagens:**
- ✅ Mais rápido (5-10 minutos)
- ✅ Gera APK instalável
- ✅ Inclui ferramentas de debug
- ✅ Pode usar Expo Go para desenvolvimento

### Opção 2: Build de Produção (AAB)

```bash
# Build AAB para Google Play Store
eas build --platform android --profile production
```

**Quando usar:**
- 📦 Para publicar na Play Store
- 🎯 Build otimizado e menor
- ⏱️ Mais demorado (15-20 minutos)

---

## 🍎 Build para iOS (Requer conta Apple Developer)

### Build de Desenvolvimento

```bash
eas build --platform ios --profile development
```

### Build de Produção

```bash
eas build --platform ios --profile production
```

**Nota:** Builds iOS requerem:
- Conta Apple Developer ($99/ano)
- Certificados configurados
- Provisioning profiles

---

## ⚡ Desenvolvimento Local com EAS

### Usar Expo Dev Client

```bash
# Instalar dev client
npx expo install expo-dev-client

# Build de desenvolvimento
eas build --platform android --profile development

# Depois de instalar o APK, executar:
npm start --dev-client
```

**Vantagens:**
- ✅ Desenvolvimento rápido
- ✅ Hot reload
- ✅ Todas as funcionalidades nativas
- ✅ Debug tools

---

## 🔍 Verificar Status do Build

### Via CLI

```bash
# Listar builds
eas build:list

# Ver detalhes do último build
eas build:view

# Ver logs do build
eas build:view --json
```

### Via Dashboard

Acesse: https://expo.dev/accounts/[seu-usuario]/projects/mobile/builds

---

## 📥 Baixar e Instalar APK

### Após build concluído:

1. **Via Dashboard:**
   - Acesse o link do build
   - Clique em "Download"
   - Transfira para o dispositivo Android

2. **Via QR Code:**
   - O EAS gera um QR code
   - Escaneie com o dispositivo
   - Baixe e instale

3. **Via comando:**
   ```bash
   # Pegar URL do último build
   eas build:list --platform android --limit 1
   ```

### Instalar no dispositivo:

```bash
# Via ADB (se conectado por cabo/Wi-Fi)
adb install ~/Downloads/nome-do-build.apk
```

---

## 🧪 Testar Build Localmente (Simulador)

### Android Emulator

```bash
# Iniciar emulador
emulator -avd Pixel_5_API_33

# Instalar APK no emulador
adb install ~/Downloads/nome-do-build.apk
```

### iOS Simulator

```bash
# Abrir simulator
open -a Simulator

# Instalar app (arquivo .app)
xcrun simctl install booted ~/Downloads/nome-do-build.app
```

---

## ⚙️ Configurações Importantes do eas.json

```json
{
  "cli": {
    "version": ">= 5.2.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
```

---

## 🔐 Variáveis de Ambiente no EAS

### Opção 1: Via eas.json

```json
{
  "build": {
    "production": {
      "env": {
        "SUPABASE_URL": "https://misptjgsftdtqfvqsneq.supabase.co",
        "SUPABASE_ANON_KEY": "sua-chave-aqui"
      }
    }
  }
}
```

### Opção 2: Via EAS Secrets (RECOMENDADO)

```bash
# Adicionar secrets
eas secret:create --scope project --name SUPABASE_URL --value "https://misptjgsftdtqfvqsneq.supabase.co"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "sua-chave-anon"

# Listar secrets
eas secret:list

# Deletar secret (se necessário)
eas secret:delete --name SUPABASE_URL
```

### Usar secrets no código:

```typescript
// app.config.js
export default {
  // ... outras configurações
  extra: {
    supabase: {
      url: process.env.SUPABASE_URL,
      anonKey: process.env.SUPABASE_ANON_KEY,
    },
    eas: {
      projectId: "06e6ae28-e20f-4a60-ad01-207a8ee39834"
    }
  }
};
```

---

## 🚀 Fluxo Completo de Teste

### 1. Build de Preview (Recomendado para testes)

```bash
# Build
eas build --platform android --profile preview

# Aguardar conclusão (5-10 min)
# Link será exibido no terminal
```

### 2. Baixar e Instalar

```bash
# Via QR code ou baixar do link
# Instalar no dispositivo Android
```

### 3. Testar Funcionalidades

- ✅ Login/Cadastro
- ✅ Listagem de exercícios (10 itens)
- ✅ Criação de treinos
- ✅ Salvar progresso
- ✅ Edição de perfil
- ✅ Cache offline

### 4. Verificar Logs

```bash
# Ver logs do dispositivo
adb logcat | grep -i "ReactNativeJS"

# Ou usar Flipper/React Native Debugger
```

---

## 📊 Perfis de Build Recomendados

### Para Desenvolvimento Diário:
```bash
npx expo start --dev-client
# Usa build development instalado uma vez
```

### Para Testes Internos:
```bash
eas build --platform android --profile preview
# Gera APK para compartilhar com testadores
```

### Para Produção:
```bash
eas build --platform android --profile production
# Gera AAB para publicar na Play Store
```

---

## 🐛 Troubleshooting

### Build falha com erro de credenciais:

```bash
# Verificar login
eas whoami

# Relogar se necessário
eas logout
eas login
```

### Build falha com erro de dependências:

```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules
npm install

# Tentar novamente
eas build --platform android --profile preview
```

### App crasha ao abrir:

1. Verificar logs:
   ```bash
   adb logcat | grep -E "(FATAL|ERROR)"
   ```

2. Verificar se credenciais Supabase estão corretas

3. Verificar se todas as dependências nativas estão configuradas

### Erro "No Android SDK found":

```bash
# EAS usa servidores próprios, não precisa de SDK local
# Build continua mesmo sem Android SDK na sua máquina
```

---

## 📱 Testar em Dispositivo Físico

### Android via Wi-Fi:

```bash
# Conectar via USB primeiro
adb devices

# Habilitar conexão Wi-Fi
adb tcpip 5555

# Conectar (substitua pelo IP do dispositivo)
adb connect 192.168.1.100:5555

# Desconectar USB e continuar via Wi-Fi
```

---

## 🎯 Próximos Passos Após Build

1. **Instalar no dispositivo**
2. **Criar primeira conta**
3. **Testar todas as funcionalidades**
4. **Verificar se dados salvam no Supabase**
5. **Testar modo offline**
6. **Compartilhar com testadores beta**

---

## 📚 Recursos Úteis

- EAS Build: https://docs.expo.dev/build/introduction/
- EAS Submit: https://docs.expo.dev/submit/introduction/
- Troubleshooting: https://docs.expo.dev/build-reference/troubleshooting/

---

## ⚡ Comandos Rápidos

```bash
# Status do projeto
eas project:info

# Builds recentes
eas build:list --limit 5

# Cancelar build em andamento
eas build:cancel

# Ver configuração atual
eas config

# Atualizar EAS CLI
npm install -g eas-cli@latest
```
