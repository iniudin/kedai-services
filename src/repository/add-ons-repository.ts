import type { DBQueryable } from '@/lib/database'
import type { AddOnResponse, CreateAddOnRequest, UpdateAddOnRequest } from '@/model/add-ons-model'
import { mapAddOnFromDB } from '@/model/add-ons-model'

const createAddOnQuery = `
  INSERT INTO add_ons (name, cost_price, sell_price, type)
    VALUES ($1, $2, $3, $4)
  RETURNING 
    id,
    name,
    cost_price,
    sell_price,
    type,
    is_active,
    created_at,
    updated_at
`

const listAddOnsQuery = `
  SELECT 
    id,
    name,
    cost_price,
    sell_price,
    type,
    is_active,
    created_at,
    updated_at
  FROM add_ons
  WHERE is_active = true
  ORDER BY created_at DESC
`

const findAddOnByIdQuery = `
  SELECT 
    id,
    name,
    cost_price,
    sell_price,
    type,
    is_active,
    created_at,
    updated_at
  FROM add_ons
  WHERE id = $1
`

const updateAddOnQuery = `
  UPDATE add_ons 
    SET 
      name = COALESCE($2, name),
      cost_price = COALESCE($3, cost_price),
      sell_price = COALESCE($4, sell_price),
      type = COALESCE($5, type),
      is_active = COALESCE($6, is_active),
      updated_at = NOW()
    WHERE id = $1
  RETURNING 
    id,
    name,
    cost_price,
    sell_price,
    type,
    is_active,
    created_at,
    updated_at
`

const deleteAddOnQuery = `
  UPDATE add_ons 
    SET 
      is_active = false,
      updated_at = NOW()
    WHERE id = $1
  RETURNING 
    id,
    name,
    cost_price,
    sell_price,
    type,
    is_active,
    created_at,
    updated_at
`

export async function createAddOn(client: DBQueryable, request: CreateAddOnRequest): Promise<AddOnResponse> {
  const values = [request.name, request.costPrice, request.sellPrice, request.type]
  const { rows } = await client.query(createAddOnQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to create add-on')
  }

  return mapAddOnFromDB(rows[0])
}

export async function listAddOns(client: DBQueryable): Promise<AddOnResponse[]> {
  const { rows } = await client.query(listAddOnsQuery)

  if (!rows[0]) {
    return []
  }

  return rows.map(mapAddOnFromDB)
}

export async function findAddOnById(client: DBQueryable, id: number): Promise<AddOnResponse> {
  const { rows } = await client.query(findAddOnByIdQuery, [id])

  if (!rows[0]) {
    throw new Error('Add-on not found')
  }

  return mapAddOnFromDB(rows[0])
}

export async function updateAddOn(client: DBQueryable, id: number, request: UpdateAddOnRequest): Promise<AddOnResponse> {
  const values = [id, request.name, request.costPrice, request.sellPrice, request.type]
  const { rows } = await client.query(updateAddOnQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to update add-on')
  }

  return mapAddOnFromDB(rows[0])
}

export async function deleteAddOn(client: DBQueryable, id: number): Promise<AddOnResponse> {
  const values = [id]
  const { rows } = await client.query(deleteAddOnQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to delete add-on')
  }

  return mapAddOnFromDB(rows[0])
}
