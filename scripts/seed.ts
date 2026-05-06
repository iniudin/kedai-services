import type { DBQueryable } from '@/lib/database'
import process from 'node:process'
import { getDB } from '@/lib/database'
import { AddOnType } from '@/model/add-ons-model'
import { createAddOn } from '@/repository/add-ons-repository'
import { createProduct } from '@/repository/products-repository'

async function seed(client: DBQueryable) {
  const products = [
    { name: 'Es Krim Vanilla', costPrice: 5000, sellPrice: 12000 },
    { name: 'Es Krim Coklat', costPrice: 5000, sellPrice: 12000 },
    { name: 'Es Krim Strawberry', costPrice: 5000, sellPrice: 12000 },
    { name: 'Es Krim Matcha', costPrice: 7000, sellPrice: 15000 },
    { name: 'Es Krim Taro', costPrice: 7000, sellPrice: 15000 },
    { name: 'Es Krim Red Velvet', costPrice: 7000, sellPrice: 15000 },
    { name: 'Es Krim Mango', costPrice: 6000, sellPrice: 13000 },
    { name: 'Es Krim Cookies & Cream', costPrice: 6500, sellPrice: 14000 },
    { name: 'Es Krim Tiramisu', costPrice: 8000, sellPrice: 16000 },
    { name: 'Es Krim Rainbow Sherbet', costPrice: 6500, sellPrice: 14000 },
  ]

  const addOns = [
    { name: 'Choco Chips', costPrice: 1000, sellPrice: 3000, type: AddOnType.TOPPING },
    { name: 'Sprinkles', costPrice: 500, sellPrice: 2000, type: AddOnType.TOPPING },
    { name: 'Caramel Drizzle', costPrice: 1000, sellPrice: 3000, type: AddOnType.TOPPING },
    { name: 'Whipped Cream', costPrice: 1000, sellPrice: 3000, type: AddOnType.TOPPING },
    { name: 'Strawberry Sauce', costPrice: 1000, sellPrice: 3000, type: AddOnType.TOPPING },
    { name: 'Oreo Crumble', costPrice: 2000, sellPrice: 4000, type: AddOnType.TOPPING },
    { name: 'Mochi', costPrice: 2000, sellPrice: 5000, type: AddOnType.TOPPING },
    { name: 'Keju Parut', costPrice: 2000, sellPrice: 4000, type: AddOnType.TOPPING },
    { name: 'Medium', costPrice: 2000, sellPrice: 5000, type: AddOnType.SIZE },
    { name: 'Large', costPrice: 6000, sellPrice: 10000, type: AddOnType.SIZE },
  ]

  console.log('Seeding database...')

  const createdProducts = []
  for (const product of products) {
    console.log(`Creating product: ${product.name}`)
    const created = await createProduct(client, product)
    createdProducts.push(created)
  }

  const createdAddOns = []
  for (const addOn of addOns) {
    console.log(`Creating add-on [${addOn.type}]: ${addOn.name}`)
    const created = await createAddOn(client, addOn)
    createdAddOns.push(created)
  }
}

(async () => {
  const db = getDB()
  const client = await db.connect()

  try {
    await client.query('BEGIN')
    await seed(client)
    await client.query('COMMIT')
    console.log('Seeding database successfully!')
  }
  catch (error) {
    await client.query('ROLLBACK')
    console.error('Error seeding database, rolling back...', error)
    process.exit(1)
  }
  finally {
    client.release()
  }
})()
