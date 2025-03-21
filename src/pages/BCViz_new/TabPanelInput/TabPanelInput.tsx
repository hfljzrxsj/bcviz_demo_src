import { some } from "lodash";
import { unstable_batchedUpdates } from "react-dom";
import { toast } from "react-toastify";
import InputST, { type InputSTSetState } from "../InputST";
import {
  Paper, Autocomplete, Checkbox, TextField,
  type AutocompleteRenderInputParams,
  type BaseTextFieldProps,
  MenuItem,
} from '@mui/material';
import style from './_index.module.scss';
import { useSetState } from 'ahooks';
import { LoadingButton, TabPanel } from "@mui/lab";
import BCVizNewStyle from "../_index.module.scss";
import { Modes, ModesShortcut, getDotName } from "../utils";
import { inputLabels } from "../Echarts";
import type { OriginDataObjArr, PosDataObjArr, UseGetFromST } from "@/pages/BCviz/types";
import type { FileNames } from "../api";

import type { Children } from "@/types/children";
import AutoCompleteRenderOptionMenuItem from "../AutoCompleteRenderOption";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import AutocompleteRenderInput from "../AutoCompleteRenderInput";
import { useSafeState } from 'ahooks';
import { uvIndObj } from "@/pages/BCviz/utils";
const { freeze } = Object;
export type UseSetState<T extends Record<string, any>> = typeof useSetState<T>;
export type UseSetInputST = ReturnType<UseSetState<InputSTSetState>>;

type UseSafeState<T> = ReturnType<typeof useSafeState<T>>;

export default function TabPanelInput (props: {
  readonly useSetInputST: UseSetInputST;
  readonly modeKey: Modes;
  readonly fileNames: FileNames;
  readonly setTabToResult: () => void;
  readonly dataArrWithPos: OriginDataObjArr;
  readonly useMultiDots: UseSafeState<OriginDataObjArr>;
  // readonly labelS: string;
  // readonly labelT: string;
} & UseGetFromST) {
  const { useSetInputST, modeKey: mode, useGetFromST,
    fileNames,
    setTabToResult,
    dataArrWithPos,
    useMultiDots: [
      multiDots, setMultiDots,
    ],
    // children,
  } = props;
  const { data, loading, runAsync } = useGetFromST;
  const [inputST, setInputST] = useSetInputST;
  const { s: labelS = '', t: labelT = '' } = inputLabels[mode] ?? {};
  return <TabPanel value={mode} className={BCVizNewStyle['TabPanel'] ?? ''}>
    <Paper elevation={24} className={style['Input'] ?? ''}>
      <InputST {...{ useSetInputST }}
        k='s'
        label={labelS}
      />
      <InputST {...{ useSetInputST }}
        k='t'
        label={labelT}
      />
      <Autocomplete
        //@ts-expect-error
        value={multiDots ?? []}
        onChange={(e, v) => {
          setMultiDots(v);
        }}
        multiple
        options={dataArrWithPos}
        getOptionLabel={getDotName}
        renderOption={(props, dotData, { selected }) => {
          return (
            <AutoCompleteRenderOptionMenuItem {...props} >
              <Checkbox
                icon={<CheckBoxOutlineBlankIcon fontSize="large" />}
                checkedIcon={<CheckBoxIcon fontSize="large" />}
                checked={selected}
              />
              {getDotName(dotData)}
            </AutoCompleteRenderOptionMenuItem>
          );
        }}
        renderInput={(params) => <AutocompleteRenderInput
          {...params}
          label='Choose Vertices'
          placeholder="Choose Vertices"
        />}
        disableCloseOnSelect={true}
        autoComplete
        autoCapitalize="words"
        autoFocus
        autoHighlight
        // blurOnSelect
        clearOnBlur
        clearOnEscape
        fullWidth
        handleHomeEndKeys
        includeInputInList
        openOnFocus
        selectOnFocus
        disableClearable={false}
        disabledItemsFocusable={false}
        disableListWrap={false}
        disablePortal={false}
        filterSelectedOptions={false}
        freeSolo={false}
      />
      <LoadingButton
        // loading={loading || undefined}
        disabled={some(inputST, i => i === '')}
        variant="contained"
        size="large"
        onClick={() => unstable_batchedUpdates(async () => {
          // if (!data) {
          //   toast('some error occur');
          //   return;
          // }
          await runAsync(mode, data, {
            ...fileNames,
            problem_type: ModesShortcut[mode],
            ...inputST,
            vertices: JSON.stringify(multiDots?.map(({ k, kInd }) => ([uvIndObj[k], kInd]))),
          })
            .then((e) => {
              toast.success(`fetch ${mode} success`);
              setTabToResult();
              return e;
              // 
            }, () => {
              toast.error(`fetch ${mode} fail`);
            });
        })}
      >Fetch {mode}</LoadingButton>
    </Paper>
  </TabPanel>;
}