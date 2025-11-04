# 🔍 Por Que o Google OAuth Não Está Funcionando

## ❌ Problema Identificado

Você está usando a biblioteca `@react-native-google-signin/google-signin` v16.0.0, mas o código estava implementado com `expo-auth-session`, que NÃO é compatível com esta biblioteca.

## ✅ O Que Foi Corrigido

### Antes (❌ Errado):

```typescript
// googleAuth.ts - ANTIGA IMPLEMENTAÇÃO
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

// Tentava usar OAuth flow do Supabase diretamente
const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo: this.config.redirectUri,
  },
});
```

**Problema:** Este método abre um WebBrowser e não funciona bem com builds nativos. Além disso, não utiliza a biblioteca Google Sign In nativa instalada.

### Depois (✅ Correto):

```typescript
// googleAuth.ts - NOVA IMPLEMENTAÇÃO
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

// Configurar Google Sign In
GoogleSignin.configure({
  webClientId: GOOGLE_OAUTH_CONFIG.CLIENT_ID,
  offlineAccess: true,
  scopes: ['openid', 'profile', 'email'],
});

// Fazer login com Google
const userInfo = await GoogleSignin.signIn();
const { idToken } = userInfo;

// Usar o idToken para autenticar no Supabase
const { data, error } = await supabase.auth.signInWithIdToken({
  provider: 'google',
  token: idToken,
});
```

## 🔄 Fluxo Correto de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO GOOGLE OAUTH                        │
└─────────────────────────────────────────────────────────────┘

1. Usuário clica em "Continuar com Google"
   ↓
2. App chama GoogleSignin.signIn()
   ↓
3. SDK do Google abre seletor de conta nativo
   ↓
4. Usuário seleciona conta Google
   ↓
5. Google retorna idToken para o app
   ↓
6. App envia idToken para Supabase
   ↓
7. Supabase valida idToken com Google
   ↓
8. Supabase cria/atualiza usuário
   ↓
9. Supabase retorna sessão autenticada
   ↓
10. App redireciona para Home
```

## 📝 Diferenças Principais

| Aspecto | Implementação Antiga (❌) | Implementação Nova (✅) |
|---------|--------------------------|------------------------|
| **Biblioteca** | expo-auth-session | @react-native-google-signin |
| **Método** | WebBrowser OAuth flow | Native Google SDK |
| **UI** | WebView do navegador | Dialog nativo do Android |
| **Performance** | Mais lento | Mais rápido |
| **UX** | Precisa digitar email/senha | Seleciona conta já logada |
| **Offline** | Não funciona | Funciona com cached credentials |
| **Integração** | Direto com Supabase | Google → idToken → Supabase |

## 🔧 Configurações Necessárias

### 1. Google Cloud Console

Você precisa de **DOIS** Client IDs:

#### a) Android Client ID
- **Tipo:** Android
- **Package Name:** `com.antony13.Mobile`
- **SHA-1:** Do seu debug.keystore ou release keystore
- **Uso:** Automático pela biblioteca

#### b) Web Client ID (IMPORTANTE!)
- **Tipo:** Aplicativo da Web
- **Uso:** Este é o que você configura no código!
- **Onde:** `src/lib/googleOAuthConfig.ts`

```typescript
export const GOOGLE_OAUTH_CONFIG = {
  CLIENT_ID: 'SEU-WEB-CLIENT-ID.apps.googleusercontent.com', // ← Web Client ID!
  // ...
};
```

**⚠️ ATENÇÃO:** Use o **Web Client ID**, não o Android Client ID!

### 2. Supabase Dashboard

1. Acesse: **Authentication** → **Providers** → **Google**
2. Habilite o provider
3. Configure:
   - **Client ID:** Web Client ID (mesmo do código)
   - **Client Secret:** Web Client Secret (do Google Cloud Console)

### 3. Rebuild Obrigatório

Após qualquer alteração nas credenciais:

```bash
# SEMPRE faça rebuild após mudar credenciais
eas build --platform android --profile preview
```

**⚠️ Não use `expo start`** - Google Sign In é native module!

## 🧪 Como Testar

### Passo a Passo:

1. **Build do app:**
   ```bash
   eas build --platform android --profile preview
   ```

2. **Instale o APK no dispositivo físico** (emulador pode não ter Play Services)

3. **Verifique logs:**
   ```bash
   adb logcat | grep -i "google\|supabase"
   ```

4. **Clique em "Continuar com Google"**

5. **Logs esperados:**
   ```
   ✅ Google Sign In configurado com sucesso
   ℹ️ Sign in silencioso falhou, solicitando login...
   ✅ ID Token obtido do Google, autenticando com Supabase...
   ✅ Login com Google realizado com sucesso!
   👤 Usuário: seu-email@gmail.com
   ```

## 🐛 Erros Comuns

### 1. DEVELOPER_ERROR

**Causa:** Client ID incorreto ou SHA-1 faltando

**Solução:**
```bash
# 1. Obtenha o SHA-1 correto
cd android
./gradlew signingReport

