# ✅ Checklist de Configuração Google OAuth

Use este checklist para garantir que tudo está configurado corretamente.

## 📋 Google Cloud Console

### Projeto e APIs
- [ ] Projeto criado ou selecionado no Google Cloud Console
- [ ] Google+ API habilitada
- [ ] Google Identity Services API habilitada

### Tela de Consentimento
- [ ] Tela de consentimento OAuth configurada
- [ ] Tipo: Externo (para testes)
- [ ] Nome do app: VivaFit Seniors
- [ ] E-mail de suporte preenchido
- [ ] Escopos adicionados: `openid`, `profile`, `email`

### Credenciais - Android Client ID
- [ ] ID do cliente OAuth 2.0 criado (tipo: Android)
- [ ] Nome do pacote: `com.antony13.Mobile`
- [ ] SHA-1 fingerprint adicionado
  - [ ] Obtido via: `./scripts/get-sha1.sh` ou `cd android && ./gradlew signingReport`
  - [ ] Exemplo: `5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25`

### Credenciais - Web Client ID ⭐
- [ ] ID do cliente OAuth 2.0 criado (tipo: Aplicativo da Web)
- [ ] Nome: VivaFit Seniors Web
- [ ] URIs de redirecionamento autorizados:
  - [ ] `https://misptjgsftdtqfvqsneq.supabase.co/auth/v1/callback`
- [ ] **Web Client ID copiado** (formato: `xxxxx.apps.googleusercontent.com`)
- [ ] **Web Client Secret copiado**

---

## 💻 Código do Aplicativo

### Configuração
- [ ] Arquivo `src/lib/googleOAuthConfig.ts` atualizado
- [ ] `CLIENT_ID` contém o **Web Client ID** (não o Android!)
- [ ] Valor não é placeholder (não contém "your-google-client-id")
- [ ] Formato correto: termina com `.apps.googleusercontent.com`

### Verificação do app.json
- [ ] Plugin configurado: `"plugins": ["@react-native-google-signin/google-signin"]`
- [ ] Scheme configurado: `"scheme": "com.antony13.mobile"`
- [ ] Package Android: `"package": "com.antony13.Mobile"`

### Biblioteca Instalada
- [ ] `@react-native-google-signin/google-signin` está em `package.json`
- [ ] Versão: ^16.0.0 ou superior

---

## 🗄️ Supabase Dashboard

### Provider Google
- [ ] Acessou: https://supabase.com/dashboard
- [ ] Projeto selecionado: `misptjgsftdtqfvqsneq`
- [ ] Navegou para: **Authentication** → **Providers**
- [ ] Provider **Google** localizado
- [ ] Toggle de **Enable** ativado
- [ ] **Client ID (for OAuth)** preenchido com Web Client ID
- [ ] **Client Secret (for OAuth)** preenchido com Web Client Secret
- [ ] Configurações salvas

### URL Configuration
- [ ] **Site URL** configurado (pode ser `http://localhost:8081` para dev)
- [ ] **Redirect URLs** incluem:
  - [ ] `http://localhost:8081/**`
  - [ ] `com.antony13.mobile://**`

---

## 🔨 Build & Deploy

### Preparação
- [ ] Todas as configurações acima completas
- [ ] Código commitado no Git
- [ ] Terminal limpo (sem processos do Expo rodando)

### Build EAS
- [ ] Executado: `eas build --platform android --profile preview`
- [ ] Build completado com sucesso (sem erros)
- [ ] APK baixado
- [ ] APK transferido para dispositivo

### Alternativa: Build Development
- [ ] Executado: `eas build --platform android --profile development`
- [ ] APK instalado
- [ ] Expo Dev Client configurado

---

## 📱 Dispositivo de Teste

### Requisitos do Dispositivo
- [ ] Dispositivo Android **físico** (não emulador sem Play Services)
- [ ] Google Play Services instalado
- [ ] Google Play Services atualizado (versão recente)
- [ ] Pelo menos uma conta Google logada no dispositivo
- [ ] Internet ativa (Wi-Fi ou dados móveis)

### Instalação do App
- [ ] APK instalado no dispositivo
- [ ] App abre sem erros
- [ ] Permissões necessárias concedidas

---

## 🧪 Teste de Funcionalidade

### Fluxo de Login
- [ ] App aberto
- [ ] Tela de Login visível
- [ ] Botão "Continuar com Google" clicável
- [ ] Ao clicar, dialog do Google aparece
- [ ] Lista de contas Google mostrada
- [ ] Conta selecionável
- [ ] Após selecionar, loading aparece
- [ ] Redirecionamento para Home ocorre
- [ ] Usuário logado com sucesso

### Logs (via ADB)
Se tiver problemas, verifique os logs:

```bash
adb logcat | grep -i "google\|supabase"
```

- [ ] Logs mostram: `✅ Google Sign In configurado com sucesso`
- [ ] Logs mostram: `✅ ID Token obtido do Google`
- [ ] Logs mostram: `✅ Login com Google realizado com sucesso!`
- [ ] Nenhum erro crítico nos logs

---

## 🐛 Troubleshooting

### Se o login falhar:

#### Erro: DEVELOPER_ERROR
- [ ] Verificado que Web Client ID está correto em `googleOAuthConfig.ts`
- [ ] Confirmado que SHA-1 está no Google Cloud Console (Android Client ID)
- [ ] Aguardado 10 minutos para propagação
- [ ] Rebuild realizado após mudanças

#### Erro: Invalid ID token (Supabase)
- [ ] Provider Google **habilitado** no Supabase
- [ ] Web Client ID no Supabase = Web Client ID no código
- [ ] Web Client Secret no Supabase está correto
- [ ] Ambos do mesmo projeto Google Cloud

#### Erro: PLAY_SERVICES_NOT_AVAILABLE
- [ ] Usando dispositivo físico (não emulador)
- [ ] Play Services instalado no dispositivo
- [ ] Play Services atualizado

#### Login funciona mas não redireciona
- [ ] Verificado listener em `Login.tsx`:
  ```typescript
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) navigation.replace('Home');
  });
  ```

---

## 📊 Status Final

Marque quando tudo estiver funcionando:

- [ ] ✅ Configuração Google Cloud completa
- [ ] ✅ Código atualizado com credenciais
- [ ] ✅ Supabase configurado
- [ ] ✅ Build EAS realizado
- [ ] ✅ App instalado em dispositivo
- [ ] ✅ Login com Google funcionando
- [ ] ✅ Redirecionamento para Home ok
- [ ] ✅ Usuário autenticado no Supabase

---

## 📚 Documentação de Suporte

Se precisar de ajuda detalhada, consulte:

- **Resumo das Correções:** `docs/GOOGLE_AUTH_CORRECTIONS.md`
- **Troubleshooting Completo:** `docs/GOOGLE_AUTH_TROUBLESHOOTING.md`
- **Setup Passo a Passo:** `docs/GOOGLE_AUTH_SETUP.md`

---

## 🎯 Comandos Úteis

```bash
# Obter SHA-1
./scripts/get-sha1.sh

# Build de preview (rápido)
eas build --platform android --profile preview

# Build de desenvolvimento (com dev tools)
eas build --platform android --profile development

# Ver logs do dispositivo
adb logcat | grep -i "google\|supabase"

# Limpar cache do Gradle (se build falhar)
cd android && ./gradlew clean && cd ..

# Verificar erros no código
npm run type-check  # se tiver o script
```

---

**Data:** 18 de outubro de 2025  
**Versão:** 1.0  
**App:** VivaFit Seniors Mobile
