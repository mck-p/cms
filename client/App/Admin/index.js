import React from 'react'
import styled from '@emotion/styled'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'

import { Helmet } from 'react-helmet'
import { useSelector } from 'react-redux'
import { Link, Redirect, useRouteMatch } from 'react-router-dom'

import { Switch, Route } from 'react-router-dom'

import * as R from 'ramda'

import * as Lenses from '@/client/State/create'

import Dashboard from '@/client/App/Admin/Dashboard'
import Collections from '@/client/App/Admin/Collections'
import Pages from '@/client/App/Admin/Pages'
import ErrorPage from '@/client/App/Error'

const Page = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;

  > header,
  > footer {
    flex-grow: 0;
  }

  > main {
    flex-grow: 2;
  }
`

const Header = styled.header`
  padding: 1rem;
  display: flex;
  justify-content: space-between;
`

const HeaderLink = styled(Typography)`
  text-decoration: none;
  color: inherit;
`

const HeaderNav = styled.nav`
  display: flex;

  ${HeaderLink}:not(:first-of-type) {
    margin-left: 1rem;
  }
`

const Footer = styled.footer``

const Main = styled.main``

const Admin = () => {
  const site_info = useSelector(R.view(Lenses.site_info))
  const match = useRouteMatch()

  return (
    <Page>
      <Helmet>
        <title>Admin Dashboard | {site_info.title}</title>
      </Helmet>
      <Header>
        <HeaderLink component={Link} to={`${match.url}/dashboard`} variant="h6">
          {site_info.name}
        </HeaderLink>
        <HeaderNav>
          <HeaderLink component={Link} to={`${match.url}/dashboard`}>
            Dashboard
          </HeaderLink>
          <HeaderLink component={Link} to={`${match.url}/pages`}>
            Pages
          </HeaderLink>
          <HeaderLink component={Link} to={`${match.url}/collections`}>
            Collections
          </HeaderLink>
          <HeaderLink component={Link} to="/">
            Site Home Page
          </HeaderLink>
        </HeaderNav>
      </Header>
      <Divider />
      <Main>
        <Switch>
          <Route path={`${match.url}/dashboard`} component={Dashboard} />
          <Route path={`${match.url}/collections`} component={Collections} />
          <Route path={`${match.url}/pages`} component={Pages} />
          <Route
            exact
            path={match.url}
            render={() => <Redirect to="/admin/dashboard" />}
          />
          <Route render={() => <ErrorPage />} />
        </Switch>
      </Main>
      <Footer>stuff</Footer>
    </Page>
  )
}

export default Admin
