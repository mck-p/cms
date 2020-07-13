import React, { useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import { useSelector, useDispatch } from 'react-redux'

import Admin from '@/client/App/Admin'
import Login from '@/client/App/Login'
import Pages from '@/client/App/Pages'

const App = () => {
  const history = useHistory()
  const pages = useSelector(({ pages }) => pages)
  const dispatch = useDispatch()

  useEffect(
    () =>
      history.listen((event) =>
        dispatch({
          type: 'HISTORY_CHANGE',
          payload: event,
        })
      ),
    []
  )

  return (
    <React.Fragment>
      <Switch>
        {/**
         * Any paths that start with /admin will be
         * rendered by the Admin application
         */}
        <Route path="/admin" component={Admin} />
        {/**
         * Let's also let people log into the system
         */}
        <Route path="/login" exact component={Login} />
        {/**
         * Anything else will be passed off to our pages
         */}
        <Route render={() => <Pages pages={pages} />} />
      </Switch>
      <CssBaseline />
    </React.Fragment>
  )
}

export default App
