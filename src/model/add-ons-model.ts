import type { ToModel } from './common-model'
import { t } from 'elysia'

export enum AddOnType {
  TOPPING = 'topping',
  SIZE = 'size',
}

export const createAddOnSchema = t.Object({
  name: t.String(),
  costPrice: t.Number(),
  sellPrice: t.Number(),
  type: t.Enum(AddOnType),
})

export const updateAddOnSchema = t.Object({
  name: t.Optional(t.String()),
  costPrice: t.Optional(t.Number()),
  sellPrice: t.Optional(t.Number()),
  type: t.Optional(t.Enum(AddOnType)),
})

export const addOnSchema = t.Object({
  id: t.Number(),
  name: t.String(),
  costPrice: t.Number(),
  sellPrice: t.Number(),
  type: t.Enum(AddOnType),
  isActive: t.Boolean(),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

export const listAddOnResponseSchema = t.Array(addOnSchema)

export type CreateAddOnRequest = ToModel<typeof createAddOnSchema>
export type UpdateAddOnRequest = ToModel<typeof updateAddOnSchema>
export type AddOnResponse = ToModel<typeof addOnSchema>
export type ListAddOnResponse = ToModel<typeof listAddOnResponseSchema>

export function mapAddOnFromDB(row: any): AddOnResponse {
  return {
    id: row.id,
    name: row.name,
    costPrice: Number(row.cost_price),
    sellPrice: Number(row.sell_price),
    type: row.type,
    isActive: row.is_active,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}
