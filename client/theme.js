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
