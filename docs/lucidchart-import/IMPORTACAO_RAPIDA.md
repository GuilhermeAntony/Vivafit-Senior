# 🎯 Guia de Importação Rápida - Lucidchart

## ✅ Método 1: Importação via dbdiagram.io (MAIS FÁCIL)

### Passo a Passo:

1. **Acesse:** https://dbdiagram.io/d

2. **Cole o código:**
   - Abra o arquivo `vivafit_seniors.dbml`
   - Copie TODO o conteúdo
   - Cole na área de texto do dbdiagram.io

3. **Visualize o diagrama:**
   - O diagrama será gerado automaticamente!
   - Ajuste o layout arrastando as tabelas

4. **Exporte para Lucidchart:**
   - Click em **"Export"** (menu superior)
   - Selecione **"Export to PDF"** ou **"Export to PNG"**
   - OU: Click em **"Export to SQL"** → **"PostgreSQL"**

5. **Importe no Lucidchart:**
   - Lucidchart → New → ERD
   - Import Data → Database Schema (SQL)
   - Cole o SQL exportado do dbdiagram.io

**Tempo:** ~3 minutos ⚡

---

## ✅ Método 2: Importação SQL Direta no Lucidchart

### Passo a Passo:

1. **Acesse Lucidchart:** https://lucid.app/

2. **Criar novo ERD:**
   - Click em "New"
   - Selecione "Lucidchart"
   - Template: "Entity Relationship Diagram"

3. **Importar SQL:**
   - No menu lateral, click em **"Import Data"**
   - Selecione **"Entity Relationship"**
   - Click em **"Import from SQL"**
   - Selecione **"PostgreSQL"**

4. **Cole o código SQL:**
   - Abra o arquivo `schema.sql`
   - Copie TODO o conteúdo
   - Cole no campo de texto do Lucidchart

5. **Gerar diagrama:**
   - Click em **"Import"** ou **"Generate Diagram"**
   - O Lucidchart criará todas as 8 entidades e 9 relacionamentos automaticamente!

6. **Ajustar:**
   - Arraste as entidades para organizar o layout
   - Aplique cores (veja tabela abaixo)
   - Adicione legendas

**Tempo:** ~5 minutos ⚡

---

## ✅ Método 3: Visualização Online (dbdiagram.io)

Se você só precisa visualizar ou apresentar online:

1. **Acesse:** https://dbdiagram.io/d
2. **Cole o código** do arquivo `vivafit_seniors.dbml`
3. **Pronto!** O diagrama está gerado e interativo
4. **Compartilhe** o link público ou exporte em PDF/PNG

**Tempo:** ~1 minuto ⚡

---

## 🎨 Cores das Entidades (Aplicar Manualmente)

Após importar, aplique estas cores:

| Entidade | Cor Hex | Nome da Cor |
|----------|---------|-------------|
| auth_users | `#E3F2FD` | Azul claro |
| profiles | `#E8F5E9` | Verde claro |
| user_roles | `#FFF3E0` | Laranja claro |
| exercises | `#F3E5F5` | Roxo claro |
| workouts | `#FFF9C4` | Amarelo claro |
| workout_exercises | `#F5F5F5` | Cinza claro |
| user_progress | `#E0F7FA` | Ciano claro |
| user_achievements | `#FCE4EC` | Rosa claro |

---

## 📊 Resultado Esperado

Após a importação, você terá:

✅ **8 Entidades** com todos os campos e tipos de dados  
✅ **9 Relacionamentos** com cardinalidade correta:
   - auth_users → profiles (1:1)
   - auth_users → user_roles (1:N)
   - auth_users → workouts (1:N)
   - auth_users → user_progress (1:N)
   - auth_users → user_achievements (1:N)
   - workouts → workout_exercises (1:N)
   - exercises → workout_exercises (1:N)
   - workouts → user_progress (1:N, opcional)
   - exercises → user_progress (1:N)

✅ **Primary Keys** e **Foreign Keys** configuradas  
✅ **Constraints** e **Índices** documentados  
✅ **Notação Crow's Foot** padrão  
✅ **Pronto para TCC** em alta qualidade  

---

## 🆘 Troubleshooting

### Problema: Lucidchart não reconhece o SQL
**Solução:** Use o Método 1 (dbdiagram.io) e exporte para SQL compatível.

### Problema: Relacionamentos não aparecem
**Solução:** O DBML do arquivo `.dbml` já define todos os relacionamentos com a sintaxe `ref: > table.field`.

### Problema: Quero editar o diagrama
**Solução:** Use dbdiagram.io (é gratuito e mais fácil) ou Lucidchart (mais profissional).

---

## 🎓 Dicas para o TCC

1. **Exporte em alta qualidade:**
   - PDF vetorial (melhor)
   - PNG com 300 DPI mínimo

2. **Adicione legendas:**
   - Tipos ENUM
   - Políticas RLS
   - Símbolos (PK, FK, 1:1, 1:N)

3. **Documente:**
   - Cada relacionamento
   - Regras de negócio
   - Constraints importantes

4. **Referência ABNT:**
   ```
   DBDIAGRAM.IO. Database Diagram Tool. Holistics Software, 2025. 
   Disponível em: https://dbdiagram.io. Acesso em: 1 nov. 2025.
   ```

---

## 📁 Arquivos Disponíveis

1. **`vivafit_seniors.dbml`** - Código DBML (recomendado para dbdiagram.io)
2. **`vivafit_seniors.json`** - Estrutura JSON com metadados completos
3. **`schema.sql`** - SQL puro do PostgreSQL (para Lucidchart)
4. **`entities.csv`** - Lista de entidades (backup)
5. **`relationships.csv`** - Lista de relacionamentos (backup)

**Use o arquivo `.dbml` para o método mais rápido!** 🚀

---

## 🎯 Recomendação Final

**Para visualização rápida e apresentação:**
→ Use **dbdiagram.io** com o arquivo `vivafit_seniors.dbml`

**Para diagrama profissional no TCC:**
→ Use **Lucidchart** importando o `schema.sql` ou o SQL exportado do dbdiagram.io

**Ambos os métodos levam menos de 5 minutos!** ⚡

---

## 🔗 Links Úteis

- **dbdiagram.io:** https://dbdiagram.io/d
- **Lucidchart:** https://lucid.app/
- **Documentação DBML:** https://dbml.dbdiagram.io/docs/
- **Tutorial Crow's Foot:** https://www.lucidchart.com/pages/er-diagrams

---

**Boa sorte com o TCC! 🎓**
