import { createStore, applyMiddleware, compose } from 'redux'

export default (initialState) => {
  const composeEnhancers =
    typeof window !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose

  const store = createStore(
    (s) => s,
    initialState,
    composeEnhancers(applyMiddleware())
  )

  return store
}
