// このファイルは「残すStoryを考える」で削除しました（参照用に残してあります）
import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { Result } from './Result'

export default {
  component: Result,
} as ComponentMeta<typeof Result>

export const Standard: ComponentStoryObj<typeof Result> = {
  args: { tax: 10000 },
}

export const NoResult: ComponentStoryObj<typeof Result> = {
  args: { tax: null },
}
