import { z } from 'zod'

type CalcRetirementIncomeDeductionInput = {
  // 勤続年数
  yearsOfService: number
  // 障害者となったことに直接基因して退職したか
  isDisability: boolean
}

// 退職所得控除額
export const calcRetirementIncomeDeduction = ({
  yearsOfService,
  isDisability,
}: CalcRetirementIncomeDeductionInput) => {
  let deduction: number
  if (yearsOfService === 1) {
    deduction = 800_000
  } else if (yearsOfService <= 19) {
    deduction = 400_000 * yearsOfService
  } else {
    deduction = 8_000_000 + 700_000 * (yearsOfService - 20)
  }

  if (isDisability) {
    deduction += 1_000_000
  }
  return deduction
}

type CalcTaxableRetirementIncomeInput = {
  // 勤続年数
  yearsOfService: number
  // 役員等かどうか
  isOfficer: boolean
  // 退職金
  severancePay: number
  // 退職所得控除額
  retirementIncomeDeduction: number
}

// 課税退職所得金額
export const calcTaxableRetirementIncome = ({
  yearsOfService,
  isOfficer,
  severancePay,
  retirementIncomeDeduction,
}: CalcTaxableRetirementIncomeInput) => {
  const targetIncome = severancePay - retirementIncomeDeduction
  if (targetIncome <= 0) {
    return 0
  }

  const calc = () => {
    if (yearsOfService >= 6) {
      return targetIncome / 2
    }

    if (isOfficer) {
      return targetIncome
    }

    if (targetIncome > 3_000_000) {
      return targetIncome - 1_500_000
    }

    return targetIncome / 2
  }

  return Math.floor(calc() / 1000) * 1000
}

type CalcIncomeTaxBaseInput = {
  // 課税退職所得金額
  taxableRetirementIncome: number
}

// 基準所得税額
export const calcIncomeTaxBase = ({
  taxableRetirementIncome,
}: CalcIncomeTaxBaseInput) => {
  if (taxableRetirementIncome === 0) {
    return 0
  }

  const calc = (income: number, taxRate: number, deduction: number) =>
    (income * taxRate) / 100 - deduction

  if (taxableRetirementIncome <= 1_949_000) {
    return calc(taxableRetirementIncome, 5, 0)
  }
  if (taxableRetirementIncome <= 3_299_000) {
    return calc(taxableRetirementIncome, 10, 97_500)
  }
  if (taxableRetirementIncome <= 6_949_000) {
    return calc(taxableRetirementIncome, 20, 427_500)
  }
  if (taxableRetirementIncome <= 8_999_000) {
    return calc(taxableRetirementIncome, 23, 636_000)
  }
  if (taxableRetirementIncome <= 17_999_000) {
    return calc(taxableRetirementIncome, 33, 1_536_000)
  }
  if (taxableRetirementIncome <= 39_999_000) {
    return calc(taxableRetirementIncome, 40, 2_796_000)
  }
  return calc(taxableRetirementIncome, 45, 4_796_000)
}

type CalcTaxWithheldInput = {
  // 基準所得税額
  incomeTaxBase: number
}

// 所得税の源泉徴収税額
export const calcTaxWithheld = ({ incomeTaxBase }: CalcTaxWithheldInput) => {
  return Math.floor((incomeTaxBase * 1021) / 1000)
}

const calcSeverancePayTaxInputSchema = z
  .object({
    // 勤続年数
    yearsOfService: z.number().int().gte(1).lte(100),
    // 障害者となったことに直接基因して退職したか
    isDisability: z.boolean(),
    // 役員等かどうか
    isOfficer: z.boolean(),
    // 退職金
    severancePay: z.number().int().gte(0).lte(1_000_000_000_000),
  })
  .strict()

type CalcSeverancePayTaxInput = z.infer<typeof calcSeverancePayTaxInputSchema>

const validateInput = (input: CalcSeverancePayTaxInput) => {
  try {
    return calcSeverancePayTaxInputSchema.parse(input)
  } catch (e) {
    throw new Error('Invalid argument.', { cause: e })
  }
}

// 退職金の所得税
export const calcIncomeTaxForSeverancePay = (
  input: CalcSeverancePayTaxInput,
) => {
  const { yearsOfService, isDisability, isOfficer, severancePay } =
    validateInput(input)

  const retirementIncomeDeduction = calcRetirementIncomeDeduction({
    yearsOfService,
    isDisability,
  })

  const taxableRetirementIncome = calcTaxableRetirementIncome({
    yearsOfService,
    isOfficer,
    severancePay,
    retirementIncomeDeduction,
  })

  const incomeTaxBase = calcIncomeTaxBase({ taxableRetirementIncome })

  return calcTaxWithheld({ incomeTaxBase })
}
