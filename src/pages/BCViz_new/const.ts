import type { TextFieldProps } from "@mui/material";

const { freeze } = Object;
export const TextFieldProps_Number: TextFieldProps = freeze({
  inputProps: {
    min: 0,
    max: 99,
    inputMode: 'numeric',
    pattern: '^(0|[1-9]\d*)$',
  },
  inputMode: 'numeric',
  type: 'number',

} as TextFieldProps);