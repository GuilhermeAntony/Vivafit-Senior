# SEÇÃO DE METODOLOGIA - ARQUITETURA DE NAVEGAÇÃO

## 3.X ARQUITETURA DE NAVEGAÇÃO DO SISTEMA

A Figura 2 mostra que a navegação foi projetada seguindo princípios de usabilidade para idosos, priorizando fluxos intuitivos e redução da carga cognitiva. O sistema utiliza o _React Navigation_ v6 com _Native Stack Navigator_, proporcionando transições nativas e performance otimizada.

### 3.X.1 Fluxo de Inicialização e Autenticação (Lado Esquerdo)

O fluxo inicia-se no **App Init**, que verifica automaticamente a existência de token JWT válido no AsyncStorage. O ponto de decisão **Authenticated?** realiza três verificações: existência, validade temporal e integridade do token. Se positivo, redireciona para **Home Screen**; caso contrário, para **Login Screen**.

A **Login Screen** oferece dois métodos de autenticação: email/senha e OAuth 2.0 com Google. A autenticação tradicional valida credenciais no backend Supabase e armazena o token recebido. O **OAuth Login** implementa fluxo PKCE (RFC 7636) para segurança em aplicativos móveis, gerando _code verifier_ e _code challenge_ via hash SHA-256, redirecionando para autorização do Google e trocando código por tokens (SAKIMURA et al., 2015; LODDERSTEDT; BRADLEY; LABUNETS, 2019).

O ponto **Login Success?** valida: token de acesso válido, sessão criada no backend, dados do usuário disponíveis e persistência local bem-sucedida. Em caso positivo, utiliza `navigation.replace()` para redirecionar à **Home Screen**, removendo Login da pilha de navegação. Falhas retornam à Login Screen com mensagens de erro contextuais.

### 3.X.2 Fluxo de Navegação Principal (Lado Direito)

Após autenticação, o usuário acessa a **Home Screen**, hub central que apresenta saudação personalizada, resumo de atividades do dia, indicador de streak e acesso rápido às funcionalidades. O design segue hierarquia visual clara com informações críticas no topo, baseando-se em estudos de Nielsen e Budiu (2013) sobre leitura em tela por usuários idosos.

A partir da Home Screen, o usuário navega para o **Dashboard**, que consolida acesso às quatro seções principais em layout de grade 2x2:

**Profile:** Gerenciamento de informações pessoais com formulário editável e validação em tempo real. Campos obrigatórios incluem nome, email e data de nascimento. Alterações sincronizam via Supabase com proteção Row Level Security (RLS).

**Exercises:** Biblioteca com lista paginada (lazy loading) de 20 exercícios iniciais, busca textual com debounce de 500ms, e filtros por grupo muscular e dificuldade. Cada exercício exibe cartão visual com imagem cacheada, nome, dificuldade e duração. O toque aciona navegação para **Exercise Detail** passando `exerciseId` via `route.params`.

**Progress:** Dashboard analítico com gráficos de linha (evolução temporal), barras (comparação semanal), estatísticas agregadas e calendário visual. Renderização via React Native Chart Kit com SVG nativo. Implementa sistema de conquistas desbloqueáveis (primeiro treino, 7/30 dias de streak, 100 treinos, 10.000 calorias).

**Settings:** Configurações organizadas em categorias: Notificações (push e lembretes), Privacidade (visibilidade de dados), Aparência (tema e fonte), e Conta (senha, logout, exclusão).

### 3.X.3 Fluxo de Execução de Treino

A partir de **Exercises**, o usuário seleciona exercício e navega para **Exercise Detail**, que carrega dados do backend filtrando por `exerciseId`. Apresenta GIF demonstrativo, descrição detalhada, instruções numeradas, diagrama de grupos musculares, duração e calorias estimadas via valores MET (Metabolic Equivalent of Task), além de precauções e contraindicações.

O botão "Iniciar Treino" (48dp de altura para acessibilidade) aciona navegação para **Workout Screen**. Esta interface de tempo real implementa: contador progressivo via `setInterval`, indicador circular de progresso em SVG animado, botões de controle grandes (pausar, retomar, finalizar), e cálculo dinâmico de calorias. O estado persiste a cada 5 segundos no AsyncStorage para recuperação em interrupções (fechamento do app, ligações).

Ao finalizar, o sistema navega para **Workout Complete**, exibindo congratulação, resumo de métricas (tempo, calorias), comparação com média pessoal e indicação de novos recordes.

O **Progress Update** executa em background de forma assíncrona: insere registro em `completed_workouts`, atualiza `user_progress` do dia, recalcula streak, verifica conquistas desbloqueadas e atualiza cache local. Após conclusão, retorna ao **Dashboard** via `navigation.navigate()`, mantendo histórico de navegação.

### 3.X.4 Gerenciamento de Estado e Otimizações

