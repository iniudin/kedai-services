import { Elysia, t } from 'elysia'
import * as commonModel from '@/model/common-model'
import * as orderModel from '@/model/orders-model'
import * as ordersService from '@/service/orders-service'

export const ordersController = new Elysia({ prefix: '/orders' })
  .post('', async ({ body, status }) => {
    const result = await ordersService.createOrder(body)
    return status(201, result)
  }, {
    body: orderModel.createOrderSchema,
    response: {
      201: orderModel.orderSchema,
      500: commonModel.errorResponseSchema,
    },
  })
  .put(':id', async ({ params: { id }, body }) => {
    const result = await ordersService.updateOrder(id, body)
    return result
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: orderModel.updateOrderSchema,
    response: {
      200: orderModel.orderSchema,
      500: commonModel.errorResponseSchema,
    },
  })
  .get('', async () => {
    const result = await ordersService.listOrders()
    return result
  }, {
    response: {
      200: orderModel.listOrderResponseSchema,
      500: commonModel.errorResponseSchema,
    },
  })
  .get(':id', async ({ params: { id } }) => {
    const result = await ordersService.findOrderById(id)
    return result
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    response: {
      200: orderModel.orderWithItemsSchema,
      500: commonModel.errorResponseSchema,
    },
  })
