import * as React from 'react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  render,
  renderHook,
  RenderHookOptions,
  RenderOptions,
} from '@testing-library/react'
import { matchRequestUrl, MockedRequest } from 'msw'
import { SetupServer } from 'msw/lib/node'

import { ChakraProvider, theme } from '@chakra-ui/react'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
  logger: {
    log: console.log,
    warn: console.warn,
    // ✅ no more errors on the console for tests
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => {},
  },
})

const AllProviders = ({ children }: { children?: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    <ChakraProvider theme={theme}>{children}</ChakraProvider>
  </QueryClientProvider>
)

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllProviders, ...options })

export { customRender as render }

const customRenderHook = <Result, Props>(
  render: (initialProps: Props) => Result,
  options?: RenderHookOptions<Props>,
) => renderHook(render, { wrapper: AllProviders, ...options })

export { customRenderHook as renderHook }

export const waitForRequest = (
  server: SetupServer,
  method: string,
  url: string,
) => {
  let requestId = ''
  return new Promise<MockedRequest>((resolve, reject) => {
    server.events.on('request:start', (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase()
      const matchesUrl = matchRequestUrl(req.url, url).matches
      if (matchesMethod && matchesUrl) {
        requestId = req.id
      }
    })
    server.events.on('request:match', (req) => {
      if (req.id === requestId) {
        resolve(req)
      }
    })
    server.events.on('request:unhandled', (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`),
        )
      }
    })
  })
}
