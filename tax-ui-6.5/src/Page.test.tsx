import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

import { Page } from './Page'
import { render, waitForRequest } from './test-utils'

const server = setupServer(
  rest.post('http://localhost:3000/calc-tax', async (req, res, ctx) => {
    return res(ctx.status(200), ctx.json({ tax: 10000 }))
  }),
)
beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
  server.events.removeAllListeners()
})
afterAll(() => server.close())

const waitForCalcTaxRequest = () =>
  waitForRequest(server, 'POST', 'http://localhost:3000/calc-tax')

describe('ページコンポーネント', () => {
  test('初期表示の確認', async () => {
    render(<Page />)

    expect(screen.getByLabelText('勤続年数')).toHaveValue(10)
    expect(screen.getByLabelText('退職基因')).not.toBeChecked()
    expect(screen.getByLabelText('役員等以外')).toBeChecked()
    expect(screen.getByLabelText('役員等')).not.toBeChecked()
    expect(screen.getByLabelText('退職金')).toHaveValue(5000000)

    expect(screen.getByLabelText('tax').textContent).toBe('---円')
  })

  test('所得税を計算できる', async () => {
    const pendingRequest = waitForCalcTaxRequest()

    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByText('所得税を計算する'))

    await waitFor(() =>
      expect(screen.getByLabelText('tax').textContent).toBe('10,000円'),
    )

    const request = await pendingRequest
    expect(await request.json()).toStrictEqual({
      yearsOfService: 10,
      isOfficer: false,
      isDisability: false,
      severancePay: 5_000_000,
    })
  })

  describe('勤続年数を入力できる', () => {
    test.each`
      yearsOfServiceValue
      ${'1'}
      ${'20'}
      ${'100'}
    `('勤続年数$yearsOfServiceValue', async ({ yearsOfServiceValue }) => {
      const pendingRequest = waitForCalcTaxRequest()

      const user = userEvent.setup()
      render(<Page />)

      const yearsTextBox = screen.getByLabelText('勤続年数')
      await user.clear(yearsTextBox)
      await user.type(yearsTextBox, yearsOfServiceValue)

      await user.click(screen.getByText('所得税を計算する'))

      await waitFor(() =>
        expect(screen.getByLabelText('tax').textContent).toBe('10,000円'),
      )

      const request = await pendingRequest
      expect(await request.json()).toStrictEqual({
        yearsOfService: Number(yearsOfServiceValue),
        isOfficer: false,
        isDisability: false,
        severancePay: 5_000_000,
      })
    })
  })

  describe('勤続年数のバリデーションエラーになる', () => {
    test.each`
      yearsOfServiceValue
      ${'-1'}
      ${'0'}
      ${'101'}
      ${'10.5'}
    `('勤続年数$yearsOfServiceValue', async ({ yearsOfServiceValue }) => {
      const user = userEvent.setup()
      render(<Page />)

      // 事前確認
      expect(screen.queryByText('有効な勤続年数を入力してください')).toBeNull()

      const yearsTextBox = screen.getByLabelText('勤続年数')
      await user.clear(yearsTextBox)
      await user.type(yearsTextBox, yearsOfServiceValue)

      await waitFor(() =>
        expect(
          screen.getByText('有効な勤続年数を入力してください'),
        ).toBeInTheDocument(),
      )
      expect(screen.getByLabelText('tax').textContent).toBe('---円')
    })
  })

  test('退職基因チェックボックスを選択できる', async () => {
    const pendingRequest = waitForCalcTaxRequest()

    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByLabelText('退職基因'))

    await user.click(screen.getByText('所得税を計算する'))

    await waitFor(() =>
      expect(screen.getByLabelText('tax').textContent).toBe('10,000円'),
    )

    const request = await pendingRequest
    expect(await request.json()).toStrictEqual({
      yearsOfService: 10,
      isOfficer: false,
      isDisability: true,
      severancePay: 5_000_000,
    })
  })

  test('退職基因チェックボックスを未選択にできる', async () => {
    const pendingRequest = waitForCalcTaxRequest()

    const user = userEvent.setup()
    render(<Page />)

    // 2回クリックすると未選択になる
    await user.click(screen.getByLabelText('退職基因'))
    await user.click(screen.getByLabelText('退職基因'))

    await user.click(screen.getByText('所得税を計算する'))

    await waitFor(() =>
      expect(screen.getByLabelText('tax').textContent).toBe('10,000円'),
    )

    const request = await pendingRequest
    expect(await request.json()).toStrictEqual({
      yearsOfService: 10,
      isOfficer: false,
      isDisability: false,
      severancePay: 5_000_000,
    })
  })

  test('役員等を選択できる', async () => {
    const pendingRequest = waitForCalcTaxRequest()

    const user = userEvent.setup()
    render(<Page />)

    await user.click(screen.getByLabelText('役員等'))

    await user.click(screen.getByText('所得税を計算する'))

    await waitFor(() =>
      expect(screen.getByLabelText('tax').textContent).toBe('10,000円'),
    )

    const request = await pendingRequest
    expect(await request.json()).toStrictEqual({
      yearsOfService: 10,
      isOfficer: true,
      isDisability: false,
      severancePay: 5_000_000,
    })
  })

  test('役員等以外を選択できる', async () => {
    const pendingRequest = waitForCalcTaxRequest()

    const user = userEvent.setup()
    render(<Page />)

    // 一度役員等を選択してから役員等以外を選択する
    await user.click(screen.getByLabelText('役員等'))
    await user.click(screen.getByLabelText('役員等以外'))

    await user.click(screen.getByText('所得税を計算する'))

    await waitFor(() =>
      expect(screen.getByLabelText('tax').textContent).toBe('10,000円'),
    )

    const request = await pendingRequest
    expect(await request.json()).toStrictEqual({
      yearsOfService: 10,
      isOfficer: false,
      isDisability: false,
      severancePay: 5_000_000,
    })
  })

  describe('退職金を入力できる', () => {
    test.each`
      severancePayValue
      ${'0'}
      ${'1'}
      ${'10000000'}
      ${'1000000000000'}
    `('退職金$severancePayValue', async ({ severancePayValue }) => {
      const pendingRequest = waitForCalcTaxRequest()

      const user = userEvent.setup()
      render(<Page />)

      const payTextBox = screen.getByLabelText('退職金')
      await user.clear(payTextBox)
      await user.type(payTextBox, severancePayValue)

      await user.click(screen.getByText('所得税を計算する'))

      await waitFor(() =>
        expect(screen.getByLabelText('tax').textContent).toBe('10,000円'),
      )

      const request = await pendingRequest
      expect(await request.json()).toStrictEqual({
        yearsOfService: 10,
        isOfficer: false,
        isDisability: false,
        severancePay: Number(severancePayValue),
      })
    })
  })

  describe('退職金のバリデーションエラーになる', () => {
    test.each`
      severancePayValue
      ${'-1'}
      ${'1000000000001'}
      ${'8000000.1'}
    `('退職金$severancePayValue', async ({ severancePayValue }) => {
      const user = userEvent.setup()
      render(<Page />)

      // 事前確認
      expect(screen.queryByText('有効な退職金を入力してください')).toBeNull()

      const payTextBox = screen.getByLabelText('退職金')
      await user.clear(payTextBox)
      await user.type(payTextBox, severancePayValue)

      await waitFor(() =>
        expect(
          screen.getByText('有効な退職金を入力してください'),
        ).toBeInTheDocument(),
      )
      expect(screen.getByLabelText('tax').textContent).toBe('---円')
    })
  })
})
