import { Router } from 'express'
import bodyParser from 'body-parser'
import * as Errors from '@/server/errors'

import { route, validate } from '@/server/api/utils'
import loginSchema from '@/server/api/schemas/login'

const router = new Router()

router.post(
  '/login',
  bodyParser.json(),
  route(async (req, res) => {
    await validate(req.body, loginSchema)

    throw new Errors.BadCredentials()
  })
)

export default router
