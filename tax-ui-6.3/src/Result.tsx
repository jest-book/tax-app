import {
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Center,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react'

type ResultProps = CardProps & {
  tax: number | null
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ja-JP').format(price)
}

const noValueStr = '---'

export const Result = ({ tax, ...props }: ResultProps) => {
  const taxStr = tax === null ? noValueStr : formatPrice(tax)
  return (
    <Card h="200px" w="400px" {...props}>
      <CardHeader>
        <Center>
          <Heading as="h3" size="md">
            退職金にかかる所得税
          </Heading>
        </Center>
      </CardHeader>
      <CardBody>
        <VStack>
          <Box aria-label="tax">
            <Text as="span" fontSize="6xl">
              {taxStr}
            </Text>
            <Text as="span" marginLeft={1}>
              円
            </Text>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}
