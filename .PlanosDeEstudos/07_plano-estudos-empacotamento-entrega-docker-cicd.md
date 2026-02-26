# Plano de Estudos — Empacotamento e Entrega  
(Docker + CI/CD)

Este plano cobre o **sétimo eixo de formação** de um profissional fullstack robusto:  
aprender a **empacotar, automatizar e entregar software de forma previsível**.

Aqui o sistema deixa de depender de pessoas “fazendo do jeito certo”  
e passa a depender de **processos reproduzíveis**.

---

## Visão Geral do Bloco

- Duração sugerida: **4 a 6 semanas**
- Pré-requisitos:
  - Backend e frontend funcionais
  - Testes automatizados básicos
- Regra de ouro: **se não é reproduzível, não é confiável**

---

## Etapa 19 — Conceitos de Empacotamento

### Objetivo
Entender por que empacotar aplicações é essencial para consistência entre ambientes.

### Fundamentos
- Diferença entre código e ambiente
- “Funciona na minha máquina” como sintoma
- Build vs runtime
- Dependências do sistema operacional
- Variáveis de ambiente como configuração

### Conceitos-chave
- Imutabilidade de builds
- Separação entre configuração e código
- Mesmo artefato em dev, stage e prod

### Resultado esperado
- Entender por que deploy manual não escala
- Reconhecer riscos de ambientes divergentes

---

## Etapa 20 — Docker (Fundamentos)

### Objetivo
Usar Docker para criar **ambientes previsíveis e portáveis**.

### O que estudar
- O que é container
- Diferença entre container e VM
- Dockerfile
- Imagens e camadas
- Containers
- `.dockerignore`
- Portas e volumes
- Variáveis de ambiente

### Boas práticas
- Imagens pequenas
- Uma responsabilidade por container
- Não colocar segredos na imagem
- Build determinístico

### Exercícios sugeridos
- Criar Dockerfile para backend
- Criar Dockerfile para frontend
- Rodar app completo via container
- Comparar ambiente local vs container

### Resultado esperado
- Criar imagens funcionais e limpas
- Rodar a aplicação em qualquer máquina
- Entender o ciclo build → run

---

## Etapa 21 — Docker Compose (Ambiente Local Integrado)

### Objetivo
Orquestrar múltiplos serviços em ambiente local.

### O que estudar
- O que é Docker Compose
- Serviços
- Redes
- Volumes persistentes
- Dependência entre containers

### Casos comuns
- Backend + banco
- Backend + frontend
- App + cache

### Exercícios sugeridos
- Subir backend + Postgres
- Subir stack completa localmente
- Resetar ambiente com um comando

### Resultado esperado
- Ambiente local previsível
- Onboarding simples de novos devs

---

## Etapa 22 — CI/CD (Conceitos)

### Objetivo
Entender o **porquê da automação** antes de escrever pipelines.

### Fundamentos
- O que é CI (Integração Contínua)
- O que é CD (Entrega/Deploy Contínuo)
- Pipeline como código
- Falhar cedo

### Conceitos-chave
- Testes como gate
- Build automatizado
- Artefatos versionados
- Menos intervenção humana

### Resultado esperado
- Visualizar pipeline como parte do sistema
- Entender riscos de deploy manual

---

## Etapa 23 — GitHub Actions (Prática)

### Objetivo
Criar pipelines simples, claros e confiáveis.

### O que estudar
- Workflows
- Jobs e steps
- Actions reutilizáveis
- Variáveis e secrets
- Triggers (push, PR, manual)

### Pipeline mínimo recomendado
1. Checkout do código
2. Instalação de dependências
3. Execução de testes
4. Build da aplicação
5. Build da imagem Docker
6. Publicação ou deploy

### Boas práticas
- Pipelines rápidos
- Logs claros
- Separar CI de CD
- Não esconder erros

### Exercícios sugeridos
- Criar pipeline de CI
- Quebrar build propositalmente
- Adicionar build de imagem Docker
- Simular deploy controlado

### Resultado esperado
- Pipeline funcional e confiável
- Redução de erros humanos
- Confiança em cada merge

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Empacotar a aplicação em containers
- Subir o sistema completo com poucos comandos
- Criar pipelines de CI claros
- Automatizar testes e builds
- Confiar no processo de entrega

---

## Observação Final

Empacotamento e CI/CD não são “DevOps extra”.  
São **infraestrutura cognitiva**.

Quando o processo é automático e previsível,  
o time pensa em produto — não em apagar incêndio.
