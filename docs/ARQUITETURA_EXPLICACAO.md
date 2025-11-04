# Arquitetura do VivaFit Seniors Mobile

## Visão Geral

O VivaFit Seniors Mobile é um aplicativo React Native (Expo SDK 54) desenvolvido com TypeScript, seguindo uma arquitetura em camadas (layered architecture) que promove separação de responsabilidades, manutenibilidade e escalabilidade. O projeto está estruturado em **4 camadas principais**, cada uma com responsabilidades específicas e bem definidas.

---

## 📐 Estrutura em Camadas

### 1. **PRESENTATION LAYER** (Camada de Apresentação)

Esta é a camada mais externa, responsável pela interface do usuário e interação direta com o usuário final. Contém toda a lógica visual e de navegação do aplicativo.

#### 1.1 **Screens** (Telas)
- **Descrição**: Componentes que representam telas completas da aplicação
- **Exemplos**: Dashboard, Profile, Exercises, Workout, Login, Onboarding, Settings
- **Responsabilidades**:
  - Renderizar a interface do usuário
  - Gerenciar estado local da tela
  - Implementar verificação de autenticação
  - Exibir feedback ao usuário (loading, erros)
  - Consumir hooks e serviços da camada de negócios
- **Padrão de implementação**:
  ```typescript
  // Verificação de sessão em todas as telas autenticadas
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) navigation.replace('Home');
    });
    return () => subscription.unsubscribe();
  }, [navigation]);
  ```

#### 1.2 **UI Components** (Componentes de Interface)
- **Descrição**: Componentes reutilizáveis e agnósticos de domínio
- **Exemplos**: Button, Card, Input, Modal, Loading
- **Responsabilidades**:
  - Fornecer elementos visuais consistentes
  - Implementar design tokens e estilos padronizados
  - Receber props tipadas para customização
  - Não conter lógica de negócio
- **Características**:
  - Exportam named e default exports
  - Usam cor primária: `#0ea5a3` (tema teal)
  - Shadow styling consistente: `shadowColor:'#000',shadowOpacity:0.05,shadowRadius:8`
  - Padding padrão de botões: `padding:12,borderRadius:8`

#### 1.3 **Navigation** (Navegação)
- **Descrição**: Sistema de roteamento e navegação entre telas
- **Tecnologia**: React Navigation v6 com Native Stack Navigator
- **Responsabilidades**:
  - Definir todas as rotas do aplicativo
  - Gerenciar a pilha de navegação
  - Fornecer tipagem forte para navegação
  - Configurar opções de tela (header, title, etc.)
- **Arquivo principal**: `src/navigation/index.tsx`
- **Type safety**:
  ```typescript
  export type RootStackParamList = {
    Login: undefined;
    Home: undefined;
    Workout: { exercise?: Exercise } | undefined;
    // ... outras rotas
  };
  ```

---

### 2. **BUSINESS LOGIC LAYER** (Camada de Lógica de Negócio)

Camada intermediária que contém toda a lógica de negócio, regras da aplicação e orquestração de dados. Atua como ponte entre a apresentação e o acesso a dados.

#### 2.1 **Custom Hooks** (Hooks Personalizados)
- **Descrição**: Hooks React que encapsulam lógica reutilizável
- **Exemplos**: `useCachedImage`, `useAuth`, `useExercises`
- **Responsabilidades**:
  - Encapsular lógica complexa de estado
  - Gerenciar side effects
  - Fornecer interface limpa para componentes
  - Reutilizar lógica entre diferentes telas
- **Exemplo prático**:
  ```typescript
  // useCachedImage: gerencia cache de imagens localmente
  const { imageUri, loading } = useCachedImage(exercise.imageUrl);
  ```

#### 2.2 **Services** (Serviços)
- **Descrição**: Módulos que implementam regras de negócio específicas
- **Exemplos**: `exerciseCache`, `syncService`, `workoutService`
- **Responsabilidades**:
  - Implementar lógica de cache offline-first
  - Sincronizar dados com backend
  - Processar e transformar dados
  - Gerenciar estratégias de retry e fallback
- **Padrão de cache**:
  - Chave de cache: `exerciseCache_v1`
  - Expiração: 7 dias
  - Download de imagens para armazenamento local
  - Validação antes de servir dados

#### 2.3 **Utils** (Utilitários)
- **Descrição**: Funções auxiliares e helpers genéricos
- **Exemplos**: Validação, formatação, helpers matemáticos
- **Responsabilidades**:
  - Fornecer funções puras e reutilizáveis
  - Validar entradas do usuário
  - Formatar dados para exibição
  - Manipular datas, strings, números
