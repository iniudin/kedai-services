import type { DBQueryable } from '@/lib/database'
import type { CreateProductRequest, ProductResponse } from '@/model/products-model'
import { mapProductFromDB } from '@/model/products-model'

const createProductQuery = `
  INSERT INTO products 
    (
      name,
      price,
      is_active
    )
    VALUES (
      $1,
      $2,
      true
    )
  RETURNING 
    id,
    sku,
    name,
    price,
    is_active,
    created_at,
    updated_at
`

const listProductsQuery = `
  SELECT 
    id,
    sku,
    name,
    price,
    is_active,
    created_at,
    updated_at
  FROM products
  ORDER BY created_at DESC
`

export async function createProduct(client: DBQueryable, request: CreateProductRequest): Promise<ProductResponse> {
  const values = [request.name, request.price]
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
