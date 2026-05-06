import type { CreateProductRequest, ProductResponse, UpdateProductRequest } from '@/model/products-model'
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

export async function findProductById(id: number): Promise<ProductResponse> {
  const db = getDB()
  return await productRepository.findProductById(db, id)
}

export async function updateProduct(id: number, request: UpdateProductRequest): Promise<ProductResponse> {
  const db = getDB()
  return await productRepository.updateProduct(db, id, request)
}

export async function deleteProduct(id: number): Promise<ProductResponse> {
  const db = getDB()
  return await productRepository.deleteProduct(db, id)
}
