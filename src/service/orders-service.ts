import type { CreateOrderRequest, ListOrderResponse, OrderResponse, OrderWithItemsResponse, UpdateOrderRequest } from '@/model/orders-model'
import { getDB } from '@/lib/database'
import { mapOrderFromDB, mapOrderWithItemsFromDB } from '@/model/orders-model'
import { findAddOnsByIds } from '@/repository/add-ons-repository'
import * as ordersRepository from '@/repository/orders-repository'
import { findProductsByIds } from '@/repository/products-repository'

async function resolveOrderItems(
  db: ReturnType<typeof getDB>,
  items: CreateOrderRequest['items'],
) {
  const productIds = [...new Set(items.map(item => item.productId))]
  const addOnIds = [...new Set(items.flatMap(item => item.addOnIds || []))]

  const [products, addOns] = await Promise.all([
    findProductsByIds(db, productIds),
    findAddOnsByIds(db, addOnIds),
  ])

  const productMap = new Map(products.map(p => [p.id, p]))
  const addOnMap = new Map(addOns.map(a => [a.id, a]))

  let totalSellPrice = 0
  let totalCostPrice = 0

  for (const item of items) {
    const p = productMap.get(item.productId)
    if (!p)
      throw new Error(`Product ${item.productId} not found`)

    totalSellPrice += Number(p.sellPrice) * item.quantity
    totalCostPrice += Number(p.costPrice) * item.quantity

    for (const aId of (item.addOnIds || [])) {
      const a = addOnMap.get(aId)
      if (!a)
        throw new Error(`Add-on ${aId} not found`)

      totalSellPrice += Number(a.sellPrice) * item.quantity
      totalCostPrice += Number(a.costPrice) * item.quantity
    }
  }

  return { productMap, addOnMap, totalSellPrice, totalCostPrice }
}

export async function createOrder(request: CreateOrderRequest): Promise<OrderResponse> {
  const db = getDB()

  const {
    productMap,
    addOnMap,
    totalSellPrice,
    totalCostPrice,
  } = await resolveOrderItems(db, request.items)

  if (request.amountPaid < totalSellPrice) {
    throw new Error(`Not enough money! Total: ${totalSellPrice}, Paid: ${request.amountPaid}`)
  }

  const totalNetProfit = totalSellPrice - totalCostPrice
  const amountChange = request.amountPaid - totalSellPrice

  try {
    await db.query('BEGIN')

    const order = await ordersRepository.createOrder(db, {
      totalRevenue: totalSellPrice,
      totalNetProfit,
      amountPaid: request.amountPaid,
      amountChange,
    })

    const orderItems = await ordersRepository.createOrderItems(db, request.items.map((item) => {
      const p = productMap.get(item.productId)!
      const addOnIds = item.addOnIds || []

      const addOnRevenue = addOnIds.reduce((sum, aId) => sum + Number(addOnMap.get(aId)!.sellPrice), 0)
      const addOnNetProfit = addOnIds.reduce((sum, aId) => {
        const a = addOnMap.get(aId)!
        return sum + (Number(a.sellPrice) - Number(a.costPrice))
      }, 0)

      return {
        orderId: order.id,
        productId: item.productId,
        productName: p.name,
        quantity: item.quantity,
        costPrice: Number(p.costPrice),
        sellPrice: Number(p.sellPrice),
        revenue: (Number(p.sellPrice) + addOnRevenue) * item.quantity,
        netProfit: ((Number(p.sellPrice) - Number(p.costPrice)) + addOnNetProfit) * item.quantity,
      }
    }))

    await ordersRepository.createOrderItemAddOns(db, request.items.flatMap((item, index) => {
      return (item.addOnIds || []).map((addOnId) => {
        const a = addOnMap.get(addOnId)!
        return {
          orderItemId: orderItems[index].id,
          addOnId,
          addOnName: a.name,
          costPrice: Number(a.costPrice),
          sellPrice: Number(a.sellPrice),
        }
      })
    }))

    await db.query('COMMIT')

    return mapOrderFromDB(order)
  }
  catch (error) {
    await db.query('ROLLBACK')
    throw error
  }
}

export async function updateOrder(id: number, request: UpdateOrderRequest): Promise<OrderResponse> {
  const db = getDB()

  const existingOrder = await ordersRepository.findOrderById(db, id)

  let totalRevenue = Number(existingOrder.total_revenue)
  let totalNetProfit = Number(existingOrder.total_net_profit)
  const amountPaid = request.amountPaid ?? Number(existingOrder.amount_paid)

  try {
    await db.query('BEGIN')

    if (request.items && request.items.length > 0) {
      const {
        productMap,
        addOnMap,
        totalSellPrice,
        totalCostPrice,
      } = await resolveOrderItems(db, request.items)

      totalRevenue = totalSellPrice
      totalNetProfit = totalSellPrice - totalCostPrice

      if (amountPaid < totalRevenue) {
        throw new Error(`Not enough money! Total: ${totalRevenue}, Paid: ${amountPaid}`)
      }

      await ordersRepository.deleteOrderItemsByOrderId(db, id)

      const orderItems = await ordersRepository.createOrderItems(db, request.items.map((item) => {
        const p = productMap.get(item.productId)!
        const addOnIds = item.addOnIds || []

        const addOnRevenue = addOnIds.reduce((sum, aId) => sum + Number(addOnMap.get(aId)!.sellPrice), 0)
        const addOnNetProfit = addOnIds.reduce((sum, aId) => {
          const a = addOnMap.get(aId)!
          return sum + (Number(a.sellPrice) - Number(a.costPrice))
        }, 0)

        return {
          orderId: id,
          productId: item.productId,
          productName: p.name,
          quantity: item.quantity,
          costPrice: Number(p.costPrice),
          sellPrice: Number(p.sellPrice),
          revenue: (Number(p.sellPrice) + addOnRevenue) * item.quantity,
          netProfit: ((Number(p.sellPrice) - Number(p.costPrice)) + addOnNetProfit) * item.quantity,
        }
      }))

      await ordersRepository.createOrderItemAddOns(db, request.items.flatMap((item, index) => {
        return (item.addOnIds || []).map((addOnId) => {
          const a = addOnMap.get(addOnId)!
          return {
            orderItemId: orderItems[index].id,
            addOnId,
            addOnName: a.name,
            costPrice: Number(a.costPrice),
            sellPrice: Number(a.sellPrice),
          }
        })
      }))
    }

    const amountChange = amountPaid - totalRevenue

    const order = await ordersRepository.updateOrder(db, id, {
      totalRevenue,
      totalNetProfit,
      amountPaid,
      amountChange,
    })

    await db.query('COMMIT')

    return mapOrderFromDB(order)
  }
  catch (error) {
    await db.query('ROLLBACK')
    throw error
  }
}

export async function listOrders(): Promise<ListOrderResponse> {
  const db = getDB()

  const orders = await ordersRepository.listOrders(db)

  return orders.map(order => mapOrderFromDB(order))
}

export async function findOrderById(id: number): Promise<OrderWithItemsResponse> {
  const db = getDB()

  const [order, orderItems] = await Promise.all([
    ordersRepository.findOrderById(db, id),
    ordersRepository.findOrderItemsByOrderId(db, id),
  ])

  if (!order)
    throw new Error(`Order ${id} not found`)

  const orderItemAddOns = await ordersRepository.findOrderItemAddOnsByOrderItemIds(
    db,
    orderItems.map(item => item.id),
  )

  return mapOrderWithItemsFromDB(order, orderItems, orderItemAddOns)
}
