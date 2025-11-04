# ARQUITETURA DE AUTENTICAÇÃO E SEGURANÇA NO APLICATIVO VIVAFIT SENIORS

**Resumo:** O presente artigo descreve a arquitetura de autenticação e segurança implementada no aplicativo móvel VivaFit Seniors, desenvolvido com React Native e Expo SDK 54. O sistema adota uma abordagem multicamadas que integra autenticação OAuth, tokens JWT (JSON Web Tokens), e Row Level Security (RLS) no PostgreSQL, garantindo isolamento completo dos dados por usuário. A arquitetura proposta oferece alto nível de segurança, privacidade e conformidade com as melhores práticas da indústria, sendo especialmente adequada para aplicações voltadas ao público idoso que manipulam dados sensíveis de saúde e fitness.

**Palavras-chave:** Autenticação. Segurança. OAuth. JWT. Row Level Security. React Native. Supabase.

---

## 1 INTRODUÇÃO

A autenticação e segurança em aplicações móveis voltadas para saúde e bem-estar representam desafios críticos no desenvolvimento de software, especialmente quando o público-alvo inclui usuários idosos que podem ter menor familiaridade com tecnologias digitais. O VivaFit Seniors é um aplicativo de fitness projetado especificamente para o público sênior, manipulando dados pessoais, históricos de exercícios, métricas de saúde e informações de progresso físico.

A Lei Geral de Proteção de Dados (LGPD), Lei nº 13.709/2018, estabelece rigorosos requisitos para o tratamento de dados pessoais, incluindo dados sensíveis relacionados à saúde (BRASIL, 2018). Neste contexto, a implementação de uma arquitetura de segurança robusta não é apenas uma boa prática técnica, mas uma exigência legal e ética.

O presente trabalho descreve detalhadamente a arquitetura de autenticação e segurança implementada no VivaFit Seniors, analisando cada etapa do fluxo de autenticação, desde a solicitação inicial de login até a entrega de dados personalizados e protegidos ao usuário final.

### 1.1 Objetivos

O objetivo geral deste artigo é documentar e explicar a arquitetura de autenticação e segurança do aplicativo VivaFit Seniors, demonstrando como cada componente contribui para a proteção dos dados dos usuários.

Os objetivos específicos incluem:

a) Detalhar o fluxo completo de autenticação desde a requisição até a resposta;

b) Explicar o papel de cada componente na arquitetura de segurança;

c) Demonstrar a implementação de Row Level Security (RLS) no PostgreSQL;

d) Analisar os mecanismos de proteção de dados em cada camada da aplicação;

e) Apresentar boas práticas de segurança aplicadas ao contexto mobile.

---

## 2 FUNDAMENTAÇÃO TEÓRICA

### 2.1 Autenticação em Aplicações Móveis

A autenticação é o processo de verificação da identidade de um usuário ou sistema. Em aplicações móveis modernas, este processo vai além da simples validação de credenciais, envolvendo gestão de sessões, renovação de tokens e sincronização multi-dispositivo (STALLINGS; BROWN, 2018).

Segundo Richardson e Ruby (2013), sistemas de autenticação eficazes devem atender aos seguintes princípios:

a) **Confidencialidade:** garantir que informações sensíveis não sejam expostas;

b) **Integridade:** assegurar que dados não sejam alterados indevidamente;

c) **Disponibilidade:** manter o serviço acessível a usuários autorizados;

d) **Não-repúdio:** impossibilitar que um usuário negue ações realizadas.

### 2.2 OAuth 2.0

O OAuth 2.0 é um framework de autorização que permite que aplicações obtenham acesso limitado a recursos de usuários em serviços HTTP, sem expor credenciais (HARDT, 2012). O protocolo define quatro papéis principais:

- **Resource Owner (Proprietário do Recurso):** o usuário que autoriza o acesso;
- **Client (Cliente):** a aplicação que solicita acesso aos recursos;
- **Authorization Server (Servidor de Autorização):** valida credenciais e emite tokens;
- **Resource Server (Servidor de Recursos):** hospeda os recursos protegidos.

