import 'ace-builds'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/theme-solarized_dark'
import 'ace-builds/src-noconflict/theme-terminal'
import 'ace-builds/src-noconflict/theme-tomorrow'
import 'ace-builds/webpack-resolver'
import * as React from 'react'
import { FC } from 'react'
import Ace from 'react-ace'
import { EditorTheme } from 'themes/themes'

type Props = {
    mode: 'javascript' | 'mysql' | 'json'
    theme: EditorTheme
    name: string
    value: string
    onChange: (v: string, e: React.ChangeEvent) => void
}
const AceEditor: FC<Props> = ({ mode, theme, name, value, onChange }) => {
    return (
        <Ace
            mode={mode}
            theme={theme}
            name={name}
            onChange={onChange}
            fontSize={16}
            highlightActiveLine={true}
            value={value}
            minLines={30}
            maxLines={Infinity}
            showPrintMargin={false}
            showGutter={false}
            cursorStart={1}
            width={`100%`}
            debounceChangePeriod={750}
        />
    )
}
export { AceEditor }
