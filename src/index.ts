import console from 'node:console'
import { fromTypes, openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { config } from '@/lib/config'
import { addOnsController } from './controller/add-ons-controller'
import { ordersController } from './controller/orders-controller'
import { productsController } from './controller/products-controller'

const app = new Elysia()
  .use(
    openapi({
      documentation: {
        info: {
          title: 'Kedai POS API',
          version: '1.0.0',
        },
      },
      references: fromTypes(),
    }),
  )
  .get('/', () => 'Hello World')
  .use(productsController)
  .use(addOnsController)
  .use(ordersController)
  .listen(config.server.port)

console.log(`🦊 Kedai POS is running at ${app.server?.hostname}:${app.server?.port}`)
