export default {
  title: 'Information Needed for Logging Into the System',
  type: 'object',
  required: ['password', 'email'],
  properties: {
    password: {
      type: 'string',
    },
    email: {
      type: 'string',
      format: 'email',
    },
  },
}
