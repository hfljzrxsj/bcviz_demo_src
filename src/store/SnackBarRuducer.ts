import type {
  RRN_,
  // RRNReactElementGenericity,
  RRNboolean,
  // RRNnumber,
  RRNstring
  // anyReactElementGenericity
} from '@/types';
import { useSelector, type TypedUseSelectorHook } from 'react-redux';
import type { actionInterface, TypedUseSelectorHookState } from '.';
import type { DOMString } from '@/pages/WebSQL/type';
import type { AlertColor } from '@mui/material';
import type { Reducer, Action } from 'redux';
export enum enumActionName {
  SnackbarAlert = 'SnackbarAlert',
  OPENTRUE = 'OPENTRUE',
  OPENFALSE = 'OPENFALSE',
}
// eslint-disable-next-line no-shadow
export enum enumSnackbarAlert {
  alertText = 'alertText',
  open = 'open',
  severity = 'severity'
}
// eslint-disable-next-line no-shadow
export enum enumSeverity {
  error = 'error',
  info = 'info',
  success = 'success',
  warning = 'warning'
}
export interface State {
  readonly [enumSnackbarAlert.alertText]: RRNstring | DOMString;
  readonly [enumSnackbarAlert.open]?: RRNboolean;
  readonly [enumSnackbarAlert.severity]: RRN_<AlertColor>;
}

// export type RRNState = RRN_<State>;
export type snackbarAlertAction = actionInterface<State, enumActionName> & Action;
const initialState = {
  [enumSnackbarAlert.alertText]: '',
  [enumSnackbarAlert.open]: false,
  [enumSnackbarAlert.severity]: enumSeverity.success
},
  // eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types, @typescript-eslint/default-param-last, default-param-last
  reducer: Reducer<State, snackbarAlertAction> = (state = initialState, action) => {
    const { type, payload = {} } = action;
    const snackbarAlertReturn = (bool: RRNboolean) => ({
      ...state,
      ...payload,
      [enumSnackbarAlert.open]: bool,
    });
    switch (type) {
      case enumActionName.OPENFALSE:
        return snackbarAlertReturn(false);
      case enumActionName.OPENTRUE:
        return snackbarAlertReturn(true);
      default:
        return state;
    }
  };
export const useSnackBarTypedSelector: TypedUseSelectorHook<TypedUseSelectorHookState<State>> = useSelector;
export default reducer;