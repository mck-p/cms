import express from 'express'
import getenv from 'getenv'

import log from '@/infrastructure/log'

import ssr from '@/server/ssr'
import api from '@/server/api'

import { cookies, authenticate } from '@/server/middleware'

log.trace('Building the Server')

const app = express()

app.use(cookies()).use(authenticate)

const router = express.Router()

router.use('/build', express.static('./build', { fallthrough: true }))
router.use(ssr)

app.use(router)
app.use('/api', api)

app.use((err, req, res, next) => {
  const code = err.code > 99 && err.code < 600 ? err.code : 500
  const message = err.message || 'Internal Server Error'
  const stack =
    getenv.string('NODE_ENV', '') === 'production' ? undefined : err.stack

  res.status(code).json({
    error: {
      message,
      stack,
    },
  })
})

const port = getenv.int('PORT')

app.listen(port, () => {
  log.info(`SSR running on port ${port}`)
})