O sistema implementa listener global `supabase.auth.onAuthStateChange()` que monitora eventos de sessão: `SIGNED_IN`, `SIGNED_OUT`, `TOKEN_REFRESHED` e `USER_UPDATED`, acionando navegações correspondentes. Navigation guards em telas protegidas verificam sessão via `useEffect`, redirecionando para login se inválida. Deep linking através de URLs `vivafit://` permite acesso direto (ex: `vivafit://exercises/abc123` abre Exercise Detail com ID correspondente).

Para performance em dispositivos limitados, o sistema implementa: lazy loading via `React.lazy()` e `Suspense`, reduzindo bundle inicial; cache offline-first que serve dados locais imediatamente (exercícios com TTL de 7 dias, estatísticas de 1 dia); e fila de sincronização para operações offline com retry exponencial (1s, 2s, 4s) e máximo de 3 tentativas.

Animações utilizam Native Stack Navigator com transições nativas: iOS com _slide from right_ e gesto de arraste, Android seguindo Material Design. Duração calibrada em 300ms para resposta instantânea (NIELSEN, 1994). A Workout Screen desabilita gestos de navegação prevenindo abandono acidental, requerendo confirmação explícita para sair.

### 3.X.5 Otimizações de Performance e Experiência Offline

Para garantir experiência fluida mesmo em dispositivos com recursos limitados, comum em público idoso que frequentemente utiliza aparelhos de gerações anteriores, o sistema implementa múltiplas estratégias de otimização. O lazy loading de componentes de tela através de `React.lazy()` e `Suspense` divide bundle JavaScript em chunks menores carregados sob demanda, reduzindo tempo de inicialização do aplicativo. Imagens são otimizadas automaticamente através de redimensionamento e compressão antes de armazenamento no cache local, balanceando qualidade visual com consumo de armazenamento e largura de banda.

A estratégia de cache implementa padrão offline-first onde dados já consultados anteriormente são armazenados localmente e servidos imediatamente, com atualização em background quando conexão estiver disponível. Este padrão é particularmente importante dado que usuários idosos frequentemente apresentam conectividade instável ou limitada. O cache mantém versões locais de listagem de exercícios, detalhes de exercícios previamente visualizados, estatísticas de progresso, e imagens ilustrativas. Cada item de cache possui timestamp de criação e política de expiração configurável (padrão de 7 dias para exercícios, 1 dia para estatísticas).

Operações de escrita (conclusão de treinos, atualização de perfil) são enfileiradas localmente quando dispositivo está offline, através de mecanismo de fila de sincronização implementado com AsyncStorage. Cada operação pendente armazena tipo de operação, dados a serem enviados, timestamp de criação, e contador de tentativas de envio. Quando conexão é restabelecida, sistema processa automaticamente fila em ordem cronológica, com retry exponencial (1s, 2s, 4s) em caso de falhas transientes, e limite máximo de 3 tentativas antes de considerar operação como falha permanente. Esta abordagem garante que nenhum dado de treino seja perdido devido a problemas de conectividade, mantendo integridade das estatísticas de progresso do usuário.

### 3.X.6 Transições e Animações de Navegação

As transições entre telas utilizam animações nativas de cada plataforma através do Native Stack Navigator, proporcionando experiência consistente com padrões de design de iOS e Android. No iOS, transições seguem padrão de deslizamento horizontal da direita para esquerda (_slide from right_) com área de arraste na borda esquerda permitindo retorno por gesto. No Android, transições respeitam Material Design com movimento vertical para telas modais e horizontal para navegação hierárquica.

A duração das animações foi calibrada para 300 milissegundos, valor que estudos de Nielsen (1994) identificam como limite para sensação de resposta instantânea do sistema. Durações menores podem causar desorientação por mudança visual abrupta, enquanto durações maiores são percebidas como lentidão do aplicativo. Para usuários idosos, este timing é particularmente crítico dado que mudanças visuais muito rápidas podem dificultar compreensão de novo contexto.

Telas específicas implementam configurações customizadas de animação conforme contexto de uso. A tela de execução de treino (Workout Screen) desabilita gestos de navegação para prevenir abandono acidental durante exercício físico, requerendo confirmação explícita através de botão para sair. A tela de conclusão de treino (Workout Complete) remove botão de voltar do header e desabilita gesto de retorno, forçando usuário a reconhecer conclusão e estatísticas antes de prosseguir, garantindo que atualização de progresso seja processada antes de nova interação.

---

## REFERÊNCIAS COMPLEMENTARES

LODDERSTEDT, T.; BRADLEY, J.; LABUNETS, A. **OAuth 2.0 Security Best Current Practice**. Internet-Draft, IETF, 2019. Disponível em: https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics. Acesso em: 1 nov. 2025.

NIELSEN, J. **Usability Engineering**. San Francisco: Morgan Kaufmann, 1994.

NIELSEN, J.; BUDIU, R. **Mobile Usability**. Berkeley: New Riders, 2013.

SAKIMURA, N. et al. **Proof Key for Code Exchange by OAuth Public Clients**. RFC 7636, IETF, 2015. Disponível em: https://datatracker.ietf.org/doc/html/rfc7636. Acesso em: 1 nov. 2025.
