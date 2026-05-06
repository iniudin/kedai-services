import type { QueryResult, QueryResultRow } from 'pg'
import { Pool } from 'pg'
import { config } from '@/lib/config'

export interface DBQueryable {
  query: <R extends QueryResultRow = any, I extends any[] = any[]>(
    queryText: string,
    values?: I,
  ) => Promise<QueryResult<R>>
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
