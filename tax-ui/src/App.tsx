import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { ChakraProvider } from '@chakra-ui/react'

import { theme } from './theme'

const queryClient = new QueryClient()

export const App = () => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>Hello</ChakraProvider>
  </QueryClientProvider>
)
