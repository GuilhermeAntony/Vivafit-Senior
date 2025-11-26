#!/bin/bash
# Script de Deploy para Produção - VivaFit Seniors

set -e

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   🚀 Deploy para Produção - VivaFit Seniors           ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para perguntar sim/não
confirm() {
    read -p "$1 (s/n): " response
    case "$response" in
        [sS][iI][mM]|[sS])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

echo "═══════════════════════════════════════════════════════"
echo "📋 VERIFICAÇÕES PRÉ-DEPLOY"
echo "═══════════════════════════════════════════════════════"
echo ""

# 1. Verificar se está logado no EAS
echo -n "🔐 Verificando login EAS... "
if eas whoami &>/dev/null; then
    USER=$(eas whoami)
    echo -e "${GREEN}✓${NC} Logado como: $USER"
else
    echo -e "${RED}✗${NC} Não logado"
    echo ""
    echo "Execute: eas login"
    exit 1
fi

# 2. Verificar status do git
echo -n "📦 Verificando status do git... "
if [ -n "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}!${NC} Há mudanças não commitadas"
    echo ""
    git status --short
    echo ""
    
    if confirm "Deseja commitar as mudanças agora?"; then
        read -p "Mensagem do commit: " commit_msg
        git add .
        git commit -m "$commit_msg"
        echo -e "${GREEN}✓${NC} Commit realizado"
    else
        echo -e "${YELLOW}!${NC} Continuando sem commit..."
    fi
else
    echo -e "${GREEN}✓${NC} Repositório limpo"
fi

# 3. Verificar configuração do Supabase
echo -n "🗄️  Verificando configuração Supabase... "
if grep -q "supabase" app.json; then
    echo -e "${GREEN}✓${NC} Configurado em app.json"
else
    echo -e "${YELLOW}!${NC} Usando secrets EAS"
fi

# 4. Verificar versão
echo -n "📌 Versão atual: "
VERSION=$(grep -o '"version": "[^"]*"' app.json | cut -d'"' -f4)
echo -e "${BLUE}$VERSION${NC}"

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🔧 CONFIGURAÇÃO DO BUILD"
echo "═══════════════════════════════════════════════════════"
echo ""

# Perguntar qual perfil de build usar
echo "Escolha o perfil de build:"
echo "  1) production  - Build final para distribuição"
echo "  2) preview     - Build para testes internos"
echo ""
read -p "Escolha (1 ou 2): " build_choice

case $build_choice in
    1)
        PROFILE="production"
        echo -e "${GREEN}✓${NC} Perfil selecionado: production"
        ;;
    2)
        PROFILE="preview"
        echo -e "${GREEN}✓${NC} Perfil selecionado: preview"
        ;;
    *)
        echo -e "${RED}✗${NC} Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "═══════════════════════════════════════════════════════"
echo "🏗️  INICIANDO BUILD"
echo "═══════════════════════════════════════════════════════"
echo ""

# Confirmar antes de iniciar
if ! confirm "Iniciar build de $PROFILE agora?"; then
    echo -e "${YELLOW}!${NC} Build cancelado pelo usuário"
    exit 0
fi

echo ""
echo -e "${BLUE}▶${NC} Iniciando build..."
echo ""

# Executar build
eas build --platform android --profile $PROFILE

BUILD_STATUS=$?

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 RESULTADO DO BUILD"
echo "═══════════════════════════════════════════════════════"
echo ""

if [ $BUILD_STATUS -eq 0 ]; then
    echo -e "${GREEN}✓${NC} Build concluído com sucesso!"
    echo ""
    echo "Próximos passos:"
    echo ""
    echo "1. 📥 Baixar o APK:"
    echo "   - Acesse o link fornecido acima"
    echo "   - Ou visite: https://expo.dev/accounts/$USER/projects/mobile/builds"
    echo ""
    echo "2. 🧪 Testar o APK:"
    echo "   - Instale em um dispositivo real"
    echo "   - Teste os principais fluxos"
    echo "   - Verifique se dados salvam no Supabase"
    echo ""
    echo "3. 📱 Distribuir:"
    echo "   - Compartilhe o link do APK"
    echo "   - Ou envie o arquivo diretamente"
    echo ""
    echo "4. 📊 Monitorar:"
    echo "   - Supabase: https://app.supabase.com"
    echo "   - Expo: https://expo.dev/accounts/$USER/projects/mobile"
    echo ""
else
    echo -e "${RED}✗${NC} Build falhou"
    echo ""
    echo "Verifique os logs acima para mais detalhes."
    echo ""
    echo "Comandos úteis:"
    echo "  eas build:list --platform android"
    echo "  eas build:view [BUILD_ID]"
    echo ""
    exit 1
fi

echo "═══════════════════════════════════════════════════════"
echo "✅ DEPLOY FINALIZADO"
echo "═══════════════════════════════════════════════════════"
echo ""
