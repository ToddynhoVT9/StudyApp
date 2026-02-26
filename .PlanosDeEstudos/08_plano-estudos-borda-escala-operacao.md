# Plano de Estudos — Borda, Escala e Operação  
(CDN / WAF / DDoS + Kubernetes)

Este plano cobre o **oitavo eixo de formação** de um profissional fullstack robusto:  
entender **o que acontece fora do código** quando uma aplicação vai para o mundo real  
e como sistemas **sobrevivem a tráfego, falhas e crescimento**.

Aqui o desenvolvedor começa a pensar como **engenheiro de sistemas**.

---

## Visão Geral do Bloco

- Duração sugerida: **4 a 6 semanas**
- Pré-requisitos:
  - Aplicação containerizada
  - CI/CD funcional
  - Noções de backend, frontend e banco
- Regra de ouro: **o código é apenas uma parte do sistema**

---

## Etapa 24 — Borda da Aplicação (Edge)

### Objetivo
Entender o papel da **borda** entre o usuário e a aplicação  
e por que muitos problemas devem ser resolvidos **antes de chegar ao backend**.

### O que é a Borda
- Usuário → Internet → Borda → Aplicação
- Latência, proximidade geográfica
- Superfície de ataque

### Conceitos-chave
- Nem todo request precisa chegar ao servidor
- Proteger antes de processar é mais barato
- A borda é parte da arquitetura

### Resultado esperado
- Visualizar o sistema além do código
- Entender onde decisões de performance e segurança são tomadas

---

## Etapa 25 — CDN (Content Delivery Network)

### Objetivo
Usar CDN para **reduzir latência e carga** no backend.

### O que estudar
- O que é uma CDN
- Cache de conteúdo estático
- Cache de respostas dinâmicas
- Invalidação de cache
- Headers de cache (`Cache-Control`)
- Trade-offs de cache agressivo

### Casos comuns
- Assets estáticos
- Páginas públicas
- APIs com alto volume de leitura

### Conceitos-chave
- Cache é decisão arquitetural
- Latência é experiência do usuário
- Cache errado quebra sistema

### Exercícios sugeridos
- Cachear assets estáticos
- Ajustar headers de cache
- Medir impacto de latência

### Resultado esperado
- Saber quando usar CDN
- Entender riscos e benefícios do cache

---

## Etapa 26 — WAF e Proteção contra DDoS (Cloudflare)

### Objetivo
Entender como **segurança de borda** protege o sistema de ataques comuns.

### O que estudar
- O que é WAF
- Ataques comuns (DDoS, brute force, scanning)
- Regras gerenciadas
- Rate limiting na borda
- Bloqueio por IP, região e padrão

### Conceitos-chave
- WAF complementa, não substitui o backend
- Segurança em camadas
- Tráfego malicioso existe sempre

### Exercícios sugeridos
- Analisar tipos de ataque comuns
- Simular limites de requisição
- Entender logs de bloqueio

### Resultado esperado
- Entender o papel do WAF
- Saber o que não deve chegar à aplicação

---

## Etapa 27 — Conceitos de Escala

### Objetivo
Construir o **modelo mental de escala**, antes de qualquer ferramenta.

### Fundamentos
- Escala vertical vs horizontal
- Stateless vs stateful
- Single point of failure
- Alta disponibilidade
- Balanceamento de carga

### Conceitos-chave
- Escala exige simplicidade
- Estado compartilhado é custo
- Falhas são normais

### Resultado esperado
- Raciocinar sobre crescimento do sistema
- Entender limites de arquiteturas simples

---

## Etapa 28 — Kubernetes (Modelo Mental)

### Objetivo
Entender Kubernetes como **plataforma de execução**, não como ferramenta mágica.

### O que é Kubernetes
- Por que existe
- O problema que resolve
- Diferença entre container e orquestração

### Componentes fundamentais
- Cluster
- Node
- Pod
- Container
- Namespace

### Conceitos-chave
- Kubernetes gerencia estado desejado
- Você descreve, o cluster converge
- Infra como sistema declarativo

### Resultado esperado
- Ler documentação e diagramas de K8s
- Entender a lógica do cluster

---

## Etapa 29 — Kubernetes na Prática (Noção Boa)

### Objetivo
Conhecer os principais objetos usados no dia a dia.

### O que estudar
- Deployment
- ReplicaSet
- Service
- ConfigMap
- Secret
- Ingress
- Health checks (liveness/readiness)
- Autoscaling (HPA – conceito)

### O que evitar
- Complexidade prematura
- Tunagem sem métrica
- YAML copiado sem entendimento

### Exercícios sugeridos
- Ler manifests simples
- Entender fluxo de deploy
- Simular scale up/down conceitualmente
- Rastrear request até o pod

### Resultado esperado
- Entender um deploy Kubernetes
- Conversar com times de plataforma
- Não ter medo do ecossistema

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Explicar o papel da borda em um sistema web
- Justificar uso de CDN e WAF
- Raciocinar sobre escala e falhas
- Explicar como Kubernetes executa aplicações
- Ler manifests básicos sem confusão

---

## Observação Final

Escala não começa quando o sistema cai.  
Começa quando você **entende onde ele pode cair**.

Quem domina borda e operação:
- escreve código mais simples
- projeta sistemas mais resilientes
- toma decisões com visão sistêmica
