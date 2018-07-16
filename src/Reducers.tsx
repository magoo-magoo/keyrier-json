import { Action, combineReducers } from 'redux'
import { UPDATE_SOURCE } from './Actions';
​
​
function editor(state = [], action: Action<string>) {
  switch (action.type) {
    case UPDATE_SOURCE:
      return [
        ...state,
        {
            completed: false,
            text: (action as any).text,
        }
      ]
    default:
      return state
  }
}
​
const rootReducers = combineReducers({
  editor
});
​
export default rootReducers