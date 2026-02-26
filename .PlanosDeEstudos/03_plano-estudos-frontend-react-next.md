# Plano de Estudos — Frontend Moderno com Cabeça Fria (React + Next.js)

Este plano cobre o **terceiro eixo de formação** de um profissional fullstack robusto:  
construir interfaces modernas entendendo **estado, composição e renderização**,  
sem cair na armadilha de dependência excessiva de bibliotecas.

Aqui o frontend deixa de ser “tela bonita” e passa a ser **parte estrutural do sistema**.

---

## Visão Geral do Bloco

- Duração sugerida: **8 a 10 semanas**
- Pré-requisitos:
  - Fundamentos da Web (HTML/CSS)
  - JavaScript e TypeScript
  - Noções básicas de HTTP
- Regra de ouro: **framework não substitui modelo mental**

---

## Etapa 7 — React (Conceitos Fundamentais)

### Objetivo
Entender React como um **modelo de composição de UI**, não como uma coleção de hooks.

### O que estudar
- O que é um componente
- JSX como sintaxe (não como HTML)
- Props (entrada de dados)
- Estado (`useState`)
- Efeitos (`useEffect`) — quando usar e quando evitar
- Renderização e re-renderização
- Fluxo de dados unidirecional
- Composição de componentes
- Keys e listas
- Condicionais na renderização

### Conceitos-chave
- UI como função do estado
- Componentes pequenos e previsíveis
- Separação entre lógica e apresentação

### O que evitar
- “Hook para tudo”
- Estado global prematuro
- Lógica complexa dentro do JSX

### Exercícios sugeridos
- Criar componentes reutilizáveis
- Quebrar uma tela grande em componentes menores
- Simular estados de loading, erro e sucesso
- Refatorar componentes grandes em composição

### Resultado esperado
- Ler componentes React e entender seu comportamento
- Escrever UI previsível e fácil de modificar
- Parar de “brigar” com re-renderizações

---

## Etapa 8 — Estado, Efeitos e Ciclo de Vida

### Objetivo
Dominar **quando e por que** o React atualiza a interface.

### O que estudar
- Ciclo de renderização
- Dependências do `useEffect`
- Derived state vs state real
- Controlled vs uncontrolled components
- Comunicação entre componentes (props drilling consciente)

### Conceitos-chave
- Nem todo dado precisa ser estado
- Efeitos são reações, não gatilhos arbitrários
- Menos estado = menos bugs

### Exercícios sugeridos
- Implementar formulários controlados
- Depurar loops de renderização
- Eliminar estados redundantes

### Resultado esperado
- Diagnosticar bugs comuns de estado
- Usar efeitos com intenção clara

---

## Etapa 9 — Next.js (Frontend que conversa com Backend)

### Objetivo
Entender como **frontend e backend começam a se misturar** no mundo real.

### O que estudar
- Estrutura de projeto Next
- Sistema de rotas
- Layouts e templates
- Server Components (conceito)
- Client Components (quando usar)
- Data fetching
- SSR, SSG e ISR (conceitos e trade-offs)
- Variáveis de ambiente
- Assets estáticos

### Conceitos-chave
- Renderização no servidor vs cliente
- Performance como decisão arquitetural
- Fronteira clara entre código server e client

### O que evitar
- Transformar tudo em client component
- Reimplementar backend dentro do frontend
- Fetching duplicado e desnecessário

### Exercícios sugeridos
- Criar páginas estáticas e dinâmicas
- Implementar loading e error states
- Consumir uma API backend real
- Comparar SSR vs SSG em casos simples

### Resultado esperado
- Escolher conscientemente o tipo de renderização
- Entender o custo de cada decisão
- Construir apps Next organizados

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Explicar como o React renderiza e atualiza UI
- Estruturar componentes de forma limpa
- Escolher entre client e server rendering no Next
- Integrar frontend com backend sem acoplamento caótico

---

## Observação Final

Frontend moderno não é sobre quantidade de bibliotecas.  
É sobre **clareza mental, composição e controle de complexidade**.

Quem domina esses fundamentos consegue:
- aprender qualquer framework futuro
- debugar UI complexa
- escalar produto sem refatoração constante
