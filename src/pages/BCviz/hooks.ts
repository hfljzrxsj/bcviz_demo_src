import { useSafeState, useMemoizedFn } from "ahooks";
import { useMemo, useRef } from "react";
import { clickCircleFn, doubleClickCircleFn, getCommonValueFromTableData, getSvgSize } from "./utils";
import type { ClickCircleProps, OriginDataObjArr, OriginGraphDataReadonlyArr } from "./types";
const { values } = Object;
export default function useBCVizFnHooks () {
  const [tableData, setTableData] = useSafeState<OriginDataObjArr>();
  const [graphData, setGraphData] = useSafeState<OriginGraphDataReadonlyArr>([]);
  // const [isEditX, {
  //   toggle: toggleIsEditX,
  // }] = useBoolean(isDEV);
  const svgRef = useRef<SVGSVGElement>(null);
  const svgSize = useMemo(getSvgSize(svgRef), [
    svgRef.current
  ]);
  const commonValueFromTableData = useMemo(() => getCommonValueFromTableData(tableData, svgSize), [tableData, svgSize]);

  return {
    tableData, setTableData, graphData, setGraphData,
    // isEditX, toggleIsEditX,
    svgRef, svgSize, commonValueFromTableData
  };
}
export const useCircleFn = (props: ClickCircleProps) => {
  // const doubleClickCircle = useMemoizedFn(doubleClickCircleFn(props));
  const clickCircle = useMemoizedFn(clickCircleFn(props));
  return {
    // doubleClickCircle,
    clickCircle
  };
};