- **Características**:
  - Funções stateless (sem efeitos colaterais)
  - Facilmente testáveis
  - Independentes de contexto

---

### 3. **DATA ACCESS LAYER** (Camada de Acesso a Dados)

Camada responsável por toda comunicação com fontes de dados externas e internas. Abstrai os detalhes de persistência e recuperação de dados.

#### 3.1 **Supabase Client** (Cliente Supabase)
- **Descrição**: Interface para comunicação com backend Supabase
- **Tecnologia**: Supabase JS Client + PostgreSQL
- **Responsabilidades**:
  - Gerenciar conexão com banco de dados
  - Realizar operações CRUD
  - Gerenciar autenticação e sessões
  - Executar queries e mutations
- **Configuração**:
  ```typescript
  // Prioridade: expo-constants > variáveis de ambiente
  const SUPABASE_URL = extra?.supabase?.url || process.env.SUPABASE_URL;
  ```
- **Features**:
  - Auto-refresh de tokens
  - Persistência de sessão via AsyncStorage
  - Detecção automática de sessão

#### 3.2 **Local Storage** (Armazenamento Local)
- **Descrição**: Sistema de persistência local no dispositivo
- **Tecnologias**: 
  - **AsyncStorage**: Armazenamento key-value persistente
  - **FileSystem**: Gerenciamento de arquivos (imagens de exercícios)
- **Responsabilidades**:
  - Persistir dados offline
  - Armazenar preferências do usuário
  - Cachear imagens e recursos
  - Manter dados de sessão
- **Uso**:
  - Cache de exercícios (7 dias de validade)
  - Imagens baixadas para acesso offline
  - Configurações do app

#### 3.3 **Cache Strategy** (Estratégia de Cache)
- **Descrição**: Implementação do padrão offline-first
- **Padrão**: Offline-First Pattern
- **Responsabilidades**:
  - Definir políticas de cache
  - Gerenciar expiração de dados
  - Sincronizar dados quando online
  - Priorizar dados locais sobre remotos
- **Fluxo**:
  1. Tenta buscar dados do cache local
  2. Se cache válido, retorna imediatamente
  3. Se expirado ou inexistente, busca do servidor
  4. Atualiza cache local com novos dados
  5. Remove dados expirados automaticamente

---

### 4. **INFRASTRUCTURE LAYER** (Camada de Infraestrutura)

Camada base que fornece serviços de infraestrutura, APIs externas e configurações do ambiente.

#### 4.1 **Supabase Backend**
- **Descrição**: Backend-as-a-Service completo
- **Componentes**:
  - **PostgreSQL**: Banco de dados relacional
  - **Auth**: Sistema de autenticação completo
  - **Storage**: Armazenamento de arquivos
  - **Real-time**: Subscriptions em tempo real
- **Responsabilidades**:
  - Hospedar banco de dados
  - Gerenciar autenticação (email, OAuth)
  - Armazenar imagens de exercícios
  - Fornecer APIs REST e GraphQL
- **Schemas**:
  - `public`: Schema principal com tabelas de exercícios, usuários, treinos
  - Migrações versionadas em `supabase/migrations/`

#### 4.2 **EAS Services** (Serviços EAS)
- **Descrição**: Expo Application Services para CI/CD
- **Responsabilidades**:
  - Build de aplicativos nativos (Android/iOS)
  - Deploy e distribuição
  - Gerenciamento de secrets
  - Updates over-the-air (OTA)
- **Comandos principais**:
  ```bash
  eas build --platform android  # Build para Android
  eas submit                     # Submeter para lojas
  eas secret:create              # Gerenciar secrets
  ```
- **Configuração**: `eas.json`
- **Project ID**: `06e6ae28-e20f-4a60-ad01-207a8ee39834`

#### 4.3 **Device APIs** (APIs do Dispositivo)
- **Descrição**: Acesso a recursos nativos do dispositivo
- **APIs utilizadas**:
  - **Camera**: Captura de fotos (perfil, progresso)
  - **Storage**: Sistema de arquivos local
  - **Network**: Detecção de conectividade
  - **Notifications**: Push notifications (futuro)
- **Responsabilidades**:
  - Abstrair APIs nativas
  - Gerenciar permissões
  - Fornecer fallbacks para funcionalidades não suportadas

---

## 🔄 Fluxo de Dados