# 2. Adicione no Google Cloud Console (Android Client ID)
# 3. Verifique se Web Client ID está em googleOAuthConfig.ts
# 4. Aguarde 5-10 minutos
# 5. Faça rebuild
eas build --platform android --profile preview
```

### 2. Invalid ID token

**Causa:** Supabase não reconhece o token

**Solução:**
1. Verifique se Google Provider está **habilitado** no Supabase
2. Confirme que Web Client ID e Secret no Supabase estão corretos
3. Certifique-se que são do mesmo projeto Google Cloud

### 3. SIGN_IN_CANCELLED

**Causa:** Usuário cancelou

**Solução:** Comportamento normal, não é erro

### 4. No saved credential found

**Causa:** Primeira vez fazendo login no dispositivo

**Solução:** O código já trata isso chamando `GoogleSignin.signIn()` interativo

## 📊 Checklist de Configuração

Use esta lista para verificar se tudo está configurado:

### Google Cloud Console
- [ ] Projeto criado
- [ ] Google+ API habilitada
- [ ] Google Identity Services API habilitada
- [ ] Tela de consentimento configurada
- [ ] Android Client ID criado (com package name + SHA-1)
- [ ] Web Client ID criado
- [ ] Web Client Secret copiado

### Supabase
- [ ] Provider Google habilitado
- [ ] Web Client ID configurado
- [ ] Web Client Secret configurado
- [ ] URL de redirect: `https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback`

### Código
- [ ] `@react-native-google-signin/google-signin` instalado (v16.0.0)
- [ ] Plugin em `app.json`: `["@react-native-google-signin/google-signin"]`
- [ ] Web Client ID em `googleOAuthConfig.ts`
- [ ] `googleAuth.ts` usando `GoogleSignin` (não expo-auth-session)
- [ ] Build EAS realizado (não `expo start`)

### Dispositivo
- [ ] Dispositivo físico Android (não emulador sem Play Services)
- [ ] Google Play Services instalado e atualizado
- [ ] Pelo menos uma conta Google logada no dispositivo
- [ ] APK instalado via EAS build

## 🎯 Próximos Passos

1. **Obtenha o Web Client ID** do Google Cloud Console
2. **Atualize** `src/lib/googleOAuthConfig.ts` com o Client ID correto
3. **Configure** no Supabase Dashboard (Provider Google)
4. **Faça rebuild:**
   ```bash
   eas build --platform android --profile preview
   ```
5. **Instale** o APK no dispositivo
6. **Teste** o login com Google

## 📚 Referências

- [Google Sign In para React Native](https://github.com/react-native-google-signin/google-signin)
- [Supabase signInWithIdToken](https://supabase.com/docs/reference/javascript/auth-signinwithidtoken)
- [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)

---

**Data:** 18 de outubro de 2025  
**Versão da biblioteca:** @react-native-google-signin/google-signin ^16.0.0
