# 🔐 Configuração Completa do Google OAuth

## 📋 Visão Geral

Para fazer a autenticação com Google funcionar no seu app React Native (Expo), você precisa:

1. ✅ Configurar no Google Cloud Console
2. ✅ Configurar no Supabase Dashboard
3. ✅ Atualizar as credenciais no código

---

## 🔧 PASSO 1: Google Cloud Console

### 1.1 Criar/Configurar Projeto

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione o existente
3. Nome sugerido: `VivaFit Seniors Mobile`

### 1.2 Habilitar APIs Necessárias

1. No menu lateral, vá em **APIs e Serviços** → **Biblioteca**
2. Procure e **habilite** as seguintes APIs:
   - ✅ **Google+ API**
   - ✅ **Google Identity Services API**
   - ✅ **Google OAuth2 API**

### 1.3 Configurar Tela de Consentimento OAuth

1. Vá em **APIs e Serviços** → **Tela de consentimento OAuth**
2. Escolha **Externo** (para testes) ou **Interno** (se tiver Google Workspace)
3. Preencha os campos obrigatórios:
   - **Nome do app**: VivaFit Seniors
   - **E-mail de suporte**: seu-email@gmail.com
   - **Logo**: (opcional) upload do ícone do app
   - **Domínio autorizado**: `supabase.co`
   - **Link da página inicial**: `https://misptjgsftdtqfvqsneq.supabase.co`
   - **E-mail de contato do desenvolvedor**: seu-email@gmail.com
4. **Escopos**: Adicione os escopos necessários:
   - `openid`
   - `profile`
   - `email`
5. Salve e continue

### 1.4 Criar Credenciais OAuth 2.0

#### Para Android:

1. Vá em **APIs e Serviços** → **Credenciais**
2. Clique em **Criar credenciais** → **ID do cliente OAuth 2.0**
3. Escolha **Aplicativo Android**
4. Preencha:
   - **Nome**: VivaFit Seniors Android
   - **Nome do pacote**: `com.antony13.Mobile`
   - **SHA-1 de assinatura**: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`
5. Clique em **Criar**
6. ✅ **COPIE O CLIENT ID** (formato: `xxx.apps.googleusercontent.com`)

#### Para iOS:

1. Repita o processo acima
2. Escolha **ID do cliente iOS**
3. Preencha:
   - **Nome**: VivaFit Seniors iOS
   - **ID do pacote**: `com.antony13.Mobile`
   - **ID do App Store** (opcional)
4. Clique em **Criar**
5. ✅ **COPIE O CLIENT ID iOS**

#### Para Web (Supabase):

1. Repita o processo mais uma vez
2. Escolha **Aplicativo da Web**
3. Preencha:
   - **Nome**: VivaFit Seniors Web (Supabase)
   - **URIs de redirecionamento autorizados**:
     ```
     https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback
     ```
4. Clique em **Criar**
5. ✅ **COPIE O CLIENT ID E CLIENT SECRET**

---

## 🗄️ PASSO 2: Supabase Dashboard

### 2.1 Acessar Configurações de Auth

1. Acesse: https://supabase.com/dashboard/project/misptjgsftdtqfvqsneq
2. No menu lateral, clique em **Authentication** (🔐)
3. Vá na aba **Providers**

### 2.2 Configurar Google Provider

1. Procure por **Google** na lista de providers
2. **Habilite** o toggle "Google enabled"
3. Preencha os campos:
   - **Client ID (for OAuth)**: Cole o Client ID WEB que você criou no passo 1.4
   - **Client Secret (for OAuth)**: Cole o Client Secret WEB
4. **Redirect URLs**: Verifique se está:
   ```
   https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback
   ```
5. Clique em **Save**

### 2.3 Configurar URLs de Redirecionamento

1. Ainda em **Authentication** → **URL Configuration**
2. Adicione as seguintes URLs em **Redirect URLs**:
   ```
   com.antony13.mobile://auth
   com.antony13.mobile://**
   exp://localhost:19000/--/*
   exp://192.168.*.*:19000/--/*
   ```
3. **Site URL**: `https://misptjgsftdtqfvqsneq.supabase.co`
4. Clique em **Save**

---

## 📱 PASSO 3: Atualizar Código do App

### 3.1 Atualizar googleOAuthConfig.ts

Já está configurado com o Client ID Android:
```typescript
CLIENT_ID: '358050334861-s6vfa8aaminfjh16l78jkvcua6h3e951.apps.googleusercontent.com'
```

Se você criou um novo Client ID, atualize este arquivo.

### 3.2 Verificar app.json

Confirme se o `scheme` está correto:
```json
"scheme": "com.antony13.mobile"
```

### 3.3 Adicionar Dependências (se necessário)

```bash
npx expo install expo-auth-session expo-web-browser
```

---

