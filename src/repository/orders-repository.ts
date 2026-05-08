import type { DBQueryable } from '@/lib/database'
import type {
  CreateOrderItemAddOnModel,
  CreateOrderItemModel,
  OrderItemAddOnResponse,
  OrderItemResponse,
  OrderModel,
} from '@/model/orders-model'
import { buildInsertManyQuery } from '@/lib/database'

const createOrderQuery = `
INSERT INTO orders (
  total_revenue,
  total_net_profit,
  amount_paid,
  amount_change
)
VALUES ($1, $2, $3, $4)
RETURNING 
  id,
  order_number,
  total_revenue,
  total_net_profit,
  amount_paid,
  amount_change,
  created_at,
  updated_at
`

const listOrdersQuery = `
SELECT
  id,
  order_number,
  total_revenue,
  total_net_profit,
  amount_paid,
  amount_change,
  created_at,
  updated_at
FROM orders
ORDER BY created_at DESC
`

const findOrderByIdQuery = `
SELECT
  id,
  order_number,
  total_revenue,
  total_net_profit,
  amount_paid,
  amount_change,
  created_at,
  updated_at
FROM orders
WHERE id = $1
`

const findOrderItemsByOrderIdQuery = `
SELECT
  id,
  order_id,
  product_id,
  product_name,
  quantity,
  cost_price,
  sell_price
FROM order_items
WHERE order_id = $1
`

const findOrderItemAddOnsByOrderItemIdQuery = `
SELECT
  id,
  order_item_id,
  add_on_id,
  add_on_name,
  cost_price,
  sell_price
FROM order_item_add_ons
WHERE order_item_id = ANY($1::integer[])
`

const updateOrderQuery = `
UPDATE orders
SET
  total_revenue = $2,
  total_net_profit = $3,
  amount_paid = $4,
  amount_change = $5,
  updated_at = NOW()
WHERE id = $1
RETURNING
  id,
  order_number,
  total_revenue,
  total_net_profit,
  amount_paid,
  amount_change,
  created_at,
  updated_at
`

const deleteOrderItemsByOrderIdQuery = `
DELETE FROM order_items WHERE order_id = $1
`

const ORDER_ITEM_COLUMNS = ['order_id', 'product_id', 'product_name', 'quantity', 'cost_price', 'sell_price', 'revenue', 'net_profit'] as const
const ORDER_ITEM_RETURNING = 'RETURNING id, order_id, product_id, quantity, cost_price, sell_price, revenue, net_profit'

const ORDER_ITEM_ADD_ON_COLUMNS = ['order_item_id', 'add_on_id', 'add_on_name', 'cost_price', 'sell_price'] as const
const ORDER_ITEM_ADD_ON_RETURNING = 'RETURNING id, order_item_id, add_on_id, cost_price, sell_price'

export async function createOrder(client: DBQueryable, order: OrderModel) {
  const values = [
    order.totalRevenue,
    order.totalNetProfit,
    order.amountPaid,
    order.amountChange,
  ]

  const { rows } = await client.query(createOrderQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to create order')
  }

  return rows[0]
}

export async function findOrderById(client: DBQueryable, id: number) {
  const { rows } = await client.query(findOrderByIdQuery, [id])

  if (!rows[0]) {
    throw new Error('Order not found')
  }

  return rows[0]
}

export async function updateOrder(client: DBQueryable, id: number, order: OrderModel) {
  const values = [
    id,
    order.totalRevenue,
    order.totalNetProfit,
    order.amountPaid,
    order.amountChange,
  ]

  const { rows } = await client.query(updateOrderQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to update order')
  }

  return rows[0]
}

export async function deleteOrderItemsByOrderId(client: DBQueryable, orderId: number): Promise<void> {
  await client.query(deleteOrderItemsByOrderIdQuery, [orderId])
}

export async function createOrderItems(client: DBQueryable, items: CreateOrderItemModel[]): Promise<OrderItemResponse[]> {
  if (items.length === 0)
    return []

  const query = buildInsertManyQuery('order_items', ORDER_ITEM_COLUMNS, items.length, ORDER_ITEM_RETURNING)

  const values = items.flatMap(item => [
    item.orderId,
    item.productId,
    item.productName,
    item.quantity,
    item.costPrice,
    item.sellPrice,
    item.revenue,
    item.netProfit,
  ])

  const { rows } = await client.query(query, values)

  if (rows.length === 0) {
    throw new Error('Failed to create order items')
  }

  return rows
}

export async function createOrderItemAddOns(client: DBQueryable, addOns: CreateOrderItemAddOnModel[]): Promise<OrderItemAddOnResponse[]> {
  if (addOns.length === 0)
    return []

  const query = buildInsertManyQuery('order_item_add_ons', ORDER_ITEM_ADD_ON_COLUMNS, addOns.length, ORDER_ITEM_ADD_ON_RETURNING)

  const values = addOns.flatMap(addOn => [
    addOn.orderItemId,
    addOn.addOnId,
    addOn.addOnName,
    addOn.costPrice,
    addOn.sellPrice,
  ])

  const { rows } = await client.query(query, values)

  if (rows.length === 0) {
    throw new Error('Failed to create order item add-ons')
  }

  return rows
}

export async function listOrders(client: DBQueryable) {
  const { rows } = await client.query(listOrdersQuery)

  if (rows.length === 0) {
    return []
  }

  return rows
}

export async function findOrderItemsByOrderId(
  client: DBQueryable,
  orderId: number,
) {
  const { rows } = await client.query(findOrderItemsByOrderIdQuery, [orderId])

  if (rows.length === 0) {
    return []
  }

  return rows
}

export async function findOrderItemAddOnsByOrderItemIds(
  client: DBQueryable,
  orderItemIds: number[],
) {
  if (orderItemIds.length === 0) {
    return []
  }

  const { rows } = await client.query(findOrderItemAddOnsByOrderItemIdQuery, [orderItemIds])

  if (rows.length === 0) {
    return []
  }

  return rows
}
