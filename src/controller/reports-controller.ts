import { Elysia, t } from 'elysia'
import * as commonModel from '@/model/common-model'
import * as reportsModel from '@/model/reports-model'
import { DateGroupingType } from '@/repository/reports-repository'
import * as reportsService from '@/service/reports-service'

export const reportsController = new Elysia({ prefix: '/reports' })
  .get('/sales', async ({ query: { grouping } }) => {
    return await reportsService.getDashboardReport(grouping as DateGroupingType)
  }, {
    query: t.Object({
      grouping: t.Enum(DateGroupingType),
    }),
    response: {
      200: t.Object({
        revenue: t.Number(),
        profit: t.Number(),
      }),
      500: commonModel.errorResponseSchema,
    },
  })
  .get('/ranks', async ({ query: { startDate, endDate } }) => {
    return await reportsService.getCustomRangeReport(startDate, endDate)
  }, {
    query: reportsModel.reportTimeRangeSchema,
    response: {
      200: t.Object({
        lowProducts: reportsModel.lowProductSalesResponseSchema,
        highProducts: reportsModel.highProductSalesResponseSchema,
      }),
      500: commonModel.errorResponseSchema,
    },
  })
