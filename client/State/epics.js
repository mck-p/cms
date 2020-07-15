import { ofType } from 'redux-observable'
import { map } from 'rxjs/operators'

import * as Actions from '@/client/State/actions'

export const pageView$ = (actions$) =>
  actions$.pipe(
    ofType(Actions.Analytics.PAGE_VIEW),
    map((data) => ({
      type: Actions.Internal.NOOP,
      payload: data,
    }))
  )