### 2.3 JSON Web Tokens (JWT)

JWT é um padrão aberto (RFC 7519) que define uma forma compacta e autossuficiente de transmitir informações entre partes como um objeto JSON (JONES; BRADLEY; SAKIMURA, 2015). Um JWT consiste em três partes codificadas em Base64URL:

```
Header.Payload.Signature
```

O header contém metadados sobre o token, o payload contém as claims (declarações) sobre o usuário, e a signature garante a integridade do token.

### 2.4 Row Level Security (RLS)

Row Level Security é um recurso do PostgreSQL que permite controlar o acesso a linhas individuais de uma tabela com base em políticas definidas (POSTGRESQL GLOBAL DEVELOPMENT GROUP, 2023). RLS oferece:

- Isolamento de dados por usuário no nível do banco de dados;
- Redução de riscos de vazamento de dados por falhas na aplicação;
- Conformidade com princípios de menor privilégio.

---

## 3 ARQUITETURA DO SISTEMA

A arquitetura de autenticação e segurança do VivaFit Seniors é composta por quatro componentes principais que interagem em um fluxo sequencial bem definido:

### 3.1 Componentes da Arquitetura

#### 3.1.1 Usuário

O componente "Usuário" representa o ponto de entrada do sistema - o idoso que utiliza o aplicativo para acompanhar seu programa de exercícios. Este usuário interage com a interface mobile através de ações como:

- Inserção de credenciais (email e senha);
- Seleção de provedor OAuth (Google, Apple);
- Acesso a funcionalidades protegidas do aplicativo.

#### 3.1.2 Aplicativo React Native

O aplicativo, desenvolvido com React Native e Expo SDK 54, atua como camada de apresentação e orquestração. Suas responsabilidades incluem:

a) **Gerenciamento de Interface:** apresentar telas de login, registro e recuperação de senha;

b) **Gerenciamento de Estado:** manter sessão ativa e informações do usuário autenticado;

c) **Armazenamento Seguro:** persistir tokens de autenticação usando AsyncStorage ou SecureStore;

d) **Interceptação de Requisições:** adicionar headers de autenticação em todas as chamadas à API.

A implementação utiliza o Supabase Client Library, que abstrai a complexidade da comunicação com o backend:

```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

#### 3.1.3 Supabase Auth

O Supabase Auth é o servidor de autenticação responsável por:

- Validar credenciais de usuários;
- Integrar-se com provedores OAuth (Google, Apple, Facebook);
- Emitir e gerenciar tokens JWT;
- Manter sessões ativas;
- Implementar políticas de segurança (rate limiting, detecção de fraudes).

O Supabase utiliza GoTrue, um servidor de autenticação de código aberto desenvolvido pela Netlify, adaptado para funcionar com PostgreSQL.

#### 3.1.4 PostgreSQL com Row Level Security (RLS)

O banco de dados PostgreSQL armazena todos os dados da aplicação e implementa RLS para garantir isolamento absoluto entre usuários. As políticas RLS são definidas diretamente no schema do banco:

```sql
-- Habilita RLS na tabela de perfis
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Política: usuários só podem ver seu próprio perfil
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Política: usuários só podem atualizar seu próprio perfil
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

---

## 4 FLUXO DE AUTENTICAÇÃO E SEGURANÇA

O fluxo de autenticação segue uma sequência de sete etapas bem definidas, cada uma com responsabilidades específicas de segurança. A Figura 1 ilustra este fluxo completo.

### 4.1 Etapa 1: Solicitação de Login

**Descrição:** O processo inicia quando o usuário acessa o aplicativo e solicita autenticação, seja através de credenciais tradicionais (email/senha) ou OAuth.

**Ator Principal:** Usuário

**Ator Secundário:** Aplicativo React Native

**Processo Técnico:**

