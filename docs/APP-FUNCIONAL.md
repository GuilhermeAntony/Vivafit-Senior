# 🚀 Próximos Passos - App 100% Funcional

## 📊 Status Atual

```
✅ Supabase configurado
✅ Schema 'public' exposto
✅ Tabelas criadas
✅ Código do app configurado
❌ Banco de dados vazio (sem exercícios)
❌ App ainda não testado em dispositivo
```

---

## 🎯 Passo 1: Popular o Banco de Dados (AGORA!)

### Execute este SQL no Supabase Dashboard:

1. **Acesse:** https://supabase.com/dashboard/project/misptjgsftdtqfvqsneq/sql/new
2. **Copie TODO o conteúdo do arquivo:** `supabase/migrations/insert_sample_exercises.sql`
3. **Cole no SQL Editor**
4. **Clique em RUN** ou pressione `Ctrl + Enter`
5. **Verifique:** Deve aparecer "Success" e ao final mostrar os 10 exercícios

### Verificar se funcionou:

```bash
node test-supabase.js
```

**Resultado esperado:**
```
✅ exercises: Tabela existe! Registros: 10
```

---

## 🎯 Passo 2: Testar Autenticação no App

### Preparar ambiente de teste:

```bash
# Limpar e reinstalar dependências
npm install

# Iniciar o servidor Expo
npm start
```

### Testar fluxo de autenticação:

1. **Abrir app no emulador/dispositivo**
   - Android: Pressione `a` no terminal
   - iOS: Pressione `i` no terminal
   - Expo Go: Escaneie o QR Code

2. **Testar cadastro:**
   - Tela de Login → "Criar conta"
   - Preencher: email, senha
   - Verificar se cria perfil automaticamente (trigger `handle_new_user`)

3. **Testar login:**
   - Email e senha cadastrados
   - Deve redirecionar para Home

4. **Verificar no Supabase:**
   - Dashboard → Authentication → Users
   - Deve aparecer o usuário criado

---

## 🎯 Passo 3: Testar Funcionalidades do App

### 3.1 Tela de Exercícios

```typescript
// src/screens/Exercises.tsx
// Verificar se carrega os 10 exercícios do banco
```

**Teste:**
1. Abrir tela "Exercícios"
2. Deve listar 10 exercícios
3. Clicar em um exercício → ver detalhes

**Debug se não aparecer:**
```bash
# Verificar logs do app
# Procurar por erros de fetch
```

### 3.2 Tela de Treinos (Workout)

**Teste:**
1. Criar um novo treino
2. Adicionar exercícios
3. Iniciar treino
4. Completar exercícios
5. Verificar se salva no `user_progress`

**Verificar no banco:**
```sql
SELECT * FROM workouts WHERE user_id = 'seu-user-id';
SELECT * FROM user_progress WHERE user_id = 'seu-user-id';
```

### 3.3 Tela de Progresso

**Teste:**
1. Verificar se mostra histórico de treinos
2. Ver gráficos (se implementados)
3. Verificar estatísticas

### 3.4 Tela de Perfil

**Teste:**
1. Visualizar dados do perfil
2. Editar informações (nome, idade, peso, nível de atividade)
3. Salvar alterações
4. Verificar se atualiza no banco

---

## 🎯 Passo 4: Configurar Políticas RLS Adicionais (Opcional)

Se você quiser permitir que admins insiram exercícios pelo app:

```sql
-- Política para admins criarem exercícios
CREATE POLICY "Admins can insert exercises"
ON public.exercises
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Política para admins editarem exercícios
CREATE POLICY "Admins can update exercises"
ON public.exercises
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() 
    AND role = 'admin'
  )
);
```

---

## 🎯 Passo 5: Adicionar Imagens aos Exercícios (Opcional)

### Opção A: Usar Supabase Storage

1. **Criar bucket no Supabase:**
   - Dashboard → Storage → New bucket
   - Nome: `exercise-images`
   - Public: ✅ (para facilitar)

2. **Upload de imagens:**
   - Fazer upload das imagens dos exercícios
   - Copiar URLs

3. **Atualizar banco:**
```sql
UPDATE public.exercises 
SET image_url = 'https://misptjgsftdtqfvqsneq.supabase.co/storage/v1/object/public/exercise-images/caminhada.jpg'
WHERE name = 'Caminhada no lugar';
```

### Opção B: Usar URLs externas

