import { useEffect, useState } from 'react'

import { useMutation } from '@tanstack/react-query'
import { z } from 'zod'

import { CalcResultStatus, CalcStatus } from './calcStatus'

const calcTaxUrl = 'http://localhost:3000/calc-tax'

export type CalcTaxParam = {
  yearsOfService: number
  isDisability: boolean
  isOfficer: boolean
  severancePay: number
}

const schema = z.object({ tax: z.number() }).strict()

export type CalcTaxResult = z.infer<typeof schema>

export const useCalcTax = () => {
  const [tax, setTax] = useState(0)

  const [calcStatus, setCalcStatus] = useState<CalcStatus>('before-calculation')

  const [calcResultStatus, setCalcResultStatus] =
    useState<CalcResultStatus>('no-result')

  const { mutate } = useMutation(
    async (param: CalcTaxParam) => {
      setCalcStatus('under-calculation')

      const response = await fetch(calcTaxUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify(param),
      })
      if (!response.ok) {
        throw new Error('Response is not ok')
      }

      const responseJson = await response.json()
      return schema.parse({ ...responseJson })
    },
    {
      onSuccess: (calcTaxResult) => {
        setCalcResultStatus('succeeded')
        setTax(calcTaxResult.tax)
      },
      onError: () => {
        setCalcResultStatus('failed')
        setTax(0)
      },
      onSettled: () => {
        setCalcStatus('done')
      },
    },
  )

  useEffect(() => {
    if (calcStatus !== 'under-calculation') {
      return
    }

    const id = setTimeout(() => {
      setCalcStatus('under-long-calculation')
    }, 300)

    return () => clearTimeout(id)
  }, [calcStatus])

  return { mutate, tax, calcStatus, calcResultStatus }
}