1. O usuário preenche o formulário de login na tela `Login.tsx`;
2. O aplicativo valida o formato dos dados localmente (validação de email, comprimento de senha);
3. Se válido, dispara evento de solicitação de autenticação;
4. Um indicador de loading é exibido ao usuário.

**Código de Implementação:**

```typescript
// src/screens/Login.tsx
const handleLogin = async () => {
  setLoading(true);
  
  // Validação local
  if (!email || !password) {
    Alert.alert('Erro', 'Preencha todos os campos');
    setLoading(false);
    return;
  }

  if (!isValidEmail(email)) {
    Alert.alert('Erro', 'Email inválido');
    setLoading(false);
    return;
  }

  // Dispara solicitação de autenticação
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  setLoading(false);

  if (error) {
    Alert.alert('Erro de Autenticação', error.message);
    return;
  }

  // Navegação tratada pelo listener de auth state
};
```

**Aspectos de Segurança:**

- Validação de entrada previne ataques de injeção;
- Senha não é armazenada ou logged em nenhum momento;
- Comunicação HTTPS obrigatória (enforced pelo Supabase);
- Rate limiting aplicado no backend (máximo 5 tentativas/minuto).

### 4.2 Etapa 2: Autenticação OAuth/Email

**Descrição:** O aplicativo React Native encaminha as credenciais ao Supabase Auth para validação, utilizando o método de autenticação escolhido pelo usuário.

**Ator Principal:** Aplicativo React Native

**Ator Secundário:** Supabase Auth

**Processo Técnico:**

Para autenticação por email/senha:

1. Credenciais são enviadas via HTTPS ao endpoint `/auth/v1/token`;
2. Supabase Auth verifica email no banco de dados;
3. Hash da senha é comparado usando bcrypt (custo 10);
4. Se válido, sessão é criada no banco de dados.

Para autenticação OAuth (exemplo: Google):

1. Aplicativo abre WebView com URL de autorização do Google;
2. Usuário concede permissões no Google;
3. Google redireciona com código de autorização;
4. Supabase troca código por access token;
5. Supabase valida token com Google;
6. Perfil do usuário é criado/atualizado no banco.

**Código de Implementação (OAuth):**

```typescript
// src/lib/googleAuth.ts
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: process.env.GOOGLE_EXPO_CLIENT_ID,
    iosClientId: process.env.GOOGLE_IOS_CLIENT_ID,
    androidClientId: process.env.GOOGLE_ANDROID_CLIENT_ID,
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      
      // Autentica no Supabase com token do Google
      supabase.auth.signInWithIdToken({
        provider: 'google',
        token: authentication.idToken,
      });
    }
  }, [response]);

  return { promptAsync, loading: !request };
};
```

**Aspectos de Segurança:**

- Senhas nunca transitam em texto plano (hash bcrypt);
- OAuth elimina exposição de senha ao aplicativo;
- Tokens de acesso OAuth têm validade limitada (1 hora);
- PKCE (Proof Key for Code Exchange) implementado para OAuth;
- TLS 1.3 obrigatório para todas as conexões.

### 4.3 Etapa 3: Token JWT + Sessão

**Descrição:** Após validação bem-sucedida, o Supabase Auth emite um token JWT assinado e uma sessão, retornando-os ao aplicativo React Native.

**Ator Principal:** Supabase Auth

**Ator Secundário:** Aplicativo React Native

**Processo Técnico:**

1. Supabase Auth gera JWT com payload contendo:
   - `sub`: ID do usuário (UUID)
   - `email`: email do usuário
   - `role`: papel do usuário (authenticated)
   - `iat`: timestamp de emissão
   - `exp`: timestamp de expiração (1 hora)

2. JWT é assinado com chave secreta usando algoritmo HS256;

3. Refresh token é gerado (válido por 30 dias);

4. Sessão é registrada no banco de dados;

5. Resposta JSON é retornada ao cliente.

**Estrutura do JWT:**

