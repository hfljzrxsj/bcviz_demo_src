import {
  TextField, type AutocompleteProps, type AutocompleteRenderInputParams,
  type BaseTextFieldProps,
} from '@mui/material';

const AutocompleteRenderInput = ({
  InputLabelProps,
  ...params
}: AutocompleteRenderInputParams & Omit<BaseTextFieldProps, keyof AutocompleteRenderInputParams>) => {
  return (
    <TextField
      {...params}
      size="medium"
      InputLabelProps={{
        ...InputLabelProps,
        className: InputLabelProps?.className ?? '',
        style: InputLabelProps?.style ?? {},
      }}
    />
  );
};
export default AutocompleteRenderInput;
