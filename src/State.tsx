import { persons } from "./data/persons";

export interface IQueryState {
  text: string;
}

export interface ISourceState {
  text: string;
}

export interface IOupoutState {
  text: string;
}

export interface IRootState {
  source: ISourceState;
  query: IQueryState;
  output: IOupoutState;
}

export interface IAppState {
    rootReducer : IRootState;
}


export const initialState: IRootState = {
    output: { text: "" },
    query: {
      text: `data
    .filter(user => user.gender === 'female')
    .filter(user => user.age > 30)
    .map(user => { return { name: user.name, age:user.age} })`
    },
    source: { text: JSON.stringify(persons) }
  };
  