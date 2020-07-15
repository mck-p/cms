/**
 * Creates a hash of { [ACTION]: NAMESPACE + SEP + ACTION }
 *
 * @example
 * const actions = createNamespaceActions('Foo', ['Bar', 'Baz'], '::')
 *
 * actions.Bar === 'Foo::Bar'
 * actions.Baz === 'Foo::Baz'
 *
 * @param {string} namespace The namespace to create actions under
 * @param {Array<string>} actions The actions to create
 * @param {string=} sep The value to use to join the namesapce to the action
 */
const createNamespacesActions = (namespace, actions, sep = '::') =>
  actions.reduce(
    (a, action) => ({
      ...a,
      [action]: `${namespace}${sep}${action}`,
    }),
    {}
  )

/**
 * @typedef {Object} RoutingActions
 *
 * @prop {string} HISTORY_CHANGE
 */

/**
 * Action Names specifically for Routing
 * @type {RoutingActions}
 */
export const Routing = createNamespacesActions('ROUTING', ['HISTORY_CHANGE'])

/**
 * @typedef {Object} AnalyticActions
 *
 * @prop {string} PAGE_VIEW
 * @prop {string} PAGE_VISIT_TIME
 */

/**
 * @type {AnalyticActions}
 */
export const Analytics = createNamespacesActions('ANALYTICS', [
  'PAGE_VIEW',
  'PAGE_VISIT_TIME',
])

/**
 * @typedef {Object} InternalActions
 *
 * @prop {string} NOOP
 */

/**
 * @type {InternalActions}
 */
export const Internal = createNamespacesActions('INTERNAL', ['NOOP'])
