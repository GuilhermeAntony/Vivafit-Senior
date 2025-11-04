## 3.2.3 Arquitetura de Autenticação e Segurança

A Figura 4 demonstra a implementação da arquitetura de segurança, evidenciando o uso do Supabase para tratamento de segurança a nível de linha no banco de dados através das políticas RLS (_Row Level Security_).

O fluxo de autenticação seguro estabelece comunicação entre quatro camadas principais: usuário, aplicativo React Native, Supabase Auth e PostgreSQL com RLS. O processo inicia-se quando o usuário requisita autenticação via OAuth ou email/senha. O Supabase Auth valida as credenciais e retorna token JWT (_JSON Web Token_) armazenado no AsyncStorage para persistência local (JONES; BRADLEY; SAKIMURA, 2015). A cada operação subsequente, o aplicativo consulta recursos incluindo contexto do usuário através do token JWT. O Supabase Auth intercepta estas requisições e aplica automaticamente políticas RLS no PostgreSQL, garantindo que cada consulta SQL seja filtrada conforme identidade do usuário autenticado (POSTGRESQL, 2023).

As políticas RLS são definidas através de regras declarativas para operações SELECT, INSERT, UPDATE e DELETE. Por exemplo, a política para `completed_workouts` utiliza cláusula `WHERE user_id = auth.uid()`, assegurando que cada usuário visualize apenas seus próprios registros. Esta arquitetura implementa segurança em profundidade (_defense in depth_), conforme recomendações da OWASP (2021), combinando autenticação baseada em token JWT, autorização via RLS no banco de dados e isolamento lógico de dados por usuário. A conformidade com a LGPD (Lei nº 13.709/2018) é assegurada garantindo que dados pessoais sensíveis de saúde sejam acessíveis apenas pelo titular, implementando princípios de segurança previstos no Art. 6º e facilitando atendimento aos direitos de portabilidade e exclusão (Arts. 18 e 19) (BRASIL, 2018).

---

## REFERÊNCIAS

BRASIL. **Lei nº 13.709, de 14 de agosto de 2018**. Lei Geral de Proteção de Dados Pessoais (LGPD). Diário Oficial da União, Brasília, DF, 15 ago. 2018. Disponível em: http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm. Acesso em: 1 nov. 2025.

HARDT, D. **The OAuth 2.0 Authorization Framework**. RFC 6749, Internet Engineering Task Force (IETF), out. 2012. Disponível em: https://datatracker.ietf.org/doc/html/rfc6749. Acesso em: 1 nov. 2025.

JONES, M.; BRADLEY, J.; SAKIMURA, N. **JSON Web Token (JWT)**. RFC 7519, Internet Engineering Task Force (IETF), maio 2015. Disponível em: https://datatracker.ietf.org/doc/html/rfc7519. Acesso em: 1 nov. 2025.

OWASP FOUNDATION. **OWASP Top Ten 2021: The Ten Most Critical Web Application Security Risks**. OWASP Foundation, 2021. Disponível em: https://owasp.org/Top10/. Acesso em: 1 nov. 2025.

POSTGRESQL GLOBAL DEVELOPMENT GROUP. **PostgreSQL 16 Documentation: Row Security Policies**. PostgreSQL, 2023. Disponível em: https://www.postgresql.org/docs/current/ddl-rowsecurity.html. Acesso em: 1 nov. 2025.
