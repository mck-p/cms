import { createClient } from 'redis'
import getenv from 'getenv'

export default createClient({
  host: getenv.string('CACHE_HOST'),
  port: getenv.int('CACHE_PORT')
})