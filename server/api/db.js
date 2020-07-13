import { Router } from 'express'
import { only_overlord } from '@/server/middleware'
import bodyParser from 'body-parser'
import db from '@/infrastructure/db'

import { route } from '@/server/api/utils'

const router = new Router()

router
  .post(
    '/migrate',
    bodyParser.json(),
    only_overlord,
    route(async (req, res) => {
      const data = await db.migrate.latest()

      res.status(201).json({
        data,
      })
    })
  )
  .post(
    '/rollback',
    bodyParser.json(),
    only_overlord,
    route(async (req, res) => {
      const data = await db.migrate.rollback()

      res.status(201).json({
        data,
      })
    })
  )

export default router
