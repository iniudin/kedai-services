import type { ToModel } from './common-model'
import { t } from 'elysia'

const orderItemInputSchema = t.Object({
  productId: t.Number(),
  quantity: t.Number(),
  addOnIds: t.Optional(t.Array(t.Number())),
})

export const createOrderSchema = t.Object({
  items: t.Array(orderItemInputSchema),
  amountPaid: t.Number(),
})

export const updateOrderSchema = t.Object({
  items: t.Optional(t.Array(orderItemInputSchema)),
  amountPaid: t.Optional(t.Number()),
})

export const orderItemAddOnSchema = t.Object({
  id: t.Number(),
  orderItemId: t.Number(),
  addOnId: t.Number(),
  addOnName: t.String(),
  costPrice: t.Number(),
  sellPrice: t.Number(),
})

export const orderItemSchema = t.Object({
  id: t.Number(),
  orderId: t.Number(),
  productId: t.Number(),
  productName: t.String(),
  addOns: t.Array(orderItemAddOnSchema),
  quantity: t.Number(),
  costPrice: t.Number(),
  sellPrice: t.Number(),
  revenue: t.Number(),
  netProfit: t.Number(),
})

export const orderWithItemsSchema = t.Object({
  id: t.Number(),
  orderNumber: t.String(),
  totalRevenue: t.Number(),
  totalNetProfit: t.Number(),
  amountPaid: t.Number(),
  amountChange: t.Number(),
  items: t.Array(orderItemSchema),
  createdAt: t.Date(),
  updatedAt: t.Date(),
})

export const orderSchema = t.Omit(orderWithItemsSchema, ['items'])

export const listOrderResponseSchema = t.Array(orderSchema)

export type CreateOrderRequest = ToModel<typeof createOrderSchema>
export type UpdateOrderRequest = ToModel<typeof updateOrderSchema>
export type OrderItemResponse = ToModel<typeof orderItemSchema>
export type OrderItemAddOnResponse = ToModel<typeof orderItemAddOnSchema>
export type OrderWithItemsResponse = ToModel<typeof orderWithItemsSchema>
export type OrderResponse = ToModel<typeof orderSchema>
export type ListOrderResponse = ToModel<typeof listOrderResponseSchema>

export interface OrderModel {
  totalRevenue: number
  totalNetProfit: number
  amountPaid: number
  amountChange: number
}

export interface CreateOrderItemModel {
  orderId: number
  productId: number
  productName: string
  quantity: number
  costPrice: number
  sellPrice: number
  revenue: number
  netProfit: number
}

export interface CreateOrderItemAddOnModel {
  orderItemId: number
  addOnId: number
  addOnName: string
  costPrice: number
  sellPrice: number
}

export function mapOrderFromDB(
  order: any,
): OrderResponse {
  return {
    id: order.id,
    orderNumber: order.order_number,
    totalRevenue: Number(order.total_revenue),
    totalNetProfit: Number(order.total_net_profit),
    amountPaid: Number(order.amount_paid),
    amountChange: Number(order.amount_change),
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.updated_at),
  }
}

export function mapOrderWithItemsFromDB(
  order: any,
  items: any[],
  addOns: any[],
): OrderWithItemsResponse {
  return {
    id: order.id,
    orderNumber: order.order_number,
    totalRevenue: Number(order.total_revenue),
    totalNetProfit: Number(order.total_net_profit),
    amountPaid: Number(order.amount_paid),
    amountChange: Number(order.amount_change),
    items: items.map((item) => {
      const itemAddOns = addOns.filter(addOn => (addOn.order_item_id) === item.id)

      const addOnRevenue = itemAddOns.reduce((sum, a) => sum + Number(a.sell_price) * item.quantity, 0)
      const addOnProfit = itemAddOns.reduce((sum, a) => sum + (Number(a.sell_price) - Number(a.cost_price)) * item.quantity, 0)

      const itemRevenue = (item.quantity * Number(item.sell_price)) + addOnRevenue
      const itemNetProfit = (item.quantity * (Number(item.sell_price) - Number(item.cost_price))) + addOnProfit

      return {
        id: item.id,
        orderId: item.order_id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        costPrice: Number(item.cost_price),
        sellPrice: Number(item.sell_price),
        revenue: itemRevenue,
        netProfit: itemNetProfit,
        addOns: itemAddOns.map(addOn => ({
          id: addOn.id,
          orderItemId: addOn.order_item_id,
          addOnId: addOn.add_on_id,
          addOnName: addOn.add_on_name,
          costPrice: Number(addOn.cost_price),
          sellPrice: Number(addOn.sell_price),
        })),
      }
    }),
    createdAt: new Date(order.created_at),
    updatedAt: new Date(order.updated_at),
  }
}
