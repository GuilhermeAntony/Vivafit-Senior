# 🚀 Deploy para Produção - VivaFit Seniors

**Data:** 17 de Novembro de 2025  
**Versão:** 1.0.0

---

## 📋 Pré-requisitos

Antes de fazer o build de produção, verifique:

```bash
# 1. Você está logado no EAS?
eas whoami
# Deve mostrar: antony13

# 2. Todas as mudanças commitadas?
git status
# Commite se necessário:
# git add .
# git commit -m "feat: correções de layout e prevenção de duplicatas"

# 3. Supabase configurado?
# Verifique se as credenciais estão em app.json ou como secrets EAS
```

---

## 🔧 Passo 1: Configurar Secrets (Se Necessário)

Se você ainda não configurou os secrets do Supabase no EAS:

```bash
# Configurar URL do Supabase
eas secret:create --scope project --name SUPABASE_URL --value https://misptjgsftdtqfvqsneq.supabase.co --type string

# Configurar Anon Key do Supabase
eas secret:create --scope project --name SUPABASE_ANON_KEY --value "sua-anon-key-aqui" --type string
```

Para ver os secrets configurados:
```bash
eas secret:list
```

---

## 📦 Passo 2: Build de Produção

### Opção A: Build Android APK (Recomendado para Teste)

```bash
# Build de produção para Android
eas build --platform android --profile production
```

**O que acontece:**
1. ✅ Código é enviado para servidores EAS
2. ✅ Build é compilado na nuvem
3. ✅ APK é gerado e disponibilizado para download
4. ⏱️ Tempo estimado: 10-20 minutos

### Opção B: Build Preview (Para Testes Internos)

```bash
# Build preview para testes
eas build --platform android --profile preview
```

---

## 📥 Passo 3: Baixar o APK

Depois que o build terminar:

1. **Via CLI:**
   ```bash
   # O link do APK aparecerá no terminal
   # Exemplo: https://expo.dev/accounts/antony13/projects/mobile/builds/xxx
   ```

2. **Via Dashboard:**
   - Acesse: https://expo.dev/accounts/antony13/projects/mobile/builds
   - Clique no build mais recente
   - Clique em "Download"

3. **Via QR Code:**
   - Escaneie o QR code que aparece no terminal
   - Baixe o APK diretamente no dispositivo

---

## 📱 Passo 4: Distribuir o APK

### Opção 1: Distribuição Interna (Manual)

```bash
# Compartilhar via WhatsApp, Email, Drive, etc.
# 1. Baixe o APK
# 2. Envie para os usuários
# 3. Usuários devem permitir "Instalar apps de fontes desconhecidas"
```

### Opção 2: Distribuição via Expo (Recomendado)

```bash
# Gerar link de distribuição
eas build --platform android --profile production --auto-submit
```

**Link gerado:** `https://expo.dev/artifacts/eas/...`
- Usuários acessam o link
- Baixam e instalam o APK
- Não precisa Google Play Store

### Opção 3: Google Play Store (Oficial)

```bash
# Build AAB para Play Store
eas build --platform android --profile production
# Depois:
eas submit --platform android --profile production
```

**Observação:** Requer configuração adicional de credenciais do Google Play.

---

## 🔄 Passo 5: Atualizar Versão (Próximas Releases)

Para a próxima atualização:

### 1. Incrementar Versão

**Edite `app.json`:**
```json
{
  "expo": {
    "version": "1.0.1",  // Era 1.0.0
    "android": {
      "versionCode": 2    // Era 1
    }
  }
}
```

### 2. Commitar Mudanças

```bash
git add .
git commit -m "chore: bump version to 1.0.1"
git push
```

### 3. Novo Build

```bash
eas build --platform android --profile production
```

---

## 🧪 Passo 6: Testar o APK

Antes de distribuir, teste o APK:

```bash
# Instale no dispositivo físico ou emulador
adb install caminho/do/app.apk

# Teste os principais fluxos:
# 1. Login/Cadastro
# 2. Completar um treino
# 3. Ver progresso
# 4. Editar perfil
# 5. Ver histórico
```

**Checklist de Teste:**
- [ ] Login funciona
- [ ] Cadastro funciona
- [ ] Treinos salvam no Supabase
- [ ] Progresso é exibido
- [ ] Histórico carrega
- [ ] Perfil salva
- [ ] Sem crashes
- [ ] Performance OK

---

## 📊 Monitoramento

Depois do deploy, monitore:

### 1. Supabase Dashboard
- **Acesse:** https://app.supabase.com
- **Verifique:**
  - Número de usuários cadastrados
  - Treinos sendo salvos
  - Erros no banco de dados

### 2. Expo Dashboard
- **Acesse:** https://expo.dev/accounts/antony13/projects/mobile
- **Verifique:**
  - Número de downloads
  - Crashes (se houver)
  - Analytics

### 3. Logs do App

Se usuários reportarem problemas:

```bash
# Ver logs de builds
eas build:list --platform android --limit 10

# Ver detalhes de um build específico
eas build:view [BUILD_ID]
```

---

## 🔧 Comandos Úteis

```bash
# Ver lista de builds
eas build:list --platform android

# Ver detalhes do último build
eas build:view --platform android

# Cancelar um build em andamento
eas build:cancel

# Ver secrets configurados
eas secret:list

# Deletar um secret
eas secret:delete --name NOME_DO_SECRET

# Ver configuração do projeto
eas project:info
```

---

## 🐛 Troubleshooting

### Problema: Build falha

**Solução:**
```bash
# 1. Ver logs detalhados
eas build:view [BUILD_ID]

# 2. Verificar configuração
cat eas.json
cat app.json

# 3. Limpar cache
eas build --platform android --profile production --clear-cache
```

### Problema: APK não instala

**Possíveis causas:**
- Dispositivo não permite apps de fontes desconhecidas
- Versão do Android incompatível
- APK corrompido durante download

**Solução:**
- Ative "Fontes desconhecidas" nas configurações
- Verifique requisitos mínimos (Android 6.0+)
- Baixe novamente o APK

### Problema: Supabase não conecta

**Verificar:**
```bash
# 1. Secrets configurados?
eas secret:list

# 2. URL correta em app.json?
cat app.json | grep supabase

# 3. RLS policies aplicadas?
node scripts/check-migration-applied.js
```

---

## 📚 Referências

- **EAS Build Docs:** https://docs.expo.dev/build/introduction/
- **EAS Submit Docs:** https://docs.expo.dev/submit/introduction/
- **Supabase Docs:** https://supabase.com/docs
- **Projeto no Expo:** https://expo.dev/accounts/antony13/projects/mobile

---

## ✅ Checklist Final

Antes de distribuir para usuários:

- [ ] Migration do Supabase aplicada
- [ ] Build de produção gerado sem erros
- [ ] APK testado em dispositivo real
- [ ] Login/Cadastro funcionando
- [ ] Treinos salvando no banco
- [ ] Progresso sendo exibido
- [ ] Sem crashes críticos
- [ ] Performance aceitável
- [ ] Versão atualizada em app.json
- [ ] Documentação atualizada

---

**🎉 Pronto para Deploy!**

Agora você pode distribuir o APK para os usuários e começar a coletar feedback! 🚀