```sql
UPDATE public.exercises 
SET image_url = 'https://exemplo.com/imagem.jpg'
WHERE name = 'Caminhada no lugar';
```

---

## 🎯 Passo 6: Implementar Cache Offline (Já existe!)

O app já tem cache implementado em `src/lib/exerciseCache.ts`. Verifique se está funcionando:

```typescript
// O cache deve:
// 1. Baixar exercícios na primeira vez
// 2. Salvar localmente (AsyncStorage)
// 3. Usar cache quando offline
// 4. Atualizar a cada 7 dias
```

**Testar:**
1. Abrir app com internet
2. Desconectar internet
3. Fechar e reabrir app
4. Exercícios devem carregar do cache

---

## 🎯 Passo 7: Build para Produção

### Android (APK):

```bash
# Configurar EAS (se ainda não fez)
eas login

# Build de desenvolvimento
eas build --platform android --profile preview

# Build de produção
eas build --platform android --profile production
```

### iOS:

```bash
# Precisa de conta Apple Developer
eas build --platform ios --profile production
```

---

## 🎯 Passo 8: Testes Finais

### Checklist de Funcionalidades:

- [ ] **Autenticação**
  - [ ] Cadastro funciona
  - [ ] Login funciona
  - [ ] Logout funciona
  - [ ] Perfil é criado automaticamente

- [ ] **Exercícios**
  - [ ] Lista carrega (10 exercícios)
  - [ ] Detalhes abrem corretamente
  - [ ] Filtros funcionam (por categoria)
  - [ ] Cache offline funciona

- [ ] **Treinos**
  - [ ] Criar treino
  - [ ] Adicionar exercícios ao treino
  - [ ] Iniciar treino
  - [ ] Completar exercícios
  - [ ] Salvar progresso

- [ ] **Progresso**
  - [ ] Histórico de treinos
  - [ ] Estatísticas corretas
  - [ ] Gráficos renderizam (se houver)

- [ ] **Perfil**
  - [ ] Visualizar dados
  - [ ] Editar informações
  - [ ] Salvar alterações
  - [ ] Logout

- [ ] **Performance**
  - [ ] App inicia rápido (<3s)
  - [ ] Navegação fluida
  - [ ] Sem memory leaks
  - [ ] Cache funciona

---

## 🐛 Troubleshooting Comum

### Exercícios não aparecem:

```bash
# Verificar no banco
node test-supabase.js

# Verificar logs do app
# Procurar por erros de fetch
```

### Erro de autenticação:

```typescript
// Verificar em src/lib/supabase.ts
// Logs devem mostrar:
// ✅ Supabase configurado corretamente!
```

### RLS bloqueando operações:

```sql
-- Verificar políticas
SELECT * FROM pg_policies WHERE schemaname = 'public';

-- Temporariamente desabilitar (APENAS PARA DEBUG)
ALTER TABLE public.exercises DISABLE ROW LEVEL SECURITY;
```

---

## 📝 Scripts Úteis

### Verificar status completo:

```bash
# Status do banco
node test-supabase.js

# Status de múltiplos schemas
node test-multiple-schemas.js

# Popular exercícios (via código)
node populate-exercises.js
```

### Limpar dados de teste:

```sql
-- Limpar progresso de teste
DELETE FROM public.user_progress;
DELETE FROM public.workouts;

-- Limpar usuários de teste (cuidado!)
-- Fazer via Dashboard → Authentication → Users
```

---

## 🎉 App 100% Funcional Quando:

✅ Exercícios aparecem na tela  
✅ Autenticação funciona  
✅ Treinos podem ser criados e completados  
✅ Progresso é salvo e visualizado  
✅ Perfil pode ser editado  
✅ Cache offline funciona  
✅ App roda sem crashes  

---

## 📚 Próximos Passos Avançados (Futuro):

1. **Analytics:** Implementar tracking de uso
2. **Push Notifications:** Lembretes de treino
3. **Social:** Compartilhar conquistas
4. **Gamificação:** Sistema de pontos e badges
5. **IA:** Recomendações personalizadas de treinos
6. **Multiplataforma:** Web app com mesma base de código

---

## 🆘 Precisa de Ajuda?

Se encontrar problemas:

1. Execute `node test-supabase.js` e compartilhe o resultado
2. Verifique logs do app no terminal Expo
3. Verifique Network tab no React Native Debugger
4. Consulte documentação do Supabase: https://supabase.com/docs
