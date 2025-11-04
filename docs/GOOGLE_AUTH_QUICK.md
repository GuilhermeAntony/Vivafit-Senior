# ⚡ Google OAuth - Guia Rápido

## 🎯 Resumo em 5 Passos

### 1️⃣ Google Cloud Console

**Acesse:** https://console.cloud.google.com/

1. **Crie 3 Client IDs:**

   **A) Android:**
   - Tipo: `Aplicativo Android`
   - Pacote: `com.antony13.Mobile`
   - SHA-1: Execute `./scripts/check-sha1.sh` para obter
   - ✅ Copie o Client ID gerado

   **B) iOS:**
   - Tipo: `ID do cliente iOS`
   - Bundle ID: `com.antony13.Mobile`
   - ✅ Copie o Client ID gerado

   **C) Web (para Supabase):**
   - Tipo: `Aplicativo da Web`
   - Redirect URI: `https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback`
   - ✅ Copie o Client ID e Client Secret

---

### 2️⃣ Supabase Dashboard

**Acesse:** https://supabase.com/dashboard/project/misptjgsftdtqfvqsneq

1. Vá em **Authentication** → **Providers**
2. Habilite **Google**
3. Cole **Client ID Web** e **Client Secret Web**
4. Em **URL Configuration**, adicione:
   ```
   com.antony13.mobile://auth
   com.antony13.mobile://**
   ```
5. Clique em **Save**

---

### 3️⃣ Atualizar Código

**Arquivo:** `src/lib/googleOAuthConfig.ts`

Substitua o `CLIENT_ID` pelo **Client ID Android** que você copiou:

```typescript
CLIENT_ID: 'SEU-CLIENT-ID-ANDROID.apps.googleusercontent.com'
```

---

### 4️⃣ Build com EAS

```bash
eas build --platform android --profile preview
```

**Aguarde 5-10 minutos** → Instale o APK no dispositivo

---

### 5️⃣ Testar

1. ✅ Abra o app no dispositivo
2. ✅ Clique em "Continuar com Google"
3. ✅ Faça login com sua conta Google
4. ✅ Aceite as permissões
5. ✅ App deve navegar para Home

---

## 🔍 Scripts Auxiliares

```bash
# Verificar SHA-1 do keystore
./scripts/check-sha1.sh

# Guia completo de configuração
./scripts/setup-google-oauth.sh
```

---

## 📋 Checklist

- [ ] Cliente Android criado no Google Cloud Console
- [ ] Cliente iOS criado no Google Cloud Console
- [ ] Cliente Web criado no Google Cloud Console
- [ ] Client ID e Secret Web adicionados no Supabase
- [ ] Google provider habilitado no Supabase
- [ ] Redirect URIs configuradas no Supabase
- [ ] Client ID Android atualizado em `googleOAuthConfig.ts`
- [ ] Build EAS criado
- [ ] APK instalado no dispositivo
- [ ] Login com Google testado

---

## ⚠️ Problemas Comuns

### "redirect_uri_mismatch"
**Solução:** Verifique se a URI no Google Console é EXATAMENTE:
```
https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback
```

### "invalid_client"
**Solução:** Certifique-se de usar o **Client ID Web** no Supabase, não o Android.

### Navegador não abre
**Solução:** Google OAuth NÃO funciona com Expo Go. Use EAS build.

### Login não redireciona
**Solução:** Adicione as redirect URIs no Supabase:
```
com.antony13.mobile://auth
com.antony13.mobile://**
```

---

## 📚 Documentação Completa

Para guia detalhado, veja: **`docs/GOOGLE_AUTH_SETUP.md`**

---

## 💡 Dicas

- ✅ Use **Client ID Web** no Supabase Dashboard
- ✅ Use **Client ID Android** no código (`googleOAuthConfig.ts`)
- ✅ **SEMPRE** use EAS build, NUNCA Expo Go
- ✅ Aguarde alguns minutos após configurar para propagação
- ✅ Teste com conta Google real, não de teste

---

**Status Atual:**
- ✅ Código configurado
- ⏳ Aguardando configuração no Google Cloud Console
- ⏳ Aguardando configuração no Supabase Dashboard
