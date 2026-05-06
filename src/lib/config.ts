import process from 'node:process'

export interface AppConfig {
  database: {
    host: string
    port: number
    database: string
    user: string
    password?: string
  }
  server: {
    port: number
  }
}

function getEnv(key: string, required = true): string {
  const value = process.env[key]
  if (required && !value) {
    throw new Error(`Configuration Error: Environment variable ${key} is missing`)
  }
  return value ?? ''
}

function getConfig(): AppConfig {
  return {
    database: {
      host: getEnv('DATABASE_HOST'),
      port: Number(getEnv('DATABASE_PORT')),
      database: getEnv('DATABASE_NAME'),
      user: getEnv('DATABASE_USER'),
      password: getEnv('DATABASE_PASSWORD', false),
    },
    server: {
      port: Number(getEnv('PORT')),
    },
  }
}

const config = getConfig()

export { config }
