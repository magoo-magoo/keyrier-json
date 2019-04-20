import { output, query, rootReducerReset, source, containsTerm } from './reducers'
import { getDefaultAppState, AppState, QueryState, emptyState } from 'State/State'

describe('Reducers', () => {
  it('rootReducers should reset', () => {
    const state: AppState = {
      output: {
        text: 'fake o',
        obj: {},
        searchTerm: '',
        match: false,
        selectedTab: 'RawJson',
        table: {
          array: [],
          isArray: false,
          isModalOpen: false,
          displayedColumns: [],
          columns: [],
          groupBy: [],
        },
      },
      query: { text: 'fake q', mode: 'Javascript' },
      source: { text: 'fake s' },
    }
    const results = rootReducerReset(state, {
      type: 'RESET_EDITOR',
    })

    expect(results.query).toEqual(getDefaultAppState().query)
    expect(results.source).toEqual(getDefaultAppState().source)
  })
  it('clear action', () => {
    const state: AppState = {
      output: {
        text: 'fake o',
        obj: {},
        searchTerm: '',
        match: false,
        selectedTab: 'RawJson',
        table: {
          array: ['fake'],
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
    const results = rootReducerReset(state, {
      type: 'CLEAR_EDITOR',
    })

    expect(results).toEqual(emptyState)
  })

  it('update query action should update', () => {
    const state: QueryState = { text: 'initial', mode: 'Javascript' }

    const result = query(state, { query: 'new value', type: 'UPDATE_QUERY' })

    expect(result).toEqual({ text: 'new value', mode: 'Javascript' })
  })

  it('update source action should update', () => {
    const state = { text: 'initial' }

    const result = source(state, {
      source: 'new value',
      type: 'UPDATE_SOURCE_TEXT',
    })

    expect(result).toEqual({ text: 'new value' })
  })

  it('output ', () => {
    const prevState: AppState = {
      output: {
        text: '{}',
        obj: {},
        match: false,
        searchTerm: '',
        selectedTab: 'RawJson',
        table: {
          array: [],
          isArray: false,
          isModalOpen: false,
          displayedColumns: [],
          columns: [],
          groupBy: [],
        },
      },
      query: { text: 'data.value', mode: 'Javascript' },
      source: { text: '{}' },
    }
    const state: AppState = {
      output: {
        obj: {},
        match: false,
        searchTerm: '',
        selectedTab: 'RawJson',
        table: {
          array: [],
          isArray: false,
          isModalOpen: false,
          displayedColumns: [],
          columns: [],
          groupBy: [],
        },
      },
      query: { text: 'data.value', mode: 'Javascript' },
      source: { text: '{"value": "test"}' },
    }

    const result = output(prevState, state, {
      type: 'EVALUATE_CODE',
    })

    expect(result.table.isArray).toEqual(false)
    expect(result.errorMessage).toBeUndefined()
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
      'toto'
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

  test('should not match if search term is not found', () => {
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
      'toto'
    )

    expect(match).toBeFalsy()
    expect(filteredObj).toEqual({})
  })
})
