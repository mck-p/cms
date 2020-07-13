# No Bullshit Guide to SSR

> Aside: If you just want to _get shit done_ and move on, you should
> check out [Parcel](parceljs.org/), [Next.JS](nextjs.org/), or [Gatsby](https://www.gatsbyjs.org/)
> as they are _batteries included_ and going to get you 80% of the way there.
>
> This is for Future Me when I want full control of the system being built and
> is a clone of the CMS that GroWorks uses for its projects

## Overview

This guide will walk us through how to create a Server-Side Rendered React application that
uses Redux for State Management, React-Router for routing, Material-UI for our UI Kit, Helmet
for head attributes, PostgreSQL for our database, and Express for serving it all.

If you don't know _what_ Server-Side rendering is, [this FreeCodeCamp][fcc-ssr]
article is a great place to start. If you don't know _why_ you need Server-Side rendering, I
suggest you wait until it solves a problem for you. However, [this LogRocket][lr-ssr]
article is a great place to read on what problem it might solve for you.

## Prereqs

This guide assumes that you have `node` and `yarn` installed locally. If you do not or
you are not familiar with writing Javascript, this guide _may_ help you via some copy-paste
but you will be up shit's creek eventually. I suggest you use one of the batteries included
frameworks or [razzle](https://github.com/jaredpalmer/razzle) instead of rolling your own.

We will also be using `docker` and `docker-compose` to set up our backing services locally
and in production.

## Step 0: What Are We Building?

It always helps to understand where you're going before embarking on a journey and programming
is no different. This guide will walk us through how to

- Create a React application that
  1. uses Redux and PostgreSQL to store and render Pages
  2. is server-side rendered
  3. has protected routes that only authenticated users can access
  4. has an Admin panel for editing and creating pages, posts, accessing media, etc.
      - Imagine `wordpress` but more simple

## Step 1: Getting Started

```shell
# First we make our project folder
# cd into the parent directory
cd ~/Projects

# make the project directory
# and then cd into it
mkdir ssr && cd ssr

# Now we can init our tooling
git init

# We use the -y in order to not
# have to answer the questions. Feel
# free to leave it off and use the CLI
# to fill out our package.json
yarn init -y
```

We should now be inside of a folder that has a `package.json` that is filled out
and ready for us to start scaffolding out the project. Since we will have two
different "apps", one on the server and one on the client, let's create two
folders:

```shell
mkdir client server
```

Let's also create a folder to hold any configuration that we might need along with any
infrastructure such as database, cache, or logging

```
mkdir config infrastructure
mkdir infrastructure/db infrastructure/cache infrastructure/log
```

Now we need to create our base configuration inside of `./config/webpack.config.js`:

> Note: This file _MUST_ be commonjs and not use import/export since this
> file will be read _outside_ of the webpack bundling

```js
const path = require('path');


const ROOT_PATH = path.resolve(__dirname, '..')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')
const CONFIG_PATH = path.resolve(ROOT_PATH, 'config')
const ENTRY_PATH = path.resolve(ROOT_PATH, 'client', 'entry.js')

const config = {
  mode: "development",
  entry: ENTRY_PATH,
  output: {
    path: BUILD_PATH,
    filename: '[name].[hash].js',
    publicPath: '/build'
  },
  devtool: "source-map",
  module: {
    rules: []
  },
  resolve: {
    extensions: ['.js', '.json', '.css'],
    alias: {
      '@': path.resolve(ROOT_PATH)
    }
  }
};

module.exports = config;
```

Let's break down what each piece of the `config` is doing:

```js
mode: 'development'
```

tells our computer that we want to build this as if we are `developing` the system. We 
can and will change this to `production` eventually but for now, let's move on.

```js
entry: ENTRY_PATH
```

We tell webpack where the entry to our file is so that it can start its journey to
bundling

```js
output: {
  path: BUILD_PATH,
  filename: '[name].[hash].js',
  publicPath: '/build'
},
```

Here we define how webpack should _output_ files. It will put them in the `BUILD_PATH` folder,
using the `[name].[hash]` naming convention so that when we update the code, the hash gets
updated and our clients will get the new files on each request. We also have a `publicPath`,
which tells webpack where our files our located.

If we were going to put this in a CDN/S3 bucket, we would want to change the `publicPath` to
be the root of the CDN/S3 bucket. Here we are just saying `/build` so that when it asks our
server for files, it asks the `build/` directory.

```js
devtool: 'source-map'
```

We want to have some sort of source-maps to help us debug later

```js
module: {
  rules: []
},
```

Here we stub out where all of our loaders will go. For now, we are just having an empty list

```js
resolve: {
  extensions: ['.js', '.json', '.css'],
  alias: {
    '@': path.resolve(ROOT_PATH)
  }
}
```

And finally we tell webpack that when we say `import foo from './bar` to look for `./bar.js`, `./bar.json`
and `./bar.css`. We also tell it that when it sees `import foo from '@/client/bar` to replace `@` with `ROOT_PATH`
This allows us to do some cool stuff.

Since we are modifying the `resolve.alias` value, let's also tell our VS Code instance about that in a file in the
root directory called `jsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

This won't do much since we don't have any loaders, so let's add loaders for `js`, `css`, and `files`:

```shell
# Add JS Loaders
yarn add -D @babel/core @babel/cli babel-loader
# Add CSS Loaders
yarn add -D style-loader css-loader postcss-loader
# Add File Loader
yarn add -D url-loader file-loader
```

Those do a good job by themselves but we are going to add some plugins and presets to make
our code even more cool:

```shell
# all of our JS plugins/presets
yarn add -D  @babel/preset-env @babel/preset-react @babel/plugin-proposal-class-properties @babel/plugin-proposal-object-rest-spread @babel/plugin-proposal-private-methods core-js

# all of our css plugins/presets
yarn add precss autoprefixer postcss-import
```

This seems like alot, and it is. But. It's once and done and allows us to use cool, hip JS/CSS
features and have our computer figure out how to make it work in _almost every_ browser we care
about.

Now that we have installed the loaders, let's add them to the `module.rules` block in the
`webpack.config.js` file:

```js
module: {
  rules: [
    {
      test: /\.js$/,
      exclude: /node_modules/,
      use: [
        'babel-loader'
      ]
    },
    {
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader',
          options: {
            importLoaders: 1,
            sourceMap: true
          }
        },
        {
          loader: 'postcss-loader'
        }
      ]
    },
    {
      test: /\.(png|jpg|gif)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
          },
        },
      ],
    },
    {
      test: /\.svg$/,
      loader: 'svg-inline-loader',
      options: {
        removeTags: true,
        classPrefix: "svg-"
      }
    }
  ]
},
```

We can now import js files and have babel transform them, css files and have postcss transform them,
and import image/svg files and use them in our react components.

We need to configure the `postcss` and `babel` loaders before they will do anything cool. We can 
do that in the `options` block of the rules but instead let's use the config files for each tool.
These files should be in the root of your project

_**.babelrc.**_
```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "targets": {
          "node": "current"
        },
        "loose": true,
        "useBuiltIns": "entry",
        "corejs": 3
      }
    ],
    [
      "@babel/preset-react"
    ]
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-class-properties"
    ],
    [
      "@babel/plugin-proposal-object-rest-spread"
    ],
    [
      "@babel/plugin-proposal-private-methods"
    ]
  ]
}
```

_**postcss.config.js**_
```js
module.exports = {
  plugins: {
    'postcss-import': {},
    precss: {},
    autoprefixer: {}
  }
}
```

This configuration works for the `client` application but what about the
`server` side aspect of it? Let's create one more configuration file, called
`webpack.server.js` and add the following to it:

```js
const path = require('path')
const defaultConfig = require('./webpack.config')
const nodeExternals = require('webpack-node-externals');
const ROOT_PATH = path.resolve(__dirname, '..')

