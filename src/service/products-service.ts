import type { CreateProductRequest, ProductResponse } from '@/model/products-model'
import { getDB } from '@/lib/database'
import * as productRepository from '@/repository/products-repository'

export async function createProduct(request: CreateProductRequest): Promise<ProductResponse> {
  const db = getDB()
  return await productRepository.createProduct(db, request)
}

export async function listProducts(): Promise<ProductResponse[]> {
  const db = getDB()
  return await productRepository.listProducts(db)
}
