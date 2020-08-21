import Actions from 'actions/actions'

import { arrayElementName } from '../models/array'
import { AppState, emptyState, getDefaultAppState, QueryState } from '../state/State'
import { availableEditorThemes, availableGeneralThemes } from '../themes/themes'
import rootReducers, { containsTerm, query, resetApp, source } from './reducers'

describe('Reducers', () => {
    it('rootReducers should reset', () => {
        const state = {
            output: {
                text: 'fake o',
                obj: {},
                searchTerm: '',
                match: false,
                selectedTab: 'RawJson' as const,
                table: {
                    array: [],
                    isArray: false,
                    isModalOpen: false,
                    displayedColumns: [],
                    columns: [],
                    groupBy: [],
                },
            },
            query: { text: 'fake q', mode: 'Javascript' as const },
            source: { text: 'fake s' },
        }
        const results = resetApp(state, {
            type: 'RESET_EDITOR',
            payload: undefined,
        })

        expect(results?.query).toEqual(getDefaultAppState().query)
        expect(results?.source).toEqual(getDefaultAppState().source)
    })

    it('clear action', () => {
        const state: AppState = {
            output: {
                obj: {},
                searchTerm: '',
                match: false,
                selectedTab: 'RawJson',
                table: {
                    isArray: false,
                    isModalOpen: true,
                    displayedColumns: [],
                    columns: ['1'],
                    groupBy: [],
                },
            },
            query: { text: 'fake q', mode: 'Javascript' },
            source: { text: 'fake s' },
        }
        const results = resetApp(state, {
            type: 'CLEAR_EDITOR',
            payload: undefined,
        })

        expect(results).toEqual(emptyState)
    })

    it('update query action should update', () => {
        const state: QueryState = { text: 'initial', mode: 'Javascript' }

        const result = query(state, { payload: 'new value', type: 'UPDATE_QUERY' })

        expect(result).toEqual({ text: 'new value', mode: 'Javascript' })
    })

    it('update source action should update', () => {
        const state = { text: 'initial' }

        const result = source(state as any, {
            payload: 'new value',
            type: 'UPDATE_SOURCE_TEXT',
        })

        expect(result).toEqual({ text: 'new value' })
    })

    it('should accept an empty state', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: [],
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, { type: '' })

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result).toBeDefined()
    })

    it.each(availableEditorThemes)('should switch editor theme', (theme) => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: [],
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.switchEditorTheme(theme))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.userSettings.editorTheme).toEqual(theme)
    })

    it.each(availableGeneralThemes)('should switch general theme', (theme) => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: [],
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.switchTheme(theme))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.userSettings.globalTheme).toEqual(theme)
    })

    it('should switch on autoformat', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    source: {
                        autoFormat: false,
                    },
                    query: {},
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateAutoFormatSource(true))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.source?.autoFormat).toEqual(true)
    })

    it('should switch off autoformat', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    source: {
                        autoFormat: true,
                        text: '[]',
                    },
                    query: {},
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateAutoFormatSource(false))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.source?.autoFormat).toEqual(false)
    })

    it('should update source text', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    source: {
                        text: '[]',
                    },
                    query: {
                        text: 'data',
                        mode: 'Javascript' as const,
                    },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateSource('[{"a": 42}]'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.source?.text).toEqual('[{"a": 42}]')
        expect(result.app.present.output?.obj).toEqual([{ a: 42 }])
    })

    it('should update query text', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    source: {
                        text: '{"foo": "bar"}',
                    },
                    query: {
                        text: 'data',
                        mode: 'Javascript' as const,
                    },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateQuery('data.foo'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.query?.text).toEqual('data.foo')
        expect(result.app.present.output?.obj).toEqual('bar')
    })

    it('should reset', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {},
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.resetEditor())

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.source).toEqual(getDefaultAppState().source)
        expect(result.app.present.query).toEqual(getDefaultAppState().query)
        expect(result.app.present.error).toEqual(getDefaultAppState().error)
    })

    it('should undo', () => {
        // arrange
        const previousState = {
            app: {
                past: [{ source: { text: 'previous' } }],
                present: {},
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.undo())

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.source?.text).toEqual('previous')
    })

    it('should redo', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {},
                future: [{ source: { text: 'next' } }],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.redo())

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.source?.text).toEqual('next')
    })

    it('should clear', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: { source: { text: 'stuff' }, query: { text: 'some' } },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.clearEditor())

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.source?.text).toEqual('')
        expect(result.app.present.query?.text).toEqual('')
        expect(result.app.present.output?.obj).toEqual({})
    })

    it('should return an empty output', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: { source: { text: '' }, query: { text: '' } },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateQuery('data'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output).toEqual({
            selectedTab: 'RawJson',
            obj: null,
            objSize: 0,
            searchTerm: '',
            match: false,
            table: {
                isArray: false,
                isModalOpen: false,
                displayedColumns: [],
                columns: [],
                groupBy: [],
            },
        })
    })

    it('should return an error', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: { source: { text: '{}' }, query: { text: '' } },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateQuery('data.does.not.exist'))

        // assert
        expect(result.app.present.output?.errorMessage).toBeDefined()
    })

    it('should toggle on Output Table Modal', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: { isModalOpen: false } },
                    source: { text: '[{}]' },
                    query: { text: 'data' },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.toggleOutputTableModal())

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.table?.isModalOpen).toEqual(true)
    })

    it('should toggle off Output Table Modal', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: { isModalOpen: true } },
                    source: { text: '[{}]' },
                    query: { text: 'data' },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.toggleOutputTableModal())

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.table?.isModalOpen).toEqual(false)
    })

    it('should update output table columns', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: {} },
                    source: { text: '[{"foo": 1, "bar":2, "some": 3}]' },
                    query: { text: 'data' },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateTableColumns(['foo', 'bar']))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.table?.displayedColumns).toEqual(['foo', 'bar'])
    })

    it('should update output table group by', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: { displayedColumns: ['foo', 'bar'] } },
                    source: { text: '[{"foo": 1, "bar": 2}]' },
                    query: { text: 'data', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateTableGroupBy(['foo', 'bar']))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.table?.groupBy).toEqual(['foo', 'bar'])
    })

    it('should update output table group by with existing column', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: { displayedColumns: ['foo'] } },
                    source: { text: '[{"foo": 1}]' },
                    query: { text: 'data', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateTableGroupBy(['foo', 'bar']))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.table?.groupBy).toEqual(['foo'])
    })

    it('should update output table group by with displayed columns', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: { groupBy: ['foo', 'bar'], displayedColumns: ['foo', 'bar'] } },
                    source: { text: '[{"foo": 1, "bar": "value"}]' },
                    query: { text: 'data', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateTableColumns(['foo']))

        // assert
        expect(result.app.present.output?.errorMessage).toBeUndefined()
        expect(result.app.present.output?.table?.groupBy).toEqual(['foo'])
        expect(result.app.present.output?.table?.displayedColumns).toEqual(['foo'])
    })

    it('should update output search term', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: {} },
                    source: { text: '[{"foo": "bar", "id": 2}]' },
                    query: { text: 'data', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateSearchTerm('bar'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.searchTerm).toEqual('bar')
    })

    it('should update output tab', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: {} },
                    source: { text: '[{"foo": "bar", "id": 2}]' },
                    query: { text: 'data', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateOutputTabSelection('Table'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.selectedTab).toEqual('Table')
    })

    it('should map correctly displayed columns', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: {} },
                    source: { text: '[{"foo": "bar", "id": 2}, {}, null]' },
                    query: { text: '', mode: 'SQL' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateQuery('select foo, field2 from data'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.table?.displayedColumns).toEqual(['field2', 'foo'])
    })

    it('should map correctly displayed columns for non object array item', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: {} },
                    source: { text: '[{"foo": 42}]' },
                    query: { text: '', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateQuery('data.map(x => x.foo)'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.table?.displayedColumns).toEqual([arrayElementName])
    })

    it('should force update to RawJson if output is not a table', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: {}, selectedTab: 'RawJson' as const },
                    source: { text: '{"foo": "bar", "id": 2}' },
                    query: { text: '', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateQuery('data'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.output?.selectedTab).toEqual('RawJson')
    })

    it('should update query mode', () => {
        // arrange
        const previousState = {
            app: {
                past: [],
                present: {
                    output: { table: {} },
                    source: { text: '[{"foo": "bar", "id": 2}]' },
                    query: { text: 'select foo from data', mode: 'Javascript' as const },
                },
                future: [],
            },
            userSettings: {},
        }

        // act
        const result = rootReducers(previousState, Actions.updateQueryMode('SQL'))

        // assert
        expect(result.app.present.error).toBeUndefined()
        expect(result.app.present.query?.text).toEqual(getDefaultAppState().query?.text)
        expect(result.app.present.query?.mode).toEqual('SQL')
    })

    it('should filter object from tree if search term is not found', () => {
        const { filteredObj, match } = containsTerm(
            {
                field1: {
                    field3: 42,
                    field4: 'val',
                    field5: 'la tête à toTo est tombée.',
                },
                field2: {
                    filed6: {},
                },
                field7: {
                    field8Toto: { a: 42 },
                },
                field9: {
                    field10Array: [{ field11: 'toto' }, { field12: { field13: 'éà' } }],
                },
            },
            'toto',
        )

        expect(match).toBeTruthy()
        expect(filteredObj).toEqual({
            field1: {
                field5: 'la tête à toTo est tombée.',
            },
            field7: {
                field8Toto: { a: 42 },
            },
            field9: {
                field10Array: [{ field11: 'toto' }],
            },
        })
    })

    it('should not match if search term is not found', () => {
        const { filteredObj, match } = containsTerm(
            {
                field1: {
                    field3: 42,
                    field4: 'val',
                    field5: 'la tête est tombée.',
                },
                field2: {
                    filed6: {},
                },
                field7: {
                    field8Momo: { a: 42 },
                },
            },
            'toto',
        )

        expect(match).toBeFalsy()
        expect(filteredObj).toEqual({})
    })
})
