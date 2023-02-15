import { extendTheme } from '@chakra-ui/react'

const fontFamily =
  '"Helvetica Neue", Arial, "Hiragino Kaku Gothic ProN", "Hiragino Sans",' +
  ' Meiryo, sans-serif'

export const theme = extendTheme({
  fonts: {
    body: fontFamily,
    heading: fontFamily,
  },
})
