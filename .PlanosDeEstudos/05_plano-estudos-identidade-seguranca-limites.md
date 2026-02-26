# Plano de Estudos — Identidade, Segurança e Limites (Auth + Proteções de API)

Este plano cobre o **quinto eixo de formação** de um profissional fullstack robusto:  
garantir **quem pode acessar o sistema, o que pode fazer e até onde pode ir**.

Aqui a aplicação deixa de ser apenas funcional e passa a ser **confiável em produção**.

---

## Visão Geral do Bloco

- Duração sugerida: **6 a 8 semanas**
- Pré-requisitos:
  - Backend estruturado (Node + HTTP + Nest)
  - Noções de banco de dados
- Regra de ouro: **segurança é desenho, não remendo**

---

## Etapa 11 — Autenticação (Quem é o usuário?)

### Objetivo
Entender os **modelos de identidade** usados em aplicações web modernas  
e saber escolher o correto para cada cenário.

### Fundamentos de Identidade
- O que é autenticação
- Identidade vs credencial
- Estado vs ausência de estado
- Autenticação ≠ autorização

### Sessão
- Sessão baseada em cookie
- Session ID
- Cookies (`HttpOnly`, `Secure`, `SameSite`)
- Vantagens e limitações
- Sessão em aplicações web tradicionais

### JWT
- Estrutura de um JWT (header, payload, signature)
- Tokens assinados vs criptografados
- Onde armazenar JWT com segurança
- Vantagens e riscos
- JWT não é bala de prata

### Refresh Tokens
- Por que tokens expiram
- Fluxo de access token + refresh token
- Revogação de sessões
- Riscos de vazamento

### OAuth2 e OpenID Connect (conceito)
- O problema que resolvem
- OAuth2 como delegação de acesso
- OpenID Connect como identidade
- Login social e SSO
- Quando usar e quando evitar

### Conceitos-chave
- Identidade é contrato de confiança
- Tokens são permissões temporárias
- Quanto menor o escopo, melhor

### Exercícios sugeridos
- Implementar login com sessão
- Implementar login com JWT
- Comparar fluxos e trade-offs
- Simular expiração e renovação de token

### Resultado esperado
- Escolher conscientemente entre sessão e JWT
- Explicar fluxos de autenticação
- Não tratar auth como “copiar tutorial”

---

## Etapa 12 — Autorização (O que o usuário pode fazer?)

### Objetivo
Controlar **acesso e permissões** de forma clara e extensível.

### Fundamentos
- Autorização baseada em regras
- Diferença entre autenticação e autorização
- Negar por padrão

### Modelos de Autorização
- RBAC (Role-Based Access Control)
- ABAC (Attribute-Based Access Control)
- Permissões explícitas vs implícitas
- Hierarquia de papéis

### Implementação prática
- Guards no backend
- Separação entre regra de negócio e permissão
- Permissões no banco de dados
- Auditoria de ações sensíveis

### Conceitos-chave
- Papel não é identidade
- Autorização vive no backend
- Permissões evoluem com o produto

### Exercícios sugeridos
- Criar sistema simples de papéis
- Proteger rotas sensíveis
- Testar acessos negados
- Refatorar regras mal acopladas

### Resultado esperado
- Criar sistemas de permissão compreensíveis
- Evitar lógica espalhada e frágil
- Manter segurança sem travar evolução

---

## Etapa 13 — Validação de Input (Confiança Zero)

### Objetivo
Tratar **todo input como potencialmente malicioso**.

### Fundamentos
- Validação vs sanitização
- Nunca confiar no client
- Tipagem ≠ validação

### O que validar
- Body
- Query params
- Route params
- Headers relevantes

### Estratégias
- Validação centralizada
- Mensagens de erro claras
- Falhar cedo

### Conceitos-chave
- Dados inválidos não entram no sistema
- Validação protege lógica interna
- Erros também são interface

### Exercícios sugeridos
- Criar DTOs validados
- Simular payloads inválidos
- Padronizar respostas de erro

### Resultado esperado
- APIs previsíveis e seguras
- Redução de bugs inesperados

---

## Etapa 14 — Rate Limiting e Proteção contra Abuso

### Objetivo
Definir **limites explícitos** para proteger o sistema e seus usuários.

### Fundamentos
- O que é rate limiting
- Ataques de força bruta
- Abuso não intencional
- Diferença entre limitação no app e na borda

### Estratégias
- Limite por IP
- Limite por usuário autenticado
- Janelas fixas vs deslizantes
- Respostas corretas (`429 Too Many Requests`)

### Integração
- Rate limit no backend
- Integração com cache (Redis)
- Complementaridade com WAF

### Conceitos-chave
- Todo sistema tem limites
- Limites claros evitam colapso
- Segurança também é UX

### Exercícios sugeridos
- Implementar rate limiting por rota
- Testar cenários de abuso
- Ajustar limites conforme uso

### Resultado esperado
- Aplicação resistente a picos e ataques simples
- Limites documentados e conscientes

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Explicar fluxos de autenticação modernos
- Implementar autorização clara e extensível
- Validar todo input crítico
- Definir e justificar limites de uso

---

## Observação Final

Segurança não é paranoia.  
É **engenharia de confiança**.

Aplicações robustas não confiam em boas intenções,  
confiam em **regras explícitas, verificáveis e testadas**.
