import { Elysia } from 'elysia'
import * as commonModel from '@/model/common-model'
import { ErrorResponse } from '@/model/common-model'
import * as productModel from '@/model/products-model'
import * as productsService from '@/service/products-service'

export const productsController = new Elysia()
  .post(
    '/products',
    async ({ body }) => {
      const result = await productsService.createProduct(body)
      return result
    },
    {
      body: productModel.createProductSchema,
      response: {
        201: productModel.productSchema,
        500: commonModel.ErrorResponse,
      },
    },
  )
  .get(
    '/products',
    async () => {
      const result = await productsService.listProducts()
      return result
    },
    {
      response: {
        200: productModel.listProductResponseSchema,
        500: ErrorResponse,
      },
    },
  )