## 🧪 PASSO 4: Testar a Autenticação

### 4.1 Ambiente de Desenvolvimento

```bash
# Limpar cache
npm start -- --clear

# Ou rodar no Android
npm run android
```

### 4.2 Build para Dispositivo

```bash
# Build de preview
eas build --platform android --profile preview

# Aguarde 5-10 minutos
# Instale o APK no dispositivo
# Teste o login com Google
```

### 4.3 O que deve acontecer:

1. ✅ Clicar em "Continuar com Google"
2. ✅ Abrir navegador com tela de login do Google
3. ✅ Fazer login com conta Google
4. ✅ Aceitar permissões do app
5. ✅ Redirecionar de volta para o app
6. ✅ App navegar para tela Home automaticamente

---

## 🐛 Solução de Problemas

### Erro: "redirect_uri_mismatch"

**Causa**: As URLs de redirecionamento não batem entre Google Console e Supabase.

**Solução**:
1. Verifique no Google Cloud Console → Credenciais → Cliente Web
2. Confirme que está usando o Client ID **Web** no Supabase
3. As URIs de redirecionamento devem ser EXATAMENTE:
   ```
   https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback
   ```

### Erro: "invalid_client"

**Causa**: Client ID ou Client Secret incorretos no Supabase.

**Solução**:
1. Volte ao Google Cloud Console
2. Copie novamente o Client ID e Secret do cliente **Web**
3. Cole no Supabase Dashboard → Authentication → Providers → Google
4. Salve as alterações

### Erro: "OAuth configuration error"

**Causa**: As APIs não foram habilitadas no Google Cloud Console.

**Solução**:
1. Vá em APIs e Serviços → Biblioteca
2. Habilite: Google+ API, Google Identity Services API
3. Aguarde alguns minutos para propagar

### Navegador não abre

**Causa**: Deep linking não configurado corretamente.

**Solução**:
1. Verifique se `scheme` está em app.json
2. Reconstrua o app com EAS:
   ```bash
   eas build --platform android --profile preview
   ```

### Login funciona mas não redireciona

**Causa**: URLs de redirecionamento não incluem o app scheme.

**Solução**:
1. No Supabase Dashboard → Authentication → URL Configuration
2. Adicione:
   ```
   com.antony13.mobile://auth
   com.antony13.mobile://**
   ```
3. Salve e teste novamente

---

## 📝 Checklist Final

Antes de testar, confirme:

- [ ] ✅ Projeto criado no Google Cloud Console
- [ ] ✅ APIs habilitadas (Google+, Identity Services)
- [ ] ✅ Tela de consentimento OAuth configurada
- [ ] ✅ 3 Client IDs criados (Android, iOS, Web)
- [ ] ✅ Client ID Web e Secret adicionados no Supabase
- [ ] ✅ Google provider habilitado no Supabase
- [ ] ✅ Redirect URLs configuradas no Supabase
- [ ] ✅ Client ID Android atualizado em googleOAuthConfig.ts
- [ ] ✅ App scheme correto em app.json
- [ ] ✅ Build EAS criado (não funciona em Expo Go)

---

## 🎯 Comando Rápido para Testar

```bash
# 1. Fazer build
eas build --platform android --profile preview

# 2. Aguardar 5-10 minutos

# 3. Instalar APK no dispositivo via QR code

# 4. Abrir app e testar "Continuar com Google"
```

---

## 🔗 Links Úteis

- **Google Cloud Console**: https://console.cloud.google.com/
- **Supabase Dashboard**: https://supabase.com/dashboard/project/misptjgsftdtqfvqsneq
- **Supabase Auth Docs**: https://supabase.com/docs/guides/auth/social-login/auth-google
- **Expo Auth Session**: https://docs.expo.dev/versions/latest/sdk/auth-session/

---

## 📞 Informações do Projeto

```
Package Name (Android): com.antony13.Mobile
Bundle ID (iOS): com.antony13.Mobile
SHA-1 Debug: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
Supabase URL: https://misptjgsftdtqfvqsneq.supabase.co
Redirect Scheme: com.antony13.mobile://auth
Current Client ID: 358050334861-s6vfa8aaminfjh16l78jkvcua6h3e951.apps.googleusercontent.com
```

---

## ⚠️ IMPORTANTE

1. **Expo Go NÃO funciona** com Google OAuth - você DEVE fazer build com EAS
2. Use o **Client ID Web** no Supabase Dashboard, não o Android
3. O **Client ID Android** vai no código (`googleOAuthConfig.ts`)
4. Certifique-se de usar o **SHA-1 correto** do seu keystore
5. Aguarde alguns minutos após configurar para as mudanças propagarem

---

**Status**: 🔴 Aguardando configuração no Google Cloud Console e Supabase Dashboard

Após configurar, o status será: ✅ Pronto para usar
