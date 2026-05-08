import console from 'node:console'
import { config } from '@/lib/config'
import { app } from './app'

app.listen(config.server.port)

console.log(`🦊 Kedai POS is running at ${app.server?.hostname}:${app.server?.port}`)
