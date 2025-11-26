#!/bin/bash

# Script para aplicar a migration de correção do completed_workouts
# Data: 13 de novembro de 2025

echo "🔧 VivaFit Seniors - Aplicar Migration de Correção RLS"
echo "======================================================"
echo ""

MIGRATION_FILE="supabase/migrations/20251113_fix_completed_workouts_rls.sql"

# Verificar se o arquivo existe
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "❌ Erro: Arquivo de migration não encontrado!"
    echo "   Esperado: $MIGRATION_FILE"
    exit 1
fi

echo "✅ Migration encontrada: $MIGRATION_FILE"
echo ""

# Verificar se Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "⚠️  Supabase CLI não encontrado"
    echo ""
    echo "Você tem duas opções:"
    echo ""
    echo "1️⃣  Instalar Supabase CLI:"
    echo "   brew install supabase/tap/supabase"
    echo "   ou"
    echo "   npm install -g supabase"
    echo ""
    echo "2️⃣  Aplicar manualmente via Dashboard:"
    echo "   • Acesse: https://app.supabase.com"
    echo "   • Vá em SQL Editor"
    echo "   • Copie o conteúdo de: $MIGRATION_FILE"
    echo "   • Cole e execute no SQL Editor"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI encontrado"
echo ""

# Verificar se está em um projeto Supabase
if [ ! -f "supabase/.temp/project-ref" ] && [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Projeto Supabase não inicializado localmente"
    echo ""
    echo "Opções:"
    echo ""
    echo "1️⃣  Vincular projeto existente:"
    echo "   supabase link --project-ref SEU_PROJECT_REF"
    echo ""
    echo "2️⃣  Aplicar manualmente via Dashboard:"
    echo "   • Acesse: https://app.supabase.com"
    echo "   • Vá em SQL Editor"
    echo "   • Copie o conteúdo de: $MIGRATION_FILE"
    echo "   • Cole e execute no SQL Editor"
    echo ""
    exit 1
fi

echo "✅ Projeto Supabase configurado"
echo ""

# Mostrar conteúdo da migration
echo "📄 Prévia da Migration:"
echo "------------------------"
head -20 "$MIGRATION_FILE"
echo "..."
echo "------------------------"
echo ""

# Perguntar confirmação
read -p "Deseja aplicar esta migration? (s/N) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "❌ Operação cancelada"
    exit 0
fi

echo ""
echo "🚀 Aplicando migration..."
echo ""

# Aplicar migration
supabase db push

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migration aplicada com sucesso!"
    echo ""
    echo "📋 Próximos passos:"
    echo "   1. Rebuildar o app: npx expo start -c"
    echo "   2. Fazer login no app"
    echo "   3. Completar um treino"
    echo "   4. Verificar logs do console"
    echo "   5. Verificar dados no Supabase Dashboard"
    echo ""
    echo "📚 Documentação completa em:"
    echo "   docs/CORRECOES_APLICADAS.md"
    echo ""
else
    echo ""
    echo "❌ Erro ao aplicar migration!"
    echo ""
    echo "Tente aplicar manualmente:"
    echo "   1. Acesse: https://app.supabase.com"
    echo "   2. Vá em SQL Editor"
    echo "   3. Copie o conteúdo de: $MIGRATION_FILE"
    echo "   4. Cole e execute no SQL Editor"
    echo ""
    exit 1
fi
