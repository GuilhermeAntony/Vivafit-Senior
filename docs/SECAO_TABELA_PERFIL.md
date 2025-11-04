## 3.2.5 Estrutura de Dados do Perfil de Usuário

A tabela `profiles` no Supabase armazena informações personalizadas dos usuários, essenciais para customização da experiência e recomendações de exercícios adequadas ao perfil individual.

A estrutura de dados implementa modelo relacional com campos específicos para o público idoso. O campo `user_id` estabelece relacionamento um-para-um com tabela de autenticação (`auth.users`), garantindo integridade referencial. Informações demográficas incluem `display_name` (nome de exibição), `age` (idade em anos) e `weight` (peso em quilogramas), permitindo cálculos personalizados de gasto calórico baseados em fórmulas metabólicas ajustadas para terceira idade.

O campo `activity_level` categoriza nível de atividade física em quatro escalas (`low`, `medium`, `high`, `sedentary`), seguindo classificação de Atividade Física da OMS (WHO, 2020), determinando intensidade e duração recomendadas dos exercícios. O campo `health_limitations` armazena texto livre descrevendo limitações específicas (exemplo: "Dores no joelho e na coluna"), crucial para filtragem de exercícios contraindicados e prevenção de lesões. Campos de auditoria `created_at` e `updated_at` registram timestamps de criação e última modificação para rastreabilidade.

Políticas RLS (_Row Level Security_) garantem que usuários acessem exclusivamente seus próprios perfis através da condição `user_id = auth.uid()`, implementando isolamento de dados conforme LGPD (BRASIL, 2018). Valores padrão como `activity_level = 'medium'` facilitam onboarding, permitindo uso imediato enquanto usuário completa perfil gradualmente.

---

## REFERÊNCIAS

BRASIL. **Lei nº 13.709, de 14 de agosto de 2018**. Lei Geral de Proteção de Dados Pessoais (LGPD). Diário Oficial da União, Brasília, DF, 15 ago. 2018. Disponível em: http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Acesso em: 1 nov. 2025.

WORLD HEALTH ORGANIZATION. **WHO guidelines on physical activity and sedentary behaviour**. Geneva: WHO, 2020. Disponível em: https://www.who.int/publications/i/item/9789240015128. Acesso em: 1 nov. 2025.
