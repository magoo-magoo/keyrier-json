export const configuration = {
    limitUndo: 9999,
    storageKey: {
        appState: 'keyrier-json.app.state',
        userSettings: 'keyrier-json.user.settings.v1',
    },
    layout: {
        keys: {
            lateralMenuKey: 'LateralMenu',
            sourceEditorKey: 'SourceEditor',
            queryEditorKey: 'QueryEditor',
            outputKey: 'Output',
        },
    },
} as const