```json
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "sub": "123e4567-e89b-12d3-a456-426614174000",
    "email": "usuario@example.com",
    "role": "authenticated",
    "iat": 1698000000,
    "exp": 1698003600,
    "aud": "authenticated",
    "app_metadata": {
      "provider": "google"
    },
    "user_metadata": {
      "full_name": "João Silva",
      "avatar_url": "https://..."
    }
  },
  "signature": "SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c"
}
```

**Aspectos de Segurança:**

- JWT assinado previne adulteração;
- Expiração curta (1 hora) limita janela de exploração;
- Refresh token permite renovação sem re-autenticação;
- Algoritmo HS256 balanceia segurança e performance;
- Claims padronizadas (sub, exp, iat) seguem RFC 7519.

### 4.4 Etapa 4: Armazenamento Seguro do Token

**Descrição:** O token JWT recebido é armazenado de forma segura no dispositivo móvel para uso em requisições subsequentes.

**Ator Principal:** Aplicativo React Native

**Processo Técnico:**

O Supabase Client automaticamente armazena os tokens usando a estratégia de storage configurada. No iOS e Android, podem ser utilizadas duas abordagens:

**Opção 1 - AsyncStorage (Padrão):**

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Configurado automaticamente pelo Supabase Client
const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    persistSession: true,
  },
});

// Estrutura armazenada
const sessionKey = 'sb-auth-token';
const sessionData = {
  access_token: 'eyJhbGc...',
  refresh_token: 'v1.MRjRu...',
  expires_at: 1698003600,
  user: { /* dados do usuário */ },
};
```

**Opção 2 - Expo SecureStore (Recomendado para dados sensíveis):**

```typescript
import * as SecureStore from 'expo-secure-store';

const SecureStoreAdapter = {
  getItem: async (key: string) => {
    return await SecureStore.getItemAsync(key);
  },
  setItem: async (key: string, value: string) => {
    await SecureStore.setItemAsync(key, value);
  },
  removeItem: async (key: string) => {
    await SecureStore.deleteItemAsync(key);
  },
};

const supabase = createClient(url, key, {
  auth: {
    storage: SecureStoreAdapter,
    persistSession: true,
  },
});
```

**Aspectos de Segurança:**

- **SecureStore** utiliza Keychain (iOS) e KeyStore (Android);
- Dados criptografados com chaves de hardware quando disponível;
- Isolamento por aplicativo (sandbox);
- Proteção contra extração por backup;
- Auto-destruição em caso de jailbreak/root (opcional).

### 4.5 Etapa 5: Consulta com Contexto do Usuário

**Descrição:** Quando o usuário solicita dados (ex: histórico de treinos), o aplicativo inclui o token JWT no header Authorization da requisição HTTP.

**Ator Principal:** Aplicativo React Native

**Ator Secundário:** PostgreSQL + RLS

**Processo Técnico:**

1. Usuário acessa uma tela que requer dados do servidor;
2. Componente React dispara query usando Supabase Client;
3. Client recupera token do storage;
4. Token é incluído no header `Authorization: Bearer <token>`;
5. Requisição é enviada ao endpoint da API.

**Código de Implementação:**

```typescript
// src/screens/History.tsx
const [workouts, setWorkouts] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchWorkouts() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigation.replace('Login');
      return;
    }

    // Query automática com contexto de autenticação
    const { data, error } = await supabase
      .from('completed_workouts')
      .select(`
        *,
        exercise:exercises(name, image_url)
      `)
      .eq('user_id', user.id)  // Filtro explícito
      .order('completed_at', { ascending: false })
      .limit(50);

    if (error) {
      Alert.alert('Erro', 'Não foi possível carregar histórico');
    } else {
      setWorkouts(data || []);
    }
    
    setLoading(false);
  }

  fetchWorkouts();
}, []);
```

**Requisição HTTP Resultante:**

```http
GET /rest/v1/completed_workouts?user_id=eq.123e4567... HTTP/1.1
Host: xyz.supabase.co
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (anon key)
Content-Type: application/json
```

**Aspectos de Segurança:**

- Token validado em cada requisição;
- Requisições sem token válido retornam 401 Unauthorized;
- Token expirado aciona refresh automático;
- CORS configurado para aceitar apenas domínios autorizados.

### 4.6 Etapa 6: Aplicação de Políticas RLS

**Descrição:** O PostgreSQL intercepta a query e aplica políticas de Row Level Security, garantindo que apenas dados do usuário autenticado sejam retornados.

**Ator Principal:** PostgreSQL + RLS

**Processo Técnico:**

1. Servidor Supabase recebe requisição HTTP;
2. Middleware valida JWT e extrai `sub` (user ID);
3. Contexto de autenticação é definido: `auth.uid() = '123e4567...'`;
4. Query SQL é executada no PostgreSQL;
5. PostgreSQL aplica políticas RLS automaticamente;
6. Apenas linhas que atendem às políticas são retornadas.

**Exemplo de Política RLS:**

```sql
-- Tabela: completed_workouts
CREATE TABLE completed_workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  exercise_id UUID REFERENCES exercises(id),
  duration INTEGER,
  calories_burned INTEGER,
  completed_at TIMESTAMP DEFAULT NOW()
);

