# Plano de Estudos — Runtime e Backend Essencial (Node.js + HTTP + Nest)

Este plano cobre o **segundo eixo de formação** de um profissional fullstack robusto:  
aprender a criar **aplicações que vivem**, recebem requisições, respondem corretamente e são organizadas para crescer.

Aqui o foco deixa de ser “linguagem” e passa a ser **sistema em execução**.

---

## Visão Geral do Bloco

- Duração sugerida: **8 a 10 semanas**
- Pré-requisito: Fundamentos da Web + JavaScript + TypeScript
- Regra de ouro: **entender antes de abstrair**

---

## Etapa 4 — Node.js (Runtime LTS)

### Objetivo
Parar de enxergar Node como “JavaScript fora do navegador”  
e começar a vê-lo como **um ambiente de execução com responsabilidades próprias**.

### O que estudar
- O que é o Node.js (V8 + event loop + APIs nativas)
- Diferença entre runtime e linguagem
- Sistema de módulos (CommonJS vs ES Modules)
- `process` e variáveis de ambiente
- File system (`fs`)
- Streams (conceito e uso básico)
- Processos, sinais e encerramento gracioso
- Gerenciamento de dependências (npm)

### Conceitos-chave
- Event loop no backend
- Operações bloqueantes vs não bloqueantes
- Por que Node escala bem em I/O

### Exercícios sugeridos
- Criar um servidor HTTP sem framework
- Ler e escrever arquivos
- Criar um pequeno script CLI
- Simular configuração por `.env`

### Resultado esperado
- Entender o ciclo de vida de uma aplicação Node
- Saber onde colocar lógica de inicialização e encerramento
- Não tratar Node como “caixa-preta”

---

## Etapa 5 — HTTP de Verdade

### Objetivo
Dominar o **protocolo** antes do framework.

Frameworks escondem HTTP — sistemas robustos dependem de entendê-lo.

### O que estudar
- Estrutura de uma requisição HTTP
- Métodos (GET, POST, PUT, PATCH, DELETE)
- Status codes (2xx, 3xx, 4xx, 5xx)
- Headers (request e response)
- Cookies e sessão
- CORS (o problema que resolve e por quê existe)
- Cache HTTP (ETag, Cache-Control)
- Idempotência
- REST: princípios, não dogmas

### Conceitos-chave
- HTTP é **stateless**
- APIs são contratos
- Erros também são respostas válidas

### Exercícios sugeridos
- Implementar endpoints HTTP puros
- Simular erros corretamente
- Testar requisições com ferramentas externas
- Quebrar e consertar CORS conscientemente

### Resultado esperado
- Explicar o que acontece do request ao response
- Projetar endpoints previsíveis
- Não “atirar status code aleatório”

---

## Etapa 6 — NestJS (API Estruturada)

### Objetivo
Aprender **organização, arquitetura e separação de responsabilidades**  
usando um framework opinativo.

### O que estudar
- Estrutura do Nest
- Controllers e rotas
- Providers e services
- Injeção de dependência
- DTOs e validação
- Pipes
- Guards (auth, autorização)
- Interceptors (logs, métricas, transformação)
- Filtros de exceção

### Conceitos-chave
- Arquitetura modular
- Dependências explícitas
- Fluxo de request dentro do framework

### O que evitar
- Decorator por reflexo
- Copiar boilerplate sem entender
- Misturar regra de negócio com controller

### Exercícios sugeridos
- Criar uma API CRUD simples
- Separar domínio, serviço e controller
- Implementar validação e tratamento de erro
- Simular autenticação básica

### Resultado esperado
- Ler um projeto Nest e entender sua arquitetura
- Criar APIs extensíveis sem virar espaguete
- Saber **onde** cada tipo de lógica deve morar

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Explicar o papel do Node como runtime
- Descrever o fluxo completo de uma requisição HTTP
- Criar uma API Nest organizada e previsível
- Justificar decisões arquiteturais básicas

---

## Observação Final

Este bloco é onde muita gente começa errado, pulando direto para o framework.

Aqui você aprende algo mais importante que Nest ou Node:  
**como sistemas backend pensam e respiram**.

Isso reduz drasticamente bugs, retrabalho e arquitetura frágil no futuro.
