import type { TSchema, UnwrapSchema } from 'elysia'

import { t } from 'elysia'

export const ErrorResponse = t.Object({
  error: t.String(),
})

export type ToModel<T> = T extends TSchema
  ? UnwrapSchema<T>
  : never
