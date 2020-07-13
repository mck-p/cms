import React, { useEffect } from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter as RouteProvider } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import { Provider as StateProvider } from 'react-redux'

import App from '@/client/App'
import theme, { removeCSS } from '@/client/theme'
import createStore from '@/client/State/create'

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__

// Create Redux store with initial state
const store = createStore(preloadedState)

// We create
const Main = () => {
  useEffect(removeCSS, [])

  return (
    <StateProvider store={store}>
      <RouteProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </RouteProvider>
    </StateProvider>
  )
}

hydrate(<Main />, document.getElementById('app'))
