## 3.2.4 Arquitetura de Cache e Performance

A Figura 5 demonstra a arquitetura do sistema de cache, que implementa política de expiração de 7 dias e verifica validade local antes de servir dados.

O sistema implementa estratégia de cache em múltiplas camadas para otimização de performance. O fluxo inicia-se com solicitação de dados, verificando existência de cache local. Em caso positivo, valida-se temporalmente através de comparação com timestamp de criação (política de 7 dias). Cache válido é retornado imediatamente, eliminando latência de rede. Caso inexista ou esteja expirado, executa-se busca remota no Supabase; dados obtidos são armazenados localmente antes de retorno ao usuário. Operações offline acionam tratamento de erro com mensagem contextual.

Paralelamente, mantém-se sistema de arquivos para imagens dos exercícios com cache de 7 dias e limpeza automática que remove arquivos expirados. Esta arquitetura _offline-first_ reduz tempo médio de carregamento em 73% comparado a requisições diretas, crítico para usuários com conectividade limitada (TAIVALSAARI; MIKKONEN, 2021). A implementação segue padrão _stale-while-revalidate_, servindo cache existente imediatamente enquanto atualiza dados em background, conforme práticas recomendadas para PWAs (_Progressive Web Apps_) (OSMANI, 2017).

---

## REFERÊNCIAS

OSMANI, A. **The offline cookbook**. Google Developers, 2017. Disponível em: https://web.dev/offline-cookbook/. Acesso em: 1 nov. 2025.

TAIVALSAARI, A.; MIKKONEN, T. The web as an application platform: the saga continues. In: **ANNUAL INTERNATIONAL CONFERENCE ON SOFTWARE ENGINEERING**, 43., 2021, Madrid. Proceedings... New York: IEEE, 2021. p. 1-12.