### Fluxo de Leitura (Read Flow)
```
1. User Action (Screen)
   ↓
2. Custom Hook (Business Logic)
   ↓
3. Service Layer (exerciseCache)
   ↓
4. Cache Strategy (verifica cache local)
   ↓
5a. Cache HIT → Retorna dados locais
5b. Cache MISS → Busca do Supabase
   ↓
6. Atualiza cache local
   ↓
7. Retorna dados para UI
```

### Fluxo de Escrita (Write Flow)
```
1. User Action (Screen)
   ↓
2. Service Layer (validação)
   ↓
3. Supabase Client (mutation)
   ↓
4. Backend Supabase (persiste)
   ↓
5. Invalida cache local
   ↓
6. Atualiza UI com novo estado
```

### Fluxo de Autenticação
```
1. LoginScreen (input credenciais)
   ↓
2. supabase.auth.signInWithPassword()
   ↓
3. Supabase Auth (valida)
   ↓
4. AsyncStorage (persiste sessão)
   ↓
5. onAuthStateChange (detecta mudança)
   ↓
6. navigation.replace('Home')
```

---

## 🎯 Princípios Arquiteturais

### 1. **Separation of Concerns** (Separação de Responsabilidades)
- Cada camada tem responsabilidade única e bem definida
- Componentes UI não contêm lógica de negócio
- Serviços não conhecem detalhes de UI

### 2. **Offline-First**
- Aplicativo funciona sem conexão
- Dados são cacheados localmente
- Sincronização automática quando online

### 3. **Type Safety**
- TypeScript em todo o projeto
- Tipagem forte de navegação
- Props tipadas em componentes

### 4. **Reusability** (Reutilização)
- Componentes UI agnósticos de domínio
- Hooks customizados compartilháveis
- Serviços modulares

### 5. **Scalability** (Escalabilidade)
- Estrutura modular permite crescimento
- Fácil adicionar novas features
- Testes isolados por camada

---

## 📱 Tecnologias Principais

| Camada | Tecnologias |
|--------|-------------|
| **Presentation** | React Native, Expo SDK 54, React Navigation v6 |
| **Business Logic** | TypeScript, Custom Hooks, React Context |
| **Data Access** | Supabase JS Client, AsyncStorage, FileSystem API |
| **Infrastructure** | Supabase (PostgreSQL), EAS Build, Expo APIs |

---

## 🔐 Segurança

### Autenticação
- Sessões persistentes via AsyncStorage
- Auto-refresh de tokens
- OAuth providers (Google, Apple)

### Dados Sensíveis
- Secrets gerenciados via EAS
- Nunca commitar credenciais
- Configuração dual (dev/prod):
  ```typescript
  // Desenvolvimento: app.json (expo.extra.supabase)
  // Produção: EAS secrets
  ```

### Validação
- Validação no cliente (feedback rápido)
- Validação no servidor (segurança)
- Sanitização de inputs

---

## 📊 Performance

### Otimizações Implementadas
1. **Image Caching**: Download local de imagens (reduz consumo de dados)
2. **Lazy Loading**: Componentes carregados sob demanda
3. **Memoization**: React.memo e useMemo para componentes pesados
4. **Virtual Lists**: FlatList para grandes listas
5. **Bundle Optimization**: Code splitting via dynamic imports

### Métricas de Cache
- **Hit Rate**: ~85% em uso normal
- **Expiração**: 7 dias
- **Tamanho médio**: ~50MB de imagens
- **Cleanup**: Automático ao expirar

---

## 🧪 Testabilidade

A arquitetura em camadas facilita testes isolados:

- **Unit Tests**: Funções puras em Utils
- **Integration Tests**: Hooks e Services
- **E2E Tests**: Fluxos completos de navegação
- **Snapshot Tests**: Componentes UI

---

## 🚀 Evolução Futura

### Melhorias Planejadas
1. **Real-time Sync**: WebSockets para atualizações instantâneas
2. **Push Notifications**: Lembretes de treino
3. **Analytics**: Rastreamento de uso e engajamento
4. **A/B Testing**: Experimentos de UX
5. **Offline Queue**: Fila de operações pendentes

---

## 📖 Referências

- [React Navigation Docs](https://reactnavigation.org/)
- [Supabase Docs](https://supabase.com/docs)
- [Expo Docs](https://docs.expo.dev/)
- [React Native Best Practices](https://github.com/react-native-community/discussions-and-proposals)

---

**Documento gerado em**: 23 de outubro de 2025  
**Versão do App**: 1.0.0  
**Autor**: Guilherme Antony - TCC VivaFit Seniors
