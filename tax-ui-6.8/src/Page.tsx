import { SubmitHandler } from 'react-hook-form'

import { Heading, HStack, Spacer, VStack } from '@chakra-ui/react'

import { CalcStatus } from './calcStatus'
import { FormInputs, InputForm } from './InputForm'
import { Result } from './Result'
import { useCalcTax } from './useCalcTax'

type PresentationProps = {
  tax: number
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
  const { mutate, tax, calcStatus } = useCalcTax()

  const handleInputFormSubmit = (formInputs: FormInputs) => {
    mutate(formInputs)
  }

  return (
    <Presentation
      tax={tax}
      onInputFormSubmit={handleInputFormSubmit}
      calcStatus={calcStatus}
    />
  )
}
