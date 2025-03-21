// https://brilliant-hamster-b238e7.netlify.app
// https://app.netlify.com/sites/brilliant-hamster-b238e7/deploys
import { useMemo } from "react";
import GraphSVG from "@/pages/BCviz/GraphSVG";
import LineSVG from "@/pages/BCviz/LineSVG";
import type { CommonSVGProps, LineSVGProps, OriginGraphDataReadonlyArr, SVGChartsProps, SetSizeProps, SvgSize } from "@/pages/BCviz/types";
import { clickToSetSize, doubleClickCircleFn, getGraphLineWithHighlightLevel } from "@/pages/BCviz/utils";
import { TabPanel } from "@mui/lab";
import { TabKey } from "../utils";
import ChartsTabPanel from "../ChartsPaper";
import { useMemoizedFn } from "ahooks";
import { useCircleFn } from "@/pages/BCviz/hooks";
// const initClickLineVal = undefined;
// export let clickLineVal: number | undefined = undefined;
const getKey = (TabKey: TabKey) => {
  // const a = sha1().update([SVGCharts.name, TabKey]).digest('hex');
  // const a = `${new Error().stack}${TabKey}`;
  return `${SVGCharts.name}${TabKey}`;
};
export default function SVGCharts (props: SVGChartsProps & {
  readonly graphData: OriginGraphDataReadonlyArr;
  readonly svgRef: LineSVGProps['svgRef'];
  readonly svgSize: SvgSize;
} & SetSizeProps) {
  const { dataArrWithPos, graphData, svgSize, setSize = () => { }, isEditX, size } = props;

  // const {
  //   data
  // } = useGetFromST ?? {};
  // const size = data?.[Modes['Hierarchical Subgraphs Search']]?.size;

  const drawDotData = useMemo(() => {
    return doubleClickCircleFn({ ...props, size });
  }, [size, dataArrWithPos]);

  // const [drawDotData = [], setDrawDotData = () => { }] = useEffectState<PosDataObjArr>(dataArrWithPos);
  // const theme = useTheme();
  // console.log(theme, colors);
  // const svgRef = useRef<SVGSVGElement>(null);

  const { svgWidth = 0, svgHeight = 0 } = svgSize;
  // const clickLineVal = size;
  const graphSvgHeght = svgHeight;

  // 二部图的线
  const graphLine = useMemo(() => getGraphLineWithHighlightLevel({ drawDotData, graphData }), [drawDotData]);
  // const clickCircleProps = useMemo(() => ({ ...props, setDrawDotData, setSize, size }), [props]);
  // const doubleClickCircle = useMemoizedFn((args: Parameters<ReturnType<typeof doubleClickCircleFn>>[0]) => {
  //   const clickReturn = doubleClickCircleFn(clickCircleProps)(args);
  //   return () => {
  //     const clickReturnInner = clickReturn();
  //     setSize(clickReturnInner);
  //     return clickReturnInner;
  //   };
  // }
  // );
  // const clickCircle = useMemoizedFn(clickCircleFn(clickCircleProps));
  const {
    // doubleClickCircle,
    clickCircle } = useCircleFn({ ...props, setSize, size });
  const doubleClickCircle: CommonSVGProps['doubleClickCircle'] = useMemoizedFn(clickToSetSize({ isEditX, setSize, size, drawDotData }));
  const commonSVGProps: CommonSVGProps = { ...props, drawDotData, clickCircle, doubleClickCircle: doubleClickCircle, graphLine, size };

  return <>
    <ChartsTabPanel value={TabKey.table} key={getKey(TabKey.table)}>
      <LineSVG {
        ...commonSVGProps
      }
        // ref={svgRef}
        viewBox={[0, 0, svgWidth, graphSvgHeght].join(' ')}
      />
    </ChartsTabPanel>
    <ChartsTabPanel value={TabKey.graph} key={getKey(TabKey.graph)}>
      <GraphSVG {
        ...commonSVGProps
      }
        viewBox={[0, 0, svgWidth, svgHeight].join(' ')}
      /></ChartsTabPanel>
    <TabPanel value={TabKey.result} key={getKey(TabKey.result)}></TabPanel>
  </>;
};