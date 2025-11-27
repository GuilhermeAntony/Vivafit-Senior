# VivaFit Seniors Mobile 🏋️‍♂️

> Aplicativo mobile React Native (Expo SDK 54) de fitness para idosos - Projeto TCC

[![Expo](https://img.shields.io/badge/Expo-SDK%2054-000020?style=flat&logo=expo)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React%20Native-0.81.2-61DAFB?style=flat&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=flat&logo=supabase)](https://supabase.com)

---

## 📲 Download do App

<div align="center">

###  Baixe agora e comece sua jornada fitness!

[![Download APK](https://img.shields.io/badge/_Baixar_para_Android-APK-0ea5a3?style=for-the-badge&logo=android)](https://expo.dev/artifacts/eas/oY8T9CyJ1rhg4gkfb8p8vE.apk)

**Versão:** 1.2.0 | **Tamanho:** ~50 MB | **Plataforma:** Android 5.0+

---

### 📱 Ou escaneie o QR Code

<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://expo.dev/artifacts/eas/oY8T9CyJ1rhg4gkfb8p8vE.apk" alt="QR Code para Download do APK" />

**Escaneie com a câmera do seu celular Android**

</div>

### 📋 Como Instalar

1. **Baixe o APK** clicando no botão acima
2. **Permita instalação de fontes desconhecidas:**
   - Vá em: Configurações → Segurança → Fontes Desconhecidas
   - Ou permita quando solicitado durante a instalação
3. **Abra o arquivo APK** baixado
4. **Toque em "Instalar"** e aguarde
5. **Abra o app** e comece a treinar! 💪

>  **Nota:** O app requer conexão com internet para autenticação e sincronização de dados. Após o primeiro login, alguns recursos funcionam offline.

---

## 📱 Sobre o Projeto

Aplicativo mobile de exercícios físicos desenvolvido especialmente para o público idoso, com interface intuitiva, acompanhamento de progresso e planos de treino personalizados.

### ✨ Funcionalidades Principais

- 🔐 **Autenticação segura** com Supabase Auth
- 💪 **10+ exercícios** em 4 categorias (cardio, força, flexibilidade, equilíbrio)
- 📊 **Acompanhamento de progresso** com histórico e estatísticas
- 🎯 **Planos de treino personalizados**
- 👤 **Perfil completo** com informações de saúde
- 📴 **Cache offline** para exercícios
- 🎨 **Interface acessível** com tema teal (#0ea5a3)

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 16+ instalado
- npm ou yarn
- Expo Go app instalado no celular (ou emulador Android/iOS)
- Conta Expo (para builds EAS)

### 1️⃣ Instalação

```bash
# Clone o repositório
cd {`/diretório`}

# Instale as dependências
npm install

# Configure o Supabase (credenciais já configuradas em app.json)
# Se necessário, edite expo.extra.supabase no app.json
```

### 2️⃣ Desenvolvimento Local

```bash
# Iniciar servidor de desenvolvimento
npx expo start --dev-client

# Rodar no Android
npx expo run:android

# Rodar no iOS (requer macOS)
npx expo run:ios
```

### 3️⃣ Build para Dispositivo (EAS)

```bash
# Opção 1: Build rápido para teste (5-10 min)
eas build --platform android --profile preview

# Opção 2: Script interativo
./scripts/eas-helper.sh

# Opção 3: Build de desenvolvimento (com dev tools)
eas build --platform android --profile development
```

📖 **Guias completos:**
- [`docs/EAS_QUICK_START.md`](docs/EAS_QUICK_START.md) - Início rápido com EAS
- [`docs/EAS_BUILD_GUIDE.md`](docs/EAS_BUILD_GUIDE.md) - Guia completo de builds
- [`docs/GOOGLE_AUTH_QUICK.md`](docs/GOOGLE_AUTH_QUICK.md) - Configuração Google OAuth
- [`docs/ROADMAP_100_FUNCIONAL.md`](docs/ROADMAP_100_FUNCIONAL.md) - Roadmap completo

## � Autenticação Google OAuth

### Configuração Rápida

Para habilitar login com Google, siga estes passos:

```bash
# 1. Verificar SHA-1 do keystore
./scripts/check-sha1.sh

# 2. Ver guia de configuração
./scripts/setup-google-oauth.sh
```

**Passos principais:**
1. Criar 3 Client IDs no Google Cloud Console (Android, iOS, Web)
2. Configurar provider Google no Supabase Dashboard
3. Atualizar Client ID Android em `src/lib/googleOAuthConfig.ts`
4. Fazer build com EAS e testar

📖 **Guia completo:** [`docs/GOOGLE_AUTH_SETUP.md`](docs/GOOGLE_AUTH_SETUP.md)
📋 **Guia rápido:** [`docs/GOOGLE_AUTH_QUICK.md`](docs/GOOGLE_AUTH_QUICK.md)

⚠️ **IMPORTANTE:** Google OAuth NÃO funciona com Expo Go - use EAS build!

## �📁 Estrutura do Projeto

```
mobile/
├── src/
│   ├── components/ui/       # Componentes reutilizáveis (Button, Card, Input)
│   ├── screens/             # Telas do app (Login, Home, Profile, etc.)
│   ├── navigation/          # Configuração de rotas (React Navigation)
│   ├── lib/                 # Utilitários (supabase, exerciseCache, googleAuth)
│   └── types/               # Definições TypeScript
├── supabase/migrations/     # Migrações do banco de dados
├── scripts/
│   ├── tests/               # Scripts de verificação
│   ├── eas-helper.sh        # Helper interativo para builds EAS
│   ├── check-sha1.sh        # Verificar SHA-1 do keystore
│   ├── setup-google-oauth.sh # Guia de configuração Google OAuth
│   └── populate-exercises.js
├── docs/                    # Documentação completa
├── android/                 # Configuração Android
├── ios/                     # Configuração iOS
├── app.json                 # Configuração Expo + secrets
└── eas.json                 # Perfis de build EAS
```

## 🗄️ Banco de Dados

### Supabase Configuration

- **Projeto:** `misptjgsftdtqfvqsneq`
- **Schema:** `public`
- **URL:** https://misptjgsftdtqfvqsneq.supabase.co
- **Status:** ✅ Configurado e populado

### Tabelas

| Tabela | Descrição | Status |
|--------|-----------|--------|
| `profiles` | Perfis de usuário | ✅ Criada |
| `user_roles` | Papéis de usuário | ✅ Criada |
| `exercises` | Catálogo de exercícios | ✅ 10 exercícios |
| `workouts` | Sessões de treino | ✅ Criada |
| `workout_exercises` | Relação treino-exercício | ✅ Criada |
| `user_progress` | Progresso do usuário | ✅ Criada |
| `user_achievements` | Conquistas | ✅ Criada |

### Verificação do Banco

```bash
# Verificar conexão e tabelas
node scripts/tests/test-supabase.js

# Verificar exercícios (10 esperados)
node scripts/tests/check-exercises.js

# Status geral do sistema
./scripts/check-status.sh
```

## 🛠️ Scripts Disponíveis

### Desenvolvimento
```bash
npm start              # Inicia servidor Expo
npm run android        # Roda no Android
npm run ios            # Roda no iOS
```

### Testes
```bash
node scripts/tests/test-supabase.js        # Testa conexão Supabase
node scripts/tests/check-exercises.js      # Verifica exercícios
node scripts/tests/check-workouts.js       # Verifica workouts
./scripts/check-status.sh                  # Status completo
```

### Builds EAS
```bash
./scripts/eas-helper.sh                    # Menu interativo
eas build --platform android --profile preview   # Build rápido
eas build --platform android --profile production # Build final
```

## 🔑 Configuração de Variáveis

### Desenvolvimento (app.json)
```json
{
  "expo": {
    "extra": {
      "supabase": {
        "url": "https://misptjgsftdtqfvqsneq.supabase.co",
        "anonKey": "sua-anon-key"
      }
    }
  }
}
```

### Produção (EAS Secrets)
```bash
eas secret:create --name SUPABASE_URL --value "https://..."
eas secret:create --name SUPABASE_ANON_KEY --value "eyJ..."
```

## 📐 Arquitetura

### Tecnologias
- **Frontend:** React Native 0.81.2 + Expo SDK 54
- **Navegação:** React Navigation v6 (Native Stack)
- **Backend:** Supabase (PostgreSQL + Auth + Real-time)
- **Storage:** AsyncStorage (cache offline)
- **Build:** EAS (Expo Application Services)
- **Linguagem:** TypeScript 5.x

### Padrões de Código

#### Componentes UI
```typescript
// Exports nomeado + default
export const Button = ({ children, ...rest }: ButtonProps) => { /* ... */ }
export default Button;

// Estilo inline com cor primária
style={{ backgroundColor: '#0ea5a3', padding: 12, borderRadius: 8 }}
```

#### Navegação Tipada
```typescript
type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Profile: { userId: string };
};

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;
```

#### Autenticação
```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(
    (event, session) => {
      if (session?.user) navigation.replace('Home');
    }
  );
  return () => subscription.unsubscribe();
}, [navigation]);
```

## 📚 Documentação Completa

- **[EAS Quick Start](docs/EAS_QUICK_START.md)** - Início rápido com builds
- **[EAS Build Guide](docs/EAS_BUILD_GUIDE.md)** - Guia completo de builds
- **[Roadmap 100% Funcional](docs/ROADMAP_100_FUNCIONAL.md)** - Roadmap detalhado
- **[App Pronto](docs/APP_PRONTO.md)** - Checklist de funcionalidades
- **[Status Supabase](docs/STATUS_SUPABASE.md)** - Status da configuração
- **[Supabase Setup](docs/SUPABASE_SETUP.md)** - Instruções de setup

## 🧪 Testando o App

### 1. Verificar Sistema
```bash
./scripts/check-status.sh
```

### 2. Build e Instalação
```bash
# Build de preview (recomendado para teste)
eas build --platform android --profile preview

# Aguarde 5-10 minutos
# Baixe o APK via QR code ou link
# Instale no dispositivo Android
```

### 3. Checklist de Teste
- [ ] Criar conta de usuário
- [ ] Visualizar 10 exercícios no catálogo
- [ ] Criar um plano de treino
- [ ] Completar exercícios
- [ ] Verificar progresso no Dashboard
- [ ] Editar perfil
- [ ] Testar modo offline (cache)

## 🐛 Solução de Problemas

### Erro de Conexão Supabase
```bash
# Verificar credenciais em app.json
# Testar conexão
node scripts/tests/test-supabase.js
```

### RLS Blocking Reads
```bash
# Verificar políticas RLS no Supabase Dashboard
# Deve permitir SELECT para authenticated users
```

### Build EAS Falhando
```bash
# Ver logs detalhados
eas build:list
eas build:view [BUILD-ID]

# Verificar secrets configurados
eas secret:list
```

### Tabelas Vazias
```bash
# Popular exercícios
node scripts/populate-exercises.js

# Verificar
node scripts/tests/check-exercises.js
```

## 🤝 Contribuindo

Este é um projeto de TCC. Para sugestões ou melhorias:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é parte de um Trabalho de Conclusão de Curso (TCC).

## 👥 Autor

**Guilherme Antony Oliveira Santos** - Projeto TCC VivaFit Seniors

**guilherme.antony1306@gmail.com** - Gmail
---

⭐ **Status do Projeto:** ✅ Configurado | 🚀 Pronto para Testes | 📱 Build EAS Disponível

EAS build (exemplo):

```bash
# instalar EAS CLI (se ainda não tiver)
npm install -g eas-cli

# fazer login e inicializar EAS no projeto (siga prompts)
eas login
eas build:configure

# construir para Android (usa secrets definidos)
eas build --platform android
```
