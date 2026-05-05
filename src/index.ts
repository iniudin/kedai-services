import console from 'node:console'
import process from 'node:process'
import { fromTypes, openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'

const app = new Elysia()
  .use(
    openapi({
      references: fromTypes(),
    }),
  )
  .get('/', () => 'Hello World')
  .listen(process.env.PORT!)

console.log(`🦊 Kedai POS is running at ${app.server?.hostname}:${app.server?.port}`)
