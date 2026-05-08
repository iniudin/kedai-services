import { fromTypes, openapi } from '@elysia/openapi'
import { Elysia } from 'elysia'
import { addOnsController } from './controller/add-ons-controller'
import { ordersController } from './controller/orders-controller'
import { productsController } from './controller/products-controller'
import { reportsController } from './controller/reports-controller'

export const app = new Elysia()
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
  .use(reportsController)
