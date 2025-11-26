# 🚀 Guia Rápido - Deploy em Produção

## Método 1: Script Automatizado (Recomendado)

```bash
./scripts/deploy-production.sh
```

O script irá:
1. ✅ Verificar login EAS
2. ✅ Verificar mudanças git
3. ✅ Verificar configuração Supabase
4. ✅ Perguntar qual perfil usar (production/preview)
5. ✅ Executar o build
6. ✅ Mostrar próximos passos

---

## Método 2: Manual

### Passo 1: Verificar Login
```bash
eas whoami
```

### Passo 2: Build de Produção
```bash
eas build --platform android --profile production
```

### Passo 3: Baixar APK
Depois que o build terminar (10-20 min):
- Acesse o link fornecido no terminal
- Ou visite: https://expo.dev/accounts/antony13/projects/mobile/builds

### Passo 4: Distribuir
- Compartilhe o link do APK com usuários
- Ou envie o arquivo APK diretamente

---

## Atualização de Versão

### Antes de novo build:

1. **Edite `app.json`:**
```json
{
  "expo": {
    "version": "1.0.1",  // Incrementar
    "android": {
      "versionCode": 2   // Incrementar
    }
  }
}
```

2. **Commit:**
```bash
git add app.json
git commit -m "chore: bump version to 1.0.1"
```

3. **Novo build:**
```bash
./scripts/deploy-production.sh
```

---

## Troubleshooting

### Build falha?
```bash
# Ver logs
eas build:list --platform android
eas build:view [BUILD_ID]

# Tentar com cache limpo
eas build --platform android --profile production --clear-cache
```

### APK não instala?
- Ative "Fontes desconhecidas" no Android
- Verifique se o Android é versão 6.0+

### Supabase não conecta?
```bash
# Verificar secrets
eas secret:list

# Verificar migration
node scripts/check-migration-applied.js
```

---

## Checklist Final

Antes de distribuir:

- [ ] Build gerado sem erros
- [ ] APK testado em dispositivo real
- [ ] Login/cadastro funcionam
- [ ] Treinos salvam no Supabase
- [ ] Migration aplicada no banco
- [ ] Sem crashes críticos

---

## Links Úteis

- **Builds:** https://expo.dev/accounts/antony13/projects/mobile/builds
- **Supabase:** https://app.supabase.com
- **Documentação completa:** `docs/DEPLOY_PRODUCAO.md`

---

**Tempo total estimado:** 15-25 minutos ⏱️
