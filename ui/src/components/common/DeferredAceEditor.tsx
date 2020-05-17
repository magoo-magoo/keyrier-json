// import 'ace-builds'
import * as ace from 'ace-builds/src-min-noconflict/ace' // Load Ace Editor
import * as React from 'react'
import { FC } from 'react'
// import 'ace-builds/src-min/mode-javascript'
// import 'ace-builds/src-min/mode-json'
// import 'ace-builds/src-min/mode-mysql'
// import 'ace-builds/src-min/theme-github'
// import 'ace-builds/src-min/theme-monokai'
// import 'ace-builds/src-min/theme-solarized_dark'
// import 'ace-builds/src-min/theme-terminal'
// import 'ace-builds/src-min/theme-tomorrow'
// import 'ace-builds/webpack-resolver'
import Ace from 'react-ace'
import { EditorTheme } from 'themes/themes'

const CDN = 'https://cdn.jsdelivr.net/npm/ace-builds@1.3.3/src-min-noconflict'
ace.config.set('basePath', CDN)
ace.config.set('modePath', CDN)
ace.config.set('themePath', CDN)
ace.config.set('workerPath', CDN)

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
