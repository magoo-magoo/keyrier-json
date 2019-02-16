import { useState } from 'react'

export const useToggleState = (initial: boolean = false): [boolean, () => void] => {
  const [value, setValue] = useState(initial)
  return [value, () => setValue(!value)]
}

type HtmlElementHookable = HTMLSelectElement | HTMLInputElement

export const useChangeEventState = (
  initialValue: string
): [string, (e: React.ChangeEvent<HtmlElementHookable>) => void] => {
  const [value, setValue] = useState(initialValue)

  const eventHandler = (event: React.ChangeEvent<HtmlElementHookable>) => {
    if (event && event.target) {
      setValue(event.target.value)
    }
  }
  return [value, eventHandler]
}
