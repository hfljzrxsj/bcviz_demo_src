import type {
  // RRN_,
  // RRNReactElementGenericity,
  RRNboolean,
  RRNstring,
  // RRNnumber,
  // anyReactElementGenericity
} from '@/types';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { actionInterface, TypedUseSelectorHookState } from '.';
import type { DBConfigData } from '@/components/Menu';
export enum enumActionName {
  SET = 'SET'
}
// eslint-disable-next-line no-shadow
export enum enumDB {
  config = 'config',
  index = 'index',
  TRIGGER = 'TRIGGER'
}
interface State {
  // readonly [enumAppBarTitle.title]: RRNstring;
  readonly [enumDB.config]?: DBConfigData;
  readonly [enumDB.index]?: RRNboolean;
  readonly [enumDB.TRIGGER]?: RRNstring;
}
// export type RRNState = RRN_<State>;
export type DBAction = actionInterface<State, enumActionName>;
const initialState = {
  [enumDB.config]: [],
  [enumDB.index]: false,
  [enumDB.TRIGGER]: '',
},
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/default-param-last, default-param-last
  reducer = (state = initialState, action: DBAction) => {
    const { type, payload = {} } = action;
    switch (type) {
      case enumActionName.SET:
        return ({
          ...state,
          ...payload,
        });
      default:
        return state;
    }
  };
export const useDBTypedSelector: TypedUseSelectorHook<TypedUseSelectorHookState<State>> = useSelector;
export default reducer;