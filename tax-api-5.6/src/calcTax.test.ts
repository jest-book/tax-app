import {
  calcRetirementIncomeDeduction,
  calcTaxableRetirementIncome,
  calcIncomeTaxBase,
  calcTaxWithheld,
} from './calcTax'

describe('退職所得控除額', () => {
  describe('勤続年数が1年の場合', () => {
    describe('「障害者となったことに直接基因して退職」に該当しない場合', () => {
      test.each`
        yearsOfService | expected
        ${1}           | ${800_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: false,
          })
          expect(deduction).toBe(expected)
        },
      )
    })

    describe('「障害者となったことに直接基因して退職」に該当する場合', () => {
      test.each`
        yearsOfService | expected
        ${1}           | ${1_800_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: true,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
  })

  describe('勤続年数が2年から19年の場合', () => {
    describe('「障害者となったことに直接基因して退職」に該当しない場合', () => {
      test.each`
        yearsOfService | expected
        ${2}           | ${800_000}
        ${3}           | ${1_200_000}
        ${19}          | ${7_600_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: false,
          })
          expect(deduction).toBe(expected)
        },
      )
    })

    describe('「障害者となったことに直接基因して退職」に該当する場合', () => {
      test.each`
        yearsOfService | expected
        ${2}           | ${1_800_000}
        ${3}           | ${2_200_000}
        ${19}          | ${8_600_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: true,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
  })

  describe('勤続年数が20年超の場合', () => {
    describe('「障害者となったことに直接基因して退職」に該当しない場合', () => {
      test.each`
        yearsOfService | expected
        ${20}          | ${8_000_000}
        ${21}          | ${8_700_000}
        ${30}          | ${15_000_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: false,
          })
          expect(deduction).toBe(expected)
        },
      )
    })

    describe('「障害者となったことに直接基因して退職」に該当する場合', () => {
      test.each`
        yearsOfService | expected
        ${20}          | ${9_000_000}
        ${21}          | ${9_700_000}
        ${30}          | ${16_000_000}
      `(
        '勤続年数$yearsOfService年 → $expected円',
        ({ yearsOfService, expected }) => {
          const deduction = calcRetirementIncomeDeduction({
            yearsOfService,
            isDisability: true,
          })
          expect(deduction).toBe(expected)
        },
      )
    })
  })
})

describe('課税退職所得金額', () => {
  describe('勤続年数が6年以上の場合', () => {
    test.each`
      yearsOfService | severancePay | deduction    | isOfficer | expected
      ${6}           | ${3_000_000} | ${2_400_000} | ${false}  | ${300_000}
      ${6}           | ${3_000_000} | ${2_400_000} | ${true}   | ${300_000}
      ${6}           | ${3_001_999} | ${2_400_000} | ${false}  | ${300_000}
      ${6}           | ${3_001_999} | ${2_400_000} | ${true}   | ${300_000}
      ${6}           | ${3_002_000} | ${2_400_000} | ${false}  | ${301_000}
      ${6}           | ${3_002_000} | ${2_400_000} | ${true}   | ${301_000}
      ${6}           | ${1_000_000} | ${2_400_000} | ${false}  | ${0}
      ${6}           | ${1_000_000} | ${2_400_000} | ${true}   | ${0}
    `(
      '勤続年数$yearsOfService年・退職金$severancePay円・退職所得控除額$deduction円・' +
        '役員等$isOfficer → $expected円',
      ({ yearsOfService, severancePay, deduction, isOfficer, expected }) => {
        const taxableIncome = calcTaxableRetirementIncome({
          yearsOfService,
          severancePay,
          isOfficer,
          retirementIncomeDeduction: deduction,
        })
        expect(taxableIncome).toBe(expected)
      },
    )
  })

  describe('役員等で勤続年数が5年以下の場合', () => {
    test.each`
      yearsOfService | severancePay | deduction    | expected
      ${5}           | ${3_000_000} | ${2_000_000} | ${1_000_000}
      ${5}           | ${3_000_999} | ${2_000_000} | ${1_000_000}
      ${5}           | ${3_001_000} | ${2_000_000} | ${1_001_000}
      ${5}           | ${1_000_000} | ${2_000_000} | ${0}
    `(
      '勤続年数$yearsOfService年・退職金$severancePay円・退職所得控除額$deduction円 → ' +
        '$expected円',
      ({ yearsOfService, severancePay, deduction, expected }) => {
        const taxableIncome = calcTaxableRetirementIncome({
          yearsOfService,
          severancePay,
          isOfficer: true,
          retirementIncomeDeduction: deduction,
        })
        expect(taxableIncome).toBe(expected)
      },
    )
  })

  describe('役員等以外で勤続年数が5年以下の場合', () => {
    describe('控除後の金額が300万円以下の場合', () => {
      test.each`
        yearsOfService | severancePay | deduction    | expected
        ${5}           | ${3_000_000} | ${2_000_000} | ${500_000}
        ${5}           | ${5_000_000} | ${2_000_000} | ${1_500_000}
        ${5}           | ${3_001_999} | ${2_000_000} | ${500_000}
        ${5}           | ${3_002_000} | ${2_000_000} | ${501_000}
        ${5}           | ${1_000_000} | ${2_000_000} | ${0}
      `(
        '勤続年数$yearsOfService年・退職金$severancePay円・退職所得控除額$deduction円 → ' +
          '$expected円',
        ({ yearsOfService, severancePay, deduction, expected }) => {
          const taxableIncome = calcTaxableRetirementIncome({
            yearsOfService,
            severancePay,
            isOfficer: false,
            retirementIncomeDeduction: deduction,
          })
          expect(taxableIncome).toBe(expected)
        },
      )
    })

    describe('控除後の金額が300万円を超える場合', () => {
      test.each`
        yearsOfService | severancePay | deduction    | expected
        ${5}           | ${6_000_000} | ${2_000_000} | ${2_500_000}
        ${5}           | ${6_001_999} | ${2_000_000} | ${2_501_000}
        ${5}           | ${6_002_000} | ${2_000_000} | ${2_502_000}
      `(
        '勤続年数$yearsOfService年・退職金$severancePay円・退職所得控除額$deduction円 → ' +
          '$expected円',
        ({ yearsOfService, severancePay, deduction, expected }) => {
          const taxableIncome = calcTaxableRetirementIncome({
            yearsOfService,
            severancePay,
            isOfficer: false,
            retirementIncomeDeduction: deduction,
          })
          expect(taxableIncome).toBe(expected)
        },
      )
    })
  })
})

describe('基準所得税額', () => {
  test.each`
    taxableRetirementIncome | expected
    ${0}                    | ${0}
    ${1_000}                | ${50}
    ${1_949_000}            | ${97_450}
    ${1_950_000}            | ${97_500}
    ${3_299_000}            | ${232_400}
    ${3_300_000}            | ${232_500}
    ${6_949_000}            | ${962_300}
    ${6_950_000}            | ${962_500}
    ${8_999_000}            | ${1_433_770}
    ${9_000_000}            | ${1_434_000}
    ${17_999_000}           | ${4_403_670}
    ${18_000_000}           | ${4_404_000}
    ${39_999_000}           | ${13_203_600}
    ${40_000_000}           | ${13_204_000}
  `(
    '課税退職所得金額$taxableRetirementIncome円 → $expected円',
    ({ taxableRetirementIncome, expected }) => {
      expect(calcIncomeTaxBase({ taxableRetirementIncome })).toBe(expected)
    },
  )
})

describe('所得税の源泉徴収税額', () => {
  test.each`
    incomeTaxBase | expected
    ${0}          | ${0}
    ${50}         | ${51}
    ${120}        | ${122}
    ${1000}       | ${1021}
  `(
    '基準所得税額$incomeTaxBase円 → $expected円',
    ({ incomeTaxBase, expected }) => {
      expect(calcTaxWithheld({ incomeTaxBase })).toBe(expected)
    },
  )
})
