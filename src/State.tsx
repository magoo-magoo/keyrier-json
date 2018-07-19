export interface IQueryState {
  text: string;
}

export interface ISourceState {
  text: string;
}

export interface IOupoutState {
  text: string;
}

export interface IState {
  source: ISourceState;
  query: IQueryState;
  output: IOupoutState;
}
