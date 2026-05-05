import { Elysia } from 'elysia'
import { openapi, fromTypes } from '@elysia/openapi'

const app = new Elysia()
	.use( openapi({
    references: fromTypes() 
  }))
	.get("/", () => "Hello World")
	.listen(process.env.PORT!);

console.log(`🦊 Kedai POS is running at ${app.server?.hostname}:${app.server?.port}`);