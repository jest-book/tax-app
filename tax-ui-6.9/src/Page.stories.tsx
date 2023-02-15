import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'
import { screen } from '@storybook/testing-library'

import { Presentation } from './Page'

export default {
  component: Presentation,
} as ComponentMeta<typeof Presentation>

export const InitialState: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'before', calcResultStatus: 'notyet' },
}

export const CalculatingAfterInitialState: ComponentStoryObj<
  typeof Presentation
> = {
  args: { tax: 0, calcStatus: 'calculating', calcResultStatus: 'notyet' },
}

export const CalculatingAfterSucceeded: ComponentStoryObj<typeof Presentation> =
  {
    args: {
      tax: 10000,
      calcStatus: 'calculating',
      calcResultStatus: 'succeeded',
    },
  }

export const CalculatingAfterFailed: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'calculating', calcResultStatus: 'failed' },
}

export const LongCalculating: ComponentStoryObj<typeof Presentation> = {
  args: {
    tax: 10000,
    calcStatus: 'long-calculating',
    calcResultStatus: 'succeeded',
  },
}

export const Succeeded: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 10000, calcStatus: 'done', calcResultStatus: 'succeeded' },
}

export const Failed: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'done', calcResultStatus: 'failed' },
}

export const ValidationError: ComponentStoryObj<typeof Presentation> = {
  args: { tax: 0, calcStatus: 'before', calcResultStatus: 'notyet' },
  play: () => {
    userEvent.clear(screen.getByLabelText('勤続年数'))
    userEvent.clear(screen.getByLabelText('退職金'))
    userEvent.tab()
  },
}
