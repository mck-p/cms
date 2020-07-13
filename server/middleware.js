import * as Errors from '@/server/errors'
import getenv from 'getenv'
import { verify } from 'jsonwebtoken'
import RateLimit from 'express-rate-limit'
import RedisRateLimit from 'rate-limit-redis'

import cache from '@/infrastructure/cache'

export { default as security_headers } from 'helmet'
export { default as cookies } from 'cookie-parser'

/**
 * Only allows those that match the overlord token to be allowed
 * into the route
 */
export const only_overlord = (req, res, next) => {
  if (!req.body.token || req.body.token !== getenv.string('OVERLORD_TOKEN')) {
    return next(new Errors.NotAuthorized())
  }

  return next()
}

/**
 * Transforms JWTS into data
 */
export const authenticate = async (req, res, next) => {
  let token
  if (req.headers.authorization) {
    token = req.headers.authorization.replace('Bearer ', '')
  } else {
    token = req.cookies.authorization
  }

  if (token) {
    req.user = await verify(token, getenv.string('JWT_SECRET'))
  }

  return next()
}

export const custom_headers = (req, res, next) => {
  res.set('Server', 'GroWorks CMS')
  res.set('X-Are-You-Cool', 'of course you are!')
  res.set(
    'X-There-You-Are',
    "I don't know where _there_ is, but you are there!"
  )
  res.set('X-Version', getenv.string('SERVER_VERSION', '0.0.0-DEVELOPMENT'))
  return next()
}

export const rateLimit = new RateLimit({
  store: new RedisRateLimit({
    client: cache,
  }),
  max: getenv.int('MAX_IP_REQUESTS_PER_WINDOW', 100), // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
})
