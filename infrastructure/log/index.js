import pino from 'pino'

export default pino({
  name: 'cms',
  level: 'trace',
  // process.env instead of getenv because this will run
  // in the browser as well so we can't use getenv
  prettyPrint: process.env.NODE_ENV === 'production' ? undefined : {
    levelFirst: true
  },
  serializers: pino.stdSerializers
})