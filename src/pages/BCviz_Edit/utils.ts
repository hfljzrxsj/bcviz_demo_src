import { type TextFieldProps } from "@mui/material";
import { type SetState } from "ahooks/lib/useSetState";
import { isUndefined } from "lodash";
import { commonUseSearchParams } from "../BCviz/const";
import { fileNameKeys } from "../BCviz/FileUpload";
import type { SetURLSearchParams } from "react-router-dom";
const { isSafeInteger } = Number;

export const setStateOnChange = <T extends Record<string, unknown>> (setState: SetState<T>, k: string): TextFieldProps['onChange'] => (e) => {
  type SetStateParams0 = Parameters<typeof setState>[0];
  const { value } = e.target;
  if (value === '' || isUndefined(value)) {
    setState(({
      [k]: undefined,
    }) as SetStateParams0);
  } else {
    const n1 = parseInt(value);
    const n2 = Number(value);
    if (isSafeInteger(n1) && isSafeInteger(n2)) {
      setState(({
        [k]: n1,
      }) as SetStateParams0);
    }
  }
};
export const datasetKey = fileNameKeys[0];

export const setSearchParamForDataset = (setSearchParams: SetURLSearchParams) => (dataset: string) => {
  setSearchParams({
    [datasetKey]: dataset
  }, commonUseSearchParams);
};