import { useState } from 'react'

export const useToggleState = (initial: boolean = false): [boolean, () => void] => {
  const [value, setValue] = useState(initial)
  return [value, () => setValue(!value)]
}
