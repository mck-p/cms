import * as R from 'ramda'

export const pages  = R.lensProp('pages')
export const site_info = R.lensProp('site')
export const menus = R.lensProp('menus')

export const menu_by_id = id => R.compose(
  menus,
  R.lensProp(id)
)