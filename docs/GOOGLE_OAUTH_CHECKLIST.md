# ✅ Checklist de Configuração Google OAuth

Use este checklist para acompanhar o progresso da configuração do Google OAuth.

---

## 📋 Preparação

- [ ] Ler guia rápido: `docs/GOOGLE_AUTH_QUICK.md`
- [ ] Executar script: `./scripts/setup-google-oauth.sh`
- [ ] Verificar SHA-1: `./scripts/check-sha1.sh`
- [ ] Anotar SHA-1 obtido: `_______________________________`

---

## 🔧 Google Cloud Console

### APIs e Serviços

- [ ] Acessar: https://console.cloud.google.com/
- [ ] Criar/selecionar projeto: `VivaFit Seniors Mobile`
- [ ] Habilitar **Google+ API**
- [ ] Habilitar **Google Identity Services API**

### Tela de Consentimento OAuth

- [ ] Ir em **APIs e Serviços** → **Tela de consentimento OAuth**
- [ ] Escolher tipo: **Externo**
- [ ] Nome do app: `VivaFit Seniors`
- [ ] E-mail de suporte: `_______________________________`
- [ ] Domínio autorizado: `supabase.co`
- [ ] Link da página inicial: `https://misptjgsftdtqfvqsneq.supabase.co`
- [ ] E-mail de contato: `_______________________________`
- [ ] Adicionar escopos: `openid`, `profile`, `email`
- [ ] Salvar e continuar

### Client ID Android

- [ ] Ir em **APIs e Serviços** → **Credenciais**
- [ ] Criar credenciais → **ID do cliente OAuth 2.0**
- [ ] Tipo: **Aplicativo Android**
- [ ] Nome: `VivaFit Seniors Android`
- [ ] Nome do pacote: `com.antony13.Mobile`
- [ ] SHA-1: `_______________________________` (do script check-sha1.sh)
- [ ] Clicar em **Criar**
- [ ] ✅ **COPIAR CLIENT ID ANDROID**: `_______________________________`

### Client ID iOS

- [ ] Criar credenciais → **ID do cliente OAuth 2.0**
- [ ] Tipo: **ID do cliente iOS**
- [ ] Nome: `VivaFit Seniors iOS`
- [ ] ID do pacote: `com.antony13.Mobile`
- [ ] Clicar em **Criar**
- [ ] ✅ **COPIAR CLIENT ID iOS**: `_______________________________`

### Client ID Web (para Supabase)

- [ ] Criar credenciais → **ID do cliente OAuth 2.0**
- [ ] Tipo: **Aplicativo da Web**
- [ ] Nome: `VivaFit Seniors Web (Supabase)`
- [ ] URIs de redirecionamento autorizados:
  - [ ] `https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback`
- [ ] Clicar em **Criar**
- [ ] ✅ **COPIAR CLIENT ID WEB**: `_______________________________`
- [ ] ✅ **COPIAR CLIENT SECRET WEB**: `_______________________________`

---

## 🗄️ Supabase Dashboard

### Configurar Provider Google

- [ ] Acessar: https://supabase.com/dashboard/project/misptjgsftdtqfvqsneq
- [ ] Ir em **Authentication** (ícone 🔐)
- [ ] Clicar na aba **Providers**
- [ ] Procurar por **Google**
- [ ] Habilitar toggle "Google enabled"
- [ ] Colar **Client ID (for OAuth)**: (Client ID Web)
- [ ] Colar **Client Secret (for OAuth)**: (Client Secret Web)
- [ ] Verificar Redirect URL: `https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback`
- [ ] Clicar em **Save**

### Configurar URLs de Redirecionamento

- [ ] Ainda em **Authentication**
- [ ] Ir na aba **URL Configuration**
- [ ] Seção **Redirect URLs**, adicionar:
  - [ ] `com.antony13.mobile://auth`
  - [ ] `com.antony13.mobile://**`
  - [ ] `exp://localhost:19000/--/*` (opcional, para dev)
  - [ ] `exp://192.168.*.*:19000/--/*` (opcional, para dev)
- [ ] Verificar **Site URL**: `https://misptjgsftdtqfvqsneq.supabase.co`
- [ ] Clicar em **Save**

---

## 📱 Atualizar Código

### googleOAuthConfig.ts

