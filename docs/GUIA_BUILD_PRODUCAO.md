# 🚀 Guia de Build de Produção - VivaFit Seniors

## 📋 Pré-requisitos

Antes de fazer a build de produção, certifique-se de:

- ✅ Conta EAS configurada (`eas login`)
- ✅ Projeto vinculado ao EAS (`eas.json` configurado)
- ✅ Credenciais do Supabase configuradas
- ✅ Código testado em desenvolvimento
- ✅ Migration aplicada no Supabase de produção

---

## 🎯 Opções de Build de Produção

### Opção 1: Build para Teste Local (APK)
**Mais rápido, ideal para validação antes da Play Store**

```bash
# Build de preview (APK instalável)
eas build --profile preview --platform android

# Após concluir, baixe o APK e instale no dispositivo
```

### Opção 2: Build de Produção Completa
**Para publicação na Google Play Store**

```bash
# Build de produção otimizada
eas build --profile production --platform android

# Gera APK otimizado e assinado para produção
```

---

## 📱 Método 1: Build com EAS (Recomendado)

### Passo 1: Verificar Configuração

```bash
# Verificar se está logado
eas whoami

# Se não estiver logado
eas login
```

### Passo 2: Configurar Secrets (Primeira vez)

```bash
# Adicionar URL do Supabase
eas secret:create --scope project --name SUPABASE_URL --value "https://misptjgsftdtqfvqsneq.supabase.co"

# Adicionar Anon Key do Supabase
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "sua-anon-key-aqui"

# Listar secrets configurados
 
```

### Passo 3: Build de Preview (Teste)

```bash
# Build de preview - gera APK para teste
eas build --profile preview --platform android --non-interactive

# Monitorar o progresso
# A build roda na nuvem e leva ~10-20 minutos
```

### Passo 4: Baixar e Instalar

```bash
# Após a build completar, você receberá um link
# Baixe o APK e instale no dispositivo Android

# Ou use o comando para baixar
eas build:download --platform android --profile preview
```

### Passo 5: Build de Produção (Para Play Store)

```bash
# Build de produção otimizada
eas build --profile production --platform android

# Após concluir, submeter para Play Store
eas submit --platform android --profile production
```

---

## 🏗️ Método 2: Build Local (Avançado)

### Requisitos
- Android Studio instalado
- JDK 17 configurado
- Android SDK configurado

### Comandos

```bash
# 1. Instalar dependências
npm install

# 2. Pré-build (gerar arquivos nativos)
npx expo prebuild --platform android --clean

# 3. Build local (APK de debug)
cd android
./gradlew assembleDebug

# APK gerado em:
# android/app/build/outputs/apk/debug/app-debug.apk

# 4. Build local (APK de release)
./gradlew assembleRelease

# APK gerado em:
# android/app/build/outputs/apk/release/app-release.apk
```

---

## ✅ Checklist Pré-Build

Antes de fazer a build de produção, verifique:

### Código
- [ ] Todos os testes passaram
- [ ] Nenhum erro de compilação TypeScript
- [ ] Logs de debug removidos ou desabilitados
- [ ] Versão atualizada em `app.json`

```bash
# Verificar erros TypeScript
npx tsc --noEmit

# Verificar lint
npx eslint src/ --ext .ts,.tsx
```

### Configuração
- [ ] `app.json` com dados corretos
- [ ] Bundle ID correto: `com.antony13.Mobile`
- [ ] Versão incrementada (ex: 1.0.0 → 1.0.1)
- [ ] Ícone e splash screen configurados

### Supabase
- [ ] Migration aplicada no banco de produção
- [ ] RLS habilitado e políticas ativas
- [ ] Credenciais de produção configuradas nos secrets
- [ ] Teste de conexão bem-sucedido

```bash
# Validar configuração do Supabase
node scripts/validate-supabase-fix.js
```

### EAS
- [ ] Conta EAS ativa
- [ ] Projeto vinculado
- [ ] Secrets configurados
- [ ] Build profile correto em `eas.json`

---

## 🧪 Testar Build de Produção

### 1. Instalar o APK no Dispositivo

```bash
# Via ADB (dispositivo conectado via USB)
adb install caminho/para/app.apk

# Ou envie o APK para o dispositivo e instale manualmente
```

### 2. Testes Essenciais

**Teste 1: Login**
- [ ] Login com email/senha funciona
- [ ] Login com Google funciona (se configurado)
- [ ] Sessão persiste após fechar o app

**Teste 2: Salvamento no Supabase**
- [ ] Complete um treino
- [ ] Verifique no Dashboard se foi salvo
- [ ] Feche e reabra o app
- [ ] Dados persistem

**Teste 3: Sincronização**
- [ ] Progresso exibe dados corretos
- [ ] Histórico exibe treinos salvos
- [ ] Gráficos renderizam corretamente

**Teste 4: Performance**
- [ ] App inicia em < 3 segundos
- [ ] Navegação fluida (sem lag)
- [ ] Imagens carregam rapidamente
- [ ] Sem crashes ou travamentos

