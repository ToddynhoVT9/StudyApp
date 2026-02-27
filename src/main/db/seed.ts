// src/main/db/seed.ts
// Popula o banco com os 8 blocos do currículo Fullstack Robusto na primeira execução.
import db from './database'

// ─── Dados do currículo (de PlanosDeEstudos/roadmap.md) ──────────
const BLOCKS = [
  {
    id: 1,
    title: 'Fundamentos da Web + Linguagem',
    order_index: 1,
    duration: '8–12 semanas',
    description: 'HTML/CSS, JavaScript e TypeScript — a base de tudo.',
    points: [
      { title: 'HTML & CSS',   order_index: 1, weeks: '01–04' },
      { title: 'JavaScript',   order_index: 2, weeks: '05–08' },
      { title: 'TypeScript',   order_index: 3, weeks: '09–12' },
    ],
  },
  {
    id: 2,
    title: 'Runtime e Backend Essencial',
    order_index: 2,
    duration: '8–10 semanas',
    description: 'Node.js como runtime, HTTP/REST e NestJS.',
    points: [
      { title: 'Node.js Runtime', order_index: 1, weeks: '13–15' },
      { title: 'HTTP e REST',     order_index: 2, weeks: '16–18' },
      { title: 'NestJS',          order_index: 3, weeks: '19–22' },
    ],
  },
  {
    id: 3,
    title: 'Frontend Moderno',
    order_index: 3,
    duration: '8–10 semanas',
    description: 'React, Next.js e estilização avançada.',
    points: [
      { title: 'React',              order_index: 1, weeks: '23–26' },
      { title: 'Next.js',            order_index: 2, weeks: '27–28' },
      { title: 'Estilização e libs', order_index: 3, weeks: '29–30' },
    ],
  },
  {
    id: 4,
    title: 'Dados e Persistência',
    order_index: 4,
    duration: '4–6 semanas',
    description: 'Modelagem relacional, SQL/PostgreSQL e migrations com ORM.',
    points: [
      { title: 'Modelagem relacional', order_index: 1, weeks: '31–32' },
      { title: 'SQL e PostgreSQL',     order_index: 2, weeks: '33–34' },
      { title: 'Migrations e ORM',     order_index: 3, weeks: '35–36' },
    ],
  },
  {
    id: 5,
    title: 'Identidade, Segurança e Limites',
    order_index: 5,
    duration: '4–6 semanas',
    description: 'Autenticação, autorização, proteção de APIs e RBAC.',
    points: [
      { title: 'Autenticação e Autorização', order_index: 1, weeks: '37–38' },
      { title: 'Segurança Aplicada',         order_index: 2, weeks: '39–40' },
      { title: 'RBAC e limites avançados',   order_index: 3, weeks: '41–42' },
    ],
  },
  {
    id: 6,
    title: 'Qualidade e Confiança em Produção',
    order_index: 6,
    duration: '4–6 semanas',
    description: 'Testes automatizados, qualidade de código e observabilidade.',
    points: [
      { title: 'Testes automatizados', order_index: 1, weeks: '43–44' },
      { title: 'Qualidade de código',  order_index: 2, weeks: '45' },
      { title: 'Observabilidade',      order_index: 3, weeks: '46–47' },
    ],
  },
  {
    id: 7,
    title: 'Empacotamento e Entrega',
    order_index: 7,
    duration: '4–6 semanas',
    description: 'Docker, CI/CD e Kubernetes para entrega contínua.',
    points: [
      { title: 'Containerização (Docker)',       order_index: 1, weeks: '48–49' },
      { title: 'Integração Contínua (CI)',       order_index: 2, weeks: '50' },
      { title: 'Entrega Contínua e Kubernetes', order_index: 3, weeks: '51–53' },
      { title: 'Fluxo de produção',              order_index: 4, weeks: '54' },
    ],
  },
  {
    id: 8,
    title: 'Borda, Escala e Operação',
    order_index: 8,
    duration: '4–6 semanas',
    description: 'CDN/WAF, escalabilidade horizontal, operação e confiabilidade.',
    points: [
      { title: 'CDN e WAF',                 order_index: 1, weeks: '55' },
      { title: 'Escala e auto-scaling',     order_index: 2, weeks: '56–57' },
      { title: 'Operação e confiabilidade', order_index: 3, weeks: '58–59' },
      { title: 'Projeto integrador',        order_index: 4, weeks: '60' },
    ],
  },
]

export function runSeed(): void {
  // Idempotente: não insere se já houver dados
  const { c } = db.prepare('SELECT COUNT(*) as c FROM blocks').get() as { c: number }
  if (c > 0) return

  const insertBlock = db.prepare(
    `INSERT INTO blocks(id, title, order_index, duration, description)
     VALUES(?, ?, ?, ?, ?)`,
  )
  const insertPoint = db.prepare(
    `INSERT INTO roadmap_points(block_id, title, order_index, weeks)
     VALUES(?, ?, ?, ?)`,
  )

  const seedAll = db.transaction(() => {
    for (const block of BLOCKS) {
      insertBlock.run(
        block.id,
        block.title,
        block.order_index,
        block.duration,
        block.description,
      )
      for (const pt of block.points) {
        insertPoint.run(block.id, pt.title, pt.order_index, pt.weeks)
      }
    }
  })

  seedAll()
  console.log('[Seed] 8 blocos e', BLOCKS.flatMap(b => b.points).length, 'pontos inseridos.')
}
