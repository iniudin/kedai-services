import { t } from 'elysia'

export const reportTimeRangeSchema = t.Object({
  startDate: t.String({ format: 'date' }),
  endDate: t.String({ format: 'date' }),
})

const productSalesSchema = t.Object({
  name: t.String(),
  quantity: t.Number(),
  revenue: t.Number(),
  netProfit: t.Number(),
})

export const lowProductSalesResponseSchema = t.Array(productSalesSchema)
export const highProductSalesResponseSchema = t.Array(productSalesSchema)