**Teste 5: Offline**
- [ ] Ative modo avião
- [ ] Complete um treino (salva local)
- [ ] Desative modo avião
- [ ] Dados sincronizam automaticamente

### 3. Monitoramento

```bash
# Ver logs do dispositivo em tempo real
adb logcat | grep -i "vivafit\|supabase\|treino"

# Filtrar apenas erros
adb logcat *:E | grep -i "vivafit"
```

---

## 📊 Comparação: Preview vs Production

| Aspecto | Preview | Production |
|---------|---------|------------|
| **Otimização** | Moderada | Máxima |
| **Tamanho APK** | ~50-60 MB | ~30-40 MB |
| **Velocidade** | Normal | Otimizada |
| **Debug** | Habilitado | Desabilitado |
| **Logs** | Verbose | Mínimo |
| **ProGuard** | Não | Sim (minificação) |
| **Uso** | Teste interno | Play Store |

---

## 🐛 Troubleshooting

### Erro: "SUPABASE_URL is not defined"

**Causa**: Secrets não configurados ou `eas.json` incorreto

**Solução**:
```bash
# Verificar secrets
eas secret:list

# Adicionar se não existir
eas secret:create --scope project --name SUPABASE_URL --value "sua-url"
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "sua-key"
```

### Erro: "Build failed during gradle"

**Causa**: Dependências nativas incompatíveis ou cache corrompido

**Solução**:
```bash
# Limpar cache do Expo
npx expo start -c

# Limpar cache do gradle (se build local)
cd android
./gradlew clean

# Rebuild
cd ..
eas build --profile preview --platform android --clear-cache
```

### Build demora muito (>30 min)

**Causa**: Fila na nuvem EAS ou problemas de rede

**Solução**:
- Verifique status: https://status.expo.dev
- Use `--local` para build local (mais rápido se tiver ambiente configurado)
- Aguarde ou cancele e tente novamente

### APK não instala no dispositivo

**Causa**: Assinatura inválida ou versão incompatível

**Solução**:
```bash
# Verificar info do APK
aapt dump badging app.apk | grep -i version

# Reinstalar completamente
adb uninstall com.antony13.Mobile
adb install app.apk
```

---

## 🎯 Scripts Rápidos

Adicione ao `package.json`:

```json
{
  "scripts": {
    "build:preview": "eas build --profile preview --platform android",
    "build:prod": "eas build --profile production --platform android",
    "build:local": "cd android && ./gradlew assembleRelease",
    "test:build": "node scripts/validate-supabase-fix.js && npx tsc --noEmit",
    "deploy": "eas submit --platform android --profile production"
  }
}
```

Uso:
```bash
# Validar antes de build
npm run test:build

# Build de preview
npm run build:preview

# Build de produção
npm run build:prod

# Submeter para Play Store
npm run deploy
```

---

## 📈 Workflow Recomendado

### 1️⃣ Desenvolvimento
```bash
npx expo start
# Testar no Expo Go ou development build
```

### 2️⃣ Validação
```bash
npm run test:build
node scripts/validate-supabase-fix.js
```

### 3️⃣ Preview Build
```bash
npm run build:preview
# Baixar APK e testar em dispositivos reais
```

### 4️⃣ Testes de QA
- Instalar APK em múltiplos dispositivos
- Executar checklist de testes
- Validar performance e bugs

### 5️⃣ Production Build
```bash
npm run build:prod
# Gerar build final para Play Store
```

### 6️⃣ Publicação
```bash
npm run deploy
# Submeter para Google Play Store
```

---

## 📚 Recursos Adicionais

### Documentação EAS
- Guia oficial: https://docs.expo.dev/build/introduction/
- Build profiles: https://docs.expo.dev/build/eas-json/

### Monitoramento
- EAS Dashboard: https://expo.dev/accounts/[seu-usuario]/projects/vivafit-senior
- Build logs: Acesse pelo dashboard após iniciar build

### Suporte
- Expo Discord: https://chat.expo.dev
- Stack Overflow: tag `expo` + `eas-build`

---

## ✅ Resumo do Fluxo

```bash
# 1. Preparação
eas login
eas secret:create --name SUPABASE_URL --value "..."
eas secret:create --name SUPABASE_ANON_KEY --value "..."

# 2. Validação
npm run test:build
node scripts/validate-supabase-fix.js

# 3. Build de Preview (Teste)
eas build --profile preview --platform android

# 4. Baixar e testar
eas build:download --platform android --profile preview
adb install app-preview.apk

# 5. Build de Produção (após testes OK)
eas build --profile production --platform android

# 6. Publicar na Play Store
eas submit --platform android --profile production
```

---

**Tempo estimado total**: 30-60 minutos (build na nuvem)  
**Build local**: 5-15 minutos (se ambiente configurado)

**Dica**: Use sempre build de preview para validar antes de fazer a build de produção final!
