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

const BeforeView = () => (
  <Box aria-label="tax">
    <Text as="span" fontSize="6xl">
      ---
    </Text>
    <Text as="span" marginLeft={1}>
      円
    </Text>
  </Box>
)

const CalculatingView = () => <Spinner size="xl" m={5} />

const FailedView = () => (
  <Alert status="error">
    <AlertIcon />
    <AlertDescription>
      エラーが発生しました。しばらくしてからもう一度お試しください。
    </AlertDescription>
  </Alert>
)

const SucceededView = ({ tax }: { tax: number }) => (
  <Box aria-label="tax">
    <Text as="span" fontSize="6xl">
      {formatPrice(tax)}
    </Text>
    <Text as="span" marginLeft={1}>
      円
    </Text>
  </Box>
)

const CalcStatusView = ({
  tax,
  calcStatus,
  calcResultStatus,
}: {
  tax: number
  calcStatus: CalcStatus
  calcResultStatus: CalcResultStatus
}) => {
  if (calcStatus === 'before') {
    return <BeforeView />
  }

  if (calcStatus === 'long-calculating') {
    return <CalculatingView />
  }

  switch (calcResultStatus) {
    case 'notyet':
      return <BeforeView />
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