defaultConfig.entry = path.resolve(ROOT_PATH, 'server', 'index.js')

defaultConfig.output =  {
  path: path.resolve(ROOT_PATH, 'build', 'server',),
  filename: 'start.js',
  publicPath: '/'
}

defaultConfig.target = 'node'

defaultConfig.externals = [nodeExternals()]

module.exports = defaultConfig
```

Let's also add the `webpack-node-externals` module so that webpack can not bundle things
that the server will have in the `node_modules` folder:

```shell
yarn add -D webpack-node-externals
```

One final piece of the puzzle is an HTML template for everything to read/use. Create a 
file called `index.template.html` inside of `configuration, and put the following

```html
<!DOCTYPE html>
<html lang="en">

<head <=%HTML_ATTR=>>
  <=%HEAD=>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style id="jss-server-side"><=%CSS=></style>
    <script>window.__PRELOADED_STATE__ = <=%STATE=></script>
</head>

<body <=%BODY_ATTR=>>
  <div id="app">
    <=%APP=>
  </div>
</body>
</html>
```

Don't worry about the `<=%FOO=>` stuff yet. It will be needed for Server-Side rendering.

Let's add the plugin that will create it for the client:

```shell
yarn add -D html-webpack-plugin
```

And let's add that plugin to the `webpack.config.js` file:

