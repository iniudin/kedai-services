import type { DBQueryable } from '@/lib/database'
import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from '@/model/products-model'
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
  WHERE is_active = true
  ORDER BY created_at DESC
`

const findProductByIdQuery = `
  SELECT 
    id,
    sku,
    name,
    price,
    is_active,
    created_at,
    updated_at
  FROM products
  WHERE id = $1
`

const updateProductQuery = `
  UPDATE products 
    SET 
      name = COALESCE($2, name),
      price = COALESCE($3, price),
      is_active = COALESCE($4, is_active),
      updated_at = NOW()
    WHERE id = $1
  RETURNING 
    id,
    sku,
    name,
    price,
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
    price,
    is_active,
    created_at,
    updated_at
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

export async function findProductById(client: DBQueryable, id: number): Promise<ProductResponse> {
  const { rows } = await client.query(findProductByIdQuery, [id])

  if (!rows[0]) {
    throw new Error('Product not found')
  }

  return mapProductFromDB(rows[0])
}

export async function updateProduct(client: DBQueryable, id: number, request: UpdateProductRequest): Promise<ProductResponse> {
  const values = [id, request.name, request.price, request.isActive]
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
