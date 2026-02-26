# Plano de Estudos — Qualidade e Confiança em Produção  
(Testes + Observabilidade)

Este plano cobre o **sexto eixo de formação** de um profissional fullstack robusto:  
garantir que o sistema **funciona hoje, continue funcionando amanhã e seja diagnosticável quando falhar**.

Aqui nasce a mentalidade **produção-first**.

---

## Visão Geral do Bloco

- Duração sugerida: **6 a 8 semanas**
- Pré-requisitos:
  - Backend estruturado (Nest / API)
  - Frontend funcional (React / Next)
  - Banco de dados integrado
- Regra de ouro: **código sem observação e sem teste é hipótese, não sistema**

---

## Etapa 15 — Testes no Backend (Unitários e de Integração)

### Objetivo
Usar testes para **proteger comportamento e arquitetura**, não apenas “aumentar cobertura”.

### Testes Unitários
- O que é um teste unitário
- Isolamento de dependências
- Testar regras de negócio
- Mock vs fake vs stub (conceito)
- Testes rápidos e determinísticos

### Testes de Integração
- Testar módulos integrados
- Testar acesso a banco
- Testar APIs reais (HTTP)
- Ambiente de teste separado
- Seed e limpeza de dados

### Conceitos-chave
- Teste protege contrato, não implementação
- Código difícil de testar geralmente está mal acoplado
- Menos mocks, mais intenção

### Exercícios sugeridos
- Testar serviços isolados
- Testar fluxo completo de uma rota
- Quebrar teste e entender o erro
- Refatorar código guiado por teste

### Resultado esperado
- Escrever código pensando em testabilidade
- Confiar em refatorações
- Detectar regressões cedo

---

## Etapa 16 — Testes End-to-End (Frontend)

### Objetivo
Garantir que o **sistema funcione do ponto de vista do usuário**.

### Fundamentos de E2E
- O que é teste E2E
- Diferença entre unit, integration e E2E
- Testar comportamento, não detalhe visual

### O que testar
- Fluxos críticos (login, cadastro, ações principais)
- Estados de erro e loading
- Permissões e acessos negados
- Integração real frontend ↔ backend

### Boas práticas
- Poucos testes E2E, mas bem escolhidos
- Dados previsíveis
- Ambiente controlado
- Evitar dependência de estado externo

### Conceitos-chave
- E2E é seguro de vida, não rede de pesca
- Teste E2E lento é normal, frágil não é
- Usuário não liga para sua arquitetura interna

### Exercícios sugeridos
- Automatizar um fluxo completo
- Simular erro de backend
- Validar comportamento após mudança

### Resultado esperado
- Confiança em deploys
- Menos medo de produção
- Feedback real sobre UX funcional

---

## Etapa 17 — Logs Estruturados

### Objetivo
Aprender a **observar o sistema em execução**.

### Fundamentos
- O que são logs
- Logs estruturados (JSON)
- Níveis de log (info, warn, error)
- Logs não são prints

### O que logar
- Erros com contexto
- Eventos importantes
- Início e fim de processos
- Identificadores de requisição

### Boas práticas
- Logs legíveis por máquinas
- Não logar dados sensíveis
- Consistência de formato

### Conceitos-chave
- Logs contam histórias
- Sem logs, não há diagnóstico
- Produção é ambiente hostil

### Exercícios sugeridos
- Padronizar logs no backend
- Simular erro e rastrear causa
- Correlacionar logs de uma requisição

### Resultado esperado
- Investigar falhas rapidamente
- Reduzir tempo de diagnóstico

---

## Etapa 18 — Métricas e Tracing (Observabilidade Básica)

### Objetivo
Entender **como o sistema se comporta ao longo do tempo**, não apenas quando quebra.

### Métricas
- O que são métricas
- Latência, throughput, erro
- SLIs e SLOs (conceito)
- Alertas básicos

### Tracing
- O que é tracing distribuído
- Span e trace
- Fluxo de uma requisição
- Identificar gargalos

### Integração Conceitual
- Logs explicam o que aconteceu
- Métricas mostram tendências
- Tracing conecta eventos

### Conceitos-chave
- Observabilidade ≠ monitoramento simples
- Sem visibilidade não há escala
- Produção ensina mais que staging

### Exercícios sugeridos
- Instrumentar uma rota
- Medir tempo de resposta
- Identificar gargalo artificial
- Simular pico de carga simples

### Resultado esperado
- Ler sinais do sistema
- Antecipar problemas
- Tomar decisões baseadas em dados

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Escrever testes que protegem comportamento
- Confiar em mudanças sem medo excessivo
- Diagnosticar erros em produção
- Entender o comportamento do sistema ao longo do tempo

---

## Observação Final

Qualidade não é perfeição.  
É **capacidade de mudança segura**.

Sistemas robustos não são os que nunca falham,  
mas os que **falham de forma compreensível, rastreável e recuperável**.
