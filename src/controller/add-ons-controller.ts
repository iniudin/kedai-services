import { Elysia, t } from 'elysia'
import * as addOnsModel from '@/model/add-ons-model'
import * as commonModel from '@/model/common-model'
import { ErrorResponse } from '@/model/common-model'
import * as addOnsService from '@/service/add-ons-service'

export const addOnsController = new Elysia()
  .post(
    '/add-ons',
    async ({ body }) => {
      const result = await addOnsService.createAddOn(body)
      return result
    },
    {
      body: addOnsModel.createAddOnSchema,
      response: {
        201: addOnsModel.addOnSchema,
        500: commonModel.ErrorResponse,
      },
    },
  )
  .get(
    '/add-ons',
    async () => {
      const result = await addOnsService.listAddOns()
      return result
    },
    {
      response: {
        200: addOnsModel.listAddOnResponseSchema,
        500: ErrorResponse,
      },
    },
  )
  .get(
    '/add-ons/:id',
    async ({ params: { id } }) => {
      const result = await addOnsService.findAddOnById(id)
      return result
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      response: {
        200: addOnsModel.addOnSchema,
        500: commonModel.ErrorResponse,
      },
    },
  )
  .put(
    '/add-ons/:id',
    async ({ params: { id }, body }) => {
      const result = await addOnsService.updateAddOn(id, body)
      return result
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      body: addOnsModel.updateAddOnSchema,
      response: {
        200: addOnsModel.addOnSchema,
        500: commonModel.ErrorResponse,
      },
    },
  )
  .delete(
    '/add-ons/:id',
    async ({ params: { id } }) => {
      const result = await addOnsService.deleteAddOn(id)
      return result
    },
    {
      params: t.Object({
        id: t.Numeric(),
      }),
      response: {
        200: addOnsModel.addOnSchema,
        500: commonModel.ErrorResponse,
      },
    },
  )
