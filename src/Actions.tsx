/*
 * action types
 */
​
export const UPDATE_SOURCE = 'UPDATE_SOURCE'

/*
 * action creators
 */
​
export function UpdateSource(text: string) {
  return { type: UPDATE_SOURCE, text }
}
​