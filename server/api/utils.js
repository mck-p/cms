import { validate as validateSchema } from 'jsonschema'
import { BadInput } from '@/server/errors'
import getenv from 'getenv'

export const route = (handler) => async (req, res, next) => {
  try {
    await handler(req, res)
  } catch (e) {
    next(e)
  }
}

export const validate = (data, schema) => {
  const valid = validateSchema(data, schema)

  if (valid.errors.length) {
    throw new BadInput(valid.errors)
  }
}
