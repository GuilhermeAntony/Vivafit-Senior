## 3.2.2 Arquitetura de Dados e Persistência

A Figura 3 representa como os dados são armazenados, possibilitando que o aplicativo funcione offline, sincronizando quando estiver online.

**Figura 3 – Arquitetura dos dados e persistência offline**

A arquitetura de dados implementa estratégia offline-first que garante funcionamento contínuo do aplicativo independente de conectividade. O fluxo inicia-se com **Entrada do Usuário**, que aciona **Armazenamento Local AsyncStorage** para persistência imediata dos dados. Simultaneamente, o sistema verifica disponibilidade de rede através do ponto de decisão **Rede Disponível?**.

Quando há conexão, o sistema executa **Sincronização Supabase** em tempo real, atualizando o backend e acionando processos paralelos de **Atualizar Cache Local** e **Sincronização em Background**. Este último alimenta o **Sistema de Arquivos Imagens dos Exercícios**, que mantém **Cache de 7 dias** com **Política de Expiração** configurável, garantindo que imagens ilustrativas permaneçam acessíveis offline.

No cenário sem conectividade, dados são **Enfileirar para Depois**, armazenando operações pendentes localmente para processamento posterior. O lado direito do diagrama ilustra o fluxo de requisição de dados aos **Dados do Servidor**: o sistema primeiro verifica **Cache Válido?**; se positivo, serve dados do **Servir do Cache**; caso contrário, executa **Buscar e Cachear**, atualizando repositório local antes de disponibilizar informações ao usuário.

Esta arquitetura dual (escrita local + sincronização assíncrona) assegura que usuários idosos, frequentemente com conectividade instável, possam registrar treinos e consultar exercícios sem interrupções, com sincronização transparente ao restabelecer conexão (SATYANARAYANAN et al., 2009).

---

## REFERÊNCIA COMPLEMENTAR

SATYANARAYANAN, M. et al. The case for VM-based cloudlets in mobile computing. **IEEE Pervasive Computing**, v. 8, n. 4, p. 14-23, 2009.
