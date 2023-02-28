import { ComponentMeta, ComponentStoryObj } from '@storybook/react'
import { screen, userEvent } from '@storybook/testing-library'

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

export const ValidationError: ComponentStoryObj<typeof Presentation> = {
  args: { tax: null },
  play: () => {
    userEvent.clear(screen.getByLabelText('勤続年数'))
    userEvent.clear(screen.getByLabelText('退職金'))
    userEvent.tab()
  },
}
