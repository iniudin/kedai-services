import console from 'node:console'
import { fromTypes, openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { config } from '@/lib/config'
import { productsController } from './controller/products-controller'

const app = new Elysia()
  .use(
    openapi({
      references: fromTypes(),
    }),
  )
  .get('/', () => 'Hello World')
  .use(productsController)
  .listen(config.server.port)

console.log(`🦊 Kedai POS is running at ${app.server?.hostname}:${app.server?.port}`)
