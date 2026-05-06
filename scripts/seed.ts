import { getDB } from '@/lib/database'
import { AddOnType } from '@/model/add-ons-model'
import { createAddOn } from '@/repository/add-ons-repository'
import { createProduct } from '@/repository/products-repository'

async function seed() {
  const db = getDB()

  const products = [
    { name: 'Es Krim Vanilla', price: 12000 },
    { name: 'Es Krim Coklat', price: 12000 },
    { name: 'Es Krim Strawberry', price: 12000 },
    { name: 'Es Krim Matcha', price: 15000 },
    { name: 'Es Krim Taro', price: 15000 },
    { name: 'Es Krim Red Velvet', price: 15000 },
    { name: 'Es Krim Mango', price: 13000 },
    { name: 'Es Krim Cookies & Cream', price: 14000 },
    { name: 'Es Krim Tiramisu', price: 16000 },
    { name: 'Es Krim Rainbow Sherbet', price: 14000 },
  ]

  const addOns = [
    { name: 'Choco Chips', price: 3000, type: AddOnType.TOPPING },
    { name: 'Sprinkles', price: 2000, type: AddOnType.TOPPING },
    { name: 'Caramel Drizzle', price: 3000, type: AddOnType.TOPPING },
    { name: 'Whipped Cream', price: 3000, type: AddOnType.TOPPING },
    { name: 'Strawberry Sauce', price: 3000, type: AddOnType.TOPPING },
    { name: 'Oreo Crumble', price: 4000, type: AddOnType.TOPPING },
    { name: 'Mochi', price: 5000, type: AddOnType.TOPPING },
    { name: 'Keju Parut', price: 4000, type: AddOnType.TOPPING },
    { name: 'Medium', price: 5000, type: AddOnType.SIZE },
    { name: 'Large', price: 10000, type: AddOnType.SIZE },
  ]

  console.log('Seeding database...')

  const createdProducts = []
  for (const product of products) {
    console.log(`Creating product: ${product.name}`)
    const created = await createProduct(db, product)
    createdProducts.push(created)
  }

  const createdAddOns = []
  for (const addOn of addOns) {
    console.log(`Creating add-on [${addOn.type}]: ${addOn.name}`)
    const created = await createAddOn(db, addOn)
    createdAddOns.push(created)
  }

  console.log('Seeding database successfully!')
}

seed()
  .then(() => {
    console.log('Done!')
  })
  .catch((error) => {
    console.error('Error seeding database:', error)
  })
