/*
 * action types
 */
export type UPDATE_SOURCE = "UPDATE_SOURCE";
export type UPDATE_QUERY = "UPDATE_QUERY";
export type EVALUATE_CODE = "EVALUATE_CODE";
export type RESET_EDITOR = "RESET_EDITOR";

type actionType =
  | UPDATE_SOURCE
  | UPDATE_QUERY
  | EVALUATE_CODE
  | RESET_EDITOR;

/*
 * action creators
 */

export const updateSource = (source: string): IActionValue<string> => ({
  type: "UPDATE_SOURCE",
  value: source
});

export const updateQuery = (query: string): IActionValue<string> => ({
  type: "UPDATE_QUERY",
  value: query
});

export const resetEditor = (): IAction => ({
  type: "RESET_EDITOR"
});

interface IActionValue<T> {
  value: T;
  type: actionType;
}

interface IAction {
  type: actionType;
}

export type t = IActionValue<void>;

export let a: Action = {type: 'EVALUATE_CODE'};


export let v: ActionValue<number> = {  type: "EVALUATE_CODE", value: 42 };

export type Action = Readonly<IAction>;
export type ActionValue<T> = Readonly<IActionValue<T>>;
