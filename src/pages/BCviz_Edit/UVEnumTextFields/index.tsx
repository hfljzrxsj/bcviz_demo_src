import { IconButton, InputAdornment, TextField, Tooltip } from "@mui/material";
import { isUndefined } from "lodash";
import { UVEnumArr } from "..";
import { UVenum } from "@/pages/BCviz/utils";
import { type UseSetStateReturnType } from "@/pages/BCViz_new/TabPanelInput/TabPanelInput";
import { initUVcount } from "../devTestData";
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import { setStateOnChange } from "../utils";
import { TextFieldProps_Number } from "@/pages/BCViz_new/const";
const { isSafeInteger } = Number;
export interface UseUVCount {
  readonly useUVCount: UseSetStateReturnType<typeofUvCountInner>;
}
export type typeofUvCountInner = typeof initUVcount;
interface ResetUVCount {
  readonly resetUVCount?: typeofUvCountInner;
}
const ResetButton = (props: {
  readonly value: number | undefined;
  readonly setUvCountInner: UseUVCount['useUVCount'][1];
  readonly uv: UVenum;
  readonly resetUVCount: ResetUVCount['resetUVCount'] | undefined;
}) => {

  const { value, setUvCountInner, uv, resetUVCount } = props;
  if (!resetUVCount) {
    return null;
  }
  const resetValue = resetUVCount[uv];

  return <InputAdornment position="end" title={`reset to ${resetValue}`}>
    <Tooltip arrow title={`reset to ${resetValue}`} placement="right">
      <IconButton
        disabled={value === resetValue}
        onClick={() => {
          setUvCountInner(({
            [uv]: resetValue,
          }) as typeofUvCountInner);
        }}
        edge="end"
        size="large"
      >
        <RotateLeftIcon fontSize="large" />
      </IconButton></Tooltip>
  </InputAdornment>;
};

export default function UVEnumTextfields (props: UseUVCount & {
  readonly labelFunc: (uv: UVenum) => string;
  // readonly resetUVCount?: typeofUvCountInner;
} & ResetUVCount) {
  const { useUVCount, labelFunc, resetUVCount } = props;
  // const [uvCountInner, setUvCountInner] = useControllableValue({ value: uvCount });
  const [uvCountInner, setUvCountInner] = useUVCount;
  // useUpdateEffect(() => {
  //   setUvCountInner(uvCount);
  // }, [uvCount]);
  return UVEnumArr.map(uv => {
    const label = labelFunc(uv);
    const value = uvCountInner[uv];
    return (
      // <Paper elevation={24} className={style['input'] ?? ""}>
      <TextField
        fullWidth
        key={uv}
        label={label}
        title={label}
        placeholder={label}
        required
        spellCheck
        autoCapitalize='on'
        enterKeyHint='next'
        translate='yes' //控制元素内容是否应被浏览器自动翻译。
        error={(!value)}
        value={value}
        onChange={setStateOnChange(setUvCountInner, uv)}
        {...TextFieldProps_Number}
        InputProps={{
          endAdornment: <ResetButton {...{ uv, setUvCountInner, value, resetUVCount }} />
        }}
      // endAdornment={

      // }
      // className={style['input'] ?? ''}
      />
    );
  });

}

