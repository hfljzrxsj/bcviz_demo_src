import type { PosDataObjArr } from "@/pages/BCviz/types";
import { useMemoizedFn, useSafeState, useUpdateEffect } from "ahooks";
import type { Dispatch, SetStateAction } from "react";
//ReturnType<typeof useSafeState<T>>
export default <T> (dataArrWithPos: T): [T, Dispatch<SetStateAction<T>>] => {
  const [drawDotData, setDrawDotData] = useSafeState<T>(dataArrWithPos);
  useUpdateEffect(() => {
    setDrawDotData(dataArrWithPos);
  }, [dataArrWithPos]);
  return [drawDotData, setDrawDotData];
};