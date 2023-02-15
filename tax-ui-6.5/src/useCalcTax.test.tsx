import { act, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { renderHook, waitForRequest } from './test-utils'
import { useCalcTax } from './useCalcTax'

const server = setupServer()
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  server.events.removeAllListeners()
})
afterAll(() => server.close())

const waitForCalcTaxRequest = () =>
  waitForRequest(server, 'POST', 'http://localhost:3000/calc-tax')

describe('useCalcTax', () => {
  test('所得税計算APIを呼び出せる', async () => {
    server.use(
      rest.post('http://localhost:3000/calc-tax', async (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({ tax: 15315 }))
      }),
    )

    const pendingRequest = waitForCalcTaxRequest()

    const { result } = renderHook(() => useCalcTax())

    act(() => {
      result.current.mutate({
        yearsOfService: 6,
        isOfficer: false,
        isDisability: false,
        severancePay: 3_000_000,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.status).toBe(200)
    expect(await result.current.data?.json()).toStrictEqual({ tax: 15315 })

    const request = await pendingRequest
    expect(await request.json()).toStrictEqual({
      yearsOfService: 6,
      isOfficer: false,
      isDisability: false,
      severancePay: 3_000_000,
    })
  })

  test('所得税計算APIがBad Requestを返す場合', async () => {
    server.use(
      rest.post('http://localhost:3000/calc-tax', async (req, res, ctx) => {
        return res(ctx.status(400), ctx.json({ message: 'Invalid parameter.' }))
      }),
    )

    const { result } = renderHook(() => useCalcTax())

    act(() => {
      result.current.mutate({
        yearsOfService: 6,
        isOfficer: false,
        isDisability: false,
        severancePay: 3_000_000,
      })
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.isError).toBe(false)
    expect(result.current.data?.status).toBe(400)
    expect(await result.current.data?.json()).toStrictEqual({
      message: 'Invalid parameter.',
    })
  })
})
