import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Card,
  CardBody,
  CardHeader,
  CardProps,
  Center,
  Heading,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'

import { CalcResultStatus, CalcStatus } from './calcStatus'

type ResultProps = CardProps & {
  tax: number
  calcStatus: CalcStatus
  calcResultStatus: CalcResultStatus
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ja-JP').format(price)
}

const BeforeCalculationView = () => (
  <Box aria-label="tax">
    <Text as="span" fontSize="6xl">
      ---
    </Text>
    <Text as="span" marginLeft={1}>
      円
    </Text>
  </Box>
)

const UnderLongCalculationView = () => <Spinner size="xl" m={5} />

const FailedView = () => (
  <Alert status="error">
    <AlertIcon />
    <AlertDescription>
      エラーが発生しました。しばらくしてからもう一度お試しください。
    </AlertDescription>
  </Alert>
)

const SucceededView = ({ tax }: { tax: number }) => {
  const taxStr = formatPrice(tax)
  return (
    <Box aria-label="tax">
      <Text as="span" fontSize="6xl">
        {taxStr}
      </Text>
      <Text as="span" marginLeft={1}>
        円
      </Text>
    </Box>
  )
}

const CalcStatusView = ({
  tax,
  calcStatus,
  calcResultStatus,
}: {
  tax: number
  calcStatus: CalcStatus
  calcResultStatus: CalcResultStatus
}) => {
  if (calcStatus === 'before-calculation') {
    return <BeforeCalculationView />
  }

  if (calcStatus === 'under-long-calculation') {
    return <UnderLongCalculationView />
  }

  switch (calcResultStatus) {
    case 'no-result':
      return <BeforeCalculationView />
    case 'succeeded':
      return <SucceededView tax={tax} />
    default:
      return <FailedView />
  }
}

export const Result = ({
  tax,
  calcStatus,
  calcResultStatus,
  ...props
}: ResultProps) => {
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
          <CalcStatusView
            tax={tax}
            calcStatus={calcStatus}
            calcResultStatus={calcResultStatus}
          />
        </VStack>
      </CardBody>
    </Card>
  )
}
