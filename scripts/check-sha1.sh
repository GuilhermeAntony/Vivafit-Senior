#!/bin/bash

# Script para verificar SHA-1 do keystore Android
# Útil para configurar Google OAuth

echo "🔍 Verificando SHA-1 do Android Keystore"
echo "=========================================="
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar se keytool está disponível
if ! command -v keytool &> /dev/null; then
    echo -e "${RED}❌ keytool não encontrado!${NC}"
    echo "keytool faz parte do JDK. Instale o JDK Java primeiro."
    exit 1
fi

echo -e "${GREEN}✅ keytool encontrado${NC}"
echo ""

# Debug keystore (padrão Expo/React Native)
DEBUG_KEYSTORE="$HOME/.android/debug.keystore"
if [ -f "$DEBUG_KEYSTORE" ]; then
    echo -e "${YELLOW}📋 DEBUG KEYSTORE (para desenvolvimento):${NC}"
    echo "Localização: $DEBUG_KEYSTORE"
    echo ""
    keytool -list -v -keystore "$DEBUG_KEYSTORE" -alias androiddebugkey -storepass android -keypass android | grep SHA1
    echo ""
else
    echo -e "${YELLOW}⚠️  Debug keystore não encontrado em $DEBUG_KEYSTORE${NC}"
fi

# Project debug keystore (dentro do projeto)
PROJECT_DEBUG="./android/app/debug.keystore"
if [ -f "$PROJECT_DEBUG" ]; then
    echo -e "${YELLOW}📋 PROJECT DEBUG KEYSTORE:${NC}"
    echo "Localização: $PROJECT_DEBUG"
    echo ""
    keytool -list -v -keystore "$PROJECT_DEBUG" -alias androiddebugkey -storepass android -keypass android | grep SHA1
    echo ""
else
    echo -e "${YELLOW}⚠️  Project debug keystore não encontrado em $PROJECT_DEBUG${NC}"
fi

# Release keystore (se existir)
RELEASE_KEYSTORE="./android/app/release.keystore"
if [ -f "$RELEASE_KEYSTORE" ]; then
    echo -e "${YELLOW}📋 RELEASE KEYSTORE (para produção):${NC}"
    echo "Localização: $RELEASE_KEYSTORE"
    echo ""
    echo "Digite a senha do keystore de release:"
    keytool -list -v -keystore "$RELEASE_KEYSTORE" | grep SHA1
    echo ""
else
    echo -e "${YELLOW}⚠️  Release keystore não encontrado em $RELEASE_KEYSTORE${NC}"
fi

# Instruções finais
echo ""
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}📝 PRÓXIMOS PASSOS:${NC}"
echo ""
echo "1. Copie o SHA-1 acima (SHA1:...)"
echo "2. Vá para Google Cloud Console"
echo "3. APIs e Serviços → Credenciais"
echo "4. Crie/Edite OAuth 2.0 Client ID (Android)"
echo "5. Cole o SHA-1 copiado"
echo "6. Nome do pacote: com.antony13.Mobile"
echo ""
echo -e "${YELLOW}💡 DICA:${NC} Para desenvolvimento, use o SHA-1 do DEBUG keystore"
echo -e "${YELLOW}💡 DICA:${NC} Para produção (EAS build), use o SHA-1 do Google Play ou EAS"
echo ""
echo -e "${GREEN}🔗 Links úteis:${NC}"
echo "   Google Cloud Console: https://console.cloud.google.com/"
echo "   Guia completo: docs/GOOGLE_AUTH_SETUP.md"
echo ""