```js
const HTMLPlugin = require('html-webpack-plugin')

/*... */
plugins: [
  new HTMLPlugin({
    template: path.resolve(CONFIG_PATH, 'index.template.html')
  }),
],
```

Since we don't need it on the Server side, we can delete the plugins key in `webpack.server.js`:

```js
/** ... */
delete defaultConfig.plugins
/** ... */
module.exports = defaultConfig
```

Your final `webpack.config.js` file should look something like this:

```js
const path = require('path');
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

const ROOT_PATH = path.resolve(__dirname, '..')
const BUILD_PATH = path.resolve(ROOT_PATH, 'build')
const CONFIG_PATH = path.resolve(ROOT_PATH, 'config')
const ENTRY_PATH = path.resolve(ROOT_PATH, 'client', 'entry.js')

const config = {
  mode: "development",
  entry: ENTRY_PATH,
  output: {
    path: BUILD_PATH,
    filename: '[name].[hash].js',
    publicPath: '/build'
  },
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          'babel-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif)$/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader',
        options: {
          removeTags: true,
          classPrefix: "svg-"
        }
      }
    ]
  },
  plugins: [
    new HTMLPlugin({
      template: path.resolve(CONFIG_PATH, 'index.template.html')
    }),
  ],
  resolve: {
    extensions: ['.js', '.json', '.css'],
    alias: {
      '@': path.resolve(ROOT_PATH)
    }
  }
};

module.exports = config;
```

and the `webpack.server.js` file something like this:

```js
const path = require('path')
const defaultConfig = require('./webpack.config')
const nodeExternals = require('webpack-node-externals');
const ROOT_PATH = path.resolve(__dirname, '..')

defaultConfig.entry = path.resolve(ROOT_PATH, 'server', 'index.js')

defaultConfig.output =  {
  path: path.resolve(ROOT_PATH, 'build', 'server',),
  filename: 'start.js',
  publicPath: '/'
}

delete defaultConfig.plugins

defaultConfig.target = 'node'

defaultConfig.externals = [nodeExternals()]

module.exports = defaultConfig
```

Alright! We can _finally_ start writing our application code, knowing that our
configuration is all set up to work!

## Step 2: Client and Server

Since we're building a React codebase, we need to add `react` and the rest of the
UI dependencies:

```shell
# Base
yarn add react react-dom react-router-dom react-helmet
# State
yarn add redux react-redux
# UI Toolkit
yarn add @material-ui/core @material-ui/icons @emotion/core @emotion/styled babel-plugin-emotion
```

Notice we added a `babel` plugin, so let's add that to our `.babelrc` file:

```json
"plugins": [
  /* ... */,
  ["babel-plugin-emotion"]
]
```

Now let's create both the `App` file and the `entry` file. We need both because the `entry` file
is where the client code starts and the `App` file is what the Server will import. Create a file
called `client/entry.js` with the following


```js
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
```

Notice the `@/client` import statements. That's our `resolve.alias` at work!
Let's add those files so that our computer doesn't yell at us

_**client/theme.js**_

```js
import { createMuiTheme } from '@material-ui/core/styles'

export const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

export const removeCSS = () => {
  const jssStyles = document.getElementById('jss-server-side')
  if (jssStyles) {
    jssStyles.parentElement.removeChild(jssStyles)
  }
}

export default theme
```

Feel free to create the theme however you wish

_**client/State/create.js**_

```js
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
```

Note the `typeof window !== 'undefined` here. this is because this will get
called on both the Server and the Client. On the Server, `window` is not
defined!

_**client/App/index.js**_

```js
import React from 'react'
import { Helmet } from 'react-helmet'
import CssBaseline from '@material-ui/core/CssBaseline'
import Typography from '@material-ui/core/Typography'

const App = () => (
  <React.Fragment>
    <Helmet>
      <title>No Bullshit Guide to SSR</title>
    </Helmet>
    <Typography>Hello from App!</Typography>
    <CssBaseline />
  </React.Fragment>
)

export default App
```

Now we can build our Client application!

```shell
webpack --config ./config/webpack.client.js
```

That is kinda hard to remember, so let's add it to the `package.json` scripts as the
`build::client` command:

```json
"scripts": {
  "build::client": "webpack --config ./config/webpack.client.js"
}
```

[fcc-ssr]: https://www.freecodecamp.org/news/what-exactly-is-client-side-rendering-and-hows-it-different-from-server-side-rendering-bd5c786b340d/
[lr-ssr]: https://blog.logrocket.com/why-you-should-render-react-on-the-server-side-a50507163b79/