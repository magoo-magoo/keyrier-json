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