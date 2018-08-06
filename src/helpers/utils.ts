import { OupoutTableState } from "../State/State";

export const nameof = <T>(name: keyof T) => name;
export const nameofFactory = <T>() => (name: keyof T) => name;

export type OupoutTableStateFields = keyof OupoutTableState;

const str = '';
const fieldName = ('array') + str;


