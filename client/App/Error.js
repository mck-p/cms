import React from 'react'
import { useLocation } from 'react-router-dom'
import Typography from '@material-ui/core/Typography'

const ErrorPage = () => {
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const message = params.get('message') || "Didn't find that page"
  const code = params.get('code') || 404

  return (
    <React.Fragment>
      <Typography variant="h1" align="center" gutterBottom>
        {code}
      </Typography>
      <Typography variant="h3" align="center">
        {message}
      </Typography>
    </React.Fragment>
  )
}

export default ErrorPage
