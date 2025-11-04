# Guia para Criar DER no Lucidchart - VivaFit Seniors

## 🎯 Objetivo
Recriar o Diagrama de Entidade-Relacionamento do banco de dados VivaFit Seniors no Lucidchart.

---

## 📋 Passo 1: Configurar Documento no Lucidchart

1. **Acesse:** https://lucid.app/
2. **Criar novo documento:**
   - New → Lucidchart
   - Template: "Entity Relationship Diagram" ou começar em branco
3. **Configurações da página:**
   - Tamanho: A3 ou Landscape
   - Grid: Ativar (para alinhamento)

---

## 🗂️ Passo 2: Criar as 8 Entidades (Tabelas)

### Template de Entidade no Lucidchart:
Use a forma "Entity" da biblioteca ERD (lado esquerdo).

### 2.1 AUTH_USERS (Sistema Supabase)
**Cor sugerida:** Azul claro (#E3F2FD)

```
┌─────────────────────────────────┐
│        AUTH_USERS (PK: id)      │
├─────────────────────────────────┤
│ 🔑 id : UUID                    │
│    email : VARCHAR              │
│    created_at : TIMESTAMP       │
│    raw_user_meta_data : JSONB   │
└─────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- `email` : VARCHAR
- `created_at` : TIMESTAMP
- `raw_user_meta_data` : JSONB

---

### 2.2 PROFILES (Perfil do Usuário)
**Cor sugerida:** Verde claro (#E8F5E9)

```
┌─────────────────────────────────────────┐
│         PROFILES (PK: id)               │
├─────────────────────────────────────────┤
│ 🔑 id : UUID                            │
│ 🔗 user_id : UUID (FK, UNIQUE)          │
│    display_name : TEXT                  │
│    age : INTEGER                        │
│    weight : NUMERIC                     │
│    activity_level : ENUM                │
│    health_limitations : TEXT            │
│    created_at : TIMESTAMP               │
│    updated_at : TIMESTAMP               │
└─────────────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- 🔗 `user_id` : UUID (Foreign Key → auth.users.id, UNIQUE)
- `display_name` : TEXT
- `age` : INTEGER
- `weight` : NUMERIC
- `activity_level` : ENUM (low, sedentary, high)
- `health_limitations` : TEXT
- `created_at` : TIMESTAMP
- `updated_at` : TIMESTAMP

---

### 2.3 USER_ROLES (Papéis de Usuário)
**Cor sugerida:** Laranja claro (#FFF3E0)

```
┌─────────────────────────────────┐
│     USER_ROLES (PK: id)         │
├─────────────────────────────────┤
│ 🔑 id : UUID                    │
│ 🔗 user_id : UUID (FK)          │
│    role : ENUM                  │
│    created_at : TIMESTAMP       │
└─────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- 🔗 `user_id` : UUID (Foreign Key → auth.users.id)
- `role` : ENUM (admin, user)
- `created_at` : TIMESTAMP

**Constraint:** UNIQUE (user_id, role)

---

### 2.4 EXERCISES (Catálogo de Exercícios)
**Cor sugerida:** Roxo claro (#F3E5F5)

```
┌─────────────────────────────────┐
│      EXERCISES (PK: id)         │
├─────────────────────────────────┤
│ 🔑 id : UUID                    │
│    name : TEXT                  │
│    description : TEXT           │
│    category : ENUM              │
│    duration : INTEGER           │
│    difficulty : INTEGER (1-5)   │
│    instructions : TEXT          │
│    image_url : TEXT             │
│    video_url : TEXT             │
│    is_active : BOOLEAN          │
│    created_at : TIMESTAMP       │
│    updated_at : TIMESTAMP       │
└─────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- `name` : TEXT
- `description` : TEXT
- `category` : ENUM (cardio, strength, flexibility, balance)
- `duration` : INTEGER (segundos)
- `difficulty` : INTEGER CHECK (1-5)
- `instructions` : TEXT
- `image_url` : TEXT
- `video_url` : TEXT
- `is_active` : BOOLEAN
- `created_at` : TIMESTAMP
- `updated_at` : TIMESTAMP

---

### 2.5 WORKOUTS (Treinos Personalizados)
**Cor sugerida:** Amarelo claro (#FFF9C4)

```
┌─────────────────────────────────────┐
│       WORKOUTS (PK: id)             │
├─────────────────────────────────────┤
│ 🔑 id : UUID                        │
│ 🔗 user_id : UUID (FK)              │
│    name : TEXT                      │
│    description : TEXT               │
│    total_duration : INTEGER         │
│    exercises_completed : INTEGER    │
│    total_exercises : INTEGER        │
│    completed_at : TIMESTAMP         │
│    created_at : TIMESTAMP           │
└─────────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- 🔗 `user_id` : UUID (Foreign Key → auth.users.id)
- `name` : TEXT
- `description` : TEXT
- `total_duration` : INTEGER (segundos)
- `exercises_completed` : INTEGER
- `total_exercises` : INTEGER
- `completed_at` : TIMESTAMP (NULL se não finalizado)
- `created_at` : TIMESTAMP

---

### 2.6 WORKOUT_EXERCISES (Tabela de Junção)
**Cor sugerida:** Cinza claro (#F5F5F5)

```
┌─────────────────────────────────┐
│  WORKOUT_EXERCISES (PK: id)     │
├─────────────────────────────────┤
│ 🔑 id : UUID                    │
│ 🔗 workout_id : UUID (FK)       │
│ 🔗 exercise_id : UUID (FK)      │
│    order_index : INTEGER        │
│    duration : INTEGER           │
│    completed_at : TIMESTAMP     │
│    created_at : TIMESTAMP       │
└─────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- 🔗 `workout_id` : UUID (Foreign Key → workouts.id)
- 🔗 `exercise_id` : UUID (Foreign Key → exercises.id)
- `order_index` : INTEGER
- `duration` : INTEGER (customizado)
- `completed_at` : TIMESTAMP
- `created_at` : TIMESTAMP

---

### 2.7 USER_PROGRESS (Histórico de Progresso)
**Cor sugerida:** Ciano claro (#E0F7FA)

```
┌─────────────────────────────────┐
│    USER_PROGRESS (PK: id)       │
├─────────────────────────────────┤
│ 🔑 id : UUID                    │
│ 🔗 user_id : UUID (FK)          │
│ 🔗 workout_id : UUID (FK)       │
│ 🔗 exercise_id : UUID (FK)      │
│    duration : INTEGER           │
│    calories_burned : INTEGER    │
│    completed_at : TIMESTAMP     │
└─────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- 🔗 `user_id` : UUID (Foreign Key → auth.users.id)
- 🔗 `workout_id` : UUID (Foreign Key → workouts.id, nullable)
- 🔗 `exercise_id` : UUID (Foreign Key → exercises.id)
- `duration` : INTEGER (segundos)
- `calories_burned` : INTEGER
- `completed_at` : TIMESTAMP

---

### 2.8 USER_ACHIEVEMENTS (Conquistas)
**Cor sugerida:** Rosa claro (#FCE4EC)

```
┌─────────────────────────────────┐
│  USER_ACHIEVEMENTS (PK: id)     │
├─────────────────────────────────┤
│ 🔑 id : UUID                    │
│ 🔗 user_id : UUID (FK)          │
│    achievement_type : TEXT      │
│    achievement_name : TEXT      │
│    description : TEXT           │
│    earned_at : TIMESTAMP        │
└─────────────────────────────────┘
```

**Campos:**
- 🔑 `id` : UUID (Primary Key)
- 🔗 `user_id` : UUID (Foreign Key → auth.users.id)
- `achievement_type` : TEXT
- `achievement_name` : TEXT
- `description` : TEXT
- `earned_at` : TIMESTAMP

---

## 🔗 Passo 3: Criar Relacionamentos

### Como criar relacionamentos no Lucidchart:
1. Arraste a linha de relacionamento da biblioteca ERD
2. Conecte da entidade origem (FK) para a entidade destino (PK)
3. Configure a cardinalidade clicando na linha

---

### 3.1 AUTH_USERS → PROFILES (1:1)
**Tipo:** Um para Um (Identificador)

```
AUTH_USERS ||--|| PROFILES
   (1)              (1)
```

**Configuração:**
- Origem: `auth.users.id` (1)
- Destino: `profiles.user_id` (1)
- Tipo: Linha sólida (identifying relationship)
- Label: "possui perfil único"
- **Constraint:** `user_id` é UNIQUE em profiles

---

### 3.2 AUTH_USERS → USER_ROLES (1:N)
**Tipo:** Um para Muitos

```
AUTH_USERS ||--o{ USER_ROLES
   (1)              (N)
```

**Configuração:**
- Origem: `auth.users.id` (1)
- Destino: `user_roles.user_id` (N)
- Tipo: Linha sólida
- Label: "tem papéis"

---

### 3.3 AUTH_USERS → WORKOUTS (1:N)
**Tipo:** Um para Muitos

```
AUTH_USERS ||--o{ WORKOUTS
   (1)              (N)
```

**Configuração:**
- Origem: `auth.users.id` (1)
- Destino: `workouts.user_id` (N)
- Tipo: Linha sólida
- Label: "cria treinos"
- **Cascade:** ON DELETE CASCADE

---

### 3.4 WORKOUTS → WORKOUT_EXERCISES (1:N)
**Tipo:** Um para Muitos

```
WORKOUTS ||--o{ WORKOUT_EXERCISES
   (1)              (N)
```

**Configuração:**
- Origem: `workouts.id` (1)
- Destino: `workout_exercises.workout_id` (N)
- Tipo: Linha sólida
- Label: "contém exercícios"
- **Cascade:** ON DELETE CASCADE

---

### 3.5 EXERCISES → WORKOUT_EXERCISES (1:N)
**Tipo:** Um para Muitos

```
EXERCISES ||--o{ WORKOUT_EXERCISES
   (1)              (N)
```

**Configuração:**
- Origem: `exercises.id` (1)
- Destino: `workout_exercises.exercise_id` (N)
- Tipo: Linha sólida
- Label: "incluído em treinos"
- **Cascade:** ON DELETE CASCADE

---

### 3.6 AUTH_USERS → USER_PROGRESS (1:N)
**Tipo:** Um para Muitos

```
AUTH_USERS ||--o{ USER_PROGRESS
   (1)              (N)
```

**Configuração:**
- Origem: `auth.users.id` (1)
- Destino: `user_progress.user_id` (N)
- Tipo: Linha sólida
- Label: "registra progresso"
- **Cascade:** ON DELETE CASCADE

---

### 3.7 WORKOUTS → USER_PROGRESS (1:N)
**Tipo:** Um para Muitos (Opcional)

```
WORKOUTS ||--o{ USER_PROGRESS
   (1)              (N)
```

**Configuração:**
- Origem: `workouts.id` (1)
- Destino: `user_progress.workout_id` (N)
- Tipo: Linha tracejada (opcional, pode ser NULL)
- Label: "rastreado em"
- **Cascade:** ON DELETE CASCADE

---

### 3.8 EXERCISES → USER_PROGRESS (1:N)
**Tipo:** Um para Muitos

```
EXERCISES ||--o{ USER_PROGRESS
   (1)              (N)
```

**Configuração:**
- Origem: `exercises.id` (1)
- Destino: `user_progress.exercise_id` (N)
- Tipo: Linha sólida
- Label: "executado em"
- **Cascade:** ON DELETE CASCADE

---

### 3.9 AUTH_USERS → USER_ACHIEVEMENTS (1:N)
**Tipo:** Um para Muitos

```
AUTH_USERS ||--o{ USER_ACHIEVEMENTS
   (1)              (N)
```

**Configuração:**
- Origem: `auth.users.id` (1)
- Destino: `user_achievements.user_id` (N)
- Tipo: Linha sólida
- Label: "conquista"
- **Cascade:** ON DELETE CASCADE

---

## 🎨 Passo 4: Layout e Organização

### Sugestão de Posicionamento:

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  AUTH_USERS (centro-esquerda)                               │
│      ├─→ PROFILES (direita)                                 │
│      ├─→ USER_ROLES (abaixo)                                │
│      ├─→ WORKOUTS (centro)                                  │
│      ├─→ USER_PROGRESS (centro-baixo)                       │
│      └─→ USER_ACHIEVEMENTS (direita-baixo)                  │
│                                                             │
│  EXERCISES (esquerda-centro)                                │
│      ├─→ WORKOUT_EXERCISES (centro)                         │
│      └─→ USER_PROGRESS (centro-baixo)                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Hierarquia Visual:**
1. **Linha 1 (Topo):** AUTH_USERS → PROFILES
2. **Linha 2 (Centro):** USER_ROLES, EXERCISES, WORKOUTS
3. **Linha 3 (Meio):** WORKOUT_EXERCISES
4. **Linha 4 (Baixo):** USER_PROGRESS
5. **Linha 5 (Base):** USER_ACHIEVEMENTS

---

## 📝 Passo 5: Adicionar Anotações e Legendas

### 5.1 Caixa de Legendas (Canto Superior Direito)

```
┌─────────────────────────────────┐
│          LEGENDAS               │
├─────────────────────────────────┤
│ 🔑 Primary Key (PK)             │
│ 🔗 Foreign Key (FK)             │
│ ─── Linha sólida: obrigatório  │
│ - - Linha tracejada: opcional  │
│ ||--|| 1:1 (Um para Um)         │
│ ||--o{ 1:N (Um para Muitos)     │
└─────────────────────────────────┘
```

---

### 5.2 Caixa de Tipos ENUM

```
┌─────────────────────────────────────────┐
│           TIPOS ENUM                    │
├─────────────────────────────────────────┤
│ activity_level:                         │
│   • low (atividade baixa)               │
│   • sedentary (sedentário)              │
│   • high (atividade alta)               │
│                                         │
│ exercise_category:                      │
│   • cardio (cardiovascular)             │
│   • strength (força)                    │
│   • flexibility (flexibilidade)         │
│   • balance (equilíbrio)                │
│                                         │
│ app_role:                               │
│   • admin (administrador)               │
│   • user (usuário comum)                │
└─────────────────────────────────────────┘
```

---

### 5.3 Caixa de Políticas RLS (Canto Inferior Esquerdo)

```
┌─────────────────────────────────────────┐
│      SEGURANÇA (Row Level Security)     │
├─────────────────────────────────────────┤
│ Todas as tabelas com user_id           │
│ implementam isolamento:                 │
│                                         │
│ USING (user_id = auth.uid())            │
│ WITH CHECK (user_id = auth.uid())       │
│                                         │
│ ✅ Conformidade LGPD                    │
│ ✅ Isolamento automático de dados       │
└─────────────────────────────────────────┘
```

---

### 5.4 Título do Diagrama (Topo)

```
════════════════════════════════════════════════════════════
   DIAGRAMA DE ENTIDADE-RELACIONAMENTO
   VivaFit Seniors - Sistema de Fitness para Idosos
   
   Database: PostgreSQL + Supabase
   Versão: 1.0
   Data: Novembro 2025
════════════════════════════════════════════════════════════
```

---

## 🔧 Passo 6: Configurações Avançadas

### 6.1 Formatação de Texto

**Para cada campo:**
- Primary Keys: **Negrito** + Cor dourada/amarela
- Foreign Keys: *Itálico* + Cor azul
- Campos obrigatórios: Fonte normal
- Campos opcionais: Cor cinza

---

### 6.2 Símbolos de Cardinalidade

**Notação Crow's Foot (pé de galinha):**

```
1:1 (Um para Um)
─────||────||─────

1:N (Um para Muitos)
─────||────<o─────

N:M (Muitos para Muitos)
────<o────><o─────

Opcional (pode ser NULL)
─────○─────
```

---

### 6.3 Cores das Entidades

| Entidade | Cor Hex | Justificativa |
|----------|---------|---------------|
| AUTH_USERS | `#E3F2FD` | Azul - Sistema core |
| PROFILES | `#E8F5E9` | Verde - Dados pessoais |
| USER_ROLES | `#FFF3E0` | Laranja - Permissões |
| EXERCISES | `#F3E5F5` | Roxo - Conteúdo |
| WORKOUTS | `#FFF9C4` | Amarelo - Ações do usuário |
| WORKOUT_EXERCISES | `#F5F5F5` | Cinza - Tabela auxiliar |
| USER_PROGRESS | `#E0F7FA` | Ciano - Métricas |
| USER_ACHIEVEMENTS | `#FCE4EC` | Rosa - Gamificação |

---

## 📊 Passo 7: Exportar e Compartilhar

### Opções de Exportação:

1. **PDF (para TCC):**
   - File → Download → PDF
   - Qualidade: Alta resolução
   - Orientação: Paisagem

2. **PNG/JPG (para apresentações):**
   - File → Download → PNG/JPG
   - Resolução: 300 DPI mínimo

3. **Compartilhamento:**
   - Share → Create shareable link
   - Permissões: View only

---

## ✅ Checklist Final

Antes de finalizar, verifique:

- [ ] Todas as 8 entidades criadas
- [ ] Todos os campos com tipos de dados corretos
- [ ] Primary Keys marcadas (🔑)
- [ ] Foreign Keys marcadas (🔗)
- [ ] 9 relacionamentos conectados
- [ ] Cardinalidade correta (1:1, 1:N)
- [ ] Labels nos relacionamentos
- [ ] Cores diferenciadas por entidade
- [ ] Legenda de símbolos
- [ ] Caixa de tipos ENUM
- [ ] Título do diagrama
- [ ] Anotações de RLS/segurança
- [ ] Layout organizado e legível
- [ ] Exportado em alta resolução

---

## 🎯 Exemplo de Relacionamento Completo

### WORKOUTS ↔ EXERCISES (Relacionamento N:M via WORKOUT_EXERCISES)

```
┌─────────────┐           ┌──────────────────┐           ┌─────────────┐
│  WORKOUTS   │           │WORKOUT_EXERCISES │           │  EXERCISES  │
├─────────────┤           ├──────────────────┤           ├─────────────┤
│ 🔑 id       │───────┐   │ 🔑 id            │   ┌───────│ 🔑 id       │
│ 🔗 user_id  │       └──>│ 🔗 workout_id    │   │       │    name     │
│    name     │           │ 🔗 exercise_id   │<──┘       │    category │
└─────────────┘           │    order_index   │           └─────────────┘
     (1)                  │    duration      │                  (1)
                          └──────────────────┘
                                (N)
```

**Leitura:**
- Um WORKOUT contém muitos WORKOUT_EXERCISES (1:N)
- Um EXERCISE está em muitos WORKOUT_EXERCISES (1:N)
- Resultado: WORKOUTS ↔ EXERCISES é N:M

---

## 🆘 Troubleshooting

### Problema: Linhas de relacionamento cruzando

**Solução:** 
- Use "Line Jumps" (pular linhas)
- Reposicione entidades para minimizar cruzamentos
- Use cores diferentes para relacionamentos complexos

### Problema: Diagrama muito grande

**Solução:**
- Divida em 2 diagramas:
  1. **Core:** AUTH_USERS, PROFILES, USER_ROLES
  2. **Funcional:** EXERCISES, WORKOUTS, PROGRESS, ACHIEVEMENTS

### Problema: Texto ilegível na exportação

**Solução:**
- Aumente tamanho da fonte (mínimo 10pt)
- Exporte em PDF vetorial (não rasterizado)
- Use zoom 100% antes de exportar

---

## 📚 Recursos Adicionais

### Tutoriais Lucidchart:
- **ERD Basics:** https://lucid.co/erd
- **Crow's Foot Notation:** https://lucid.co/crows-foot

### Validação do Schema:
```bash
# No seu projeto, valide o schema:
node scripts/tests/test-supabase.js
```

### Documentação Original:
- `/home/antony/Documentos/TCC/mobile/docs/DER_VIVAFIT_SENIORS.md`
- `/home/antony/Documentos/TCC/mobile/supabase/migrations/20250117_vivafit_seniors_enhanced_schema.sql`

---

## 📝 Notas Finais

Este diagrama representa o schema de produção do VivaFit Seniors, incluindo:
- ✅ Autenticação com Supabase Auth
- ✅ Perfis personalizados para idosos
- ✅ Catálogo de exercícios por categoria
- ✅ Sistema de treinos customizáveis
- ✅ Rastreamento de progresso
- ✅ Gamificação com conquistas
- ✅ Segurança RLS em todas as tabelas
- ✅ Conformidade LGPD

**Tempo estimado para criação:** 45-60 minutos

**Dica:** Salve versões intermediárias enquanto constrói o diagrama!

---

## 🎓 Para o TCC

### Incluir na metodologia:
- Screenshot do diagrama completo
- Explicação de cada entidade (já no DER_VIVAFIT_SENIORS.md)
- Justificativa dos relacionamentos
- Políticas de segurança (RLS)

### Referências ABNT:
LUCID SOFTWARE INC. **Lucidchart: Diagramação inteligente**. Lucidchart, 2025. Disponível em: https://www.lucidchart.com. Acesso em: 1 nov. 2025.

---

**Bom trabalho! 🚀**