-- Habilita RLS
ALTER TABLE completed_workouts ENABLE ROW LEVEL SECURITY;

-- Política SELECT: usuário vê apenas seus treinos
CREATE POLICY "Users view own workouts"
  ON completed_workouts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política INSERT: usuário cria treinos apenas para si
CREATE POLICY "Users insert own workouts"
  ON completed_workouts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política UPDATE: usuário atualiza apenas seus treinos
CREATE POLICY "Users update own workouts"
  ON completed_workouts
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Política DELETE: usuário deleta apenas seus treinos
CREATE POLICY "Users delete own workouts"
  ON completed_workouts
  FOR DELETE
  USING (auth.uid() = user_id);
```

**Transformação da Query:**

Query original da aplicação:

```sql
SELECT * FROM completed_workouts 
WHERE user_id = '123e4567-e89b-12d3-a456-426614174000'
ORDER BY completed_at DESC
LIMIT 50;
```

Query executada no PostgreSQL (com RLS):

```sql
SELECT * FROM completed_workouts 
WHERE user_id = '123e4567-e89b-12d3-a456-426614174000'
  AND auth.uid() = user_id  -- Adicionado pelo RLS
ORDER BY completed_at DESC
LIMIT 50;
```

**Aspectos de Segurança:**

- Proteção no nível do banco de dados (defesa em profundidade);
- Impossibilidade de bypass mesmo com SQL injection;
- Políticas aplicadas independente da lógica da aplicação;
- Auditoria centralizada de acesso a dados;
- Conformidade com princípio de menor privilégio.

### 4.7 Etapa 7: Retorno de Dados Específicos e Interface Personalizada

**Descrição:** Apenas dados pertencentes ao usuário autenticado são retornados pelo banco de dados, processados pelo aplicativo e exibidos em uma interface personalizada.

**Ator Principal:** Aplicativo React Native

**Ator Secundário:** Usuário

**Processo Técnico:**

1. PostgreSQL retorna resultado da query (apenas dados do usuário);
2. Servidor Supabase serializa resposta em JSON;
3. Aplicativo React Native recebe resposta HTTP 200 OK;
4. Dados são deserializados e armazenados no estado local;
5. Componente React renderiza interface personalizada;
6. Cache local é atualizado para acesso offline.

**Código de Renderização:**

```typescript
// src/screens/History.tsx (continuação)
return (
  <View style={styles.container}>
    <Text style={styles.title}>Meu Histórico de Treinos</Text>
    
    {loading ? (
      <ActivityIndicator size="large" color="#0ea5a3" />
    ) : workouts.length === 0 ? (
      <Text style={styles.emptyText}>
        Nenhum treino realizado ainda
      </Text>
    ) : (
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <WorkoutCard
            exerciseName={item.exercise.name}
            imageUrl={item.exercise.image_url}
            duration={item.duration}
            calories={item.calories_burned}
            completedAt={item.completed_at}
          />
        )}
      />
    )}
  </View>
);
```

**Dados Retornados (JSON):**

```json
[
  {
    "id": "a1b2c3d4-...",
    "user_id": "123e4567-...",
    "exercise_id": "789abc...",
    "duration": 1200,
    "calories_burned": 150,
    "completed_at": "2025-10-20T14:30:00Z",
    "exercise": {
      "name": "Caminhada Leve",
      "image_url": "https://..."
    }
  },
  {
    "id": "e5f6g7h8-...",
    "user_id": "123e4567-...",
    "exercise_id": "def456...",
    "duration": 900,
    "calories_burned": 120,
    "completed_at": "2025-10-19T10:15:00Z",
    "exercise": {
      "name": "Alongamento",
      "image_url": "https://..."
    }
  }
]
```

**Aspectos de Segurança:**

- Dados sensíveis (ex: data de nascimento) não são expostos desnecessariamente;
- Imagens carregadas via HTTPS;
- Cache local protegido por criptografia do sistema operacional;
- Logout limpa cache e remove tokens;
- Interface exibe apenas dados do usuário (privacidade).

---

## 5 SEGURANÇA EM CAMADAS (DEFENSE IN DEPTH)

A arquitetura implementa o princípio de defesa em profundidade, com múltiplas camadas de segurança:

### 5.1 Camada de Transporte

- **TLS 1.3:** criptografia de ponta a ponta;
- **Certificate Pinning:** validação de certificado do servidor (opcional);
- **HSTS:** força uso de HTTPS.

### 5.2 Camada de Aplicação

- **Validação de Entrada:** previne XSS e injection;
- **Sanitização de Dados:** limpa dados antes de exibir;
- **Content Security Policy:** previne scripts maliciosos.

### 5.3 Camada de Autenticação

- **OAuth 2.0:** delegação segura de autorização;
- **JWT:** tokens stateless e assinados;
- **Refresh Tokens:** renovação automática de sessão;
- **Rate Limiting:** previne brute force (5 tentativas/minuto).

### 5.4 Camada de Autorização

- **Row Level Security:** controle granular no banco;
- **Políticas Declarativas:** separação de lógica de negócio;
- **Função `auth.uid()`:** contexto de usuário sempre disponível.

### 5.5 Camada de Dados

- **Criptografia em Repouso:** dados criptografados no disco;
- **Backups Criptografados:** proteção de backups;
- **Auditoria:** logs de acesso a dados sensíveis.

---

## 6 CONFORMIDADE COM LGPD

A arquitetura atende aos princípios da LGPD:

### 6.1 Finalidade

Dados coletados apenas para funcionalidades do aplicativo (treinos, progresso).

### 6.2 Adequação

Tratamento compatível com finalidades informadas ao usuário.

### 6.3 Necessidade

Coleta limitada ao mínimo necessário (minimização de dados).

### 6.4 Transparência

Usuário informado sobre coleta e uso de dados (política de privacidade).

### 6.5 Segurança

Medidas técnicas e administrativas de proteção (RLS, criptografia, auditoria).

### 6.6 Prevenção

Políticas RLS previnem vazamentos acidentais.

### 6.7 Não Discriminação

Dados não utilizados para fins discriminatórios.

### 6.8 Responsabilização

Logs de auditoria demonstram conformidade.

---

## 7 TESTES DE SEGURANÇA

### 7.1 Teste de Isolamento de Dados

**Cenário:** Usuário A tenta acessar dados do Usuário B.

**Procedimento:**

```typescript
// Login como Usuário A
const { data: userA } = await supabase.auth.signInWithPassword({
  email: 'usuarioA@test.com',
  password: 'senha123',
});

