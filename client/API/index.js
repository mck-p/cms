export const json = (url, opts) => fetch(url, opts).then((x) => x.json())

export const login = ({ email, password }) =>
  json(`${process.env.WEBSITE_ROOT}/api/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

export const analytics = (event) =>
  json(`${process.env.WEBSITE_ROOT}/api/anayltics`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(event),
  })

export const page_view = () =>
  analytics({
    type: 'PAGE_VIEW',
    page: window.location.pathname,
    search: [...new URLSearchParams(window.location.search).entries()].reduce(
      (a, c) => ({
        ...a,
        [c[0]]: c[1],
      }),
      {}
    ),
    viewed_at: new Date().toISOString(),
  })

export const page_visit_with_time = () => {
  const start = Date.now()
  const args = {
    type: 'PAGE_VISIT_TIME',
    page: window.location.pathname,
    search: [...new URLSearchParams(window.location.search).entries()].reduce(
      (a, c) => ({
        ...a,
        [c[0]]: c[1],
      }),
      {}
    ),
  }

  return () =>
    analytics({
      ...args,
      time_ms: Date.now() - start,
    })
}
