import { useState } from 'react'

import { Heading, HStack, Spacer, VStack } from '@chakra-ui/react'

import { InputForm } from './InputForm'
import { Result } from './Result'

type PresentationProps = {
  tax: number | null
}

export const Presentation = ({ tax }: PresentationProps) => (
  <VStack marginY={5} spacing={5} w="100%" minW="800px">
    <Heading>退職金の所得税計算アプリケーション</Heading>
    <HStack w="100%">
      <Spacer />
      <InputForm w="400px" h="500px" />
      <Result w="400px" h="500px" tax={tax} />
      <Spacer />
    </HStack>
  </VStack>
)

export const Page = () => {
  // TODO APIからデータを取得する
  const [tax] = useState(10000)

  return <Presentation tax={tax} />
}