// Tenta acessar treino do Usuário B
const { data, error } = await supabase
  .from('completed_workouts')
  .select('*')
  .eq('user_id', 'id-do-usuario-B');

// Resultado esperado: array vazio (RLS bloqueia)
console.log(data); // []
```

**Resultado:** RLS previne acesso, retornando array vazio mesmo com query explícita.

### 7.2 Teste de Token Expirado

**Cenário:** Requisição com JWT expirado.

**Procedimento:**

1. Obter token válido;
2. Aguardar expiração (1 hora);
3. Fazer requisição com token expirado;
4. Verificar refresh automático.

**Resultado:** Cliente detecta expiração, usa refresh token, obtém novo access token, re-tenta requisição com sucesso.

### 7.3 Teste de SQL Injection

**Cenário:** Tentativa de injection em campo de busca.

**Entrada Maliciosa:**

```
' OR '1'='1'; DROP TABLE users; --
```

**Resultado:** Supabase Client usa prepared statements (parametrização), input é tratado como string literal, ataque falha.

---

## 8 CONSIDERAÇÕES FINAIS

A arquitetura de autenticação e segurança do VivaFit Seniors demonstra como é possível implementar proteções robustas em aplicações móveis voltadas para o público idoso, balanceando segurança e usabilidade.

### 8.1 Principais Contribuições

a) **Documentação Detalhada:** cada etapa do fluxo foi explicada com código real;

b) **Defesa em Profundidade:** múltiplas camadas de segurança protegem os dados;

c) **Conformidade Legal:** arquitetura atende requisitos da LGPD;

d) **Boas Práticas:** OAuth, JWT e RLS seguem padrões da indústria.

### 8.2 Trabalhos Futuros

Possíveis melhorias incluem:

- Implementação de autenticação biométrica (Face ID, Touch ID);
- Multi-factor authentication (MFA) via SMS ou TOTP;
- Rotação automática de chaves de criptografia;
- Integração com HSM (Hardware Security Module);
- Análise comportamental para detecção de fraudes.

### 8.3 Conclusão

A segurança em aplicações de saúde não é um recurso opcional, mas um requisito fundamental. A arquitetura apresentada demonstra que é possível oferecer experiências mobile seguras, conformes com legislação e acessíveis ao público sênior, contribuindo para a democratização do acesso a tecnologias de bem-estar.

---

## REFERÊNCIAS

BRASIL. Lei nº 13.709, de 14 de agosto de 2018. Lei Geral de Proteção de Dados Pessoais (LGPD). Diário Oficial da União, Brasília, DF, 15 ago. 2018.

EXPO. Expo SecureStore Documentation. Disponível em: https://docs.expo.dev/versions/latest/sdk/securestore/. Acesso em: 20 out. 2025.

HARDT, D. The OAuth 2.0 Authorization Framework. RFC 6749, IETF, 2012.

JONES, M.; BRADLEY, J.; SAKIMURA, N. JSON Web Token (JWT). RFC 7519, IETF, 2015.

POSTGRESQL GLOBAL DEVELOPMENT GROUP. PostgreSQL 15 Documentation: Row Security Policies. Disponível em: https://www.postgresql.org/docs/15/ddl-rowsecurity.html. Acesso em: 20 out. 2025.

RICHARDSON, L.; RUBY, S. RESTful Web APIs: Services for a Changing World. Sebastopol: O'Reilly Media, 2013.

STALLINGS, W.; BROWN, L. Computer Security: Principles and Practice. 4. ed. Upper Saddle River: Pearson, 2018.

SUPABASE. Supabase Auth Documentation. Disponível em: https://supabase.com/docs/guides/auth. Acesso em: 20 out. 2025.

SUPABASE. Row Level Security in PostgreSQL. Disponível em: https://supabase.com/docs/guides/auth/row-level-security. Acesso em: 20 out. 2025.

---

**Sobre os Autores**

Este artigo foi desenvolvido como parte do Trabalho de Conclusão de Curso (TCC) do projeto VivaFit Seniors, aplicativo móvel de fitness para idosos.

**Data de Publicação:** 20 de outubro de 2025
