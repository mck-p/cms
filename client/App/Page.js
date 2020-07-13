import React from 'react'
import Meta from './Meta'
import styled from '@emotion/styled'
import * as Components from '@/client/Components'

const Main = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Page = ({ meta, blocks, menu_id }) => (
  <React.Fragment>
    <Meta {...meta} />
    <Main>
      {blocks.map(({ id, type, props }) => {
        // If there is no component with that name,
        // just skip this
        if (!(type in Components)) {
          return null
        }

        const Component = Components[type]

        return <Component {...props} menu_id={menu_id} key={id} />
      })}
    </Main>
  </React.Fragment>
)

export default Page
