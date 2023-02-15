import { ComponentMeta, ComponentStoryObj } from '@storybook/react'

import { Presentation } from './Page'

export default {
  component: Presentation,
} as ComponentMeta<typeof Presentation>

export const Standard: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000 },
}

export const NoResult: ComponentStoryObj<typeof Presentation> = {
  args: { tax: null },
}
