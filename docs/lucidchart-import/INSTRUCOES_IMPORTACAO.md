# 📥 Instruções de Importação para Lucidchart

## ⚠️ Aviso Importante
O Lucidchart tem suporte limitado para importação de ERD via CSV. A melhor abordagem é usar o **método híbrido** abaixo que combina importação automática com ajustes manuais.

---

## 🎯 Método Recomendado: Importação via Lucidchart ERD Template

### Opção 1: Importação SQL Direta (MELHOR MÉTODO)

O Lucidchart pode importar diretamente do schema PostgreSQL/Supabase!

#### Passo a Passo:

1. **Acesse Lucidchart:** https://lucid.app/
2. **Criar novo documento:**
   - Click em **"New"** → **"Lucidchart"**
   - Selecione **"Entity Relationship Diagram"** template
   
3. **Importar do Banco de Dados:**
   - No painel esquerdo, procure por **"Import Data"** ou **"Entity Relationship"**
   - Click em **"Import from Database"**
   - Selecione **"PostgreSQL"**

4. **Configurar Conexão:**
   ```
   Host: db.misptjgsftdtqfvqsneq.supabase.co
   Port: 5432
   Database: postgres
   Schema: public
   User: postgres
   Password: [Sua senha do Supabase]
   ```
   
   **⚠️ Alternativa Segura:** Se não quiser expor credenciais, use o método SQL abaixo.

5. **Selecionar Tabelas:**
   - Marque todas as 8 tabelas:
     - ✅ auth.users (se disponível)
     - ✅ profiles
     - ✅ user_roles
     - ✅ exercises
     - ✅ workouts
     - ✅ workout_exercises
     - ✅ user_progress
     - ✅ user_achievements

6. **Gerar Diagrama:**
   - Click em **"Import"**
   - O Lucidchart criará automaticamente todas as entidades e relacionamentos!

---

## Opção 2: Importação via SQL DDL

Se a conexão direta não funcionar, use o arquivo SQL:

1. **Copie o arquivo SQL:**
   - Arquivo: `/home/antony/Documentos/TCC/mobile/supabase/migrations/20250117_vivafit_seniors_enhanced_schema.sql`

2. **No Lucidchart:**
   - New → Lucidchart → Entity Relationship
   - Click em **"Import Data"** no menu
   - Selecione **"Database Schema (SQL)"**
   - Cole o conteúdo do arquivo SQL

3. **Ajustar:**
   - O Lucidchart lerá automaticamente as tabelas e FKs
   - Organize o layout manualmente

---

## Opção 3: Importação Manual com CSV (Backup)

Se os métodos acima não funcionarem, use os arquivos CSV fornecidos.

### Arquivos Disponíveis:
- `entities.csv` - Definição das 8 entidades
- `relationships.csv` - Definição dos 9 relacionamentos

### Passo a Passo:

1. **Abrir Lucidchart:**
   - https://lucid.app/
   - New → Lucidchart (em branco)

2. **Importar Entidades:**
   - Menu: File → Import Data → CSV
   - Selecione `entities.csv`
   - Configure:
     - Header Row: Yes
     - Shape Column: "Name"
     - Shape Library: "Entity Relationship"

3. **Ajustar Manualmente:**
   - As entidades serão criadas, mas precisarão de ajustes
   - Adicione campos detalhados em cada entidade
   - Configure cores conforme o guia

4. **Criar Relacionamentos:**
   - Use a biblioteca ERD no painel esquerdo
   - Arraste conexões entre as entidades
   - Configure cardinalidade (1:1, 1:N)

---

## 📋 Estrutura Completa das Entidades

### Use este template para adicionar campos manualmente:

### 1. AUTH_USERS
```
🔑 id : UUID
   email : VARCHAR
   created_at : TIMESTAMP
   raw_user_meta_data : JSONB
```
**Cor:** #E3F2FD (Azul claro)

---

### 2. PROFILES
```
🔑 id : UUID
🔗 user_id : UUID [FK, UNIQUE]
   display_name : TEXT
   age : INTEGER
   weight : NUMERIC
   activity_level : ENUM (low, sedentary, high)
   health_limitations : TEXT
   created_at : TIMESTAMP
   updated_at : TIMESTAMP
```
**Cor:** #E8F5E9 (Verde claro)

---

### 3. USER_ROLES
```
🔑 id : UUID
🔗 user_id : UUID [FK]
   role : ENUM (admin, user)
   created_at : TIMESTAMP
```
**Cor:** #FFF3E0 (Laranja claro)
**Constraint:** UNIQUE (user_id, role)

---

