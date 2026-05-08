import { Elysia, t } from 'elysia'
import * as commonModel from '@/model/common-model'
import * as productModel from '@/model/products-model'
import * as productsService from '@/service/products-service'

export const productsController = new Elysia({ prefix: '/products' })
  .post('', async ({ body, status }) => {
    const result = await productsService.createProduct(body)
    return status(201, result)
  }, {
    body: productModel.createProductSchema,
    response: {
      201: productModel.productSchema,
      500: commonModel.errorResponseSchema,
    },
  })
  .get('', async () => {
    const result = await productsService.listProducts()
    return result
  }, {
    response: {
      200: productModel.listProductResponseSchema,
      500: commonModel.errorResponseSchema,
    },
  })
  .get(':id', async ({ params: { id } }) => {
    const result = await productsService.findProductById(id)
    return result
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    response: {
      200: productModel.productSchema,
      500: commonModel.errorResponseSchema,
    },
  })
  .put(':id', async ({ params: { id }, body }) => {
    const result = await productsService.updateProduct(id, body)
    return result
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    body: productModel.updateProductSchema,
    response: {
      200: productModel.productSchema,
      500: commonModel.errorResponseSchema,
    },
  })
  .delete(':id', async ({ params: { id } }) => {
    const result = await productsService.deleteProduct(id)
    return result
  }, {
    params: t.Object({
      id: t.Numeric(),
    }),
    response: {
      200: productModel.productSchema,
      500: commonModel.errorResponseSchema,
    },
  })
