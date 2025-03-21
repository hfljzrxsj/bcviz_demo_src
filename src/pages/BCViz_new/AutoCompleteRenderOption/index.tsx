import type { Children } from '@/types/children';
import {
  Paper, Autocomplete, Checkbox, TextField,
  type AutocompleteRenderInputParams,
  type BaseTextFieldProps,
  type AutocompleteProps,
  Tooltip,
  MenuItem,
} from '@mui/material';
import { filter, isUndefined, negate, omitBy } from 'lodash';
// type TT<T> = AutocompleteProps<T, true, true, false, "div">['renderOption'];
// const a = ({ autoFocus,
//   tabIndex,
//   className,
//   style,
//   ...props }, { label, ...option }, state) => {
//   return <Tooltip title={getTooltipTitle(option)} arrow placement="right"><MenuItem
//     {...props}
//     // {...(isUndefined(autoFocus) ? {} : { autoFocus })}
//     {...fromEntries(entries({
//       autoFocus,
//       tabIndex,
//       className,
//       style,
//     }).filter(([, v]) => !isUndefined(v)))}
//   >
//     {/* <div> */}
//     {label ?? `Rank ${state.index + 1}`}
//     {/* </div> */}
//   </MenuItem></Tooltip>;
//   ;
// };
// export default;
// const isNotU = negate(isUndefined);
// console.log(isNotU(undefined));
// console.log(isNotU(1));


export default function AutoCompleteRenderOptionMenuItem ({
  children,
  autoFocus,
  tabIndex,
  className,
  style,
  ...others
}: Parameters<NonNullable<AutocompleteProps<unknown, true, true, false>['renderOption']>>[0] & Children) {

  return <MenuItem
    {...others}
    {
    ...omitBy({
      autoFocus,
      tabIndex,
      className,
      style,
    }, isUndefined)
    }
  // {...fromEntries(entries({
  //   autoFocus,
  //   tabIndex,
  //   className,
  //   style,
  // }).filter(([, v]) => !isUndefined(v)))}
  >
    {/* <div> */}
    {children}
    {/* </div> */}
  </MenuItem>;
};