### 4. EXERCISES
```
🔑 id : UUID
   name : TEXT
   description : TEXT
   category : ENUM (cardio, strength, flexibility, balance)
   duration : INTEGER
   difficulty : INTEGER (1-5)
   instructions : TEXT
   image_url : TEXT
   video_url : TEXT
   is_active : BOOLEAN
   created_at : TIMESTAMP
   updated_at : TIMESTAMP
```
**Cor:** #F3E5F5 (Roxo claro)

---

### 5. WORKOUTS
```
🔑 id : UUID
🔗 user_id : UUID [FK]
   name : TEXT
   description : TEXT
   total_duration : INTEGER
   exercises_completed : INTEGER
   total_exercises : INTEGER
   completed_at : TIMESTAMP
   created_at : TIMESTAMP
```
**Cor:** #FFF9C4 (Amarelo claro)

---

### 6. WORKOUT_EXERCISES
```
🔑 id : UUID
🔗 workout_id : UUID [FK]
🔗 exercise_id : UUID [FK]
   order_index : INTEGER
   duration : INTEGER
   completed_at : TIMESTAMP
   created_at : TIMESTAMP
```
**Cor:** #F5F5F5 (Cinza claro)

---

### 7. USER_PROGRESS
```
🔑 id : UUID
🔗 user_id : UUID [FK]
🔗 workout_id : UUID [FK, nullable]
🔗 exercise_id : UUID [FK]
   duration : INTEGER
   calories_burned : INTEGER
   completed_at : TIMESTAMP
```
**Cor:** #E0F7FA (Ciano claro)

---

### 8. USER_ACHIEVEMENTS
```
🔑 id : UUID
🔗 user_id : UUID [FK]
   achievement_type : TEXT
   achievement_name : TEXT
   description : TEXT
   earned_at : TIMESTAMP
```
**Cor:** #FCE4EC (Rosa claro)

---

## 🔗 Relacionamentos (Cardinalidade)

Crie manualmente as conexões com estas configurações:

| # | Origem | Destino | Tipo | Label | Cardinalidade |
|---|--------|---------|------|-------|---------------|
| 1 | AUTH_USERS.id | PROFILES.user_id | Identificador | possui perfil | 1:1 |
| 2 | AUTH_USERS.id | USER_ROLES.user_id | Regular | tem papéis | 1:N |
| 3 | AUTH_USERS.id | WORKOUTS.user_id | Regular | cria treinos | 1:N |
| 4 | WORKOUTS.id | WORKOUT_EXERCISES.workout_id | Regular | contém | 1:N |
| 5 | EXERCISES.id | WORKOUT_EXERCISES.exercise_id | Regular | incluído em | 1:N |
| 6 | AUTH_USERS.id | USER_PROGRESS.user_id | Regular | registra | 1:N |
| 7 | WORKOUTS.id | USER_PROGRESS.workout_id | Opcional | rastreado | 1:N |
| 8 | EXERCISES.id | USER_PROGRESS.exercise_id | Regular | executado | 1:N |
| 9 | AUTH_USERS.id | USER_ACHIEVEMENTS.user_id | Regular | conquista | 1:N |

### Notação Crow's Foot:
- **1:1** - `||--||` (Linha sólida com traços perpendiculares)
- **1:N** - `||--o<` (Linha sólida com pé de galinha)
- **Opcional** - Linha tracejada `- - -`

---

## 🎨 Legendas para Adicionar

Crie caixas de texto com estas informações:

### Legenda de Símbolos
```
┌─────────────────────────────┐
│        LEGENDAS             │
├─────────────────────────────┤
│ 🔑 Primary Key (PK)         │
│ 🔗 Foreign Key (FK)         │
│ ||--|| 1:1 (Um para Um)     │
│ ||--o< 1:N (Um para Muitos) │
│ - - -  Relacionamento       │
│        Opcional (nullable)  │
└─────────────────────────────┘
```

### Tipos ENUM
```
┌──────────────────────────────────┐
│         TIPOS ENUM               │
├──────────────────────────────────┤
│ activity_level:                  │
│  • low (atividade baixa)         │
│  • sedentary (sedentário)        │
│  • high (atividade alta)         │
│                                  │
│ exercise_category:               │
│  • cardio (cardiovascular)       │
│  • strength (força)              │
│  • flexibility (flexibilidade)   │
│  • balance (equilíbrio)          │
│                                  │
│ app_role:                        │
│  • admin (administrador)         │
│  • user (usuário comum)          │
└──────────────────────────────────┘
```

