# Instruções de Codificação IA - VivaFit Seniors Mobile

## Visão Geral do Projeto
Este é um aplicativo React Native (Expo SDK 54) de fitness para idosos, parte de um projeto de TCC. O app usa TypeScript, Supabase para backend/auth, e React Navigation para roteamento.

## Arquitetura e Padrões Principais

### Estrutura do Projeto
- `src/screens/` - Todas as telas do app (Login, Dashboard, Profile, etc.)
- `src/navigation/index.tsx` - Configuração central de navegação com tipos `RootStackParamList`
- `src/components/ui/` - Componentes UI reutilizáveis (Button, Card, Input, etc.)
- `src/lib/` - Utilitários (cliente supabase, exerciseCache)
- `supabase/migrations/` - Migrações do schema do banco de dados

### Configuração do Supabase
A configuração usa um padrão de dupla abordagem:
```typescript
// Prioridade: expo-constants > variáveis de ambiente
const SUPABASE_URL = extra?.supabase?.url || process.env.SUPABASE_URL;
```
- Desenvolvimento: Defina credenciais em `app.json` sob `expo.extra.supabase`
- Produção: Use EAS secrets (`eas secret:create --name SUPABASE_URL`)

### Padrões de Navegação
- Usa React Navigation v6 com native stack
- Todos os tipos de tela definidos em `RootStackParamList` para type safety
- Fluxo de auth: Tela de Login verifica sessão, redireciona para Home na autenticação
- Props de navegação tipadas como `NativeStackScreenProps<RootStackParamList, 'NomeDaTela'>`

### Fluxo de Autenticação
Padrão usado em todas as telas:
```typescript
useEffect(() => {
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) navigation.replace('Home');
  });
  // Verifica sessão existente
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session?.user) navigation.replace('Home');
  });
  return () => subscription.unsubscribe();
}, [navigation]);
```

### Convenções dos Componentes UI
- Componentes exportam tanto named quanto default exports
- Estilos inline usando object literals (sem stylesheets externos)
- Cor primária: `#0ea5a3` (tema teal)
- Cards usam shadow styling: `shadowColor:'#000',shadowOpacity:0.05,shadowRadius:8`
- Botões têm padding consistente: `padding:12,borderRadius:8`

### Padrões TypeScript
- Uso extensivo de type casting `any` para compatibilidade com props do React Native
- Props tipadas com intersection: `TouchableOpacityProps & { children: React.ReactNode }`
- Componentes de tela usam tipagem adequada de navegação

## Fluxo de Desenvolvimento

### Executando o App
```bash
npm install           # Instalar dependências
npm start            # Iniciar servidor de desenvolvimento Expo
npm run android      # Executar no emulador Android
```

### Processo de Build EAS
```bash
eas login
eas build:configure  # Configuração inicial
eas build --platform android
```

### Migrações do Banco de Dados
- Localizadas em `supabase/migrations/`
- Use formato: `AAAAMMDD_descricao.sql`
- Inclua `create extension if not exists pgcrypto;` para geração de UUID

## Estratégia de Cache
O app implementa cache local para exercícios usando AsyncStorage + FileSystem:
- Padrão de chave de cache: `exerciseCache_v1`
- Política de expiração de 7 dias
- Baixa imagens localmente para uso offline
- Validação de cache antes de servir dados

## Arquivos Principais para Referência
- `src/navigation/index.tsx` - Configuração de navegação e tipos de rotas
- `src/lib/supabase.ts` - Configuração do cliente do banco de dados
- `src/screens/Login.tsx` - Padrão de implementação de auth
- `src/components/ui/button.tsx` - Exemplo de estrutura de componente UI
- `app.json` - Configuração do Expo e gerenciamento de secrets

## Padrões Comuns
- Todas as telas devem implementar verificação de sessão de auth
- Use `ActivityIndicator` para estados de loading
- Tratamento de erro com `Alert.alert()` para feedback do usuário
- Padrão de substituição de navegação: `navigation.replace()` para fluxos de auth
- Spreading de props de componente: `{...rest}` com arrays de style para customização

## Configuração de Build
- EAS Project ID: `06e6ae28-e20f-4a60-ad01-207a8ee39834`
- Pacote Android: `com.antony13.Mobile`
- Bundle iOS: `com.antony13.Mobile`
- Builds geram arquivos APK (não AAB)