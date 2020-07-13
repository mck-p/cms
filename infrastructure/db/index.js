import Knex from 'knex'
import getenv from 'getenv'
import defaultConfig from '@/knexfile'

export default Knex({
  ...defaultConfig,
  connection: {
    user: getenv.string('DB_USER'),
    password: getenv.string('DB_PASS'),
    host: getenv.string('DB_HOST'),
    port: getenv.string('DB_PORT'),
    database: getenv.string('DB_NAME')
  }
})