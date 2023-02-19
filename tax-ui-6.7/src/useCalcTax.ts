import { useMutation } from '@tanstack/react-query'

const calcTaxUrl = 'http://localhost:3000/calc-tax'

export type CalcTaxParam = {
  yearsOfService: number
  isDisability: boolean
  isOfficer: boolean
  severancePay: number
}

export type CalcTaxResult = {
  tax: number
}

export const useCalcTax = () =>
  useMutation((param: CalcTaxParam) =>
    fetch(calcTaxUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(param),
    }),
  )
