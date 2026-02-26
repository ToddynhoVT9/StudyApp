# Plano de Estudos — Dados e Persistência (PostgreSQL + Migrations)

Este plano cobre o **quarto eixo de formação** de um profissional fullstack robusto:  
aprender a **pensar em dados** de forma estrutural, entendendo que banco de dados não é detalhe de implementação,  
mas parte central da longevidade de qualquer sistema.

Aqui muitos sistemas ganham estabilidade — ou acumulam dívidas difíceis de pagar depois.

---

## Visão Geral do Bloco

- Duração sugerida: **6 a 8 semanas**
- Pré-requisitos:
  - Backend básico (Node + HTTP + Nest)
  - Noções de APIs e domínio da aplicação
- Regra de ouro: **dados duram mais que código**

---

## Etapa 9 — PostgreSQL (SQL de Verdade)

### Objetivo
Dominar o uso de um banco relacional maduro e aprender a **modelar realidade em dados**.

### Fundamentos de SQL
- O que é um banco relacional
- Tabelas, linhas e colunas
- Tipos de dados
- Chaves primárias
- Chaves estrangeiras
- Constraints (`NOT NULL`, `UNIQUE`, `CHECK`)
- Relacionamentos (1–1, 1–N, N–N)

### Consultas
- `SELECT`, `INSERT`, `UPDATE`, `DELETE`
- `WHERE`, `ORDER BY`, `LIMIT`
- `JOIN` (INNER, LEFT)
- Agregações (`COUNT`, `SUM`, `AVG`)
- `GROUP BY` e `HAVING`
- Subqueries (uso consciente)

### Modelagem de Dados
- Normalização (até 3ª forma normal)
- Quando desnormalizar
- Tabelas de associação
- Modelagem orientada ao domínio (não à tela)
- Evitar duplicação semântica

### Índices e Performance
- O que é um índice
- Quando criar índices
- Índices em chaves estrangeiras
- Trade-offs: escrita vs leitura
- Uso básico de `EXPLAIN`

### Conceitos-chave
- Banco impõe regras que o código não deve violar
- Schema é contrato
- Performance começa no modelo

### Exercícios sugeridos
- Modelar um domínio simples (ex: usuários, pedidos, produtos)
- Criar consultas com múltiplos JOINs
- Analisar consultas lentas
- Ajustar índices conscientemente

### Resultado esperado
- Ler um schema e entender o domínio
- Escrever SQL legível e eficiente
- Saber quando o problema é de modelo, não de código

---

## Etapa 10 — Migrations (Versionamento de Schema)

### Objetivo
Aprender a tratar o banco como **parte versionada do sistema**, não como algo manual e frágil.

### Fundamentos
- O que são migrations
- Diferença entre schema atual e histórico
- Criação incremental de tabelas
- Alterações seguras de colunas
- Remoção e depreciação de campos

### Ambientes
- Banco local (dev)
- Banco de testes
- Banco de homologação (stage)
- Banco de produção

### Rollback e Segurança
- Migrações reversíveis
- Estratégias de rollback
- Migrations pequenas e frequentes
- Nunca alterar migration já aplicada

### Integração com Código
- Sincronização entre entidades e schema
- Deploy com migration automatizada
- Falhas de migration em produção

### Conceitos-chave
- Schema drift é inimigo silencioso
- Migrations são documentação executável
- Banco evolui junto com o código

### Exercícios sugeridos
- Criar sequência de migrations
- Simular erro de migration
- Testar rollback
- Evoluir schema sem quebrar dados existentes

### Resultado esperado
- Evoluir banco sem medo
- Manter ambientes sincronizados
- Tratar banco como ativo crítico

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Modelar um domínio relacional de forma coerente
- Escrever SQL sem depender de ORM para tudo
- Justificar escolhas de normalização e índices
- Executar migrations com segurança em múltiplos ambientes

---

## Observação Final

Frameworks mudam.  
ORMs mudam.  
**Dados permanecem.**

Quem domina banco de dados e migrations constrói sistemas que sobrevivem ao tempo,  
às trocas de tecnologia e ao crescimento inevitável do produto.
