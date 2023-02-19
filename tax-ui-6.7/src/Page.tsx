import { useState } from 'react'
import { SubmitHandler } from 'react-hook-form'

import { Heading, HStack, Spacer, VStack } from '@chakra-ui/react'

import { CalcStatus } from './calcStatus'
import { FormInputs, InputForm } from './InputForm'
import { Result } from './Result'
import { CalcTaxResult, useCalcTax } from './useCalcTax'

type PresentationProps = {
  tax: number | null
  onInputFormSubmit: SubmitHandler<FormInputs>
  calcStatus: CalcStatus
}

export const Presentation = ({
  tax,
  onInputFormSubmit,
  calcStatus,
}: PresentationProps) => (
  <VStack marginY={5} spacing={5} w="100%" minW="800px">
    <Heading>退職金の所得税計算アプリケーション</Heading>
    <HStack w="100%">
      <Spacer />
      <InputForm
        w="400px"
        h="550px"
        onInputFormSubmit={onInputFormSubmit}
        calcStatus={calcStatus}
      />
      <Result w="400px" h="550px" tax={tax} calcStatus={calcStatus} />
      <Spacer />
    </HStack>
  </VStack>
)

export const Page = () => {
  const [calcStatus, setCalcStatus] = useState<CalcStatus>('before-calculation')
  const [tax, setTax] = useState<number | null>(null)

  const { mutate } = useCalcTax()

  const handleInputFormSubmit = (formInputs: FormInputs) => {
    setCalcStatus('under-calculation')
    mutate(formInputs, {
      onSuccess: async (data) => {
        if (data.ok) {
          const json = (await data.json()) as CalcTaxResult
          setCalcStatus('succeeded')
          setTax(json.tax)
        } else {
          setCalcStatus('failed')
          setTax(null)
        }
      },
      onError: () => {
        setCalcStatus('failed')
        setTax(null)
      },
    })
  }

  return (
    <Presentation
      tax={tax}
      onInputFormSubmit={handleInputFormSubmit}
      calcStatus={calcStatus}
    />
  )
}