### Segurança RLS
```
┌──────────────────────────────────┐
│   SEGURANÇA (Row Level Security) │
├──────────────────────────────────┤
│ Todas as tabelas com user_id    │
│ implementam isolamento:          │
│                                  │
│ USING (user_id = auth.uid())     │
│ WITH CHECK (user_id = auth.uid())│
│                                  │
│ ✅ Conformidade LGPD             │
│ ✅ Isolamento de dados           │
└──────────────────────────────────┘
```

---

## 📐 Layout Sugerido

Organize as entidades nesta disposição:

```
┌────────────────────────────────────────────────────┐
│  [TÍTULO: DER VivaFit Seniors]                     │
│                                                    │
│  [AUTH_USERS]──────[PROFILES]                      │
│       │                                            │
│       ├─────[USER_ROLES]                           │
│       │                                            │
│       ├─────[WORKOUTS]────[WORKOUT_EXERCISES]      │
│       │         │               │                  │
│       │         │               │                  │
│  [EXERCISES]────┴───────────────┘                  │
│       │                         │                  │
│       │                         │                  │
│       └────[USER_PROGRESS]──────┘                  │
│                   │                                │
│       [USER_ACHIEVEMENTS]                          │
│                                                    │
│  [LEGENDAS]           [TIPOS ENUM]    [RLS]        │
└────────────────────────────────────────────────────┘
```

**Posicionamento recomendado:**
1. **Topo:** Título do diagrama
2. **Centro-esquerda:** AUTH_USERS (entidade principal)
3. **Centro-direita:** PROFILES (1:1 com AUTH_USERS)
4. **Centro:** WORKOUTS, EXERCISES, WORKOUT_EXERCISES (core funcional)
5. **Parte inferior:** USER_PROGRESS (recebe de múltiplas fontes)
6. **Inferior direita:** USER_ACHIEVEMENTS
7. **Rodapé:** Legendas, ENUM, RLS

---

## 🎯 Checklist de Importação

Após importar, verifique:

- [ ] 8 entidades criadas com nomes corretos
- [ ] Todos os campos presentes em cada entidade
- [ ] Primary Keys marcadas (🔑)
- [ ] Foreign Keys marcadas (🔗)
- [ ] 9 relacionamentos conectados
- [ ] Cardinalidade configurada (1:1, 1:N)
- [ ] Labels nos relacionamentos
- [ ] Cores aplicadas nas entidades
- [ ] Legendas adicionadas
- [ ] Layout organizado e legível
- [ ] Relacionamento opcional (WORKOUTS→USER_PROGRESS) como linha tracejada

---

## 🔧 Troubleshooting

### Problema: CSV não importa corretamente
**Solução:** Use o método SQL DDL (Opção 2) ou crie manualmente seguindo o template acima.

### Problema: Relacionamentos não aparecem
**Solução:** A importação CSV não cria relacionamentos automaticamente. Crie-os manualmente arrastando da biblioteca ERD.

### Problema: Campos não aparecem completos
**Solução:** Clique duas vezes em cada entidade e adicione os campos listados acima.

### Problema: Lucidchart não aceita conexão direta
**Solução:** 
1. Exporte o schema via `pg_dump`
2. Importe o SQL no Lucidchart
3. OU use o método manual com o template fornecido

---

## 📚 Arquivo SQL para Importação Direta

**Localização:** `/home/antony/Documentos/TCC/mobile/supabase/migrations/20250117_vivafit_seniors_enhanced_schema.sql`

**Como usar:**
1. Abra o arquivo no VS Code
2. Copie TODO o conteúdo
3. No Lucidchart: Import Data → Database Schema (SQL)
4. Cole o conteúdo
5. Click em "Generate Diagram"

---

## ✅ Resultado Esperado

Após seguir qualquer um dos métodos, você terá:

- ✅ Diagrama ERD profissional com 8 entidades
- ✅ 9 relacionamentos claramente definidos
- ✅ Notação Crow's Foot padrão
- ✅ Cores diferenciadas por tipo de entidade
- ✅ Legendas explicativas
- ✅ Pronto para exportar em PDF de alta qualidade
- ✅ Adequado para inclusão no TCC

**Tempo estimado:**
- Método 1 (SQL): 5-10 minutos
- Método 2 (Manual): 30-45 minutos

---

## 🆘 Suporte

Se nenhum método funcionar, você pode:
1. Criar um diagrama básico com as 8 entidades
2. Usar o template visual do `LUCIDCHART_DER_GUIDE.md`
3. Conectar manualmente os relacionamentos
4. Aplicar as cores e legendas sugeridas

O resultado final será o mesmo! 🎯

---

**Boa sorte com a importação! 🚀**
