import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { userEvent } from '@storybook/testing-library'
import { screen } from '@storybook/testing-library'

import { Presentation } from './Page'

export default {
  component: Presentation,
} as ComponentMeta<typeof Presentation>

type StoryType = ComponentStoryObj<typeof Presentation>

export const BeforeCalculation: StoryType = {
  args: {
    tax: 0,
    calcStatus: 'before-calculation',
    calcResultStatus: 'no-result',
  },
}

export const UnderCalculationAfterNoResult: StoryType = {
  args: {
    tax: 0,
    calcStatus: 'under-calculation',
    calcResultStatus: 'no-result',
  },
}

export const UnderCalculationAfterSucceeded: StoryType = {
  args: {
    tax: 10000,
    calcStatus: 'under-calculation',
    calcResultStatus: 'succeeded',
  },
}

export const UnderCalculationAfterFailed: StoryType = {
  args: {
    tax: 0,
    calcStatus: 'under-calculation',
    calcResultStatus: 'failed',
  },
}

export const UnderLongCalculation: StoryType = {
  args: {
    tax: 10000,
    calcStatus: 'under-long-calculation',
    calcResultStatus: 'succeeded',
  },
}

export const Succeeded: StoryType = {
  args: { tax: 10000, calcStatus: 'done', calcResultStatus: 'succeeded' },
}

export const Failed: StoryType = {
  args: { tax: 0, calcStatus: 'done', calcResultStatus: 'failed' },
}

export const ValidationError: StoryType = {
  args: {
    tax: 0,
    calcStatus: 'before-calculation',
    calcResultStatus: 'no-result',
  },
  play: () => {
    userEvent.clear(screen.getByLabelText('勤続年数'))
    userEvent.clear(screen.getByLabelText('退職金'))
    userEvent.tab()
  },
}
