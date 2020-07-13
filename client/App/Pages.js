import React from 'react'
import { Switch, Route } from 'react-router-dom'
import ErrorPage from './Error'
import Page from './Page'

const Pages = ({ pages }) => {
  const paths = Object.entries(pages)

  return (
    <Switch>
      {paths.map(([path, props]) => (
        <Route
          exact={props.exact}
          path={path}
          render={() => <Page {...props} />}
          key={path}
        />
      ))}
      <Route component={ErrorPage} />
    </Switch>
  )
}

export default Pages
