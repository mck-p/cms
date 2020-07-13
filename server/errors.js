export class BadCredentials extends Error {
  code = 403
  message = 'You cannot log into the system using those credentials'
}

export class BadInput extends Error {
  code = 400
  constructor(errors) {
    super()

    this.message = `You failed validation for: ${errors.map(
      ({ message }) => message
    )}`
  }
}

export class NotAuthorized extends Error {
  code = 403
  message = "I'm afraid I can't do that, Dave."
}
