import type { AddOnResponse, CreateAddOnRequest, UpdateAddOnRequest } from '@/model/add-ons-model'
import { getDB } from '@/lib/database'
import * as addOnsRepository from '@/repository/add-ons-repository'

export async function createAddOn(request: CreateAddOnRequest): Promise<AddOnResponse> {
  const db = getDB()
  return await addOnsRepository.createAddOn(db, request)
}

export async function listAddOns(): Promise<AddOnResponse[]> {
  const db = getDB()
  return await addOnsRepository.listAddOns(db)
}

export async function findAddOnById(id: number): Promise<AddOnResponse> {
  const db = getDB()
  return await addOnsRepository.findAddOnById(db, id)
}

export async function updateAddOn(id: number, request: UpdateAddOnRequest): Promise<AddOnResponse> {
  const db = getDB()
  return await addOnsRepository.updateAddOn(db, id, request)
}

export async function deleteAddOn(id: number): Promise<AddOnResponse> {
  const db = getDB()
  return await addOnsRepository.deleteAddOn(db, id)
}
