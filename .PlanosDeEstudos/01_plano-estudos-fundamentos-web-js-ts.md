# Plano de Estudos — Fundamentos da Web + Linguagem

Este plano cobre o **primeiro eixo de formação** de um profissional fullstack robusto:  
compreender como a Web funciona e dominar a linguagem base antes de qualquer framework.

O objetivo **não** é virar especialista em tudo, mas construir **intuição técnica sólida**.

---

## Visão Geral do Bloco

- Duração sugerida: **8 a 12 semanas**
- Foco: compreensão, não velocidade
- Regra de ouro: **nada de frameworks neste estágio**

---

## Etapa 1 — HTML + CSS (Fundamentos Funcionais)

### Objetivo
Entender como o navegador interpreta, organiza e renderiza conteúdo.

### HTML — O que estudar
- Estrutura básica do documento (`doctype`, `html`, `head`, `body`)
- Semântica (`header`, `main`, `section`, `article`, `nav`, `footer`)
- Hierarquia e aninhamento
- Formulários e inputs
- Atributos importantes (`id`, `class`, `data-*`, `aria-*`)

### CSS — O que estudar
- Box model (margin, border, padding, content)
- Display (`block`, `inline`, `inline-block`, `none`)
- Flexbox (eixo principal e cruzado)
- Grid (linhas, colunas, áreas)
- Posicionamento (`relative`, `absolute`, `fixed`, `sticky`)
- Responsividade (media queries)
- Cascade, especificidade e herança

### Resultado esperado
- Ler um HTML/CSS e **entender por que ele se comporta daquele jeito**
- Criar layouts simples sem “tentativa e erro”

---

## Etapa 2 — JavaScript (Base Sólida)

### Objetivo
Construir intuição sobre **como o JavaScript realmente funciona**.

### Fundamentos essenciais
- Tipos primitivos e objetos
- Variáveis (`let`, `const`)
- Funções e arrow functions
- Escopo léxico
- Closures
- `this` (conceito, não decoreba)

### JavaScript Assíncrono
- Callbacks
- Promises
- `async / await`
- Tratamento de erros (`try/catch`)
- Event loop (conceito)

### Estruturação
- Módulos (`import` / `export`)
- Organização de arquivos
- Código legível e previsível

### Resultado esperado
- Entender **por que** algo é assíncrono
- Ler código JS sem achar que é “mágica”

---

## Etapa 3 — TypeScript (Disciplina e Contratos)

### Objetivo
Usar tipos para **reduzir ambiguidade e erro**, não para complicar.

### Fundamentos
- Tipos primitivos
- `any` vs `unknown`
- Inferência de tipos
- Interfaces e tipos (`interface` vs `type`)
- Tipos opcionais e readonly

### Conceitos-chave
- Union e intersection types
- Narrowing (type guards)
- Generics (uso prático, não teoria pesada)
- Tipagem de funções

### Mentalidade
- Tipos como **contratos**
- Código mais explícito > código “esperto”

### Resultado esperado
- Escrever código JS melhor **mesmo quando estiver sem TS**
- Antecipar erros antes de rodar o programa

---

## Critérios de Conclusão do Bloco

Você pode avançar quando for capaz de:
- Explicar como um navegador renderiza uma página
- Explicar o fluxo de execução de um código JS
- Usar TypeScript para deixar o código mais claro, não mais verboso
- Ler código alheio sem se sentir perdido

---

## Observação Final

Este bloco é **fundação estrutural**.  
Tudo que vem depois (React, Node, Nest, Docker) depende diretamente dele.

Pular esta etapa não acelera o aprendizado — **cobra juros depois**.
