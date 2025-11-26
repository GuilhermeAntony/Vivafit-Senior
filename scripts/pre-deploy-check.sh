#!/bin/bash
# Checklist Pré-Deploy - VivaFit Seniors

echo "╔═══════════════════════════════════════════════════════╗"
echo "║   ✅ Checklist Pré-Deploy - VivaFit Seniors           ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

ERRORS=0
WARNINGS=0

echo "🔍 Verificando requisitos..."
echo ""

# 1. Login EAS
echo -n "1. Login EAS... "
if eas whoami &>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Execute: eas login"
    ((ERRORS++))
fi

# 2. Node modules
echo -n "2. Dependências instaladas... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "   Execute: npm install"
    ((ERRORS++))
fi

# 3. TypeScript compila
echo -n "3. TypeScript compila... "
if npx tsc --noEmit &>/dev/null; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}!${NC}"
    echo "   Há erros de TypeScript"
    ((WARNINGS++))
fi

# 4. Configuração Supabase
echo -n "4. Supabase configurado... "
if grep -q "supabase" app.json || [ -f ".env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}!${NC}"
    echo "   Verifique se SUPABASE_URL e SUPABASE_ANON_KEY estão configurados"
    ((WARNINGS++))
fi

# 5. Versão configurada
echo -n "5. Versão definida... "
if grep -q '"version"' app.json; then
    VERSION=$(grep -o '"version": "[^"]*"' app.json | cut -d'"' -f4)
    echo -e "${GREEN}✓${NC} ($VERSION)"
else
    echo -e "${RED}✗${NC}"
    ((ERRORS++))
fi

# 6. Bundle identifier
echo -n "6. Bundle identifier... "
if grep -q '"bundleIdentifier"' app.json; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}!${NC}"
    ((WARNINGS++))
fi

# 7. Migration aplicada (tentar verificar)
echo -n "7. Migration Supabase... "
if [ -f "scripts/check-migration-applied.js" ]; then
    if node scripts/check-migration-applied.js &>/dev/null; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo "   Execute: node scripts/check-migration-applied.js"
        echo "   A migration precisa ser aplicada no Supabase!"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}?${NC}"
    echo "   Não foi possível verificar (execute manualmente)"
    ((WARNINGS++))
fi

# 8. Git status
echo -n "8. Git limpo... "
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${YELLOW}!${NC}"
    echo "   Há mudanças não commitadas"
    ((WARNINGS++))
fi

echo ""
echo "═══════════════════════════════════════════════════════"
echo "📊 RESULTADO"
echo "═══════════════════════════════════════════════════════"
echo ""

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo -e "${GREEN}✅ TUDO PRONTO PARA DEPLOY!${NC}"
    echo ""
    echo "Execute:"
    echo "  ./scripts/deploy-production.sh"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo -e "${YELLOW}⚠️  PRONTO COM AVISOS${NC}"
    echo ""
    echo "Avisos: $WARNINGS"
    echo ""
    echo "Você pode prosseguir, mas verifique os avisos acima."
    echo ""
    echo "Execute:"
    echo "  ./scripts/deploy-production.sh"
    echo ""
    exit 0
else
    echo -e "${RED}❌ NÃO ESTÁ PRONTO${NC}"
    echo ""
    echo "Erros críticos: $ERRORS"
    echo "Avisos: $WARNINGS"
    echo ""
    echo "Corrija os erros acima antes de fazer deploy."
    echo ""
    exit 1
fi
