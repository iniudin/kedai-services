import type { PoolClient } from 'pg'
import fs from 'node:fs'
import path from 'node:path'
import { getDB } from '@/lib/database'

const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations')

function getMigrationFiles() {
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter(f => f.endsWith('.sql'))
    .sort()
}

function readMigrationFile(filename: string) {
  return fs.readFileSync(path.join(MIGRATIONS_DIR, filename), 'utf8')
}

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS _migrations (
    id         SERIAL PRIMARY KEY,
    filename   TEXT NOT NULL UNIQUE,
    applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  )
`

async function ensureMigrationsTable(client: PoolClient) {
  await client.query(createTableQuery)
}

async function isMigrationApplied(client: PoolClient, filename: string) {
  const { rowCount } = await client.query('SELECT 1 FROM _migrations WHERE filename = $1', [
    filename,
  ])
  return rowCount && rowCount > 0
}

async function runMigration(client: PoolClient, sql: string) {
  await client.query(sql)
}

async function recordMigration(client: PoolClient, filename: string) {
  await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [filename])
}

export async function migrate() {
  const db = getDB()

  const client = await db.connect()

  try {
    await ensureMigrationsTable(client)
    await client.query('BEGIN')

    for (const filename of getMigrationFiles()) {
      if (await isMigrationApplied(client, filename)) {
        console.log(`Skipping: ${filename}`)
        continue
      }

      console.log(`Applying: ${filename}`)
      await runMigration(client, readMigrationFile(filename))
      await recordMigration(client, filename)
    }

    await client.query('COMMIT')
    console.log('All migrations applied successfully')
  }
  catch (error) {
    await client.query('ROLLBACK')
    console.error('Migration failed, rolling back:', error)
    throw error
  }
  finally {
    client.release()
    await db.end()
  }
}

if (import.meta.main) {
  migrate()
}
