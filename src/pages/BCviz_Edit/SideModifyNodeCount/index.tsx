import { Button, Paper } from "@mui/material";
import { isEqual } from "lodash";
import { UVEnumArr } from "..";
import type { UseUVCount } from "../UVEnumTextFields";
import { useSetState, useUpdateEffect } from "ahooks";
import style from './_index.module.scss';
import UVEnumTextfields from "../UVEnumTextFields";

export default function SideModifyNodeCount (props: UseUVCount) {
  const { useUVCount } = props;
  // const [uvCountInner, setUvCountInner] = useControllableValue({ value: uvCount });
  const [uvCount, setUvCount] = useUVCount;
  const useUVCountInner = useSetState(uvCount);
  const [uvCountInner, setUvCountInner] = useUVCountInner;
  useUpdateEffect(() => {
    setUvCountInner(uvCount);
  }, [uvCount]);
  return <Paper elevation={24} className={style['Paper'] ?? ""}>
    <UVEnumTextfields
      useUVCount={useUVCountInner}
      labelFunc={(uv) => `Maximum Index of ${uv}`}
      resetUVCount={uvCount}
    />
    <Button fullWidth size="large" disabled={
      // !fileName ||
      UVEnumArr.some(uv => !uvCountInner[uv]) || isEqual(uvCount, uvCountInner)
    }
      variant="contained"

      onClick={() => {
        setUvCount(uvCountInner);
      }}
    >Modify</Button>
  </Paper>;
}