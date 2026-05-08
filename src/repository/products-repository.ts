import type { DBQueryable } from '@/lib/database'
import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from '@/model/products-model'
import { mapProductFromDB } from '@/model/products-model'

const createProductQuery = `
  INSERT INTO products 
    (
      name,
      cost_price,
      sell_price,
      is_active
    )
    VALUES (
      $1,
      $2,
      $3,
      true
    )
  RETURNING 
    id,
    sku,
    name,
    cost_price,
    sell_price,
    is_active,
    created_at,
    updated_at
`

const listProductsQuery = `
  SELECT 
    id,
    sku,
    name,
    cost_price,
    sell_price,
    is_active,
    created_at,
    updated_at
  FROM products
  WHERE is_active = true
  ORDER BY created_at DESC
`

const findProductByIdQuery = `
  SELECT 
    id,
    sku,
    name,
    cost_price,
    sell_price,
    is_active,
    created_at,
    updated_at
  FROM products
  WHERE id = $1
`

const findProductsByIdsQuery = `
  SELECT 
    id,
    name,
    cost_price,
    sell_price
  FROM products
  WHERE
    id = ANY($1)
    AND is_active = true
`

const updateProductQuery = `
  UPDATE products 
    SET 
      name = COALESCE($2, name),
      cost_price = COALESCE($3, cost_price),
      sell_price = COALESCE($4, sell_price),
      updated_at = NOW()
    WHERE id = $1
  RETURNING 
    id,
    sku,
    name,
    cost_price,
    sell_price,
    is_active,
    created_at,
    updated_at
`

const deleteProductQuery = `
  UPDATE products 
    SET 
      is_active = false,
      updated_at = NOW()
    WHERE id = $1
  RETURNING 
    id,
    sku,
    name,
    cost_price,
    sell_price,
    is_active,
    created_at,
    updated_at
`

export async function createProduct(client: DBQueryable, request: CreateProductRequest): Promise<ProductResponse> {
  const values = [request.name, request.costPrice, request.sellPrice]
  const { rows } = await client.query(createProductQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to create product')
  }

  return mapProductFromDB(rows[0])
}

export async function listProducts(client: DBQueryable): Promise<ProductResponse[]> {
  const { rows } = await client.query(listProductsQuery)

  if (!rows[0]) {
    return []
  }

  return rows.map(mapProductFromDB)
}

export async function findProductById(client: DBQueryable, id: number): Promise<ProductResponse> {
  const { rows } = await client.query(findProductByIdQuery, [id])

  if (!rows[0]) {
    throw new Error('Product not found')
  }

  return mapProductFromDB(rows[0])
}

export async function findProductsByIds(
  client: DBQueryable,
  ids: number[],
): Promise<Pick<ProductResponse, 'id' | 'name' | 'costPrice' | 'sellPrice'>[]> {
  if (ids.length === 0) {
    return []
  }

  const { rows } = await client.query(findProductsByIdsQuery, [ids])
  if (!rows[0]) {
    return []
  }

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    costPrice: Number(row.cost_price),
    sellPrice: Number(row.sell_price),
  }))
}

export async function updateProduct(client: DBQueryable, id: number, request: UpdateProductRequest): Promise<ProductResponse> {
  const values = [id, request.name, request.costPrice, request.sellPrice]
  const { rows } = await client.query(updateProductQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to update product')
  }

  return mapProductFromDB(rows[0])
}

export async function deleteProduct(client: DBQueryable, id: number): Promise<ProductResponse> {
  const values = [id]
  const { rows } = await client.query(deleteProductQuery, values)

  if (!rows[0]) {
    throw new Error('Failed to delete product')
  }

  return mapProductFromDB(rows[0])
}
