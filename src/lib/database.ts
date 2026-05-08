import type { QueryResult, QueryResultRow } from 'pg'
import { Pool } from 'pg'
import { config } from '@/lib/config'

export interface DBQueryable {
  query: <R extends QueryResultRow = any, I extends any[] = any[]>(
    queryText: string,
    values?: I,
  ) => Promise<QueryResult<R>>
}

export function buildInsertManyQuery(
  table: string,
  columns: readonly string[],
  rowCount: number,
  returning: string,
): string {
  const colCount = columns.length
  const valueRows: string[] = []

  for (let i = 0; i < rowCount; i++) {
    const placeholders = columns.map((_, j) => `$${i * colCount + j + 1}`)
    valueRows.push(`(${placeholders.join(', ')})`)
  }

  return `INSERT INTO ${table} (${columns.join(', ')}) VALUES ${valueRows.join(', ')} ${returning}`
}

export function getDB() {
  return new Pool({
    user: config.database.user,
    host: config.database.host,
    database: config.database.database,
    password: config.database.password,
    port: config.database.port,
  })
}
