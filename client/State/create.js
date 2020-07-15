import { createStore, applyMiddleware, compose } from 'redux'
import { combineEpics, createEpicMiddleware } from 'redux-observable'

import * as Epics from '@/client/State/epics'

export default (initialState) => {
  const rootEpic = combineEpics(...Object.values(Epics))

  const epicMiddleware = createEpicMiddleware()

  const composeEnhancers =
    typeof window !== 'undefined'
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      : compose

  const store = createStore(
    (s) => s,
    initialState,
    composeEnhancers(applyMiddleware(epicMiddleware))
  )

  /**
   * Must be done _after_ we create the store
   */
  epicMiddleware.run(rootEpic)

  return store
}
