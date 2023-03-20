import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { screen, userEvent } from '@storybook/testing-library'

import { Presentation } from './Page'

export default {
  component: Presentation,
} as ComponentMeta<typeof Presentation>

export const BeforeCalculation: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'before-calculation' },
}

export const UnderCalculation: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000, calcStatus: 'under-calculation' },
}

export const Succeeded: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000, calcStatus: 'succeeded' },
}

export const Failed: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000, calcStatus: 'failed' },
}

export const ValidationError: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'before-calculation' },
  play: () => {
    userEvent.clear(screen.getByLabelText('勤続年数'))
    userEvent.clear(screen.getByLabelText('退職金'))
    userEvent.tab()
  },
}
