// src/main/db/database.ts
// Singleton do banco SQLite — aberto uma vez e reutilizado em toda a app.
import Database from 'better-sqlite3'
import { app } from 'electron'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

// Em produção: %APPDATA%/StudyApp/studyapp.db
// Em dev: mesma pasta, para facilitar inspeção
const dbPath = path.join(app.getPath('userData'), 'studyapp.db')

// schema.sql fica na mesma pasta compilada
const schemaPath = path.join(__dirname, 'schema.sql')

const db = new Database(dbPath)

// Aplica o schema (idempotente — usa CREATE TABLE IF NOT EXISTS)
db.exec(fs.readFileSync(schemaPath, 'utf8'))

export default db
