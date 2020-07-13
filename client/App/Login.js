import React from 'react'

import styled from '@emotion/styled'
import { useHistory } from 'react-router-dom'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'

import { login } from '@/client/API'

const Form = styled.form`
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const Login = () => {
  const history = useHistory()
  const handleSubmit = (e) => {
    e.preventDefault()

    const form = e.target
    const formData = new FormData(form)
    const data = {
      email: formData.get('email'),
      password: formData.get('password'),
    }

    login(data).then(({ data, error }) => {
      if (error) {
        return console.warn(error)
      } else {
        history.push('/admin')
      }
    })
  }

  return (
    <Form onSubmit={handleSubmit}>
      <TextField name="email" type="email" label="Email" required fullWidth />
      <TextField
        name="password"
        type="password"
        label="Password"
        required
        fullWidth
      />
      <ButtonGroup>
        <Button color="primary" type="submit">
          Submit
        </Button>
        <Button color="secondary" type="reset">
          Clear
        </Button>
      </ButtonGroup>
    </Form>
  )
}

export default Login
