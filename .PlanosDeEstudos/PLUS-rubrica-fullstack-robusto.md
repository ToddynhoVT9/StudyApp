# Rubrica de Avaliação — Tutor Fullstack Robusto (JS/TS)

Esta rubrica define **critérios objetivos e progressivos** para avaliar o avanço do estudante em cada um dos **8 blocos do currículo**.

Ela é usada pelo GPT de forma **interna** para:
- diagnosticar nível,
- corrigir exercícios,
- decidir quando avançar de bloco,
- evitar progressão com lacunas conceituais.

Os níveis são:
- **Iniciante** → reconhecimento e execução guiada  
- **Funcional** → autonomia com supervisão  
- **Sólido** → domínio estrutural e capacidade de explicação  

---

## Bloco 1 — Fundamentos da Web + JS + TS

### Iniciante
- Reconhece estrutura básica de HTML/CSS
- Entende variáveis, funções e async/await
- Usa TypeScript de forma superficial

### Funcional
- Explica fluxo JS (event loop em alto nível)
- Usa TS para modelar dados simples
- Consegue debugar erros comuns de frontend

### Sólido
- Explica diferenças entre sync/async claramente
- Usa TS como contrato (interfaces, unions)
- Justifica decisões de estrutura de código

---

## Bloco 2 — Node + HTTP + Nest

### Iniciante
- Cria APIs simples com Nest
- Reconhece verbos HTTP e status codes
- Usa Node sem entender runtime profundamente

### Funcional
- Explica request → response
- Organiza código em controllers/services
- Trata erros e valida input

### Sólido
- Justifica arquitetura de API
- Explica trade-offs de design HTTP
- Consegue depurar problemas de runtime

---

## Bloco 3 — React + Next.js

### Iniciante
- Cria componentes simples
- Usa estado e props
- Segue tutoriais

### Funcional
- Entende re-renderização
- Escolhe entre SSR/SSG
- Estrutura componentes corretamente

### Sólido
- Explica ciclo de renderização
- Evita estado redundante
- Justifica decisões de arquitetura frontend

---

## Bloco 4 — PostgreSQL + Migrations

### Iniciante
- Escreve SQL básico
- Entende tabelas e chaves
- Usa ORM sem entender SQL

### Funcional
- Modela domínio simples
- Usa joins e índices básicos
- Executa migrations com segurança

### Sólido
- Justifica modelo relacional
- Analisa performance com EXPLAIN
- Evolui schema sem quebrar dados

---

## Bloco 5 — Identidade, Segurança e Limites

### Iniciante
- Implementa login básico
- Usa JWT ou sessão sem critério claro

### Funcional
- Diferencia autenticação e autorização
- Implementa RBAC simples
- Valida input corretamente

### Sólido
- Justifica escolha entre sessão/JWT
- Define limites e proteções conscientemente
- Pensa segurança em camadas

---

## Bloco 6 — Testes + Observabilidade

### Iniciante
- Escreve testes básicos
- Usa logs como prints

### Funcional
- Testa regras de negócio
- Usa logs estruturados
- Entende métricas básicas

### Sólido
- Usa testes para guiar arquitetura
- Diagnostica falhas em produção
- Interpreta sinais do sistema

---

## Bloco 7 — Docker + CI/CD

### Iniciante
- Cria Dockerfile funcional
- Executa pipeline simples

### Funcional
- Usa docker-compose
- Automatiza testes e build
- Entende pipeline CI/CD

### Sólido
- Justifica empacotamento
- Depura falhas de pipeline
- Usa CI/CD como parte do sistema

---

## Bloco 8 — Borda, Escala e Operação

### Iniciante
- Reconhece CDN, WAF e Kubernetes
- Usa conceitos sem modelo mental claro

### Funcional
- Explica papel da borda
- Entende deploy em Kubernetes
- Raciocina sobre escala básica

### Sólido
- Justifica decisões de cache e proteção
- Explica falhas e resiliência
- Pensa sistema como fluxo completo

---

## Regra de Progressão

- Um bloco só é considerado **concluído** quando o estudante atinge **nível Funcional**.
- Avanço para **Sólido** pode ocorrer em paralelo, por aprofundamento.
- Lacunas em blocos anteriores **bloqueiam progressão**, mesmo que blocos posteriores “funcionem”.

---

## Princípio Central

> Avançar rápido não é progresso.  
> Progredir com clareza é.

Esta rubrica existe para garantir **longevidade cognitiva**,  
não velocidade artificial.
