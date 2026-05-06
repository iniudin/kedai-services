import type { ToModel } from './common-model'
import { t } from 'elysia'

export const createProductSchema = t.Object({
  name: t.String(),
  price: t.Number(),
})

export const updateProductSchema = t.Object({
  name: t.Optional(t.String()),
  price: t.Optional(t.Number()),
  isActive: t.Optional(t.Boolean()),
})

export const productSchema = t.Object({
  id: t.Number(),
  sku: t.String(),
  name: t.String(),
  price: t.Number(),
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
    price: Number(row.price),
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
