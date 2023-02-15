import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'
import { screen } from '@storybook/testing-library'

import { Presentation } from './Page'

export default {
  component: Presentation,
} as ComponentMeta<typeof Presentation>

export const Before: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'before' },
}

export const Calculating: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000, calcStatus: 'calculating' },
}

export const Succeeded: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000, calcStatus: 'succeeded' },
}

export const Failed: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000, calcStatus: 'failed' },
}

export const ValidationError: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'before' },
  play: () => {
    userEvent.clear(screen.getByLabelText('勤続年数'))
    userEvent.clear(screen.getByLabelText('退職金'))
    userEvent.tab()
  },
}
