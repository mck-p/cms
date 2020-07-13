import { Router } from 'express'

import {
  authenticate,
  security_headers,
  custom_headers,
  rateLimit,
} from '@/server/middleware'

import dbRouter from '@/server/api/db'
import userRouter from '@/server/api/users'

const router = new Router()

router
  .use(security_headers())
  .use(custom_headers)
  .use(rateLimit)
  .use('/db', dbRouter)
  .use('/users', userRouter)

export default router
