import type { ToModel } from './common-model'
import { t } from 'elysia'

export const createProductSchema = t.Object({
  name: t.String(),
  costPrice: t.Number(),
  sellPrice: t.Number(),
})

export const updateProductSchema = t.Object({
  name: t.Optional(t.String()),
  costPrice: t.Optional(t.Number()),
  sellPrice: t.Optional(t.Number()),
})

export const productSchema = t.Object({
  id: t.Number(),
  sku: t.String(),
  name: t.String(),
  costPrice: t.Number(),
  sellPrice: t.Number(),
  isActive: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

export const listProductResponseSchema = t.Array(productSchema)

export type CreateProductRequest = ToModel<typeof createProductSchema>
export type UpdateProductRequest = ToModel<typeof updateProductSchema>
export type ProductResponse = ToModel<typeof productSchema>
export type ListProductsResponse = ToModel<typeof listProductResponseSchema>

export function mapProductFromDB(row: any): ProductResponse {
  return {
    id: row.id,
    sku: row.sku,
    name: row.name,
    costPrice: Number(row.cost_price),
    sellPrice: Number(row.sell_price),
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
