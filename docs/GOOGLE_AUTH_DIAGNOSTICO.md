# 🔥 DIAGNÓSTICO: Por Que Google OAuth Não Funciona

## ❌ PROBLEMAS IDENTIFICADOS

### 1. Usando `expo start` ao invés de Build EAS

**Status atual detectado:**
```bash
✗ expo start --dev-client está rodando (PID: 9408)
```

**Por que não funciona:**
- ❌ Google Sign In é um **native module**
- ❌ Precisa de código nativo compilado (Java/Kotlin para Android)
- ❌ `expo start` não compila código nativo
- ❌ Só funciona com build EAS ou Expo Dev Client pré-compilado

**Solução:**
```bash
# 1. Pare o processo atual
Ctrl+C (no terminal onde está rodando)

# 2. Faça build EAS
eas build --platform android --profile development

# 3. Instale o APK no dispositivo
```

---

### 2. Bug na Função `isGoogleOAuthConfigured()`

**Código atual (ERRADO):**
```typescript
export const isGoogleOAuthConfigured = (): boolean => {
  return GOOGLE_OAUTH_CONFIG.CLIENT_ID && 
         !GOOGLE_OAUTH_CONFIG.CLIENT_ID.includes('358050334861-b5s858c68cr4f8anlj79c6e1oi5716m8.apps.googleusercontent.com') &&
         GOOGLE_OAUTH_CONFIG.CLIENT_ID.includes('.googleusercontent.com');
};
```

**Problema:**
- Verifica se CLIENT_ID **NÃO INCLUI** o próprio CLIENT_ID configurado!
- Sempre retorna `false`

**Correção necessária:**
```typescript
export const isGoogleOAuthConfigured = (): boolean => {
  return GOOGLE_OAUTH_CONFIG.CLIENT_ID && 
         GOOGLE_OAUTH_CONFIG.CLIENT_ID.includes('.googleusercontent.com') &&
         GOOGLE_OAUTH_CONFIG.CLIENT_ID.length > 50; // Client IDs são longos
};
```

---

### 3. Configuração do Supabase

**Verifique se está configurado:**

1. **Supabase Dashboard:**
   - URL: https://supabase.com/dashboard
   - Projeto: `misptjgsftdtqfvqsneq`
   - Authentication → Providers → **Google**
   - Toggle: **Habilitado** ✅
   - Client ID: `358050334861-b5s858c68cr4f8anlj79c6e1oi5716m8.apps.googleusercontent.com`
   - Client Secret: [deve estar preenchido]

2. **Google Cloud Console:**
   - Projeto criado ✅
   - Web Client ID criado ✅ (é o que está no código)
   - Android Client ID criado? ⚠️ (verificar)
   - SHA-1 adicionado no Android Client ID? ⚠️

---

## 🔧 PASSO A PASSO PARA CORRIGIR

### Passo 1: Corrigir o Bug no Código

```bash
# Editar o arquivo
nano src/lib/googleOAuthConfig.ts
```

Ou deixe-me corrigir automaticamente (responda: "corrigir código")

---

### Passo 2: Verificar SHA-1

```bash
./scripts/get-sha1.sh
```

**Copie o SHA-1 e adicione no Google Cloud Console:**
- Console: https://console.cloud.google.com/
- APIs e Serviços → Credenciais
- Encontre ou crie "Android Client ID"
- Adicione o SHA-1 obtido

---

### Passo 3: Parar Expo Start

```bash
# No terminal onde está rodando, pressione:
Ctrl+C
```

---

### Passo 4: Fazer Build EAS

```bash
# Build de desenvolvimento (recomendado)
eas build --platform android --profile development

# Aguarde 10-15 minutos
# Baixe o APK gerado
# Instale no dispositivo
```

---

### Passo 5: Testar no Dispositivo

1. Abra o app instalado
2. Clique em "Continuar com Google"
3. Selecione sua conta Google
4. Deve redirecionar para Home

---

## 🐛 ERROS COMUNS E SOLUÇÕES

### Erro: DEVELOPER_ERROR

**Causa:** SHA-1 não configurado ou Client ID errado

**Solução:**
1. Execute: `./scripts/get-sha1.sh`
2. Copie o SHA-1
3. Adicione no Google Cloud Console (Android Client ID)
4. Aguarde 5-10 minutos para propagação
5. Faça novo build EAS

---

### Erro: Invalid ID token (Supabase)

**Causa:** Provider Google não habilitado ou credenciais erradas no Supabase

**Solução:**
1. Acesse Supabase Dashboard
2. Authentication → Providers → Google
3. Verifique:
   - Toggle habilitado ✅
   - Client ID = `358050334861-b5s858c68cr4f8anlj79c6e1oi5716m8.apps.googleusercontent.com`
   - Client Secret preenchido
4. Salve

---

### Erro: Sign in cancelled

**Causa:** Usuário cancelou ou nenhuma conta Google no dispositivo

**Solução:** 
- Comportamento normal se usuário cancelou
- Verifique se há conta Google logada no dispositivo

---

## 📊 CHECKLIST DE VERIFICAÇÃO

Marque o que já está feito:

### Google Cloud Console
- [ ] Projeto criado
- [ ] Google+ API habilitada
- [ ] Google Identity Services API habilitada
- [ ] Web Client ID criado (o que está no código)
- [ ] Android Client ID criado
- [ ] SHA-1 adicionado no Android Client ID
- [ ] Tela de consentimento configurada

### Código
- [ ] CLIENT_ID configurado (já está ✅)
- [ ] Função `isGoogleOAuthConfigured()` corrigida (precisa correção)
- [ ] Plugin em app.json (já está ✅)

### Supabase
- [ ] Provider Google habilitado
- [ ] Web Client ID configurado
- [ ] Web Client Secret configurado

### Build & Teste
- [ ] `expo start` parado
- [ ] Build EAS realizado
- [ ] APK instalado em dispositivo físico
- [ ] Dispositivo tem Google Play Services
- [ ] Conta Google logada no dispositivo

---

## 🚀 COMANDOS RÁPIDOS

```bash
# 1. Obter SHA-1
./scripts/get-sha1.sh

# 2. Parar Expo (se estiver rodando)
# Pressione Ctrl+C no terminal

# 3. Build EAS
eas build --platform android --profile development

# 4. Ver logs do dispositivo (após instalar APK)
adb logcat | grep -i "google\|supabase\|oauth"
```

---

## 📚 DOCUMENTAÇÃO COMPLETA

- **Checklist completo:** `docs/GOOGLE_AUTH_CHECKLIST.md`
- **Troubleshooting:** `docs/GOOGLE_AUTH_TROUBLESHOOTING.md`
- **Correções feitas:** `docs/GOOGLE_AUTH_CORRECTIONS.md`

---

## ⚠️ PONTO CRÍTICO

**Você NÃO PODE usar `expo start` para testar Google Sign In!**

Google Sign In é um módulo nativo que precisa ser compilado. Sempre use:
- ✅ Build EAS: `eas build --platform android --profile development`
- ✅ APK instalado em dispositivo físico
- ❌ Nunca: `expo start`, `npm start`, etc.

---

**Data:** 19 de outubro de 2025  
**Status:** Aguardando correção do código e build EAS
