# 🚀 Guia Rápido: Build de Produção

## ⚡ Início Rápido

### Opção 1: Script Interativo (Recomendado)
```bash
npm run build:interactive
```
Este script te guia passo a passo e valida tudo antes de fazer a build.

### Opção 2: Comandos Diretos

```bash
# Build de Preview (Teste)
npm run build:preview

# Build de Produção (Play Store)
npm run build:production

# Baixar APK após build
npm run build:download

# Publicar na Play Store
npm run deploy
```

---

## 📋 Pré-requisitos

✅ **Verificar antes da build:**
```bash
# Validar tudo de uma vez
npm run test:all

# Ou separadamente:
npm run test:types    # TypeScript
npm run validate      # Supabase
```

✅ **Login EAS:**
```bash
eas whoami  # Verificar login
eas login   # Se não estiver logado
```

✅ **Configurar Secrets (primeira vez):**
```bash
# URL do Supabase
eas secret:create --scope project --name SUPABASE_URL \
  --value "https://misptjgsftdtqfvqsneq.supabase.co"

# Anon Key do Supabase
eas secret:create --scope project --name SUPABASE_ANON_KEY \
  --value "sua-anon-key-aqui"

# Listar secrets
eas secret:list
```

---

## 🎯 Fluxo Completo

### 1. Preparação
```bash
# Validar código
npm run test:all

# Ver secrets configurados
eas secret:list
```

### 2. Build de Preview (Teste)
```bash
# Iniciar build (15-20 min na nuvem)
npm run build:preview

# Aguardar conclusão...
# Você receberá um email quando terminar
```

### 3. Baixar e Testar
```bash
# Baixar APK
npm run build:download

# Instalar no dispositivo
adb install ~/Downloads/build-*.apk

# Testar manualmente
./scripts/test-visual-guide.sh
```

### 4. Build de Produção (se testes OK)
```bash
# Build final otimizada
npm run build:production

# Aguardar conclusão...
```

### 5. Publicar
```bash
# Submeter para Google Play Store
npm run deploy
```

---

## 🔍 Verificações Importantes

### Antes da Build
```bash
# 1. Código TypeScript válido?
npm run test:types

# 2. Supabase conectando?
npm run validate

# 3. Secrets configurados?
eas secret:list

# 4. Versão atualizada em app.json?
grep '"version"' app.json
```

### Após a Build
```bash
# 1. Download do APK
npm run build:download

# 2. Informações do APK
aapt dump badging build-*.apk | grep -E "package|version"

# 3. Instalar e testar
adb install build-*.apk
```

---

## 📊 Tipos de Build

| Tipo | Comando | Tempo | Uso |
|------|---------|-------|-----|
| **Preview** | `npm run build:preview` | ~15-20 min | Teste interno |
| **Production** | `npm run build:production` | ~20-30 min | Play Store |
| **Interactive** | `npm run build:interactive` | Variável | Guiado |

---

## 🐛 Problemas Comuns

### Erro: "SUPABASE_URL is not defined"
```bash
# Adicionar secrets
eas secret:create --scope project --name SUPABASE_URL --value "sua-url"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "sua-key"
```

### Erro: TypeScript compilation failed
```bash
# Ver erros detalhados
npm run test:types

# Corrigir erros e tentar novamente
```

### Build muito demorada
```bash
# Verificar status do EAS
curl https://status.expo.dev

# Cancelar e tentar novamente
# (A build pode estar em fila)
```

### APK não instala
```bash
# Desinstalar versão antiga
adb uninstall com.antony13.Mobile

# Reinstalar
adb install -r build-*.apk
```

---

## 📱 Testar APK

### No Dispositivo Físico
```bash
# Via USB (Android Debug Bridge)
adb devices  # Verificar dispositivo conectado
adb install build-*.apk

# Ver logs em tempo real
adb logcat | grep -i "vivafit"
```

### Emulador
```bash
# Listar emuladores
emulator -list-avds

# Iniciar emulador
emulator -avd Pixel_5_API_31

# Instalar APK
adb install build-*.apk
```

---

## 📚 Documentação Completa

Para mais detalhes, consulte:
- **Guia completo**: `docs/GUIA_BUILD_PRODUCAO.md`
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **Dashboard EAS**: https://expo.dev/accounts/antony13/projects/Mobile

---

## ✅ Checklist Rápido

- [ ] Código validado (`npm run test:all`)
- [ ] Logado no EAS (`eas whoami`)
- [ ] Secrets configurados (`eas secret:list`)
- [ ] Versão atualizada em `app.json`
- [ ] Build preview testada
- [ ] Testes manuais OK
- [ ] Build production criada
- [ ] APK final testado
- [ ] Pronto para publicar!

---

## 🎯 Comandos Úteis

```bash
# Status da build
eas build:list --platform android

# Cancelar build em andamento
eas build:cancel

# Ver detalhes de uma build
eas build:view [BUILD_ID]

# Limpar cache e rebuild
eas build --profile preview --platform android --clear-cache

# Monitorar dashboard
open https://expo.dev/accounts/antony13/projects/Mobile/builds
```

---

**Dica**: Use sempre `npm run build:interactive` para ter um processo guiado com validações automáticas! 🚀
