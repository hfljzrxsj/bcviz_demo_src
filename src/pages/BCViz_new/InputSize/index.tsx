import type { SetSizeProps, SizeProps } from "@/pages/BCviz/types";
import {
  Paper, FormControl,

  TextField,
  Divider,
  Chip,
  Button,
  Tooltip,
} from "@mui/material";
import { useControllableValue, useUpdateEffect, useSafeState } from 'ahooks';
import { Modes } from "../utils";
import style from './_index.module.scss';
import { isUndefined } from "lodash";
import { unstable_batchedUpdates } from "react-dom";
import { waitLastEventLoop } from "@/utils";
const { isSafeInteger } = Number;
export default function InputSize (props: {
  readonly value: SizeProps['size'];
  readonly setSize: SetSizeProps['setSize'];
  readonly max: number;
}) {
  const { setSize, value, max } = props;
  const [size, setSizeInner] = useSafeState<SizeProps['size']>(value);
  useUpdateEffect(() => {
    setSizeInner(value);
  }, [value]);
  const isSizeUndefined = isUndefined(size);
  const isError = !isSizeUndefined && (size < 0 || size > max);
  return <>
    <p>Please double-click the dot on the Cohesion.</p>
    <Divider
      // orientation="vertical"
      variant="fullWidth"
      flexItem
    ><Chip label="OR" /></Divider>
    <Paper elevation={24} className={style['Form'] ?? ''}>
      <FormControl fullWidth>
        <TextField
          fullWidth
          placeholder='Input Size'
          label='Input Size'
          type="search"
          title='Input Size'
          value={size}
          inputProps={{
            min: 0,
            max,
            inputMode: 'numeric',
            pattern: '^(0|[1-9]\d*)$',
          }}
          spellCheck
          autoCapitalize='on'
          enterKeyHint='next'
          translate='yes' //控制元素内容是否应被浏览器自动翻译。
          unselectable='on'
          inputMode='numeric'
          onChange={((e) => unstable_batchedUpdates(() => {
            const { value } = e.target;
            if (!value) {
              setSizeInner(undefined);
            } else {
              const num = parseInt(value);
              if (isSafeInteger(num)) {
                setSizeInner(num);
              }
              // else {
              //   setSizeInner(() => 0);
              //   waitLastEventLoop(() => {
              //     setSizeInner(() => undefined);
              //   });
              // }
            }
          }))}
          error={isError}
          {...(isError ? {
            helperText: `Size is not in the right range(0 ~ ${max}).`
          } : null)}
        />
      </FormControl>
      <Tooltip arrow
        title={isSizeUndefined ? 'Set size to undefined' : `${Modes['Hierarchical Subgraphs Search']} with size is ${size}`}
        placement="right"
      >
        <Button fullWidth
          variant="contained"
          size="large"
          onClick={() => {
            setSize(size);
          }}
          disabled={isError}
        >Search</Button></Tooltip>
    </Paper>
  </>;
}