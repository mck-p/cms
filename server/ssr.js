import fs from 'fs'
import path from 'path'

import express from 'express'
import getenv from 'getenv'

import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { ServerStyleSheets, ThemeProvider } from '@material-ui/core/styles'
import { Helmet } from 'react-helmet'
import { Provider as StateProvider } from 'react-redux'

import App from '@/client/App'
import theme from '@/client/theme'
import createStore from '@/client/State/create'

const router = express.Router()

/**
 * Given a incoming Request, create the needed store
 *
 * Can be async if need be
 *
 * TODO: Create Store Based on Request
 */
export const createStoreBasedOnRequest = async (req) =>
  createStore({
    site: {
      title: 'Company Default Title',
      name: "Acme Corp's Website",
    },
    menus: {
      1: {
        id: 1,
        items: [
          {
            id: 1,
            label: 'About',
            href: '/about',
          },
          {
            id: 2,
            label: 'Contact',
            href: '/contact',
          },
        ],
      },
    },
    pages: {
      '/': {
        exact: true,
        meta: {
          title: 'I am the page title',
          description: 'I am the page description',
          author: 'Tim Roberts',
          robots: '',
          keywords: ['consulting', 'programming'],
          canonicalUrl: getenv.string('WEBSITE_ROOT', 'http://localhost:8080'),
          favicon:
            'https://livingrichwithcoupons.com/wp-content/uploads/2012/07/Favicon_v5.png',
        },
        menu_id: 1,
        blocks: [
          {
            id: 1,
            type: 'Header',
            props: {
              logo:
                'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/Meta-Wiki_Proposed_logo.svg/1024px-Meta-Wiki_Proposed_logo.svg.png',
              text: 'Company Name',
            },
          },
        ],
      },
    },
  })
/**
 * SYNC but only so we don't have to worry about re-reading it
 * every time we get a request
 */
const FILE_TEMPLATE = fs.readFileSync(
  path.resolve('./build/index.html'),
  'utf8'
)

const ssr = async (req, res, next) => {
  /**
   * We are going to want to inline our styles for faster
   * First Time To Interaction
   */
  const sheets = new ServerStyleSheets()

  /**
   * We create the state based on the incoming request
   */
  const store = await createStoreBasedOnRequest(req)

  /**
   * This is our server-rendering context
   */
  const context = {}
  /**
   * We render the app to a string
   */
  const app = ReactDOMServer.renderToString(
    sheets.collect(
      <StateProvider store={store}>
        <ThemeProvider theme={theme}>
          <StaticRouter location={req.url} context={context}>
            <App />
          </StaticRouter>
        </ThemeProvider>
      </StateProvider>
    )
  )

  const helmet = Helmet.renderStatic()
  const css = sheets.toString()
  const preloadedState = store.getState()

  /**
   * If the rendering has requested that we
   * redirect
   */
  if (context.url) {
    /**
     * Just redirect
     */
    return res.redirect(301, context.url)
  }

  return res.send(
    FILE_TEMPLATE.replace('<=%APP=>', app)
      .replace('<=%CSS=>', css)
      .replace(
        '<=%HEAD=>',
        `
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}`
      )
      .replace('<=%HTML_ATTR=>', helmet.htmlAttributes.toString())
      .replace('<=%BODY_ATTR=>', helmet.bodyAttributes.toString())
      .replace(
        '<=%STATE=>',
        JSON.stringify(preloadedState).replace(/</g, '\\u003c')
      )
  )
}

router.get('/*', ssr)

export default router
