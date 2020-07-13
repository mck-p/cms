import React from 'react'
import styled from '@emotion/styled'
import Avatar from '@material-ui/core/Avatar'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

const HeaderLink = styled(Link)`
  color: inherit;
  text-decoration: none;
`

const HeaderWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 0.5rem;
  justify-content: space-between;
  align-items: center;
`

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;

  ${HeaderLink}:not(:first-of-type) {
    margin-left: 1rem;
  }
`

const Header = ({ text, logo, menu_id }) => {
  const menu = useSelector(({ menus }) => menus[menu_id] || { items: [] })

  return (
    <HeaderWrapper>
      <HeaderLink to="/">
        <Avatar src={logo} alt={text + ' Company Logo'} />
      </HeaderLink>
      <Nav>
        {menu.items.map(({ id, label, href }) => (
          <HeaderLink key={id} to={href}>
            <Typography variant="subtitle1" component="span">
              {label}
            </Typography>
          </HeaderLink>
        ))}
      </Nav>
    </HeaderWrapper>
  )
}

export default Header
