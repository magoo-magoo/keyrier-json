import { ChangeEvent, useCallback, useState } from 'react'

export const useToggleState = (initial = false): readonly [boolean, () => void] => {
    const [value, setValue] = useState(initial)
    return [value, () => setValue(!value)]
}

type HtmlElementHookable = HTMLSelectElement | HTMLInputElement

export const useChangeEventState = (initialValue: string): readonly [string, (e: ChangeEvent<HtmlElementHookable>) => void] => {
    const [value, setValue] = useState(initialValue)

    const eventHandler = useCallback(
        (event: ChangeEvent<HtmlElementHookable>) => {
            if (event && event.target) {
                setValue(event.target.value)
            }
        },
        [setValue],
    )

    return [value, eventHandler]
}