- [ ] Abrir arquivo: `src/lib/googleOAuthConfig.ts`
- [ ] Verificar/atualizar `CLIENT_ID` com o **Client ID Android**
- [ ] Verificar se está no formato: `xxxxx.apps.googleusercontent.com`
- [ ] Salvar arquivo

### Verificar app.json

- [ ] Abrir arquivo: `app.json`
- [ ] Confirmar `"scheme": "com.antony13.mobile"`
- [ ] Confirmar configuração Supabase está presente

---

## 🏗️ Build com EAS

### Preparar Build

- [ ] Fazer commit das alterações (se houver):
  ```bash
  git add .
  git commit -m "Configure Google OAuth"
  git push
  ```

### Executar Build

- [ ] Escolher perfil de build:
  - [ ] **Preview** (recomendado para testes): `eas build --platform android --profile preview`
  - [ ] **Development** (com dev tools): `eas build --platform android --profile development`
  - [ ] **Production** (final): `eas build --platform android --profile production`

- [ ] Executar comando:
  ```bash
  eas build --platform android --profile preview
  ```

- [ ] Aguardar conclusão do build (5-10 minutos)
- [ ] Anotar ID do build: `_______________________________`
- [ ] Baixar APK via QR code ou link

---

## 📲 Instalar e Testar

### Instalação

- [ ] Transferir APK para dispositivo Android
- [ ] Habilitar "Instalar apps de fontes desconhecidas"
- [ ] Instalar APK
- [ ] Abrir app VivaFit Seniors

### Teste de Autenticação

- [ ] App abre na tela de Login
- [ ] Clicar em **"Continuar com Google"**
- [ ] Navegador abre com tela de login do Google
- [ ] Fazer login com conta Google
- [ ] Aceitar permissões do app
- [ ] Navegador redireciona de volta ao app
- [ ] App abre tela **Home** automaticamente
- [ ] ✅ **Login com Google funcionando!**

### Teste de Funcionalidades

- [ ] Ver lista de exercícios (10 exercícios)
- [ ] Abrir detalhes de um exercício
- [ ] Criar um plano de treino
- [ ] Completar um exercício
- [ ] Ver progresso no Dashboard
- [ ] Editar perfil de usuário
- [ ] Fazer logout
- [ ] Fazer login novamente

---

## 🐛 Troubleshooting

Se encontrar problemas, marque o erro encontrado:

- [ ] **redirect_uri_mismatch**
  - Solução: Verificar URI no Google Console
  - URI deve ser: `https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback`

- [ ] **invalid_client**
  - Solução: Verificar Client ID e Secret no Supabase
  - Usar Client ID **Web**, não Android

- [ ] **OAuth configuration error**
  - Solução: Verificar APIs habilitadas no Google Console
  - Aguardar alguns minutos para propagação

- [ ] **Navegador não abre**
  - Solução: Verificar `scheme` em app.json
  - Refazer build EAS

- [ ] **Login não redireciona ao app**
  - Solução: Adicionar redirect URIs no Supabase
  - Verificar: `com.antony13.mobile://auth`

---

## ✅ Verificação Final

- [ ] Google OAuth configurado no Google Cloud Console
- [ ] Provider Google habilitado no Supabase
- [ ] Client IDs corretos no código e no Supabase
- [ ] Build EAS criado e instalado
- [ ] Login com Google testado e funcionando
- [ ] Todas as funcionalidades do app testadas
- [ ] App pronto para uso! 🎉

---

## 📊 Resumo de Configuração

Preencha este resumo para referência futura:

```
Google Cloud Console:
├── Projeto: VivaFit Seniors Mobile
├── Client ID Android: _______________________________
├── Client ID iOS: _______________________________
├── Client ID Web: _______________________________
└── Client Secret Web: _______________________________

Supabase Dashboard:
├── Projeto: misptjgsftdtqfvqsneq
├── Google Provider: Habilitado ✅
├── Client ID (Supabase): _______________________________
└── Client Secret (Supabase): _______________________________

Build EAS:
├── Profile: preview / development / production
├── Build ID: _______________________________
├── Data do build: ___/___/______
└── Status: ✅ Funcionando
```

---

## 📝 Notas

Use este espaço para anotar observações durante a configuração:

```
_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________

_________________________________________________________________
```

---

**Data de configuração:** ___/___/______

**Configurado por:** _______________________________

**Status final:** ✅ Funcionando | ⏳ Em andamento | ❌ Com problemas
